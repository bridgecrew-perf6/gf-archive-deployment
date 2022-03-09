const express = require('express');
const app = express();
const port = 3000;

app.set('view engine','ejs'); 

app.get('/test', (req, res) => {
    res.render(__dirname + '/src/views/test.ejs');
});

app.get('/', (req, res) => {
    res.render(__dirname + '/src/views/index.ejs');
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
  });