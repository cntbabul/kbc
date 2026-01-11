
import { signIn } from "@/auth"
import Link from "next/link"

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 p-4 font-sans">
            <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-md border border-white/20 text-center">

                <h1 className="mb-2 text-3xl font-extrabold text-white">Welcome Back</h1>
                <p className="mb-8 text-indigo-200">Sign in to save your progress and compete!</p>

                <div className="flex flex-col gap-4">

                    <form
                        action={async () => {
                            "use server"
                            await signIn("google", { redirectTo: "/dashboard" })
                        }}
                    >
                        <button className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-black transition-transform hover:scale-105 hover:bg-gray-100">
                            <img src="https://authjs.dev/img/providers/google.svg" className="h-5 w-5" alt="Google" />
                            <span className="font-semibold">Sign in with Google</span>
                        </button>
                    </form>

                    <form
                        action={async () => {
                            "use server"
                            await signIn("github", { redirectTo: "/dashboard" })
                        }}
                    >
                        <button className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#24292F] px-4 py-3 text-white transition-transform hover:scale-105 hover:bg-[#333]">
                            <img src="https://authjs.dev/img/providers/github.svg" className="h-5 w-5 invert" alt="GitHub" />
                            <span className="font-semibold">Sign in with GitHub</span>
                        </button>
                    </form>

                    <form
                        action={async () => {
                            "use server"
                            await signIn("apple", { redirectTo: "/dashboard" })
                        }}
                    >
                        <button className="flex w-full items-center justify-center gap-3 rounded-lg bg-black px-4 py-3 text-white transition-transform hover:scale-105 hover:bg-gray-900">
                            <img src="https://authjs.dev/img/providers/apple.svg" className="h-5 w-5 invert" alt="Apple" />
                            <span className="font-semibold">Sign in with Apple</span>
                        </button>
                    </form>

                </div>

                <div className="mt-8 text-sm text-indigo-300">
                    <Link href="/" className="hover:text-white hover:underline underline-offset-4">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
