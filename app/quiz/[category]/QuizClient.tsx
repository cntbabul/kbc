"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { notFound } from "next/navigation";

interface Question {
    _id: string;
    text: string;
    description: string;
    options: string[];
    correctAnswer: number;
}

interface ProgressRecord {
    questionId: string;
    isCorrect: boolean;
}

export default function QuizClient({ category }: { category: string }) {
    // Props passed from server component

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sessionAnswers, setSessionAnswers] = useState<ProgressRecord[]>([]);

    // Timer States
    const [timeLeft, setTimeLeft] = useState(30);
    const [bonusUsed, setBonusUsed] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, [category]);

    useEffect(() => {
        if (showResult && score > 0) {
            saveScore();
            saveProgress();
        }
    }, [showResult]);

    // Timer Logic
    useEffect(() => {
        if (loading || showResult || questions.length === 0 || selectedAnswer !== null) return;

        if (timeLeft <= 0) {
            if (!bonusUsed) {
                // First timeout: Add 30s bonus
                setBonusUsed(true);
                setTimeLeft(30);
            } else {
                // Second timeout: Auto-wrong
                handleAnswerClick(-1); // -1 indicates timeout/wrong
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, loading, showResult, questions.length, selectedAnswer, bonusUsed]);


    const fetchQuestions = async () => {
        try {
            const res = await fetch(`/api/questions?category=${encodeURIComponent(category)}`);
            if (!res.ok) throw new Error("Failed to fetch questions");
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                setQuestions(data);
                setTimeLeft(30); // Reset for first question
                setBonusUsed(false);
            } else {
                setError(`No questions found (or all completed!) for category: ${category}`);
            }
        } catch (err) {
            setError("Error loading game. Make sure MongoDB is connected.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerClick = (index: number) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(index);
        const currentQ = questions[currentIndex];
        // If index is -1, it means time ran out, so it's always wrong.
        const isCorrect = index === currentQ.correctAnswer;

        if (isCorrect) {
            setScore(score + 10);
            setCorrectCount(correctCount + 1);
        } else {
            setScore(score - 1);
            setWrongCount(wrongCount + 1);
        }

        setSessionAnswers(prev => [...prev, {
            questionId: currentQ._id,
            isCorrect: isCorrect
        }]);
    };

    const handleNextQuestion = () => {
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
            setTimeLeft(30); // Reset Timer
            setBonusUsed(false); // Reset Bonus
        } else {
            setShowResult(true);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setScore(0);
        setCorrectCount(0);
        setWrongCount(0);
        setSessionAnswers([]);
        setShowResult(false);
        setBonusUsed(false);
        setTimeLeft(30);
        fetchQuestions();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
                <p className="text-red-400 text-xl font-bold mb-4">{error}</p>
                <Link href="/" className="px-6 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700">
                    Back to Home
                </Link>
            </div>
        );
    }

    const saveScore = async () => {
        try {
            await fetch('/api/user/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, score })
            });
        } catch (e) {
            console.error("Failed to save score", e);
        }
    };

    const saveProgress = async () => {
        try {
            await fetch('/api/user/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers: sessionAnswers,
                    category: category
                })
            });
        } catch (e) {
            console.error("Failed to save progress", e);
        }
    };

    const currentQuestion = questions[currentIndex];
    // Timer Color Logic
    const timerColor = timeLeft > 10 ? 'text-white' : 'text-red-500 animate-pulse';

    if (showResult) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 p-4">
                <div className="w-full max-w-lg rounded-2xl bg-white/10 p-8 text-center backdrop-blur-md shadow-2xl border border-white/20">
                    <h2 className="mb-6 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                        Game Over!
                    </h2>
                    <p className="mb-8 text-2xl text-white">
                        You scored <span className="font-bold text-yellow-400">{score}</span>
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-8 text-indigo-200">
                        <div className="bg-white/5 p-4 rounded-xl">
                            <p className="text-sm">Correct</p>
                            <p className="text-2xl font-bold text-green-400">{correctCount}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl">
                            <p className="text-sm">Wrong</p>
                            <p className="text-2xl font-bold text-red-400">{wrongCount}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleRestart}
                            className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-3 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-lg shadow-blue-500/50"
                        >
                            Play Again
                        </button>
                        <div className="flex gap-4 justify-center mt-2">
                            <Link href="/dashboard" className="text-indigo-300 hover:text-white transition-colors text-sm">
                                Go to Dashboard
                            </Link>
                            <span className="text-gray-600">|</span>
                            <Link href="/" className="text-indigo-300 hover:text-white transition-colors text-sm">
                                Choose Category
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 p-4 md:p-8 font-sans">
            <main className="w-full max-w-4xl flex flex-col items-center">

                {/* Stats Header */}
                <div className="w-full flex justify-between items-start mb-6 px-2 text-sm md:text-base font-bold text-indigo-200 uppercase tracking-widest">
                    {/* Top Left: Counts */}
                    <div className="flex flex-col gap-1 items-start">
                        <div className="flex items-center gap-2">
                            <Link href="/" className="mr-2 text-red-500 hover:text-red-400 transition-colors" title="Exit Quiz">✕</Link>
                            <span className="text-indigo-400">Questions:</span>
                            <span className="text-white">{currentIndex + 1} / {questions.length}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs md:text-sm">
                            <span className="text-green-400">Right: {correctCount}</span>
                            <span className="text-gray-500">|</span>
                            <span className="text-red-400">Wrong: {wrongCount}</span>
                        </div>
                    </div>

                    {/* Timer - Center-ish or near top */}
                    <div className={`flex flex-col items-center justify-center -ml-8 ${bonusUsed ? 'text-orange-400' : ''}`}>
                        <div className={`text-4xl font-black ${timerColor} tabular-nums drop-shadow-lg`}>
                            {timeLeft}s
                        </div>
                        {bonusUsed && <span className="text-[10px] text-orange-400 tracking-wider">BONUS TIME</span>}
                    </div>

                    {/* Top Right: Score */}
                    <div className="flex flex-col items-end">
                        <span className="text-indigo-400 text-xs text-right mb-1">{category}</span>
                        <span className="text-3xl md:text-4xl font-extrabold text-yellow-400 tabular-nums drop-shadow-md">
                            {score}
                        </span>
                    </div>
                </div>

                {/* Question Container */}
                <div className="w-full rounded-3xl bg-black/40 p-1 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                    <div className="flex flex-col items-center p-6 md:p-10">

                        {/* Question Text */}
                        <div className="mb-6 w-full text-center">
                            <h2 className="text-xl md:text-3xl font-bold leading-tight text-white mb-4">
                                {currentQuestion.text}
                            </h2>

                            {/* Description - Logic Update: Show ONLY after answer */}
                            {selectedAnswer !== null && (
                                <div className="mt-6 w-full bg-indigo-900/40 rounded-xl p-4 border border-indigo-500/30 animate-in fade-in slide-in-from-top-2 duration-500">
                                    <div className="flex gap-3 items-start">
                                        <span className="text-2xl">💡</span>
                                        <div className="text-left">
                                            <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Did you know?</p>
                                            <p className="text-white text-sm md:text-base leading-relaxed">
                                                {currentQuestion.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Answer Options Grid */}
                        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = selectedAnswer === index;
                                const isCorrect = index === currentQuestion.correctAnswer;
                                const isRevealed = selectedAnswer !== null;

                                let buttonStyle = "border-indigo-500/30 bg-indigo-950/40 text-white hover:bg-indigo-800/60 hover:border-indigo-400"; // Default

                                if (isRevealed) {
                                    if (isCorrect) {
                                        // ALWAYS Green if correct
                                        buttonStyle = "border-green-500 bg-green-500/20 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]";
                                    } else if (isSelected && !isCorrect) {
                                        // Red if picked wrong
                                        buttonStyle = "border-red-500 bg-red-500/20 text-white";
                                    } else {
                                        // Dim others
                                        buttonStyle = "opacity-40 border-transparent bg-black/20 text-gray-500";
                                    }
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerClick(index)}
                                        disabled={isRevealed}
                                        className={`group relative flex items-center rounded-xl border-2 px-6 py-4 text-left transition-all duration-300 ease-out ${buttonStyle}`}
                                    >
                                        <span className={`mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-current text-sm font-bold ${isRevealed ? 'opacity-100' : 'opacity-70'}`}>
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        <span className="text-lg font-medium">{option}</span>

                                        {/* Icons for right/wrong */}
                                        {isRevealed && isCorrect && (
                                            <span className="absolute right-4 text-green-400 text-xl">✓</span>
                                        )}
                                        {isRevealed && isSelected && !isCorrect && (
                                            <span className="absolute right-4 text-red-400 text-xl">✕</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Next Button */}
                        {selectedAnswer !== null && (
                            <div className="mt-8">
                                <button
                                    onClick={handleNextQuestion}
                                    className="rounded-full bg-yellow-500 px-10 py-3 text-lg font-bold text-black shadow-lg shadow-yellow-500/20 transition-transform hover:scale-105 hover:bg-yellow-400 active:scale-95"
                                >
                                    {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next Question →"}
                                </button>
                            </div>
                        )}

                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-8 h-2 w-full max-w-xs overflow-hidden rounded-full bg-gray-800">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>

            </main>
        </div>
    );
}
