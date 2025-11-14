import User, { IUser } from '../models/User'
import bcrypt from 'bcryptjs'

const signup = async (userData: IUser) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10)
  userData.password = hashedPassword
  const user = await User.create(userData)
  return user
}

const login = async (username: string, password: string) => {
  const user = await User.findOne({ username })
  if (!user) {
    throw new Error('User not found')
  }
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new Error('Invalid password')
  }
  return user
}

const getUserInfo = async (userId: string) => {
  const user = await User.findById(userId).select('-password')
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

export default {
  signup,
  login,
  getUserInfo
}
