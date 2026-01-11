import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        // Find questions created by this user
        // Note: createdBy stores ObjectId, but session.user.id is string. Mongoose usually handles casting automatically in find queries.
        const questions = await Question.find({ createdBy: session.user.id })
            .sort({ _id: -1 }) // Newest first
            .limit(50); // Limit to last 50

        return NextResponse.json(questions);
    } catch (error) {
        console.error("Error fetching user questions:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
