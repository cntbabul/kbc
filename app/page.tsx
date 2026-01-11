"use client";

import Link from "next/link";

const categories = [
  {
    name: "Science",
    description: "Explore the wonders of the universe, biology, and chemistry.",
    icon: "🧬",
    color: "from-blue-500 to-cyan-400",
  },
  {
    name: "History",
    description: "Dive into the past events that shaped our world.",
    icon: "📜",
    color: "from-amber-500 to-orange-400",
  },
  {
    name: "Geography",
    description: "Travel the world and test your knowledge of places.",
    icon: "🌍",
    color: "from-green-500 to-emerald-400",
  },
  {
    name: "Entertainment",
    description: "Movies, music, celebrities, and pop culture.",
    icon: "🎬",
    color: "from-purple-500 to-pink-400",
  }
];

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 p-4 md:p-8 font-sans">
      <main className="w-full max-w-5xl flex flex-col items-center">

        {/* Header / Logo Area */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] mb-4">
            MILLIONAIRE <span className="text-yellow-400">QUIZ</span>
          </h1>
          <p className="text-lg text-indigo-200 max-w-xl mx-auto">
            Choose a category to start your journey to become a virtual millionaire!
            Test your knowledge across different domains.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/quiz/${category.name}`}
              className="group relative overflow-hidden rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/20"
            >
              {/* Card Background Gradient on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              <div className="p-8 flex items-start gap-6">
                <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} shadow-lg text-4xl transform group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {category.name}
                  </h2>
                  <p className="text-indigo-200 text-sm leading-relaxed">
                    {category.description}
                  </p>

                  <div className="mt-4 flex items-center text-sm font-semibold text-white/50 group-hover:text-white transition-colors">
                    Start Quiz <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer/Seed Link for Dev */}
        <div className="mt-16 text-center">
          <p className="text-indigo-400/50 text-xs uppercase tracking-widest">
            Game Data Management
          </p>
          <a
            href="/api/seed"
            target="_blank"
            className="mt-2 inline-block px-4 py-1 rounded-full bg-white/5 text-indigo-300 hover:bg-white/10 hover:text-white text-xs transition-colors"
          >
            Reset / Seed Database
          </a>
        </div>

      </main>
    </div>
  );
}
