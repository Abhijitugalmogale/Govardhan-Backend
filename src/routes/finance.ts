import express from 'express';
import FinanceRecord from '../models/FinanceRecord.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

// Get all finance records
router.get('/', async (req, res) => {
    try {
        const records = await FinanceRecord.find({ uid: (req as any).user.uid }).sort({ date: -1, createdAt: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add a new finance transaction
router.post('/', async (req, res) => {
    try {
        const newRecord = new FinanceRecord({
            ...req.body,
            uid: (req as any).user.uid
        });
        const savedRecord = await newRecord.save();
        res.status(201).json(savedRecord);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
    try {
        const record = await FinanceRecord.findOneAndDelete({ _id: req.params.id, uid: (req as any).user.uid });
        if (!record) return res.status(404).json({ message: 'Transaction not found' });
        res.json({ message: 'Transaction removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

export default router;
