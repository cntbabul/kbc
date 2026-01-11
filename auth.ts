import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "./lib/db"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Apple from "next-auth/providers/apple"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        GitHub, // Auto reads GITHUB_ID, GITHUB_SECRET
        Apple({
            clientId: process.env.APPLE_ID,
            clientSecret: process.env.APPLE_SECRET
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            // Attach user ID to session
            if (session?.user && user?.id) {
                session.user.id = user.id;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login', // Custom login page
    }
})
