import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface Question {
    _id: string;
    text: string;
    description: string;
    options: string[];
    correctAnswer: number;
}

// Mock Data
const MOCK_QUESTIONS: Record<string, Question[]> = {
    Science: [
        {
            _id: "s1",
            text: "What is the chemical symbol for Gold?",
            description: "Au comes from the Latin word 'Aurum'.",
            options: ["Ag", "Au", "Pb", "Fe"],
            correctAnswer: 1,
        },
        {
            _id: "s2",
            text: "Which planet is known as the Red Planet?",
            description: "Mars appears red due to iron oxide (rust) on its surface.",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correctAnswer: 1,
        },
        {
            _id: "s3",
            text: "What is the powerhouse of the cell?",
            description: "Mitochondria generate most of the chemical energy needed to power the cell's biochemical reactions.",
            options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Apparatus"],
            correctAnswer: 1,
        }
    ],
    History: [
        {
            _id: "h1",
            text: "Who was the first President of the United States?",
            description: "George Washington served as the first president from 1789 to 1797.",
            options: ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"],
            correctAnswer: 2,
        },
        {
            _id: "h2",
            text: "In which year did World War II end?",
            description: "World War II ended in 1945 with the surrender of Germany and Japan.",
            options: ["1943", "1944", "1945", "1950"],
            correctAnswer: 2,
        }
    ],
    Geography: [
        {
            _id: "g1",
            text: "What is the capital of France?",
            description: "Paris is the capital and most populous city of France.",
            options: ["London", "Berlin", "Madrid", "Paris"],
            correctAnswer: 3,
        },
        {
            _id: "g2",
            text: "Which is the largest ocean on Earth?",
            description: "The Pacific Ocean covers about 46% of Earth's water surface.",
            options: ["Atlantic", "Indian", "Arctic", "Pacific"],
            correctAnswer: 3,
        }
    ],
    Entertainment: [
        {
            _id: "e1",
            text: "Who played Iron Man in the Marvel Cinematic Universe?",
            description: "Robert Downey Jr. kicked off the MCU with Iron Man in 2008.",
            options: ["Chris Evans", "Chris Hemsworth", "Robert Downey Jr.", "Mark Ruffalo"],
            correctAnswer: 2,
        },
        {
            _id: "e2",
            text: "Which movie won the Oscar for Best Picture in 2020?",
            description: "Parasite was the first non-English language film to win Best Picture.",
            options: ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"],
            correctAnswer: 2,
        }
    ]
};

export default function QuizScreen() {
    const { category } = useLocalSearchParams<{ category: string }>();
    const router = useRouter();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(true);

    // Timer text rendering
    const [timeLeft, setTimeLeft] = useState(30);
    const [bonusUsed, setBonusUsed] = useState(false);

    useEffect(() => {
        // Simulate fetch
        const timer = setTimeout(() => {
            const cat = category || "Science";
            const questionsData = MOCK_QUESTIONS[cat] || MOCK_QUESTIONS["Science"];
            setQuestions(questionsData);
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [category]);


    useEffect(() => {
        if (loading || showResult || questions.length === 0 || selectedAnswer !== null) return;

        if (timeLeft <= 0) {
            if (!bonusUsed) {
                setBonusUsed(true);
                setTimeLeft(30);
            } else {
                handleAnswerClick(-1);
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, loading, showResult, questions.length, selectedAnswer, bonusUsed]);


    const handleAnswerClick = (index: number) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(index);
        const currentQ = questions[currentIndex];
        const isCorrect = index === currentQ.correctAnswer;

        if (isCorrect) {
            setScore(score + 10);
            setCorrectCount(correctCount + 1);
        } else {
            setScore(score - 1);
            setWrongCount(wrongCount + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
            setTimeLeft(30);
            setBonusUsed(false);
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
        setShowResult(false);
        setBonusUsed(false);
        setTimeLeft(30);
        setLoading(true);
        // Re-simulate fetch
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    if (loading) {
        return (
            <LinearGradient colors={['#0f172a', '#1e1b4b']} style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#eab308" />
                <Text style={styles.loadingText}>Loading Quiz...</Text>
            </LinearGradient>
        );
    }

    if (showResult) {
        return (
            <LinearGradient
                colors={['#0f172a', '#581c87', '#0f172a']}
                style={styles.container}
            >
                <BlurView intensity={30} tint="dark" style={styles.resultCard}>
                    <Text style={styles.gameOverText}>Game Over!</Text>
                    <Text style={styles.scoreText}>
                        You scored <Text style={styles.scoreHighlight}>{score}</Text>
                    </Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Correct</Text>
                            <Text style={[styles.statValue, { color: '#4ade80' }]}>{correctCount}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Wrong</Text>
                            <Text style={[styles.statValue, { color: '#f87171' }]}>{wrongCount}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.playAgainBtn} onPress={handleRestart}>
                        <Text style={styles.playAgainText}>Play Again</Text>
                    </TouchableOpacity>

                    <View style={styles.resultLinks}>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/index')}>
                            <Text style={styles.linkText}>Choose Category</Text>
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </LinearGradient>
        );
    }

    const currentQuestion = questions[currentIndex];
    const timerColor = timeLeft > 10 ? 'white' : '#ef4444';

    return (
        <LinearGradient
            colors={['#1e1b4b', '#581c87', '#1e1b4b']}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Stats Header */}
                <View style={styles.header}>
                    <View>
                        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color="#ef4444" />
                        </TouchableOpacity>
                        <Text style={styles.qCount}>
                            Question: <Text style={{ color: 'white' }}>{currentIndex + 1} / {questions.length}</Text>
                        </Text>
                        <View style={styles.miniStats}>
                            <Text style={{ color: '#4ade80', fontSize: 12 }}>Right: {correctCount}</Text>
                            <Text style={{ color: '#6b7280', marginHorizontal: 5 }}>|</Text>
                            <Text style={{ color: '#f87171', fontSize: 12 }}>Wrong: {wrongCount}</Text>
                        </View>
                    </View>

                    <View style={styles.timerContainer}>
                        <Text style={[styles.timerText, { color: timerColor }]}>{timeLeft}s</Text>
                        {bonusUsed && <Text style={styles.bonusText}>BONUS</Text>}
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.catLabel}>{category}</Text>
                        <Text style={styles.scoreDisplay}>{score}</Text>
                    </View>
                </View>

                {/* Question Card */}
                <BlurView intensity={20} tint="dark" style={styles.questionCard}>
                    <Text style={styles.questionText}>{currentQuestion.text}</Text>

                    {selectedAnswer !== null && (
                        <View style={styles.descriptionBox}>
                            <Text style={styles.bulb}>💡</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.descLabel}>DID YOU KNOW?</Text>
                                <Text style={styles.descText}>{currentQuestion.description}</Text>
                            </View>
                        </View>
                    )}

                    {/* Options */}
                    <View style={styles.optionsContainer}>
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = selectedAnswer === index;
                            const isCorrect = index === currentQuestion.correctAnswer;
                            const isRevealed = selectedAnswer !== null;

                            let borderColor = 'rgba(99, 102, 241, 0.3)';
                            let bgColor = 'rgba(30, 27, 75, 0.4)';

                            if (isRevealed) {
                                if (isCorrect) {
                                    borderColor = '#22c55e';
                                    bgColor = 'rgba(34, 197, 94, 0.2)';
                                } else if (isSelected && !isCorrect) {
                                    borderColor = '#ef4444';
                                    bgColor = 'rgba(239, 68, 68, 0.2)';
                                } else {
                                    borderColor = 'transparent';
                                    bgColor = 'rgba(0,0,0,0.2)';
                                }
                            }

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.optionBtn,
                                        { borderColor, backgroundColor: bgColor, opacity: (isRevealed && !isSelected && !isCorrect) ? 0.5 : 1 }
                                    ]}
                                    onPress={() => handleAnswerClick(index)}
                                    disabled={isRevealed}
                                >
                                    <View style={styles.optionLetter}>
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{String.fromCharCode(65 + index)}</Text>
                                    </View>
                                    <Text style={styles.optionText}>{option}</Text>

                                    {isRevealed && isCorrect && <Ionicons name="checkmark-circle" size={24} color="#4ade80" style={{ marginLeft: 'auto' }} />}
                                    {isRevealed && isSelected && !isCorrect && <Ionicons name="close-circle" size={24} color="#ef4444" style={{ marginLeft: 'auto' }} />}
                                </TouchableOpacity>
                            )
                        })}
                    </View>

                    {selectedAnswer !== null && (
                        <TouchableOpacity style={styles.nextBtn} onPress={handleNextQuestion}>
                            <Text style={styles.nextBtnText}>
                                {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next Question →"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </BlurView>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: `${((currentIndex + 1) / questions.length) * 100}%` }]} />
                </View>

            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: '#94a3b8', marginTop: 10 },
    scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 40 },

    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
    closeBtn: { marginBottom: 4 },
    qCount: { color: '#818cf8', fontWeight: 'bold' },
    miniStats: { flexDirection: 'row', marginTop: 4 },

    timerContainer: { alignItems: 'center' },
    timerText: { fontSize: 32, fontWeight: '900' },
    bonusText: { color: '#fb923c', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },

    catLabel: { color: '#818cf8', fontSize: 12, textAlign: 'right' },
    scoreDisplay: { fontSize: 32, fontWeight: '800', color: '#facc15' },

    questionCard: {
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        overflow: 'hidden',
    },
    questionText: { fontSize: 22, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 24, lineHeight: 30 },

    descriptionBox: {
        backgroundColor: 'rgba(49, 46, 129, 0.4)',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.3)',
        width: '100%',
    },
    bulb: { fontSize: 24 },
    descLabel: { color: '#c7d2fe', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginBottom: 4 },
    descText: { color: 'white', fontSize: 14, lineHeight: 20 },

    optionsContainer: { width: '100%', gap: 12 },
    optionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
    },
    optionLetter: {
        width: 32, height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    optionText: { color: 'white', fontSize: 16, fontWeight: '500', flex: 1 },

    nextBtn: {
        marginTop: 32,
        backgroundColor: '#eab308',
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 999,
        shadowColor: '#eab308',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    nextBtnText: { fontSize: 18, fontWeight: 'bold', color: 'black' },

    progressContainer: {
        marginTop: 32,
        height: 6,
        backgroundColor: '#1f2937',
        borderRadius: 999,
        width: '100%',
        maxWidth: 200,
        alignSelf: 'center',
        overflow: 'hidden'
    },
    progressBar: { height: '100%', backgroundColor: '#6366f1' },

    // Result Styles
    resultCard: {
        margin: 20,

        padding: 32,
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        marginTop: 100,
    },
    gameOverText: { fontSize: 36, fontWeight: '900', color: '#facc15', marginBottom: 24 },
    scoreText: { fontSize: 24, color: 'white', marginBottom: 32 },
    scoreHighlight: { fontWeight: 'bold', color: '#facc15' },
    statsRow: { flexDirection: 'row', gap: 16, marginBottom: 32, width: '100%' },
    statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 16, alignItems: 'center' },
    statLabel: { color: '#c7d2fe', fontSize: 12, marginBottom: 4 },
    statValue: { fontSize: 24, fontWeight: 'bold' },
    playAgainBtn: {
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 999,
        marginBottom: 20,
    },
    playAgainText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    resultLinks: { flexDirection: 'row', gap: 16 },
    linkText: { color: '#c7d2fe', fontSize: 14 },
});
