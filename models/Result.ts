import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResult extends Document {
    userId: mongoose.Types.ObjectId;
    category: string;
    score: number;
    createdAt: Date;
}

const ResultSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, required: true },
    score: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Prevent overwrite
const Result: Model<IResult> = mongoose.models.Result || mongoose.model<IResult>('Result', ResultSchema);

export default Result;
