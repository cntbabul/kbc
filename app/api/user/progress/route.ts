import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import dbConnect from '@/lib/mongodb';
import UserProgress from '@/models/UserProgress';

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { answers, category } = await req.json();

        if (!Array.isArray(answers)) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        await dbConnect();

        // Bulk write using upsert to record latest attempt or keep tracking
        // If we want to strictly track "once correct, always correct", we should only update if it was wrong before or insert new.
        // Actually, user requirement: "not repeat the question which already gave correct answer".
        // So simply recording the latest status is fine, or better yet, only upsert if new status is correct, or just overwrite.
        // Let's iterate and update.

        const operations = answers.map((ans: any) => ({
            updateOne: {
                filter: { userId: session.user!.id, questionId: ans.questionId },
                update: {
                    $set: {
                        userId: session.user!.id,
                        questionId: ans.questionId,
                        category: category,
                        isCorrect: ans.isCorrect, // Overwrite with latest result? 
                        // User wants: "wrong answer next attempt". This implies if I got it right before, I shouldn't see it.
                        // If I get it wrong now, I should see it again.
                        // So if I got it right, isCorrect=true. Efficient.
                    }
                },
                upsert: true
            }
        }));

        if (operations.length > 0) {
            await UserProgress.bulkWrite(operations);
        }

        return NextResponse.json({ message: 'Progress saved' });

    } catch (error) {
        console.error("Error saving progress:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
