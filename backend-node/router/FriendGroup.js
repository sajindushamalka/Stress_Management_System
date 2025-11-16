import  express  from 'express';
import { AddRequest, GetAllMySentRequest, GetAllMyGotRequest } from '../controller/FriendGroup.js'
const router = express.Router();

router.post('/add', AddRequest);
router.get('/get', GetAllMySentRequest);
router.get('/got/:user_email', GetAllMyGotRequest);

export default router;