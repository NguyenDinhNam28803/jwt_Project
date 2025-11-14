import type { JwtPayload } from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      // `user` will contain the user document returned from the DB (without password)
      user?: JwtPayload | Record<string, unknown>
    }
  }
}

export {}
