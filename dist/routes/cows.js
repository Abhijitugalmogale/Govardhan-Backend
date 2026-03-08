import express from 'express';
import Cow from '../models/Cow.js';
import { authMiddleware } from '../middleware/auth.js';
const router = express.Router();
router.use(authMiddleware);
// Get all cows for user
router.get('/', async (req, res) => {
    try {
        const uid = req.user.uid;
        console.log(`Fetching cows for user: ${uid}`);
        const cows = await Cow.find({ uid }).sort({ createdAt: -1 });
        console.log(`Found ${cows.length} cows`);
        res.json(cows);
    }
    catch (error) {
        console.error('Error fetching cows:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
// Add a new cow
router.post('/', async (req, res) => {
    try {
        const newCow = new Cow({
            ...req.body,
            uid: req.user.uid
        });
        const savedCow = await newCow.save();
        res.status(201).json(savedCow);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});
// Update a cow
router.put('/:id', async (req, res) => {
    try {
        const cow = await Cow.findOneAndUpdate({ _id: req.params.id, uid: req.user.uid }, req.body, { new: true });
        if (!cow)
            return res.status(404).json({ message: 'Cow not found' });
        res.json(cow);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});
// Delete a cow
router.delete('/:id', async (req, res) => {
    try {
        const cow = await Cow.findOneAndDelete({ _id: req.params.id, uid: req.user.uid });
        if (!cow)
            return res.status(404).json({ message: 'Cow not found' });
        res.json({ message: 'Cow removed' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});
export default router;
