const path = require ('path');
const express = require('express');
const app = express();
const port = 3000;

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