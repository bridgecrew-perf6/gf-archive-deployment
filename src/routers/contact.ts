import { log } from 'console';
import express from 'express';
import prisma from '../prisma/client';
import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';


let router = express.Router();
let currentDate = new Date().toISOString().split('T')[0];

//Contact Router
let emailAllowed = true;
router.get('/', (req, res) => {
    const header = {currSite: 3};
    emailAllowed = true;
    res.render('contact', {header, emailAllowed});
});

router.post("/", async (req, res) =>{
    let firstname = req.body.formFirstname;
    let lastname = req.body.formLastname;
    let email = req.body.formEmail;
    let message = req.body.formMessage;

    const foundUser = await prisma.contactUser.findUnique({
        where:{
            email: email,
        }
    });
    if(foundUser != null){
        if(foundUser.lastContacted.toISOString().split('T')[0] = currentDate){
            emailAllowed = false;
        }
        else{
            emailAllowed = true;
            const contactUser = await prisma.contactUser.update({
                where: {
                    email: email,
                },
                data:{
                    firstname:      firstname,
                    lastname:       lastname,
                    message:        message,
                    timesContacted: {increment: 1}
                },
            })
            sendMails(firstname, lastname, email, message);
        }
    }
    else{
        emailAllowed = true;
        const contactUser = await prisma.contactUser.create({
            data: {
                firstname: firstname,
                lastname: lastname,
                email: email,
                message: message,
            },
        })
        sendMails(firstname, lastname, email, message);
    }
    const header = {currSite: 3};
    res.redirect('/contact');
});
async function sendMails(firstname: string, lastname:string, email:string, message:string){
    //Mailconfig
    dotenv.config()
    const connection = {
        host: "smtp.gmail.com",
        port: "465",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    }
    //Bestätigungsmail
    const transporterCustomer = nodemailer.createTransport({
        //@ts-ignore
        host: connection.host,
        port: connection.port,
        auth: {
            user: connection.auth.user,
            pass: connection.auth.pass
        },
    });
    const mailOptionsCustomer = {
        from: 'gf.archivee@gmail.com',
        to: email,
        subject: "You'll hear from me soon",
        text: "Hallo " + firstname +"\n\nVielen Dank für deine Nachricht. Ich werde deine Anfrage so zeitnah, wie möglich bearbeiten.\n\nLiebe Grüsse\nGian"
    };

    //Infomail an mich
    const transporterAdmin = nodemailer.createTransport({
        //@ts-ignore
        host: connection.host,
        port: connection.port,
        auth: {
            user: connection.auth.user,
            pass: connection.auth.pass
        },
    });
    const mailOptionsAdmin = {
        from: 'gf.archivee@gmail.com',
        to: 'gian.federspiel@bluewin.ch',
        subject: "Neue Kontaktanfrage",
        text: "Kontaktanfrage von: " + firstname + " " + lastname + "\nEmail: " + email + "\n\nInhalt: " + message
    }

    await transporterCustomer.sendMail(mailOptionsCustomer);
    await transporterAdmin.sendMail(mailOptionsAdmin);
};

export = router;
