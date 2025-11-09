import  express  from 'express';
import { AddLecture, GetLecturesByEmail } from '../controller/Lecture.js'
const router = express.Router();

router.post('/add', AddLecture);
router.get('/get/:user_email', GetLecturesByEmail);

export default router;