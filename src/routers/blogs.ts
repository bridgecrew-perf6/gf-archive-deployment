import { log } from 'console';
import express from 'express';
import { uptime } from 'process';
import prisma from '../prisma/client';

let router = express.Router();

router.get('/', async (req, res) => {    
    const header = {currSite: 2};  
    const blogs =  await prisma.blog.findMany({});
    res.render('blogs', {header, blogs});
});

export = router;
