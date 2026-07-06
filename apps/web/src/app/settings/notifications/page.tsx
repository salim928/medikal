"use client";

import { useAuth } from "@/hooks/useAuth";
import { PageSpinner } from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Calendar,
  FileText,
  Video,
  Pill,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface NotificationPreferences {
  email: {
    appointments: boolean;
    appointmentReminders: boolean;
    prescriptions: boolean;
    labResults: boolean;
    messages: boolean;
    newsletters: boolean;
  };
  sms: {
    appointments: boolean;
    appointmentReminders: boolean;
    prescriptions: boolean;
    labResults: boolean;
  };
  push: {
    appointments: boolean;
    messages: boolean;
    prescriptions: boolean;
    labResults: boolean;
    videoConsultations: boolean;
  };
}

const defaultPreferences: NotificationPreferences = {
  email: {
    appointments: true,
    appointmentReminders: true,
    prescriptions: true,
    labResults: true,
    messages: true,
    newsletters: false,
  },
  sms: {
    appointments: true,
    appointmentReminders: true,
    prescriptions: false,
    labResults: true,
  },
  push: {
    appointments: true,
    messages: true,
    prescriptions: true,
    labResults: true,
    videoConsultations: true,
  },
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

export default function NotificationPreferencesPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <PageSpinner />;

  const handleToggle = (channel: keyof NotificationPreferences, type: string) => {
    setPreferences(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [type]: !prev[channel][type as keyof typeof prev[typeof channel]]
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAlert({ type: 'success', message: 'Notification preferences saved successfully' });
    } catch {
      setAlert({ type: 'error', message: 'Failed to save preferences. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnableAll = () => {
    setPreferences({
      email: {
        appointments: true,
        appointmentReminders: true,
        prescriptions: true,
        labResults: true,
        messages: true,
        newsletters: true,
      },
      sms: {
        appointments: true,
        appointmentReminders: true,
        prescriptions: true,
        labResults: true,
      },
      push: {
        appointments: true,
        messages: true,
        prescriptions: true,
        labResults: true,
        videoConsultations: true,
      },
    });
  };

  const handleDisableAll = () => {
    setPreferences({
      email: {
        appointments: false,
        appointmentReminders: false,
        prescriptions: false,
        labResults: false,
        messages: false,
        newsletters: false,
      },
      sms: {
        appointments: false,
        appointmentReminders: false,
        prescriptions: false,
        labResults: false,
      },
      push: {
        appointments: false,
        messages: false,
        prescriptions: false,
        labResults: false,
        videoConsultations: false,
      },
    });
  };



  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-50 rounded-lg border border-slate-200">
              <Bell className="w-8 h-8 text-brand-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-ink">Notification Preferences</h1>
              <p className="text-slate-600 mt-1">Manage how you receive notifications</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleEnableAll} className="bg-brand-500 hover:bg-brand-600 text-sm">
              Enable All
            </Button>
            <Button onClick={handleDisableAll} className="bg-red-500 hover:bg-red-600 text-sm">
              Disable All
            </Button>
          </div>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`rounded-lg p-4 border flex items-center gap-3 ${
          alert.type === 'success' 
            ? 'bg-brand-500/10 border-green-500/50 text-emerald-600'
            : 'bg-red-500/10 border-red-500/50 text-red-600'
        }`}>
          {alert.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p>{alert.message}</p>
          <button onClick={() => setAlert(null)} className="ml-auto text-xl">×</button>
        </div>
      )}

      {/* Email Notifications */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-6 h-6 text-brand-600" />
          <div>
            <h2 className="text-xl font-semibold text-ink">Email Notifications</h2>
            <p className="text-sm text-slate-500">Receive notifications via email</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-brand-600" />
              <div>
                <p className="text-ink font-medium">Appointments</p>
                <p className="text-sm text-slate-500">New appointments and updates</p>
              </div>
            </div>
            <Switch 
              enabled={preferences.email.appointments} 
              onToggle={() => handleToggle('email', 'appointments')} 
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-ink font-medium">Appointment Reminders</p>
                <p className="text-sm text-slate-500">Reminders 24 hours before appointments</p>
              </div>
            </div>
            <Switch 
              enabled={preferences.email.appointmentReminders} 
              onToggle={() => handleToggle('email', 'appointmentReminders')} 
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <Pill className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-ink font-medium">Prescriptions</p>
                <p className="text-sm text-slate-500">New prescriptions and refills</p>
              </div>
            </div>
            <Switch 
              enabled={preferences.email.prescriptions} 
              onToggle={() => handleToggle('email', 'prescriptions')} 
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-brand-600" />
              <div>
                <p className="text-ink font-medium">Lab Results</p>
                <p className="text-sm text-slate-500">New lab results and medical records</p>
              </div>
            </div>
            <Switch 
              enabled={preferences.email.labResults} 
              onToggle={() => handleToggle('email', 'labResults')} 
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-brand-600" />
              <div>
                <p className="text-ink font-medium">Messages</p>
                <p className="text-sm text-slate-500">Messages from healthcare providers</p>
              </div>
            </div>
            <Switch 
              enabled={preferences.email.messages} 
              onToggle={() => handleToggle('email', 'messages')} 
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-ink font-medium">Newsletters</p>
                <p className="text-sm text-slate-500">Health tips and platform updates</p>
              </div>
            </div>
            <Switch 
              enabled={preferences.email.newsletters} 
              onToggle={() => handleToggle('email', 'newsletters')} 
            />
          </div>
        </div>
      </div>

      {/* SMS Notifications */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-6 h-6 text-emerald-600" />
          <div>
            <h2 className="text-xl font-semibold text-ink">SMS Notifications</h2>
            <p className="text-sm text-slate-500">Receive notifications via text message</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-brand-600" />
              <div>
                <p className="text-ink font-medium">Appointments</p>
                <p className="text-sm text-slate-500">New appointments and updates</p>
              </div>
            </div>
            <Switch 
              enabled={preferences.sms.appointments} 
              onToggle={() => handleToggle('sms', 'appointments')} 
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-ink font-medium">Appointment Reminders</p>
                <p className="text-sm text-slate-500">Reminders 24 hours before appointments</p>
              </div>
            </div>
            <Switch 
              enabled={preferences.sms.appointmentReminders} 
              onToggle={() => handleToggle('sms', 'appointmentReminders')} 
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <Pill className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-ink font-medium">Prescriptions</p>
                <p className="text-sm text-slate-500">New prescriptions and refills</p>
              </div>
            </div>
            <Switch 
              enabled={preferences.sms.prescriptions} 
              onToggle={() => handleToggle('sms', 'prescriptions')} 
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-brand-600" />
              <div>
                <p className="text-ink font-medium">Lab Results</p>
                <p className="text-sm text-slate-500">New lab results available</p>
              </div>
            </div>
            <Switch 
              enabled={preferences.sms.labResults} 
              onToggle={() => handleToggle('sms', 'labResults')} 
            />
          </div>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-brand-600" />
          <div>
            <h2 className="text-xl font-semibold text-ink">Push Notifications</h2>
            <p className="text-sm text-slate-500">Receive notifications on your device</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-brand-600" />
              <div>
                <p className="text-ink font-medium">Appointments</p>
                <p className="text-sm text-slate-500">New appointments and updates</p>
              </div>
            </div>
            <Switch 
              enabled={preferences.push.appointments} 
              onToggle={() => handleToggle('push', 'appointments')} 
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-brand-600" />
              <div>
                <p className="text-ink font-medium">Messages</p>
                <p className="text-sm text-slate-500">Messages from healthcare providers</p>
              </div>
            </div>
            <Switch 
              enabled={preferences.push.messages} 
              onToggle={() => handleToggle('push', 'messages')} 
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <Pill className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-ink font-medium">Prescriptions</p>
                <p className="text-sm text-slate-500">New prescriptions and refills</p>
              </div>
            </div>
            <Switch 
              enabled={preferences.push.prescriptions} 
              onToggle={() => handleToggle('push', 'prescriptions')} 
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-brand-600" />
              <div>
                <p className="text-ink font-medium">Lab Results</p>
                <p className="text-sm text-slate-500">New lab results available</p>
              </div>
            </div>
            <Switch 
              enabled={preferences.push.labResults} 
              onToggle={() => handleToggle('push', 'labResults')} 
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Video className="w-5 h-5 text-brand-600" />
              <div>
                <p className="text-ink font-medium">Video Consultations</p>
                <p className="text-sm text-slate-500">Consultation starting soon</p>
              </div>
            </div>
            <Switch 
              enabled={preferences.push.videoConsultations} 
              onToggle={() => handleToggle('push', 'videoConsultations')} 
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
        <Button 
          onClick={() => setPreferences(defaultPreferences)}
          className="bg-mist text-slate-700 hover:bg-slate-200"
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
