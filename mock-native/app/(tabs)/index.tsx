import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';

const categories = [
  {
    name: "Science",
    description: "Explore the wonders of the universe, biology, and chemistry.",
    icon: "🧬",
    colors: ['#3b82f6', '#22d3ee'] as const,
  },
  {
    name: "History",
    description: "Dive into the past events that shaped our world.",
    icon: "📜",
    colors: ['#f59e0b', '#fb923c'] as const,
  },
  {
    name: "Geography",
    description: "Travel the world and test your knowledge of places.",
    icon: "🌍",
    colors: ['#22c55e', '#34d399'] as const,
  },
  {
    name: "Entertainment",
    description: "Movies, music, celebrities, and pop culture.",
    icon: "🎬",
    colors: ['#a855f7', '#f472b6'] as const,
  }
];

export default function Home() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#1e1b4b', '#581c87', '#1e1b4b']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            MILLIONAIRE <Text style={styles.titleHighlight}>QUIZ</Text>
          </Text>
          <Text style={styles.subtitle}>
            Choose a category to start your journey to become a virtual millionaire!
          </Text>
        </View>

        {/* Categories Grid */}
        <View style={styles.grid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={styles.cardContainer}
              onPress={() => router.push(`/quiz/${category.name}`)}
              activeOpacity={0.8}
            >
              <BlurView intensity={20} tint="dark" style={styles.card}>
                <View style={[styles.iconContainer, { backgroundColor: category.colors[0] }]}>
                  {/* Using Text for emoji icon for simplicity matching web */}
                  <Text style={styles.icon}>{category.icon}</Text>
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{category.name}</Text>
                  <Text style={styles.cardDescription}>{category.description}</Text>

                  <View style={styles.cardFooter}>
                    <Text style={styles.startText}>Start Quiz</Text>
                    <Text style={styles.arrow}>→</Text>
                  </View>
                </View>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Game Data Management</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
    alignItems: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowRadius: 15,
  },
  titleHighlight: {
    color: '#facc15', // yellow-400
  },
  subtitle: {
    fontSize: 16,
    color: '#c7d2fe', // indigo-200
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 24,
  },
  grid: {
    width: '100%',
    gap: 20,
  },
  cardContainer: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  card: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  icon: {
    fontSize: 30,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#c7d2fe',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    marginRight: 8,
  },
  arrow: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  footer: {
    marginTop: 60,
    opacity: 0.5,
  },
  footerText: {
    color: '#c7d2fe',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
