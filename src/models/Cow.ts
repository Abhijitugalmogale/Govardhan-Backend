import mongoose, { Document, Schema } from 'mongoose';

export interface ICow extends Document {
    uid: string; // User ID who owns the cow
    tag: string;
    name: string;
    breed: string;
    age: number;
    status: 'Milking' | 'Dry' | 'Pregnant' | 'Heifer';
    pregnancyStartDate?: Date;
    milkingStartDate?: Date;
    expectedDelivery?: Date;
    createdAt: Date;
}

const cowSchema = new Schema<ICow>({
    uid: { type: String, required: true },
    tag: { type: String, required: true },
    name: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    status: { type: String, enum: ['Milking', 'Dry', 'Pregnant', 'Heifer'], required: true },
    pregnancyStartDate: { type: Date },
    milkingStartDate: { type: Date },
    expectedDelivery: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICow>('Cow', cowSchema);
