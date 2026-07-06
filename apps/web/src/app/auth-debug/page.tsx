"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/auth";

export default function AuthDebugPage() {
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        // Check session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        setSessionInfo({
          hasSession: !!sessionData.session,
          user: sessionData.session?.user,
          error: sessionError?.message,
        });

        // Check user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        setUserInfo({
          hasUser: !!userData.user,
          user: userData.user,
          error: userError?.message,
        });
      } catch (err) {
        console.error('Debug error:', err);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas text-ink p-8">
        <h1 className="text-2xl font-bold mb-4">Checking authentication...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-ink p-8">
      <h1 className="text-3xl font-bold mb-8">🔍 Authentication Debug Page</h1>

      <div className="space-y-6">
        {/* Session Info */}
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-brand-600">Session Info</h2>
          <div className="space-y-2">
            <p><strong>Has Session:</strong> {sessionInfo?.hasSession ? '✅ Yes' : '❌ No'}</p>
            {sessionInfo?.error && (
              <p className="text-red-600"><strong>Error:</strong> {sessionInfo.error}</p>
            )}
            {sessionInfo?.user && (
              <>
                <p><strong>Email:</strong> {sessionInfo.user.email}</p>
                <p><strong>User ID:</strong> {sessionInfo.user.id}</p>
                <p><strong>Role:</strong> {sessionInfo.user.user_metadata?.role || 'Not set'}</p>
                <p><strong>Email Confirmed:</strong> {sessionInfo.user.email_confirmed_at ? '✅ Yes' : '❌ No'}</p>
              </>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-brand-600">User Info</h2>
          <div className="space-y-2">
            <p><strong>Has User:</strong> {userInfo?.hasUser ? '✅ Yes' : '❌ No'}</p>
            {userInfo?.error && (
              <p className="text-red-600"><strong>Error:</strong> {userInfo.error}</p>
            )}
            {userInfo?.user && (
              <>
                <p><strong>Email:</strong> {userInfo.user.email}</p>
                <p><strong>User ID:</strong> {userInfo.user.id}</p>
              </>
            )}
          </div>
        </div>

        {/* LocalStorage Info */}
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-brand-600">LocalStorage Keys</h2>
          <div className="space-y-2">
            {typeof window !== 'undefined' && (
              <pre className="bg-canvas p-4 rounded overflow-auto">
                {JSON.stringify(
                  Object.keys(localStorage).filter(k => k.includes('sb-')),
                  null,
                  2
                )}
              </pre>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-brand-600">Quick Actions</h2>
          <div className="space-x-4">
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-brand-600 px-4 py-2 rounded hover:bg-brand-700"
            >
              Go to Login
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-brand-700 px-4 py-2 rounded hover:bg-brand-700"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            >
              Clear & Reload
            </button>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="bg-white p-6 rounded-lg border-2 border-brand-500">
          <h2 className="text-xl font-bold mb-4 text-brand-600">📊 Diagnosis</h2>
          <div className="space-y-2">
            {sessionInfo?.hasSession && userInfo?.hasUser ? (
              <p className="text-green-400 text-lg">✅ Everything looks good! You should be able to access the dashboard.</p>
            ) : (
              <p className="text-red-600 text-lg">❌ Not authenticated. Please login first.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
