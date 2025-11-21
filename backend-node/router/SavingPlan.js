import  express  from 'express';
import { AddNewSavingPlan, GetAllSavingPlansByEmail } from '../controller/SavingPlan.js';
const router = express.Router();

router.post('/add', AddNewSavingPlan);
router.get('/all/:email', GetAllSavingPlansByEmail);

export default router;