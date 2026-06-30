"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { buildQuizCards } from "./quizData";

function QuizCard({ quiz }) {
  return (
    <div key={quiz.title} className="border rounded-2xl p-6 shadow-sm hover:shadow-lg transition bg-white dark:bg-[#222327]">
      <h2 className="text-3xl font-semibold mb-4">📘 {quiz.title}</h2>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {quiz.description}
      </p>

      <Link href={quiz.href}>
        <button
          className={`text-white px-6 py-3 rounded-lg font-semibold ${quiz.color}`}
        >
          Start Quiz
        </button>
      </Link>
    </div>
  );
}

function SortingQuizGroup({ quiz }) {
  return (
    <div className="border rounded-2xl p-6 shadow-sm hover:shadow-lg transition bg-white dark:bg-[#222327]">
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-3xl font-semibold">📘 {quiz.title}</h2>
        <p className="text-gray-600 dark:text-gray-300">{quiz.description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {quiz.items.map((item) => (
          <Link key={item.title} href={item.href}>
            <button
              className={`w-full text-white px-5 py-3 rounded-lg font-semibold ${item.color}`}
            >
              Start {item.title}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function QuizPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const displayCards = useMemo(
    () => buildQuizCards(searchQuery),
    [searchQuery],
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f] p-8">
      <h1 className="text-5xl font-bold text-center mb-4">🎯 Quiz Mode</h1>

      <p className="text-center text-gray-500 mb-6">
        Choose an algorithm quiz to test your understanding.
      </p>

      <div className="relative max-w-2xl mx-auto mb-10">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />

        <input
          type="text"
          placeholder="Search quizzes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-12 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#2b2b2b] dark:border-gray-700"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {displayCards.length > 0 ? (
          displayCards.map((quiz) =>
            quiz.type === "group" ? (
              <SortingQuizGroup key={quiz.title} quiz={quiz} />
            ) : (
              <QuizCard key={quiz.title} quiz={quiz} />
            ),
          )
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-xl text-gray-500 dark:text-gray-400">
              No quizzes found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
