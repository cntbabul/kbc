import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock Data matching Next.js Dashboard structure


import { useSession } from '../../ctx';
import { Redirect } from 'expo-router';

// Mock Data matching Next.js Dashboard structure
const MOCK_USER = {
    email: "user@example.com",
    id: "mock-user-123456",
    initial: "U",
    avatarColor: "#4f46e5"
};

const MOCK_STATS = {
    totalAttempted: 142,
    totalCorrect: 89,
    totalWrong: 53,
    accuracy: 62.7
};

const MOCK_HIGH_SCORES = [
    { category: "Science", score: 240 },
    { category: "History", score: 180 },
    { category: "Geography", score: 310 },
    { category: "Entertainment", score: 150 },
];

const MOCK_RECENT_ACTIVITY = [
    { _id: "1", category: "Science", score: 40, date: "2024-02-06", isWin: true },
    { _id: "2", category: "History", score: -10, date: "2024-02-05", isWin: false },
    { _id: "3", category: "Geography", score: 120, date: "2024-02-04", isWin: true },
    { _id: "4", category: "Entertainment", score: 80, date: "2024-02-03", isWin: true },
    { _id: "5", category: "Science", score: -5, date: "2024-02-02", isWin: false },
];

export default function Dashboard() {
    const router = useRouter();
    const { session, signOut } = useSession();

    if (!session) {
        return <Redirect href="/login" />;
    }

    return (
        <LinearGradient
            colors={['#0f172a', '#312e81', '#0f172a']}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Dashboard</Text>
                    <TouchableOpacity
                        style={styles.logoutBtn}
                        onPress={() => {
                            signOut();
                            // Redirect is handled by the component re-rendering and hitting the (!session) check or automatic router behavior if protected layouts were used.
                            // But here explicit check works.
                        }}
                    >
                        <Ionicons name="log-out-outline" size={24} color="#f87171" />
                    </TouchableOpacity>
                </View>

                {/* Profile Card */}
                <BlurView intensity={20} tint="dark" style={styles.card}>
                    <View style={styles.profileHeader}>
                        <View style={[styles.avatar, { backgroundColor: MOCK_USER.avatarColor }]}>
                            <Text style={styles.avatarText}>{MOCK_USER.initial}</Text>
                        </View>
                        <View>
                            <Text style={styles.email}>{MOCK_USER.email}</Text>
                            <Text style={styles.userId}>ID: {MOCK_USER.id}</Text>
                        </View>
                    </View>
                </BlurView>

                {/* Profile Card */}


                {/* Lifetime Stats Grid */}
                <Text style={styles.sectionTitle}>Lifetime Stats</Text>
                <View style={styles.statsGrid}>
                    <BlurView intensity={10} tint="dark" style={styles.statBox}>
                        <Text style={styles.statLabel}>ATTEMPTED</Text>
                        <Text style={styles.statValue}>{MOCK_STATS.totalAttempted}</Text>
                    </BlurView>
                    <BlurView intensity={10} tint="dark" style={[styles.statBox, { borderColor: 'rgba(74, 222, 128, 0.2)' }]}>
                        <Text style={[styles.statLabel, { color: '#4ade80' }]}>CORRECT</Text>
                        <Text style={[styles.statValue, { color: '#4ade80' }]}>{MOCK_STATS.totalCorrect}</Text>
                    </BlurView>
                    <BlurView intensity={10} tint="dark" style={[styles.statBox, { borderColor: 'rgba(248, 113, 113, 0.2)' }]}>
                        <Text style={[styles.statLabel, { color: '#f87171' }]}>WRONG</Text>
                        <Text style={[styles.statValue, { color: '#f87171' }]}>{MOCK_STATS.totalWrong}</Text>
                    </BlurView>
                    <BlurView intensity={10} tint="dark" style={[styles.statBox, { borderColor: 'rgba(129, 140, 248, 0.2)' }]}>
                        <Text style={[styles.statLabel, { color: '#818cf8' }]}>ACCURACY</Text>
                        <Text style={[styles.statValue, { color: '#818cf8' }]}>{MOCK_STATS.accuracy}%</Text>
                    </BlurView>
                </View>

                {/* High Scores */}
                <Text style={styles.sectionTitle}>High Scores</Text>
                <View style={styles.highScoreGrid}>
                    {MOCK_HIGH_SCORES.map((item) => (
                        <BlurView key={item.category} intensity={15} tint="dark" style={styles.highScoreCard}>
                            <Text style={styles.highScoreCat}>{item.category}</Text>
                            <Text style={styles.highScoreVal}>{item.score}</Text>
                            <Ionicons name="trophy" size={24} color="rgba(255, 255, 255, 0.1)" style={styles.trophyIcon} />
                        </BlurView>
                    ))}
                </View>

                {/* Recent Activity */}
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <BlurView intensity={20} tint="dark" style={styles.activityCard}>
                    {MOCK_RECENT_ACTIVITY.map((activity, index) => (
                        <View key={activity._id} style={[
                            styles.activityRow,
                            index !== MOCK_RECENT_ACTIVITY.length - 1 && styles.activityBorder
                        ]}>
                            <View>
                                <Text style={styles.activityCat}>{activity.category}</Text>
                                <Text style={styles.activityDate}>{activity.date}</Text>
                            </View>
                            <Text style={[
                                styles.activityScore,
                                { color: activity.score > 0 ? '#4ade80' : '#f87171' }
                            ]}>
                                {activity.score > 0 ? '+' : ''}{activity.score}
                            </Text>
                        </View>
                    ))}
                </BlurView>

                {/* Add Question Action - Mimicking the web dashboard 'Add New Answer' */}
                <TouchableOpacity style={styles.actionBtn}>
                    <LinearGradient
                        colors={['#2563eb', '#4f46e5']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.actionGradient}
                    >
                        <Ionicons name="add-circle-outline" size={24} color="white" />
                        <Text style={styles.actionText}>Add New Question</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Spacer for Tab Bar */}
                <View style={{ height: 80 }} />

            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20, paddingTop: 60 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: { fontSize: 32, fontWeight: '800', color: 'white' },
    logoutBtn: {
        padding: 10,
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(248, 113, 113, 0.2)'
    },

    card: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    avatar: {
        width: 60, height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    avatarText: { fontSize: 24, fontWeight: 'bold', color: 'white' },
    email: { fontSize: 16, fontWeight: '600', color: 'white' },
    userId: { fontSize: 12, color: '#94a3b8', marginTop: 4, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },


    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 16 },

    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
    },
    statBox: {
        width: '48%',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
    },
    statLabel: { fontSize: 10, fontWeight: 'bold', color: '#94a3b8', letterSpacing: 1, marginBottom: 8 },
    statValue: { fontSize: 24, fontWeight: 'bold', color: 'white' },

    highScoreGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
    },
    highScoreCard: {
        width: '48%',
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.2)',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        position: 'relative',
    },
    highScoreCat: { fontSize: 12, fontWeight: 'bold', color: '#818cf8', textTransform: 'uppercase', marginBottom: 4 },
    highScoreVal: { fontSize: 28, fontWeight: '800', color: 'white' },
    trophyIcon: { position: 'absolute', right: 8, top: 8 },

    activityCard: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: 32,
    },
    activityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    activityBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    activityCat: { fontSize: 16, fontWeight: '600', color: 'white' },
    activityDate: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
    activityScore: { fontSize: 18, fontWeight: 'bold' },

    actionBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
    actionGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        gap: 8,
    },
    actionText: { fontSize: 16, fontWeight: 'bold', color: 'white' },
});
