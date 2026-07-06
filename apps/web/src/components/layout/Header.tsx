"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { signOut as authSignOut } from "@/lib/auth-fresh";
import { clearDemoSession } from "@/lib/demo";
import { clearAuthCache } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Menu, X, Activity, Bell, Settings, User, Shield, LogOut, ChevronDown } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Sign out function
  const handleSignOut = async () => {
    clearDemoSession();
    clearAuthCache();
    try {
      await authSignOut();
    } catch {
      // ignore backend errors during demo sign-out
    }
    window.location.assign("/login");
  };

  // Determine if user is a provider
  const isProvider = useMemo(() => {
    return role === "doctor" || role === "nurse" || role === "midwife" || role === "lawyer";
  }, [role]);

  // Mock unread notifications count
  const unreadCount = 3;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setSettingsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-brand-600 hover:text-brand-700 transition">
          <Activity className="w-6 h-6" />
          medicom
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {loading ? (
            // Show nothing while loading to prevent flash
            <div className="w-32 h-8"></div>
          ) : user ? (
            <>
              <Link href="/dashboard" className="text-sm text-slate-600 hover:text-brand-600 transition">
                Dashboard
              </Link>
              
              {/* Role-Specific Navigation */}
              {isProvider ? (
                <>
                  {/* Provider Navigation */}
                  <Link href="/appointments" className="text-sm text-slate-600 hover:text-brand-600 transition">
                    Appointments
                  </Link>
                  <Link href="/triage-queue" className="text-sm text-slate-600 hover:text-brand-600 transition">
                    Triage Queue
                  </Link>
                  <Link href="/patients" className="text-sm text-slate-600 hover:text-brand-600 transition">
                    Patients
                  </Link>
                  <Link href="/prescriptions" className="text-sm text-slate-600 hover:text-brand-600 transition">
                    Prescriptions
                  </Link>
                  <Link href="/records" className="text-sm text-slate-600 hover:text-brand-600 transition">
                    Records
                  </Link>
                  <Link href="/verify-drug" className="text-sm text-slate-600 hover:text-brand-600 transition">
                    Verify Drug
                  </Link>
                </>
              ) : (
                <>
                  {/* Patient Navigation */}
                  <Link href="/symptom-checker" className="text-sm text-slate-600 hover:text-brand-600 transition">
                    Symptom Checker
                  </Link>
                  <Link href="/providers" className="text-sm text-slate-600 hover:text-brand-600 transition">
                    Find Doctors
                  </Link>
                  <Link href="/appointments" className="text-sm text-slate-600 hover:text-brand-600 transition">
                    Appointments
                  </Link>
                  <Link href="/prescriptions" className="text-sm text-slate-600 hover:text-brand-600 transition">
                    Prescriptions
                  </Link>
                  <Link href="/pharmacies" className="text-sm text-slate-600 hover:text-brand-600 transition">
                    Pharmacies
                  </Link>
                  <Link href="/records" className="text-sm text-slate-600 hover:text-brand-600 transition">
                    Records
                  </Link>
                </>
              )}
              
              {/* Notifications Bell */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setSettingsDropdownOpen(false);
                  }}
                  className="relative p-2 text-slate-600 hover:text-brand-600 transition rounded-lg hover:bg-white"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl z-50">
                    <div className="p-4 border-b border-slate-200">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-ink">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <Link
                        href="/notifications"
                        onClick={() => setNotificationsOpen(false)}
                        className="block p-4 hover:bg-mist transition border-b border-slate-200"
                      >
                        <p className="text-sm text-ink font-medium">New appointment request</p>
                        <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                      </Link>
                      <Link
                        href="/notifications"
                        onClick={() => setNotificationsOpen(false)}
                        className="block p-4 hover:bg-mist transition border-b border-slate-200"
                      >
                        <p className="text-sm text-ink font-medium">Prescription ready for pickup</p>
                        <p className="text-xs text-slate-500 mt-1">5 hours ago</p>
                      </Link>
                      <Link
                        href="/notifications"
                        onClick={() => setNotificationsOpen(false)}
                        className="block p-4 hover:bg-mist transition"
                      >
                        <p className="text-sm text-ink font-medium">Lab results available</p>
                        <p className="text-xs text-slate-500 mt-1">1 day ago</p>
                      </Link>
                    </div>
                    <div className="p-3 border-t border-slate-200">
                      <Link
                        href="/notifications"
                        onClick={() => setNotificationsOpen(false)}
                        className="block text-center text-sm text-brand-600 hover:text-brand-700"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Settings Dropdown */}
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={() => {
                    setSettingsDropdownOpen(!settingsDropdownOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 text-slate-600 hover:text-brand-600 transition rounded-lg hover:bg-white"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {settingsDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-50">
                    <div className="p-3 border-b border-slate-200">
                      <p className="text-sm font-medium text-ink">{user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}</p>
                      <p className="text-xs text-slate-500">{user?.email || ""}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/settings/profile"
                        onClick={() => setSettingsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-mist hover:text-ink transition"
                      >
                        <User className="w-4 h-4" />
                        Profile Settings
                      </Link>
                      <Link
                        href="/settings/security"
                        onClick={() => setSettingsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-mist hover:text-ink transition"
                      >
                        <Shield className="w-4 h-4" />
                        Security
                      </Link>
                      <Link
                        href="/settings/notifications"
                        onClick={() => setSettingsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-mist hover:text-ink transition"
                      >
                        <Bell className="w-4 h-4" />
                        Notification Preferences
                      </Link>
                      <Link
                        href="/settings/privacy"
                        onClick={() => setSettingsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-mist hover:text-ink transition"
                      >
                        <Settings className="w-4 h-4" />
                        Privacy
                      </Link>
                    </div>
                    <div className="border-t border-slate-200 py-2">
                      <button
                        onClick={() => {
                          setSettingsDropdownOpen(false);
                          handleSignOut();
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-mist hover:text-red-700 transition w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-slate-600 hover:text-brand-600 transition">
                Sign In
              </Link>
              <Button asChild size="sm" className="bg-brand-600 hover:bg-brand-700">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-slate-600 hover:text-brand-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-canvas">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {loading ? (
              <div className="h-20"></div>
            ) : user ? (
              <>
                {/* User Info */}
                <div className="pb-3 border-b border-slate-200 mb-2">
                  <p className="text-sm font-medium text-ink">{user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}</p>
                  <p className="text-xs text-slate-500">{user?.email || ""}</p>
                </div>

                <Link href="/dashboard" className="text-sm text-slate-600 hover:text-brand-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                
                {/* Notifications Link for Mobile */}
                <Link href="/notifications" className="text-sm text-slate-600 hover:text-brand-600 transition py-2 flex items-center justify-between" onClick={() => setMobileMenuOpen(false)}>
                  <span className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                
                {/* Role-Specific Mobile Navigation */}
                {isProvider ? (
                  <>
                    {/* Provider Mobile Menu */}
                    <Link href="/appointments" className="text-sm text-slate-600 hover:text-brand-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>
                      Appointments
                    </Link>
                    <Link href="/triage-queue" className="text-sm text-slate-600 hover:text-brand-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>
                      Triage Queue
                    </Link>
                    <Link href="/patients" className="text-sm text-slate-600 hover:text-brand-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>
                      Patients
                    </Link>
                    <Link href="/prescriptions" className="text-sm text-slate-600 hover:text-brand-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>
                      Prescriptions
                    </Link>
                    <Link href="/records" className="text-sm text-slate-600 hover:text-brand-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>
                      Records
                    </Link>
                    <Link href="/verify-drug" className="text-sm text-slate-600 hover:text-brand-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>
                      Verify Drug
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Patient Mobile Menu */}
                    <Link href="/symptom-checker" className="text-sm text-slate-600 hover:text-brand-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>
                      Symptom Checker
                    </Link>
                    <Link href="/providers" className="text-sm text-slate-600 hover:text-brand-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>
                      Find Doctors
                    </Link>
                    <Link href="/appointments" className="text-sm text-slate-600 hover:text-brand-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>
                      Appointments
                    </Link>
                    <Link href="/prescriptions" className="text-sm text-slate-600 hover:text-brand-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>
                      Prescriptions
                    </Link>
                    <Link href="/pharmacies" className="text-sm text-slate-600 hover:text-brand-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>
                      Pharmacies
                    </Link>
                    <Link href="/records" className="text-sm text-slate-600 hover:text-brand-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>
                      Records
                    </Link>
                  </>
                )}
                
                {/* Settings Links for Mobile */}
                <div className="border-t border-slate-200 pt-3 mt-2">
                  <Link href="/settings/profile" className="text-sm text-slate-600 hover:text-brand-600 transition py-2 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <User className="w-4 h-4" />
                    Profile Settings
                  </Link>
                  <Link href="/settings/security" className="text-sm text-slate-600 hover:text-brand-600 transition py-2 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <Shield className="w-4 h-4" />
                    Security
                  </Link>
                  <Link href="/settings/privacy" className="text-sm text-slate-600 hover:text-brand-600 transition py-2 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <Settings className="w-4 h-4" />
                    Privacy
                  </Link>
                </div>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSignOut()}
                  className="bg-mist hover:bg-slate-200 text-ink border-slate-200 mt-2"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-slate-600 hover:text-brand-600 transition py-2" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Button asChild size="sm" className="bg-brand-600 hover:bg-brand-700 mt-2">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}