"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUserStore } from "@/stores/useUserStore";
import { apiClient } from "@/lib/api";
import { User, Save, X } from "lucide-react";

export default function ProfileSettingsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const userStore = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.email || "",
        email: user.email || "",
        bio: "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put("/users/profile", formData);
      userStore.updateProfile({
        fullName: formData.fullName,
        bio: formData.bio,
      });
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (error) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-brand-500/10 to-brand-500/10 rounded-lg p-6 border border-slate-200 backdrop-blur">
        <div className="flex items-center gap-3">
          <User className="w-8 h-8 text-brand-600" />
          <div>
            <h1 className="text-3xl font-bold text-ink">Profile Settings</h1>
            <p className="text-slate-600 mt-1">Manage your account information</p>
          </div>
        </div>
      </div>

      <div className="bg-white backdrop-blur border border-slate-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-ink">Basic Information</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Full Name
            </label>
            <Input
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              disabled={!isEditing}
              className="bg-mist border-slate-200 text-ink placeholder-slate-400 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              disabled
              className="bg-mist/30 border-slate-200 text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              disabled={!isEditing}
              className="block w-full px-4 py-2 bg-mist border border-slate-200 text-ink placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50"
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-brand-600 hover:bg-brand-700 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-brand-500 hover:bg-brand-600 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  className="bg-slate-600 hover:bg-mist flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}