import mongoose, { Schema } from 'mongoose';
const financeRecordSchema = new Schema({
    uid: { type: String, required: true },
    type: { type: String, enum: ['Income', 'Expense'], required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});
export default mongoose.model('FinanceRecord', financeRecordSchema);
