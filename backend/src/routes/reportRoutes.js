import { Router } from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';
import { createReport, getReports, updateReport, deleteReport } from '../controllers/reportController.js';

const router = Router();

router.post('/', protect, upload.array('attachments', 5), createReport);
router.get('/', protect, getReports);
router.put('/:id', protect, updateReport);
router.delete('/:id', protect, authorize('admin'), deleteReport);

export default router;
