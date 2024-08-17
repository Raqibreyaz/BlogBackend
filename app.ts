import express from 'express'
import cors from 'cors'
import { errorMiddleWare } from './src/utils/apiError'
import cookieParser from 'cookie-parser';
import userRouter from './src/routes/user.routes';
import postRouter from './src/routes/post.routes';
import commentRouter from './src/routes/comment.routes';

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['PUT', 'POST', 'GET', 'PATCH', 'DELETE']
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/users',userRouter)
app.use('/api/v1/posts',postRouter)
app.use('/api/v1/comments',commentRouter)

app.use(errorMiddleWare)
export default app;