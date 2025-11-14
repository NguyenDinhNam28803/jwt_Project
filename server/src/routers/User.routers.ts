import { Router } from 'express'
import UserControllers from '../controllers/User.controllers'
import authUser from '../middlewares/authUser.middlewares'

const router = Router()

router.post('/signup', UserControllers.signup)
router.post('/login', UserControllers.login)
router.get('/info', authUser, UserControllers.getUserInfo)

export default router
