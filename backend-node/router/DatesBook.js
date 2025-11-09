import  express  from 'express';
import { AddDateBook } from '../controller/DatesBook.js'
const router = express.Router();

router.post('/add', AddDateBook);

export default router;