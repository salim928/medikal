"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  Shield, 
  Lock, 
  Eye,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  FileText,
  Users,
  Database,
  Share2
} from "lucide-react";

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'providers-only';
  shareDataWithResearch: boolean;
  shareDataWithProviders: boolean;
  allowThirdPartyIntegrations: boolean;
  medicalHistoryVisibility: 'all-providers' | 'selected-providers' | 'primary-only';
}

const defaultSettings: PrivacySettings = {
  profileVisibility: 'providers-only',
  shareDataWithResearch: false,
  shareDataWithProviders: true,
  allowThirdPartyIntegrations: false,
  medicalHistoryVisibility: 'all-providers',
};

export default function PrivacySettingsPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<PrivacySettings>(defaultSettings);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading privacy settings...</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAlert({ type: 'success', message: 'Privacy settings saved successfully' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to save settings. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadData = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAlert({ type: 'success', message: 'Your data export has been initiated. You will receive an email when it\'s ready.' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to initiate data export. Please try again.' });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE MY ACCOUNT') {
      setAlert({ type: 'error', message: 'Please type "DELETE MY ACCOUNT" to confirm' });
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAlert({ type: 'success', message: 'Your account deletion request has been submitted. You will receive a confirmation email.' });
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete account. Please contact support.' });
    }
  };

  const Switch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-brand-600' : 'bg-mist'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-500/10 to-brand-500/10 rounded-lg p-6 border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 rounded-lg border border-slate-200">
            <Shield className="w-8 h-8 text-brand-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-ink">Privacy Settings</h1>
            <p className="text-slate-600 mt-1">Control your data sharing and privacy preferences</p>
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
          <p className="flex-1">{alert.message}</p>
          <button onClick={() => setAlert(null)} className="text-xl">×</button>
        </div>
      )}

      {/* HIPAA Compliance Notice */}
      <div className="bg-brand-500/10 border border-blue-500/50 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Lock className="w-6 h-6 text-brand-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-brand-600 mb-2">HIPAA Compliance</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              medicom is fully HIPAA compliant. Your medical information is protected by federal law and encryption. 
              We will never share your personal health information without your explicit consent, except as required by law 
              or for treatment, payment, and healthcare operations.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Visibility */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-6 h-6 text-brand-600" />
          <div>
            <h2 className="text-xl font-semibold text-ink">Profile Visibility</h2>
            <p className="text-sm text-slate-500">Control who can see your profile information</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center p-3 bg-canvas border border-slate-200 rounded-lg cursor-pointer hover:border-brand-500/50 transition">
            <input
              type="radio"
              name="visibility"
              checked={settings.profileVisibility === 'public'}
              onChange={() => setSettings({ ...settings, profileVisibility: 'public' })}
              className="w-4 h-4 text-brand-600"
            />
            <div className="ml-3">
              <p className="text-ink font-medium">Public</p>
              <p className="text-sm text-slate-500">Anyone can see your basic profile information</p>
            </div>
          </label>

          <label className="flex items-center p-3 bg-canvas border border-brand-500/50 rounded-lg cursor-pointer">
            <input
              type="radio"
              name="visibility"
              checked={settings.profileVisibility === 'providers-only'}
              onChange={() => setSettings({ ...settings, profileVisibility: 'providers-only' })}
              className="w-4 h-4 text-brand-600"
            />
            <div className="ml-3">
              <div className="flex items-center gap-2">
                <p className="text-ink font-medium">Providers Only</p>
                <span className="px-2 py-0.5 bg-brand-500/20 border border-green-500/50 rounded text-green-400 text-xs">
                  Recommended
                </span>
              </div>
              <p className="text-sm text-slate-500">Only healthcare providers in your network can see your profile</p>
            </div>
          </label>

          <label className="flex items-center p-3 bg-canvas border border-slate-200 rounded-lg cursor-pointer hover:border-brand-500/50 transition">
            <input
              type="radio"
              name="visibility"
              checked={settings.profileVisibility === 'private'}
              onChange={() => setSettings({ ...settings, profileVisibility: 'private' })}
              className="w-4 h-4 text-brand-600"
            />
            <div className="ml-3">
              <p className="text-ink font-medium">Private</p>
              <p className="text-sm text-slate-500">Your profile is completely hidden from everyone</p>
            </div>
          </label>
        </div>
      </div>

      {/* Data Sharing */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Share2 className="w-6 h-6 text-brand-600" />
          <div>
            <h2 className="text-xl font-semibold text-ink">Data Sharing</h2>
            <p className="text-sm text-slate-500">Control how your health data is shared</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between py-3 border-b border-slate-200">
            <div className="flex items-start gap-3 flex-1">
              <Users className="w-5 h-5 text-brand-600 mt-1" />
              <div>
                <p className="text-ink font-medium">Share with Healthcare Providers</p>
                <p className="text-sm text-slate-500">
                  Allow your healthcare providers to access your medical history for better care coordination
                </p>
              </div>
            </div>
            <Switch 
              enabled={settings.shareDataWithProviders} 
              onToggle={() => setSettings({ ...settings, shareDataWithProviders: !settings.shareDataWithProviders })} 
            />
          </div>

          <div className="flex items-start justify-between py-3 border-b border-slate-200">
            <div className="flex items-start gap-3 flex-1">
              <Database className="w-5 h-5 text-brand-600 mt-1" />
              <div>
                <p className="text-ink font-medium">Contribute to Medical Research</p>
                <p className="text-sm text-slate-500">
                  Share anonymized data with approved medical research institutions to advance healthcare
                </p>
              </div>
            </div>
            <Switch 
              enabled={settings.shareDataWithResearch} 
              onToggle={() => setSettings({ ...settings, shareDataWithResearch: !settings.shareDataWithResearch })} 
            />
          </div>

          <div className="flex items-start justify-between py-3">
            <div className="flex items-start gap-3 flex-1">
              <Share2 className="w-5 h-5 text-green-400 mt-1" />
              <div>
                <p className="text-ink font-medium">Third-Party Integrations</p>
                <p className="text-sm text-slate-500">
                  Allow approved third-party apps and services to access your health data
                </p>
              </div>
            </div>
            <Switch 
              enabled={settings.allowThirdPartyIntegrations} 
              onToggle={() => setSettings({ ...settings, allowThirdPartyIntegrations: !settings.allowThirdPartyIntegrations })} 
            />
          </div>
        </div>
      </div>

      {/* Medical History Access */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-brand-600" />
          <div>
            <h2 className="text-xl font-semibold text-ink">Medical History Access</h2>
            <p className="text-sm text-slate-500">Control who can view your medical history</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center p-3 bg-canvas border border-brand-500/50 rounded-lg cursor-pointer">
            <input
              type="radio"
              name="historyVisibility"
              checked={settings.medicalHistoryVisibility === 'all-providers'}
              onChange={() => setSettings({ ...settings, medicalHistoryVisibility: 'all-providers' })}
              className="w-4 h-4 text-brand-600"
            />
            <div className="ml-3">
              <div className="flex items-center gap-2">
                <p className="text-ink font-medium">All Providers</p>
                <span className="px-2 py-0.5 bg-brand-500/20 border border-green-500/50 rounded text-green-400 text-xs">
                  Recommended
                </span>
              </div>
              <p className="text-sm text-slate-500">Any healthcare provider you consult can access your full medical history</p>
            </div>
          </label>

          <label className="flex items-center p-3 bg-canvas border border-slate-200 rounded-lg cursor-pointer hover:border-brand-500/50 transition">
            <input
              type="radio"
              name="historyVisibility"
              checked={settings.medicalHistoryVisibility === 'selected-providers'}
              onChange={() => setSettings({ ...settings, medicalHistoryVisibility: 'selected-providers' })}
              className="w-4 h-4 text-brand-600"
            />
            <div className="ml-3">
              <p className="text-ink font-medium">Selected Providers Only</p>
              <p className="text-sm text-slate-500">Only providers you explicitly authorize can view your medical history</p>
            </div>
          </label>

          <label className="flex items-center p-3 bg-canvas border border-slate-200 rounded-lg cursor-pointer hover:border-brand-500/50 transition">
            <input
              type="radio"
              name="historyVisibility"
              checked={settings.medicalHistoryVisibility === 'primary-only'}
              onChange={() => setSettings({ ...settings, medicalHistoryVisibility: 'primary-only' })}
              className="w-4 h-4 text-brand-600"
            />
            <div className="ml-3">
              <p className="text-ink font-medium">Primary Care Provider Only</p>
              <p className="text-sm text-slate-500">Only your designated primary care provider can access your full history</p>
            </div>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Privacy Settings'}
        </Button>
        <Button 
          onClick={() => setSettings(defaultSettings)}
          className="bg-mist hover:bg-slate-200"
        >
          Reset to Defaults
        </Button>
      </div>

      {/* Data Management */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-6 h-6 text-brand-600" />
          <h2 className="text-xl font-semibold text-ink">Data Management</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-canvas border border-slate-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <Download className="w-5 h-5 text-brand-600 mt-1" />
                <div>
                  <p className="text-ink font-medium">Download Your Data</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Export all your personal and medical data in a portable format
                  </p>
                </div>
              </div>
              <Button onClick={handleDownloadData} className="bg-brand-600 hover:bg-brand-700">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-1" />
              <div>
                <p className="text-ink font-medium">Delete Your Account</p>
                <p className="text-sm text-slate-500 mt-1">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
            </div>

            {!showDeleteConfirm ? (
              <Button 
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-500 hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-canvas border border-yellow-500/50 rounded-lg">
                  <p className="text-yellow-400 text-sm font-medium mb-2">
                    ⚠️ This will permanently delete:
                  </p>
                  <ul className="text-slate-600 text-sm space-y-1 ml-4">
                    <li>• Your profile and account information</li>
                    <li>• All your medical records and history</li>
                    <li>• Appointment history and prescriptions</li>
                    <li>• Messages and communication history</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Type "DELETE MY ACCOUNT" to confirm:
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full px-4 py-2 bg-canvas border border-slate-200 rounded-lg text-ink focus:outline-none focus:border-red-500"
                    placeholder="DELETE MY ACCOUNT"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== 'DELETE MY ACCOUNT'}
                    className="bg-red-500 hover:bg-red-600 disabled:opacity-50"
                  >
                    Confirm Deletion
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText('');
                    }}
                    className="bg-mist hover:bg-slate-200"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Privacy Policy Link */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-slate-500" />
            <p className="text-slate-600">Read our full Privacy Policy and Terms of Service</p>
          </div>
          <Button className="bg-mist hover:bg-slate-200">
            View Policies
          </Button>
        </div>
      </div>
    </div>
  );
}
