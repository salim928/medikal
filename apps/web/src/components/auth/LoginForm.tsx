"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, getUserRoleFromDB } from "@/lib/auth-fresh";
import { setDemoSession, DEMO_ROLES, type DemoRole } from "@/lib/demo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn(email, password);

      if (result.error) {
        setError(result.error.message || "Login failed. Please try again.");
        setIsLoading(false);
        return;
      }

      if (!result.session || !result.user) {
        setError("We couldn't start a session. Please try again.");
        setIsLoading(false);
        return;
      }

      const role = await getUserRoleFromDB(result.user.id);
      window.location.replace(`/dashboard/${role}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Welcome back
        </h1>
        <p className="mt-2 text-ink-soft">Sign in to continue to medicom.</p>
      </div>

      <div className="space-y-5">
        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isLoading}
          autoFocus
        />

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Forgot?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isLoading}
          />
        </div>

        <Button
          onClick={handleLogin}
          disabled={isLoading}
          size="lg"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
            </>
          ) : (
            <>
              Sign in <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-brand-600 hover:text-brand-700">
            Create one
          </Link>
        </p>

        {/* Demo access — explore a role dashboard without a backend. */}
        <div className="pt-4">
          <div className="relative mb-4 text-center">
            <span className="relative z-10 bg-white px-3 text-xs font-medium uppercase tracking-wider text-slate-400">
              or explore a demo
            </span>
            <span className="absolute inset-x-0 top-1/2 -z-0 h-px bg-slate-200" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ROLES.map((r: DemoRole) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setDemoSession(r);
                  window.location.assign(`/dashboard/${r}`);
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium capitalize text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
