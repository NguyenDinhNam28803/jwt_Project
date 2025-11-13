import { Request, Response } from 'express'
import UserServices from '../services/User.services'
import { validationResult } from 'express-validator'
import User, { IUser } from '../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const signup = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { username, email, password, firstName, lastName } = req.body

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.username === username ? 'Username already exists' : 'Email already exists'
      })
    }

    const user = await UserServices.signup({
      username,
      email,
      password,
      firstName,
      lastName
    })

    // Remove password from response
    const userResponse = user.toObject()

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userResponse
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { username, password } = req.body

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Create token with more user info
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email
    }

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRE || '1h'
      } as jwt.SignOptions
    )

    // Remove password from response
    const userResponse = user.toObject()

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    })
  } catch (error: any) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

export default {
  signup,
  login
}
