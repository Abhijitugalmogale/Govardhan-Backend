import mongoose, { Schema } from 'mongoose';
const milkRecordSchema = new Schema({
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
export default mongoose.model('MilkRecord', milkRecordSchema);
