"use client";

import Link from "next/link";

export default function EmptyState({
  icon: Icon,
  title,
  message,
  actionLabel,
  actionHref,
  actionOnClick,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-neutral-800 dark:bg-neutral-900">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Icon className="h-7 w-7 text-primary" />
        </div>
      )}
      <h3 className="text-base font-black text-slate-800 dark:text-white">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-neutral-400">
        {message}
      </p>
      {actionLabel && (actionHref || actionOnClick) && (
        actionHref ? (
          <Link
            href={actionHref}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-primary focus-ring dark:bg-white dark:text-slate-900"
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            type="button"
            onClick={actionOnClick}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-primary focus-ring dark:bg-white dark:text-slate-900"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
}
