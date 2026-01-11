
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { text, description, options, correctAnswer, category, difficulty } = body;

        // Basic validation
        if (!text || !options || options.length !== 4 || correctAnswer === undefined || !category) {
            return NextResponse.json({ error: 'Invalid fields. Need text, 4 options, correctAnswer (index), category' }, { status: 400 });
        }

        await dbConnect();

        // Create question
        const newQuestion = await Question.create({
            text,
            description,
            options,
            correctAnswer,
            category,
            difficulty: difficulty || 'easy',
            createdBy: session.user.id
        });

        return NextResponse.json({ message: 'Question added successfully', question: newQuestion }, { status: 201 });
    } catch (error) {
        console.error('Error adding question:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
