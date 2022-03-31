import express from 'express';
import path, { dirname } from 'path';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import endpoint from './mailEndpoint.config'
import nodemailer from 'nodemailer';
import SMTPConnection from 'nodemailer/lib/smtp-connection';
import { env, getMaxListeners } from 'process';
import { hostname } from 'os';
import { PrismaClient } from '@prisma/client'
import { TextDecoderStream } from 'stream/web';

const prisma = new PrismaClient()
const app = express();
const port = 3000;

const currentDate = new Date().toISOString().split('T')[0];

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
//Send public files
app.use(express.static(path.join(__dirname, '/src/public')));

//view engine
app.set('view engine','ejs');

//Routers

//Home Routers
app.get('/', (req, res) => {  
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    const header = {currSite: 1};  
    res.render(__dirname + '/src/views/index.ejs', {header});
});

//Blog Router
app.get('/blog', async (req, res) => {    
    const header = {currSite: 2};  
    const blogs =  await prisma.blog.findMany({});

    res.render(__dirname + '/src/views/blog.ejs', {header, blogs});

});

//Contact Router
app.get('/contact', (req, res) => {
    const header = {currSite: 3};
    res.render(__dirname + '/src/views/contact.ejs', {header});
});

//Write a Blog Router
app.get('/write-a-blog', (req, res) => {
    res.render(__dirname + '/src/views/write-a-blog.ejs');
});

app.post("/write-a-blog", async (req, res) =>{
    let title = req.body.title;
    let subtitle = req.body.subtitle;
    let author = req.body.author;
    let content = req.body.blogContent;

    const createBlog = await prisma.blog.create({
        data:{
            title: title,
            subtitle: subtitle,
            author: author,
            body: content,
            createdAt: new Date(),
        }
    })

    res.redirect("/write-a-blog");
})

app.post("/contact", async (req, res) =>{
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
        }
        else{
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
    res.redirect("/contact");
});

app.listen(port, () => {
    console.log(`GF Archive listening on port ${port}!`)
  });


async function sendMails(firstname: string, lastname:string, email:string, message:string){
    //Mailconfig
    dotenv.config()
    const connection = {
        host: "smtp.gmail.com",
        port: "465",
        auth: {
            user: await endpoint.mailHost,
            pass: await endpoint.mailPW
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
}