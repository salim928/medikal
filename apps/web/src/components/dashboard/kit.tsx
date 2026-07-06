"use client";

import { ArrowRight } from "lucide-react";

export function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export function todayLabel() {
  return new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

type IconType = React.ComponentType<{ className?: string }>;

export function WelcomeBanner({
  name,
  subtitle,
  actions,
}: {
  name: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-navy-950 px-6 py-8 sm:px-10 sm:py-10">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_80%_at_15%_10%,rgba(37,99,235,0.45),transparent_65%)]" />
      <div aria-hidden className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-brand-600/25 blur-3xl" />
      <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-medium text-brand-300">{todayLabel()}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {greeting()}, {name}.
          </h1>
          <p className="mt-2 max-w-md text-slate-300">{subtitle}</p>
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  );
}

export function BannerButton({
  icon: Icon,
  label,
  onClick,
  variant = "solid",
}: {
  icon?: IconType;
  label: string;
  onClick?: () => void;
  variant?: "solid" | "outline";
}) {
  return (
    <button
      onClick={onClick}
      className={
        variant === "solid"
          ? "inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          : "inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
      }
    >
      {Icon && <Icon className="h-4 w-4" />} {label}
    </button>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  trend,
}: {
  icon: IconType;
  label: string;
  value: string;
  hint?: string;
  trend?: "up" | "down";
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon className="h-5 w-5" />
        </span>
        {trend && (
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${trend === "up" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {trend === "up" ? "↑" : "↓"}
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink">{value}</p>
      <p className="text-sm font-medium text-slate-600">{label}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: { label: string; onClick: () => void };
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition hover:text-brand-700"
          >
            {action.label} <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

export function QuickAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: IconType;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-sm font-semibold text-ink">{label}</span>
    </button>
  );
}

export function PersonRow({
  initials,
  title,
  subtitle,
  right,
  badge,
  onClick,
}: {
  initials: string;
  title: string;
  subtitle: string;
  right?: React.ReactNode;
  badge?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 font-semibold text-brand-700">
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-ink">{title}</p>
        <p className="truncate text-sm text-slate-500">{subtitle}</p>
      </div>
      {right && <div className="hidden text-right sm:block">{right}</div>}
      {badge}
      {onClick && (
        <button onClick={onClick} className="rounded-lg p-2 text-slate-400 transition hover:bg-mist hover:text-ink">
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function ActivityFeed({ items }: { items: { icon: IconType; text: string; time: string }[] }) {
  return (
    <ul className="space-y-4">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-mist text-brand-600">
            <it.icon className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-sm text-ink">{it.text}</p>
            <p className="text-xs text-slate-400">{it.time}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-44 animate-pulse rounded-3xl bg-slate-200/70" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-200/70" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-96 animate-pulse rounded-3xl bg-slate-200/70 lg:col-span-2" />
        <div className="h-96 animate-pulse rounded-3xl bg-slate-200/70" />
      </div>
    </div>
  );
}
