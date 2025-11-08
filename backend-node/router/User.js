import  express  from 'express';
import {UserRegistration, Signin } from '../controller/User.js'
const router = express.Router();

router.post('/Signup', UserRegistration);
router.post('/Signin',Signin);

export default router;