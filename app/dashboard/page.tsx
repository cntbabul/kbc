import { auth } from "@/auth"
import { redirect } from "next/navigation"
import dbConnect from "@/lib/mongodb"
import Result from "@/models/Result"
import Question from "@/models/Question"
import UserProgress from "@/models/UserProgress"
import Link from "next/link"

export default async function Dashboard() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    await dbConnect();

    const userId = session.user.id;

    // Fetch High Scores
    const results = await Result.find({ userId: userId }).sort({ score: -1 });

    // Process for high scores
    const highScores: Record<string, number> = {};
    results.forEach((r) => {
        if (!highScores[r.category] || r.score > highScores[r.category]) {
            highScores[r.category] = r.score;
        }
    });

    // Fetch Question Stats (DB Overview)
    const questionStats = await Question.aggregate([
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }
    ]);

    // Fetch User Overall Progress Stats
    const progressStats = await UserProgress.aggregate([
        { $match: { userId: userId } },
        {
            $group: {
                _id: null,
                totalAttempted: { $sum: 1 },
                totalCorrect: { $sum: { $cond: ["$isCorrect", 1, 0] } },
                totalWrong: { $sum: { $cond: ["$isCorrect", 0, 1] } }
            }
        }
    ]);

    const stats = progressStats[0] || { totalAttempted: 0, totalCorrect: 0, totalWrong: 0 };
    const accuracy = stats.totalAttempted > 0 ? ((stats.totalCorrect / stats.totalAttempted) * 100).toFixed(1) : 0;
    const totalQuestions = questionStats.reduce((acc: number, curr: any) => acc + curr.count, 0);

    return (
        <div className="flex min-h-screen flex-col bg-zinc-950 font-sans text-white">
            <div className="pt-6"></div>

            <main className="mx-auto w-full max-w-6xl p-6 md:p-12">
                <div className="grid gap-8 md:grid-cols-3">

                    {/* Sidebar / Actions */}
                    <div className="flex flex-col gap-6 md:col-span-1">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                            <h2 className="mb-4 text-lg font-bold text-white">Actions</h2>
                            <Link
                                href="/dashboard/add-question"
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                            >
                                <span>+</span> Add New Question
                            </Link>
                            <Link
                                href="/"
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10"
                            >
                                Play Quiz
                            </Link>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                            <h2 className="mb-2 text-lg font-bold text-white">Your Profile</h2>
                            <p className="text-sm text-gray-400">Email: {session.user.email}</p>
                            <p className="text-sm text-gray-400 mt-1">User ID: <span className="font-mono text-xs">{session.user.id}</span></p>
                        </div>

                        {/* Question Bank Stats Sidebar Box */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                            <h2 className="mb-4 text-lg font-bold text-white flex items-center justify-between gap-2">
                                <span className="flex items-center gap-2"><span>📚</span> Question Bank</span>
                                <span className="text-xs bg-indigo-500 text-white px-2 py-1 rounded-md shadow-lg shadow-indigo-500/20">{totalQuestions} Total</span>
                            </h2>
                            <div className="flex flex-col gap-3">
                                {questionStats.length > 0 ? (
                                    questionStats.map((stat: any) => (
                                        <div key={stat._id} className="flex justify-between items-center bg-black/20 p-2 rounded-lg">
                                            <span className="text-sm text-indigo-300 font-medium">{stat._id || "Uncategorized"}</span>
                                            <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-md">
                                                {stat.count} Qs
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No questions in database.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content / Stats */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Overall Statistics Panel */}
                        <div className="rounded-3xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-6 border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-20 text-6xl">📊</div>
                            <h2 className="mb-6 text-2xl font-bold tracking-tight">Lifetime Stats</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-black/20 p-4 rounded-2xl">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Attempted</p>
                                    <p className="text-3xl font-bold text-white mt-1">{stats.totalAttempted}</p>
                                </div>
                                <div className="bg-green-500/10 p-4 rounded-2xl border border-green-500/10">
                                    <p className="text-xs text-green-400 uppercase tracking-wider">Correct</p>
                                    <p className="text-3xl font-bold text-green-300 mt-1">{stats.totalCorrect}</p>
                                </div>
                                <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/10">
                                    <p className="text-xs text-red-400 uppercase tracking-wider">Wrong</p>
                                    <p className="text-3xl font-bold text-red-300 mt-1">{stats.totalWrong}</p>
                                </div>
                                <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/10">
                                    <p className="text-xs text-indigo-400 uppercase tracking-wider">Accuracy</p>
                                    <p className="text-3xl font-bold text-indigo-300 mt-1">{accuracy}%</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="mb-6 text-2xl font-bold tracking-tight">Highest Scores</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {Object.entries(highScores).length === 0 ? (
                                    <div className="col-span-2 rounded-2xl border border-dashed border-white/20 p-8 text-center text-gray-500">
                                        No games played yet.
                                    </div>
                                ) : (
                                    Object.entries(highScores).map(([category, score]) => (
                                        <div key={category} className="relative overflow-hidden rounded-2xl bg-zinc-900 p-6 border border-white/5 transition-all hover:bg-zinc-800">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 text-5xl">🏆</div>
                                            <h3 className="text-sm font-medium uppercase tracking-wider text-indigo-400 max-w-[80%]">{category}</h3>
                                            <p className="mt-2 text-4xl font-extrabold text-white">{score}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-4 text-xl font-bold">Recent Activity</h3>
                            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                                <div className="flex flex-col divide-y divide-white/10">
                                    {results.slice(0, 5).map((r: any) => (
                                        <div key={r._id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                                            <div>
                                                <p className="font-medium text-white">{r.category}</p>
                                                <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <span className={`font-bold ${r.score > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {r.score > 0 ? '+' : ''}{r.score}
                                            </span>
                                        </div>
                                    ))}
                                    {results.length === 0 && (
                                        <div className="p-4 text-center text-sm text-gray-500">No recent activity</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}
