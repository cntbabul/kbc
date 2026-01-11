
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import dbConnect from '@/lib/mongodb';
import Result from '@/models/Result';

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { category, score } = body;

        if (!category || score === undefined) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        await dbConnect();

        // Save Result
        await Result.create({
            userId: session.user.id,
            category,
            score,
            createdAt: new Date()
        });

        return NextResponse.json({ message: 'Score saved' }, { status: 201 });
    } catch (error) {
        console.error('Error saving score:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
