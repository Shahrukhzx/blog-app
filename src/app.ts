import express from 'express';
import { PostRouter } from './modules/post/post.router';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import cors from 'cors';
import { CommentRouter } from './modules/comment/comment.router';
import errorHandler from './middlewares/globalErrorHandler';
import { notFound } from './middlewares/notFound';


const app = express();

app.use(cors({
    origin: process.env.APP_URL, // client side url
    credentials: true

}))

app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(express.json());
app.use('/posts', PostRouter);
app.use('/comments', CommentRouter);


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use(notFound)
app.use(errorHandler);
export default app;