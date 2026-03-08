import express from 'express';
import { checkSymptoms, reportSymptoms, getMyReports, getCommunityReports } from '../controllers/symptomController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/check', checkSymptoms);
router.post('/report', authMiddleware, reportSymptoms);
router.get('/my-reports', authMiddleware, getMyReports);
router.get('/community-reports', getCommunityReports);

export default router;