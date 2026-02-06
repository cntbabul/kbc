import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

import { useSession } from '../ctx';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const router = useRouter();
    const { signIn } = useSession();

    const handleLogin = (provider: string) => {
        // Mock Login Logic
        alert(`Signing in with ${provider}...`);
        setTimeout(() => {
            signIn();
            router.replace('/(tabs)/dashboard');
        }, 1000);
    };

    return (
        <LinearGradient
            colors={['#1e1b4b', '#581c87', '#1e1b4b']}
            style={styles.container}
        >
            <View style={styles.content}>
                <BlurView intensity={20} tint="dark" style={styles.card}>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to save your progress and compete!</Text>

                    <View style={styles.buttonContainer}>
                        {/* Google */}
                        <TouchableOpacity style={styles.socialBtn} onPress={() => handleLogin('Google')}>
                            <Ionicons name="logo-google" size={20} color="black" />
                            <Text style={styles.btnText}>Sign in with Google</Text>
                        </TouchableOpacity>

                        {/* GitHub */}
                        <TouchableOpacity style={[styles.socialBtn, styles.githubBtn]} onPress={() => handleLogin('GitHub')}>
                            <Ionicons name="logo-github" size={20} color="white" />
                            <Text style={[styles.btnText, { color: 'white' }]}>Sign in with GitHub</Text>
                        </TouchableOpacity>

                        {/* Apple */}
                        <TouchableOpacity style={[styles.socialBtn, styles.appleBtn]} onPress={() => handleLogin('Apple')}>
                            <Ionicons name="logo-apple" size={20} color="white" />
                            <Text style={[styles.btnText, { color: 'white' }]}>Sign in with Apple</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
                        <Text style={styles.backText}>← Back to Home</Text>
                    </TouchableOpacity>
                </BlurView>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    content: { alignItems: 'center' },
    card: {
        width: '100%',
        maxWidth: 400,
        padding: 30,
        borderRadius: 24,
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: 'white',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#c7d2fe',
        textAlign: 'center',
        marginBottom: 32,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    socialBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 12,
    },
    githubBtn: { backgroundColor: '#24292F' },
    appleBtn: { backgroundColor: 'black' },
    btnText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'black',
    },
    backLink: { marginTop: 32 },
    backText: { color: '#818cf8', fontSize: 14 },
});
