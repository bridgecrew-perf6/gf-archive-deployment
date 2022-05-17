import { log } from 'console';
import express from 'express';
import { uptime } from 'process';
import prisma from '../prisma/client';

let router = express.Router();

router.get('/', (req, res) => {
    res.render('write-a-blog');
});

router.post("/", async (req, res) =>{
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
});

export = router;
