import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserProgress extends Document {
    userId: string; // Store as string to match session ID usually (or ObjectId if consistency maintained)
    questionId: mongoose.Types.ObjectId;
    category: string;
    isCorrect: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserProgressSchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    category: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
}, { timestamps: true });

// Compound index to quickly look up a specific user's progress on a question
UserProgressSchema.index({ userId: 1, questionId: 1 }, { unique: true });

const UserProgress: Model<IUserProgress> = mongoose.models.UserProgress || mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);

export default UserProgress;
