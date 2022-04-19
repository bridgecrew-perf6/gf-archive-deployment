import path from 'path';
import fs from 'fs';
import express from 'express'

export default function sendFileIfParamEqualsName(req: express.Request, res: express.Response, next: express.NextFunction) {
    const files = fs.readdirSync(path.join(__dirname, '../../Public'));
    const file =    files.find(f => f.toLowerCase() === req.params.blogId?.toLowerCase()) || 
                    files.find(f => f.toLowerCase() === req.params.blogId?.toLowerCase()) || 
                    files.find(f => f.toLowerCase() === req.params.blogId?.toLowerCase());
    if (file) {
        res.sendFile(path.join(__dirname, '../../public', file));
    } else {
        next();
    }
};
