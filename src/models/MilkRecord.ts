import mongoose, { Document, Schema } from 'mongoose';

export interface IMilkRecord extends Document {
    uid: string;
    cowId?: mongoose.Types.ObjectId;
    cowName?: string;
    date: string;
    morning: number;
    evening: number;
    total: number;
    morningRate?: number;
    eveningRate?: number;
    createdAt: Date;
}

const milkRecordSchema = new Schema<IMilkRecord>({
    uid: { type: String, required: true },
    cowId: { type: Schema.Types.ObjectId, ref: 'Cow' },
    cowName: { type: String },
    date: { type: String, required: true },
    morning: { type: Number, default: 0 },
    evening: { type: Number, default: 0 },
    total: { type: Number, required: true },
    morningRate: { type: Number },
    eveningRate: { type: Number },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMilkRecord>('MilkRecord', milkRecordSchema);
