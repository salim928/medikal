"use client";

import { useAuth } from "@/hooks/useAuth";
import { securitySessions, type SecuritySession } from "@/lib/data";
import { useToast } from "@/components/ui/toast";
import { PageSpinner } from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  Shield, 
  Lock, 
  Smartphone, 
  Monitor, 
  Key,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react";

export default function SecuritySettingsPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  
  // Sessions state
  const [sessions, setSessions] = useState<SecuritySession[]>(securitySessions);
  
  // Alert state
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <PageSpinner />;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setAlert({ type: 'error', message: 'New passwords do not match' });
      return;
    }
    
    if (newPassword.length < 8) {
      setAlert({ type: 'error', message: 'Password must be at least 8 characters' });
      return;
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAlert({ type: 'success', message: 'Password changed successfully' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleToggleTwoFactor = async () => {
    if (!twoFactorEnabled) {
      setShowTwoFactorSetup(true);
    } else {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setTwoFactorEnabled(false);
      setAlert({ type: 'success', message: 'Two-factor authentication disabled' });
    }
  };

  const handleSetupTwoFactor = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setTwoFactorEnabled(true);
    setShowTwoFactorSetup(false);
    setAlert({ type: 'success', message: 'Two-factor authentication enabled successfully' });
  };

  const handleRevokeSession = async (sessionId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    setAlert({ type: 'success', message: 'Session revoked successfully' });
  };

  const handleRevokeAllSessions = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setSessions(prev => prev.filter(s => s.current));
    setAlert({ type: 'success', message: 'All other sessions revoked successfully' });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-500/10 to-brand-500/10 rounded-lg p-6 border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 rounded-lg border border-slate-200">
            <Shield className="w-8 h-8 text-brand-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-ink">Security Settings</h1>
            <p className="text-slate-600 mt-1">Manage your account security and privacy</p>
          </div>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`rounded-lg p-4 border flex items-center gap-3 ${
          alert.type === 'success' 
            ? 'bg-brand-500/10 border-green-500/50 text-green-400'
            : 'bg-red-500/10 border-red-500/50 text-red-600'
        }`}>
          {alert.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
          <p>{alert.message}</p>
          <button onClick={() => setAlert(null)} className="ml-auto text-xl">×</button>
        </div>
      )}

      {/* Change Password */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-6 h-6 text-brand-600" />
          <h2 className="text-xl font-semibold text-ink">Change Password</h2>
        </div>
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-canvas border border-slate-200 rounded-lg text-ink focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-600"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-2 bg-canvas border border-slate-200 rounded-lg text-ink focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-600"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-canvas border border-slate-200 rounded-lg text-ink focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
            Update Password
          </Button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-6 h-6 text-brand-600" />
            <div>
              <h2 className="text-xl font-semibold text-ink">Two-Factor Authentication</h2>
              <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            twoFactorEnabled 
              ? 'bg-brand-500/20 text-green-400 border border-green-500/50'
              : 'bg-mist text-slate-500'
          }`}>
            {twoFactorEnabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>

        {!showTwoFactorSetup ? (
          <Button 
            onClick={handleToggleTwoFactor}
            className={twoFactorEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-brand-600 hover:bg-brand-700'}
          >
            {twoFactorEnabled ? 'Disable' : 'Enable'} Two-Factor Authentication
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="bg-canvas border border-slate-200 rounded-lg p-4">
              <p className="text-slate-600 mb-3">Scan this QR code with your authenticator app:</p>
              <div className="w-48 h-48 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center">
                <p className="text-slate-900 text-xs">[QR Code Placeholder]</p>
              </div>
              <p className="text-sm text-slate-500 text-center">
                Or enter this code manually: <span className="text-brand-600 font-mono">XXXX XXXX XXXX XXXX</span>
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSetupTwoFactor} className="bg-brand-500 hover:bg-brand-600">
                I've Scanned the Code
              </Button>
              <Button onClick={() => setShowTwoFactorSetup(false)} className="bg-mist hover:bg-slate-200">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Monitor className="w-6 h-6 text-brand-600" />
            <div>
              <h2 className="text-xl font-semibold text-ink">Active Sessions</h2>
              <p className="text-sm text-slate-500">Manage devices that are currently signed in</p>
            </div>
          </div>
          {sessions.length > 1 && (
            <Button onClick={handleRevokeAllSessions} className="bg-red-500 hover:bg-red-600 text-sm">
              Revoke All Other Sessions
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="bg-canvas border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Monitor className="w-5 h-5 text-slate-500 mt-1" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-ink">{session.device}</h3>
                      {session.current && (
                        <span className="px-2 py-0.5 bg-brand-500/20 border border-green-500/50 rounded text-green-400 text-xs">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      {session.location} • {session.ipAddress}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Last active: {formatTimestamp(session.lastActive)}
                    </p>
                  </div>
                </div>
                
                {!session.current && (
                  <Button 
                    onClick={() => handleRevokeSession(session.id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-600 border border-red-500/50 text-sm"
                  >
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Key className="w-6 h-6 text-yellow-400 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Security Recommendations</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Use a strong, unique password for your medicom account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Enable two-factor authentication for maximum security</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Review your active sessions regularly and revoke any unrecognized devices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>Never share your password or authentication codes with anyone</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
