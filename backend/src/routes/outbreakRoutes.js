import express from 'express';
import { detectOutbreaks, getOutbreakAlerts, getTrendData } from '../controllers/outbreakController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/detect', authMiddleware, roleMiddleware(['admin', 'laboratory']), detectOutbreaks);
router.get('/alerts', getOutbreakAlerts);
router.get('/trends', getTrendData);

export default router;