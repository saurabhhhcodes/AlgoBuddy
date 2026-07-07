"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

export default function DuelLobbyPage({ params }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-neutral-900">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-neutral-900">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-neutral-200">Access Denied</h2>
          <p className="text-sm text-slate-500 dark:text-neutral-400">Please sign in to join a duel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-900 p-8 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-neutral-200">Duel Lobby</h1>
      <p className="text-slate-500 dark:text-neutral-400 mt-2">Scaffolding created successfully.</p>
    </div>
  );
}
