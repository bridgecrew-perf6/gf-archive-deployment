import express from 'express';

let router = express.Router();

router.get('/', (req, res) => {  
    res.redirect('/home');
});

console.log("");
router.get('/home',  (req, res) => {
    const header = {currSite: 1};  
    res.render('index', {header});
});

export = router;