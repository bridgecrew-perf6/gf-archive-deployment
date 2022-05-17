import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import blogRouter from './routers/blog';
import blogsRouter from './routers/blogs';
import contactRouter from './routers/contact';
import writeBlogRouter from './routers/write-a-blog';
import indexRouter from './routers/index';


const app = express();
const port: number = Number(process.env.PORT) || 3000;


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//Send public files
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public/images')));

//view engine
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', indexRouter);
app.use('/home', indexRouter);
app.use('/blog', blogRouter);
app.use('/blogs', blogsRouter);
app.use('/contact', contactRouter);
app.use('/write-a-blog', writeBlogRouter);

app.listen(port, () => {
    console.log(`GF Archive listening on port ${port}!`)
  });


