

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddQuestionPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        text: '',
        description: '',
        option0: '',
        option1: '',
        option2: '',
        option3: '',
        correctAnswer: 0,
        category: 'Science',
        difficulty: 'easy'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [myQuestions, setMyQuestions] = useState<any[]>([]);

    useEffect(() => {
        fetchMyQuestions();
    }, []);

    const fetchMyQuestions = async () => {
        try {
            const res = await fetch('/api/user/questions');
            if (res.ok) {
                const data = await res.json();
                setMyQuestions(data);
            }
        } catch (e) {
            console.error("Failed to fetch my questions", e);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                text: formData.text,
                description: formData.description,
                options: [formData.option0, formData.option1, formData.option2, formData.option3],
                correctAnswer: Number(formData.correctAnswer),
                category: formData.category,
                difficulty: formData.difficulty
            };

            const res = await fetch('/api/questions/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to add question');
            }

            // Refresh list
            fetchMyQuestions();

            // Clear form (except category/difficulty maybe?)
            setFormData(prev => ({
                ...prev,
                text: '',
                description: '',
                option0: '',
                option1: '',
                option2: '',
                option3: '',
                correctAnswer: 0
            }));

            // Optional: show toast

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-start justify-center bg-zinc-950 p-4 font-sans text-white md:p-8 gap-8 flex-col md:flex-row">

            {/* Form Section */}
            <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-xl">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Add New Question</h1>
                    <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">Cancel</Link>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    <div className="grid grid-cols-2 gap-4">
                        {/* Subject (formerly Category) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
                            <select
                                className="w-full rounded-lg border border-white/10 bg-zinc-800 p-3 text-white focus:border-indigo-500 focus:outline-none"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Science">Science</option>
                                <option value="History">History</option>
                                <option value="Geography">Geography</option>
                                <option value="Entertainment">Entertainment</option>
                            </select>
                        </div>

                        {/* Difficulty */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Difficulty</label>
                            <select
                                className="w-full rounded-lg border border-white/10 bg-zinc-800 p-3 text-white focus:border-indigo-500 focus:outline-none capitalize"
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                                <option value="extreme">Extreme</option>
                            </select>
                        </div>
                    </div>

                    {/* Question Text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Question Text</label>
                        <textarea
                            required
                            className="w-full rounded-lg border border-white/10 bg-zinc-800 p-3 text-white focus:border-indigo-500 focus:outline-none"
                            rows={2}
                            placeholder="e.g. What is the capital of France?"
                            value={formData.text}
                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Description / Hint (Optional)</label>
                        <input
                            type="text"
                            className="w-full rounded-lg border border-white/10 bg-zinc-800 p-3 text-white focus:border-indigo-500 focus:outline-none"
                            placeholder="e.g. Known for the Eiffel Tower"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i}>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Option {i + 1}</label>
                                <input
                                    required
                                    type="text"
                                    className={`w-full rounded-lg border ${formData.correctAnswer === i ? 'border-green-500/50 bg-green-900/10' : 'border-white/10 bg-zinc-800'} p-3 text-white focus:border-indigo-500 focus:outline-none`}
                                    //@ts-ignore
                                    value={formData[`option${i}`]}
                                    //@ts-ignore
                                    onChange={(e) => setFormData({ ...formData, [`option${i}`]: e.target.value })}
                                />
                                <div className="mt-1 flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="correctAnswer"
                                        checked={formData.correctAnswer === i}
                                        onChange={() => setFormData({ ...formData, correctAnswer: i })}
                                        className="accent-green-500"
                                    />
                                    <span className="text-xs text-gray-400">Correct Answer</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full rounded-xl bg-indigo-600 p-4 font-bold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Create Question'}
                    </button>

                </form>
            </div>

            {/* My Questions Sidebar */}
            <div className="w-full md:w-96 flex-shrink-0">
                <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-xl sticky top-8">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span>📝</span> My Added Questions
                    </h2>
                    <div className="flex flex-col gap-3 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                        {myQuestions.length === 0 ? (
                            <div className="text-gray-500 text-sm italic">You haven't added any questions yet.</div>
                        ) : (
                            myQuestions.map((q: any) => (
                                <div key={q._id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded uppercase">{q.category}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded capitalize ${q.difficulty === 'very easy' ? 'bg-green-500/20 text-green-400' :
                                            q.difficulty === 'easy' ? 'bg-teal-500/20 text-teal-400' :
                                                q.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-400' :
                                                    'bg-red-500/20 text-red-400'
                                            }`}>{q.difficulty || 'Easy'}</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-200 line-clamp-2">{q.text}</p>
                                    <div className="mt-2 text-xs text-gray-500">
                                        Added: {new Date(q.createdAt || Date.now()).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
