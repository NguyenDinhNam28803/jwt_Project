import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authUser from './middlewares/authUser.middlewares'
import connectDB from './database/database'
import userRouter from './routers/User.routers'
import Todorouter from './routers/Todo.routers'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(
  cors({
    origin: 'http://localhost:5000', // Port của Vite dev server
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)
app.use(express.json())

app.use('/api/user', userRouter)

app.use(authUser)
app.use('/api', Todorouter)
// app.get("/", () => console.log("Hello, it's jwt website !"))

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})
