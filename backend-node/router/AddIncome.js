import  express  from 'express';
import { AddNewIncome, GetAllIncome, DeleteIncome } from '../controller/AddIncome.js'
const router = express.Router();

router.post('/add', AddNewIncome);
router.get('/all', GetAllIncome);
router.delete('/remove/:id', DeleteIncome);

export default router;