import express from 'express';
import MilkRecord from '../models/MilkRecord.js';
import FinanceRecord from '../models/FinanceRecord.js';
import { authMiddleware } from '../middleware/auth.js';
const router = express.Router();
router.use(authMiddleware);
// Get all milk records for user
router.get('/', async (req, res) => {
    try {
        const uid = req.user.uid;
        console.log(`Fetching milk records for user: ${uid}`);
        const records = await MilkRecord.find({ uid }).sort({ date: -1, createdAt: -1 });
        console.log(`Found ${records.length} milk records`);
        res.json(records);
    }
    catch (error) {
        console.error('Error fetching milk records:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
// Add a new global milk record and auto-calculate income
router.post('/', async (req, res) => {
    try {
        const { date, morning, evening, total, morningRate, eveningRate } = req.body;
        const newRecord = new MilkRecord({
            uid: req.user.uid,
            date,
            cowName: "All Cows (Farm Total)",
            morning,
            evening,
            total,
            morningRate,
            eveningRate
        });
        const savedRecord = await newRecord.save();
        const activeMorningRate = morningRate || 50; // Fallback to 50 if somehow not provided
        const activeEveningRate = eveningRate || 50;
        const amount = (morning * activeMorningRate) + (evening * activeEveningRate);
        if (amount > 0) {
            const financeRecord = new FinanceRecord({
                uid: req.user.uid,
                type: 'Income',
                category: 'Milk Sales',
                amount: amount,
                date: date,
                description: `Daily Total: Morning ${morning}L @ ₹${activeMorningRate}/L, Evening ${evening}L @ ₹${activeEveningRate}/L`
            });
            await financeRecord.save();
        }
        res.status(201).json(savedRecord);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});
// Delete a milk record
router.delete('/:id', async (req, res) => {
    try {
        const uid = req.user.uid;
        // Find the record first so we can use its data to delete the finance record
        const record = await MilkRecord.findOne({ _id: req.params.id, uid });
        if (!record)
            return res.status(404).json({ message: 'Record not found' });
        // Calculate what the finance record amount would have been
        const activeMorningRate = record.morningRate || record.ratePerLiter || 50;
        const activeEveningRate = record.eveningRate || record.ratePerLiter || 50;
        const expectedAmount = (record.morning * activeMorningRate) + (record.evening * activeEveningRate);
        console.log(`[DELETE MILK] Deleting record for date: ${record.date}, expected amount: ${expectedAmount}`);
        // Delete the milk record
        await MilkRecord.findOneAndDelete({ _id: req.params.id, uid });
        // Try to find and delete the exactly corresponding FinanceRecord
        if (expectedAmount > 0) {
            // First try to find by exact amount
            let deletedFinance = await FinanceRecord.findOneAndDelete({
                uid: uid,
                date: record.date,
                category: 'Milk Sales',
                amount: expectedAmount
            });
            // If not found, it might be an old record with a different total, just try to find by Date + Category + Description containing "Morning"
            if (!deletedFinance) {
                console.log(`[DELETE MILK] Exact amount ${expectedAmount} not found. Trying flexible date+category match.`);
                deletedFinance = await FinanceRecord.findOneAndDelete({
                    uid: uid,
                    date: record.date,
                    category: 'Milk Sales'
                });
            }
            if (deletedFinance) {
                console.log(`[DELETE MILK] Successfully deleted linked finance record:`, deletedFinance._id);
            }
            else {
                console.log(`[DELETE MILK] Failed to find ANY linked finance record for date ${record.date}`);
            }
        }
        res.json({ message: 'Record removed successfully' });
    }
    catch (error) {
        console.error('[DELETE MILK ERROR]', error);
        res.status(500).json({ message: 'Server Error', error });
    }
});
// Add multiple milk records at once (bulk)
router.post('/bulk', async (req, res) => {
    try {
        const records = req.body; // Expects array of records
        if (!Array.isArray(records) || records.length === 0) {
            return res.status(400).json({ message: 'Invalid data format' });
        }
        const uid = req.user.uid;
        let totalMilkSaved = 0;
        let recordDate = records[0].date;
        const savedRecords = [];
        for (const record of records) {
            const { date, cowName, cowId, morning, evening, total } = record;
            if (total > 0) {
                const newRecord = new MilkRecord({
                    uid, date, cowName, cowId, morning, evening, total
                });
                const saved = await newRecord.save();
                savedRecords.push(saved);
                totalMilkSaved += total;
                recordDate = date; // Take the date of the records
            }
        }
        // Auto-calculate aggregated salary/income based on total milk saved
        const milkRatePerLiter = 50;
        const amount = totalMilkSaved * milkRatePerLiter;
        if (amount > 0) {
            const financeRecord = new FinanceRecord({
                uid,
                type: 'Income',
                category: 'Milk Sales',
                amount: amount,
                date: recordDate,
                description: `Auto-calculated: ${totalMilkSaved}L milk collected on this day @ ₹${milkRatePerLiter}/L`
            });
            await financeRecord.save();
        }
        res.status(201).json(savedRecords);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});
export default router;
