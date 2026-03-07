import mongoose, { Document, Schema } from 'mongoose';

export interface IFinanceRecord extends Document {
    uid: string;
    type: 'Income' | 'Expense';
    category: string;
    amount: number;
    date: string;
    description?: string;
    createdAt: Date;
}

const financeRecordSchema = new Schema<IFinanceRecord>({
    uid: { type: String, required: true },
    type: { type: String, enum: ['Income', 'Expense'], required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IFinanceRecord>('FinanceRecord', financeRecordSchema);
