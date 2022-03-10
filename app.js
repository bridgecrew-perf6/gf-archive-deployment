const path = require ('path');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const SMTPConnection = require('nodemailer/lib/smtp-connection');
const { getMaxListeners } = require('process');
const app = express();
const port = 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
//Send public files
app.use(express.static(path.join(__dirname, '/src/public')));
console.log(__dirname);

//view engine
app.set('view engine','ejs');

app.get('/', (req, res) => {  
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    const header = {currSite: 1};  
    res.render(__dirname + '/src/views/index.ejs', {header});
});

app.get('/blog', (req, res) => {    
    const header = {currSite: 2};  
    res.render(__dirname + '/src/views/blog.ejs', {header});
});

app.get('/contact', (req, res) => {
    const header = {currSite: 3};
    res.render(__dirname + '/src/views/contact.ejs', {header});
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
  });
app.post("/contact", async (req, res) =>{
    var firstname = req.body.formFirstname
    var lastname = req.body.formLastname
    var email = req.body.formEmail
    var message = req.body.formMessage
    
    //Bestätigungsmail
    const transporterCustomer = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: "465",
        auth: {
            user: "gf.archivee@gmail.com",
            pass: "Gian_2004"
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
        host: "smtp.gmail.com",
        port: "465",
        auth: {
            user: "gf.archivee@gmail.com",
            pass: "Gian_2004"
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

    res.redirect("/contact");
});