import mongoose, { Schema } from 'mongoose';
const cowSchema = new Schema({
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
export default mongoose.model('Cow', cowSchema);
