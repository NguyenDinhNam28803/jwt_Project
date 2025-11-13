import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authUser from './middlewares/authUser.middlewares';
import connectDB from './database/database'
import userRouter from './routers/User.routers'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authUser);
app.use('/api/user', userRouter)

connectDB().then(() => {
  app.use("/", () => console.log("Hello, it's jwt website !"))
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})
