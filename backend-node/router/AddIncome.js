import express from 'express';
import { 
  AddNewTransaction, 
  GetAllIncomeByEmail, 
  MonthlySummaryCal, 
  DeleteIncome,
  WeeklyExpenseCategory     
} from '../controller/AddIncome.js';

const router = express.Router();

router.post('/add', AddNewTransaction);
router.get('/all/:email', GetAllIncomeByEmail);
router.get('/monthly/:email', MonthlySummaryCal);
router.get('/weekly-category/:email', WeeklyExpenseCategory);   
router.delete('/remove/:id', DeleteIncome);

export default router;
