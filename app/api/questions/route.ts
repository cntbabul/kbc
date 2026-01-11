import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
import UserProgress from '@/models/UserProgress';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const session = await auth();

        // Get 'category' from query params
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category');

        let matchStage: any = {};
        if (category) {
            matchStage.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        // If user is logged in, filter out correctly answered questions
        if (session?.user?.id) {
            const solvedQuestions = await UserProgress.find({
                userId: session.user.id,
                isCorrect: true
            }).select('questionId');

            const solvedIds = solvedQuestions.map(p => p.questionId);

            if (solvedIds.length > 0) {
                matchStage._id = { $nin: solvedIds };
            }
        }

        // Use aggregation to get random 20
        const questions = await Question.aggregate([
            { $match: matchStage },
            { $sample: { size: 20 } }
        ]);

        return NextResponse.json(questions);
    } catch (error) {
        console.error("Fetch questions error:", error);
        return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }
}
