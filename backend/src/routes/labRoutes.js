import express from 'express';
import { registerLaboratory, uploadLabResult, getLabResults, getAllLaboratories, getNearbyLaboratories } from '../controllers/labController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', authMiddleware, roleMiddleware(['laboratory']), registerLaboratory);
router.post('/results', authMiddleware, roleMiddleware(['laboratory']), uploadLabResult);
router.get('/results', authMiddleware, roleMiddleware(['laboratory']), getLabResults);
router.get('/all', getAllLaboratories);
router.get('/nearby', getNearbyLaboratories);

export default router;