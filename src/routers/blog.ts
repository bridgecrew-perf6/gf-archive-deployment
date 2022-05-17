import { log } from 'console';
import express from 'express';
import prisma from '../prisma/client';

let router = express.Router();

router.get('/:blogId', async (req, res) =>{
    const header = {currSite: 2};
    if(isNaN(Number(req.params.blogId))){
        res.send("yourmom");
    }
    else{
        const blog =  await prisma.blog.findUnique({
            where:{
                blogId: +req.params.blogId,
            }
        });
        res.render('blog', {header, blog, params:req.params})
    }    
});

export = router;
