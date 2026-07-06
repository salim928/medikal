"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/auth";

export default function AuthStatusPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    setLoading(true);
    
    try {
      // Check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      // Check user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      // Check localStorage
      const localStorageKeys = Object.keys(localStorage).filter(key => 
        key.includes('supabase') || key.includes('sb-')
      );
      const localStorageData: any = {};
      localStorageKeys.forEach(key => {
        try {
          localStorageData[key] = JSON.parse(localStorage.getItem(key) || '{}');
        } catch {
          localStorageData[key] = localStorage.getItem(key);
        }
      });
      
      setStatus({
        session: session ? {
          access_token: session.access_token?.substring(0, 20) + '...',
          user: {
            id: session.user.id,
            email: session.user.email,
            email_confirmed_at: session.user.email_confirmed_at,
            role: session.user.role,
            created_at: session.user.created_at,
            user_metadata: session.user.user_metadata
          },
          expires_at: new Date(session.expires_at! * 1000).toLocaleString()
        } : null,
        sessionError,
        user: user ? {
          id: user.id,
          email: user.email,
          email_confirmed_at: user.email_confirmed_at,
          role: user.role
        } : null,
        userError,
        localStorage: localStorageData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setStatus({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-ink mb-6">Authentication Status</h1>
          <div className="text-brand-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-ink mb-6">Authentication Status</h1>
        
        <div className="space-y-6">
          {/* Session Status */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-brand-600 mb-4">Session Status</h2>
            {status.session ? (
              <div className="space-y-2 text-sm">
                <div className="text-green-400 font-semibold">✅ SESSION ACTIVE</div>
                <div className="text-slate-600">
                  <strong>User ID:</strong> {status.session.user.id}
                </div>
                <div className="text-slate-600">
                  <strong>Email:</strong> {status.session.user.email}
                </div>
                <div className="text-slate-600">
                  <strong>Email Confirmed:</strong> {status.session.user.email_confirmed_at || 'Not confirmed'}
                </div>
                <div className="text-slate-600">
                  <strong>Role:</strong> {status.session.user.role}
                </div>
                <div className="text-slate-600">
                  <strong>Expires:</strong> {status.session.expires_at}
                </div>
                <div className="text-slate-600">
                  <strong>Access Token:</strong> {status.session.access_token}
                </div>
              </div>
            ) : (
              <div className="text-red-600 font-semibold">❌ NO SESSION</div>
            )}
            {status.sessionError && (
              <div className="mt-2 text-red-600 text-sm">
                Error: {JSON.stringify(status.sessionError)}
              </div>
            )}
          </div>

          {/* User Status */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-brand-600 mb-4">User Status</h2>
            {status.user ? (
              <div className="space-y-2 text-sm">
                <div className="text-green-400 font-semibold">✅ USER FOUND</div>
                <div className="text-slate-600">
                  <strong>User ID:</strong> {status.user.id}
                </div>
                <div className="text-slate-600">
                  <strong>Email:</strong> {status.user.email}
                </div>
                <div className="text-slate-600">
                  <strong>Email Confirmed:</strong> {status.user.email_confirmed_at || 'Not confirmed'}
                </div>
              </div>
            ) : (
              <div className="text-red-600 font-semibold">❌ NO USER</div>
            )}
            {status.userError && (
              <div className="mt-2 text-red-600 text-sm">
                Error: {JSON.stringify(status.userError)}
              </div>
            )}
          </div>

          {/* LocalStorage */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-brand-600 mb-4">LocalStorage Data</h2>
            <pre className="text-slate-600 text-xs overflow-auto">
              {JSON.stringify(status.localStorage, null, 2)}
            </pre>
          </div>

          {/* Actions */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-brand-600 mb-4">Actions</h2>
            <div className="flex gap-4">
              <button
                onClick={checkAuthStatus}
                className="px-4 py-2 bg-brand-700 hover:bg-brand-700 text-white rounded-lg"
              >
                Refresh Status
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
              >
                Go to Login
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
              >
                Go to Dashboard
              </button>
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-slate-500 text-sm text-center">
            Last checked: {status.timestamp}
          </div>
        </div>
      </div>
    </div>
  );
}
