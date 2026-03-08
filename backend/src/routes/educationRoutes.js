import express from 'express';
import { getEducationContent, getEducationByCategory } from '../controllers/educationController.js';

const router = express.Router();

router.get('/content', getEducationContent);
router.get('/content/:category', getEducationByCategory);

export default router;