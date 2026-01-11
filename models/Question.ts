import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuestion extends Document {
    text: string;
    description: string;
    options: string[];
    correctAnswer: number; // Index 0-3
    category: string;
    difficulty: "very easy" | "easy" | "hard" | "extreme hard";
    createdBy?: mongoose.Types.ObjectId; // User ID if user submitted
}

const QuestionSchema: Schema = new Schema({
    text: { type: String, required: true },
    description: { type: String, required: false }, // Made optional
    options: {
        type: [String],
        required: true,
        validate: [arrayLimit, '{PATH} exceeds the limit of 4']
    },
    correctAnswer: { type: Number, required: true, min: 0, max: 3 },
    category: { type: String, required: true, index: true },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard", "extreme"], // keeping old ones for backward compat + new ones
        default: "easy",
        required: true
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

function arrayLimit(val: string[]) {
    return val.length === 4;
}

// Check if model is already compiled to avoid OverwriteModelError
const Question: Model<IQuestion> = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
