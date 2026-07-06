"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { signOut as authSignOut } from "@/lib/auth-fresh";
import { clearDemoSession } from "@/lib/demo";
import { clearAuthCache } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/BrandMark";
import {
  LayoutDashboard, Activity, Stethoscope, Calendar, ClipboardList, Users,
  Pill, MapPin, FileText, ShieldCheck, Bell, Settings, LogOut,
  X, PanelLeftClose, PanelLeftOpen,
} from "lucide-react";

type NavItem = { label: string; href: string; icon: React.ComponentType<{ className?: string }> };

const patientNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Symptom Checker", href: "/symptom-checker", icon: Activity },
  { label: "Find Doctors", href: "/providers", icon: Stethoscope },
  { label: "Appointments", href: "/appointments", icon: Calendar },
  { label: "Prescriptions", href: "/prescriptions", icon: Pill },
  { label: "Pharmacies", href: "/pharmacies", icon: MapPin },
  { label: "Records", href: "/records", icon: FileText },
  { label: "Verify Drug", href: "/verify-drug", icon: ShieldCheck },
];

const providerNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Appointments", href: "/appointments", icon: Calendar },
  { label: "Triage Queue", href: "/triage-queue", icon: ClipboardList },
  { label: "Patients", href: "/patients", icon: Users },
  { label: "Prescriptions", href: "/prescriptions", icon: Pill },
  { label: "Records", href: "/records", icon: FileText },
  { label: "Verify Drug", href: "/verify-drug", icon: ShieldCheck },
];

const bottomNav: NavItem[] = [
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings/profile", icon: Settings },
];

function NavLink({
  item, active, collapsed, onClick,
}: {
  item: NavItem; active: boolean; collapsed: boolean; onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
        collapsed && "justify-center px-0",
        active ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon className={cn("h-[18px] w-[18px] flex-shrink-0", active ? "text-brand-300" : "text-slate-400 group-hover:text-slate-200")} />
      {!collapsed && item.label}
    </Link>
  );
}

export function Sidebar({
  collapsed, onToggleCollapse, mobileOpen, onClose,
}: {
  collapsed: boolean; onToggleCollapse: () => void; mobileOpen: boolean; onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role } = useAuth();

  const isProvider = role === "doctor" || role === "nurse" || role === "midwife" || role === "lawyer";
  const nav = useMemo(() => (isProvider ? providerNav : patientNav), [isProvider]);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname.startsWith("/dashboard") : pathname === href || pathname.startsWith(`${href}/`);

  const displayName =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.name as string) ||
    user?.email?.split("@")[0] || "User";
  const initials = displayName.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

  const handleSignOut = async () => {
    clearDemoSession();
    clearAuthCache();
    try { await authSignOut(); } catch {}
    router.push("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn("fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden", mobileOpen ? "block" : "hidden")}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-white/10 bg-navy transition-all duration-200",
          "lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "lg:w-[68px]" : "lg:w-60"
        )}
      >
        {/* Brand + collapse toggle */}
        <div className={cn("flex h-16 items-center px-5", collapsed ? "lg:justify-center lg:px-0" : "justify-between")}>
          <Link href="/" className="flex items-center gap-2" title="medicom">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
              <BrandMark className="h-[18px] w-[18px]" />
            </span>
            {!collapsed && <span className="font-display text-base font-semibold tracking-tight text-white">medicom</span>}
          </Link>
          {/* mobile close */}
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
          {/* desktop collapse */}
          {!collapsed && (
            <button onClick={onToggleCollapse} className="hidden rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:block" title="Collapse sidebar">
              <PanelLeftClose className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button onClick={onToggleCollapse} className="mx-auto mb-1 hidden rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:block" title="Expand sidebar">
            <PanelLeftOpen className="h-5 w-5" />
          </button>
        )}

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {!collapsed && <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Menu</p>}
          {nav.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item.href)} collapsed={collapsed} onClick={onClose} />
          ))}
          <div className="my-3 border-t border-white/10" />
          {bottomNav.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item.href)} collapsed={collapsed} onClick={onClose} />
          ))}
        </nav>

        {/* User card */}
        <div className="border-t border-white/10 p-3">
          <div className={cn("flex items-center gap-3 rounded-xl px-2 py-2", collapsed && "lg:flex-col lg:gap-2 lg:px-0")}>
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
              {initials}
            </span>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                <p className="truncate text-xs capitalize text-slate-400">{role}</p>
              </div>
            )}
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
