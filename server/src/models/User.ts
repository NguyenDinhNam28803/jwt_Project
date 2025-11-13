import { Schema, model } from 'mongoose'

export interface IUser {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true }
})

const User = model<IUser>('User', userSchema)

export default User
