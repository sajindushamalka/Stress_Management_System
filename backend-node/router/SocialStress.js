import  express  from 'express';
import { AddSocialStress, GetMyLastValues } from '../controller/SocialStress.js'
const router = express.Router();

router.post('/add', AddSocialStress);
router.get('/get/:user_email', GetMyLastValues);

export default router;