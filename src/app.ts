import express from 'express';
import { PostRouter } from './modules/post/post.router';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import cors from 'cors';


const app = express();

app.use(cors({
    origin: process.env.APP_URL!,
    credentials: true

}))

app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(express.json());
app.use('/posts', PostRouter);


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

export default app;