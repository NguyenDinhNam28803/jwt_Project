import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '../models/User'

const authUser = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const secret = process.env.JWT_SECRET as string
    if (!secret) {
      console.error('JWT secret is not configured')
      return res.status(500).json({ message: 'Server configuration error' })
    }

    const decoded = jwt.verify(token, secret)

    let userId: string | undefined
    if (typeof decoded === 'object' && decoded !== null) {
      const payload = decoded as JwtPayload
      const idField = (payload as Record<string, unknown>)['id'] ?? (payload as Record<string, unknown>)['userId']
      if (idField != null) userId = String(idField)
    }

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token payload' })
    }

    const user = await User.findById(userId).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - User not found' })
    }

    req.user = user.toObject()
    next()
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Token verification error:', message)
    return res.status(401).json({ message: 'Unauthorized - Invalid token', error: message })
  }
}

export default authUser
