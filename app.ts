import express from 'express'
import cors from 'cors'
import { errorMiddleWare } from './src/utils/apiError'
import cookieParser from 'cookie-parser';

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['PUT', 'POST', 'GET', 'PATCH', 'DELETE']
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(errorMiddleWare)
export default app;