import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/auth";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

export function PatientRegistrationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: new Date(),
    gender: "male" as "male" | "female" | "other",
    password: "",
    confirmPassword: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    setLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: "patient",
            full_name: formData.fullName,
            phone: formData.phone,
            date_of_birth: formData.dateOfBirth.toISOString().split("T")[0],
            gender: formData.gender,
          },
        },
      });

      if (signUpError) throw signUpError;

      alert("Account created successfully! Please sign in.");
      router.replace("/(auth)/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="person" size={32} color="white" />
          </View>
          <Text style={styles.title}>Patient Registration</Text>
          <Text style={styles.subtitle}>Join our healthcare community</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor="#64748b"
              value={formData.fullName}
              onChangeText={(text: string) => setFormData({ ...formData, fullName: text })}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="john@example.com"
              placeholderTextColor="#64748b"
              value={formData.email}
              onChangeText={(text: string) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="+1234567890"
              placeholderTextColor="#64748b"
              value={formData.phone}
              onChangeText={(text: string) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth *</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
              disabled={loading}
            >
              <Text style={styles.dateText}>
                {formData.dateOfBirth.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.dateOfBirth}
                mode="date"
                display="default"
                onChange={(event: any, selectedDate?: Date) => {
                  setShowDatePicker(Platform.OS === "ios");
                  if (selectedDate) {
                    setFormData({ ...formData, dateOfBirth: selectedDate });
                  }
                }}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender *</Text>
            <View style={styles.genderContainer}>
              {["male", "female", "other"].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderButton,
                    formData.gender === gender && styles.genderButtonSelected,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, gender: gender as typeof formData.gender })
                  }
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      formData.gender === gender && styles.genderButtonTextSelected,
                    ]}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Min 8 characters"
              placeholderTextColor="#64748b"
              value={formData.password}
              onChangeText={(text: string) => setFormData({ ...formData, password: text })}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter password"
              placeholderTextColor="#64748b"
              value={formData.confirmPassword}
              onChangeText={(text: string) =>
                setFormData({ ...formData, confirmPassword: text })
              }
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Creating Account..." : "Complete Registration"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkBold}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: "#06b6d4",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  errorContainer: {
    backgroundColor: "#7f1d1d",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#fca5a5",
    fontSize: 14,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#cbd5e1",
  },
  input: {
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "white",
  },
  dateText: {
    color: "white",
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: "row",
    gap: 8,
  },
  genderButton: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  genderButtonSelected: {
    backgroundColor: "#06b6d4",
    borderColor: "#06b6d4",
  },
  genderButtonText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "500",
  },
  genderButtonTextSelected: {
    color: "white",
  },
  submitButton: {
    backgroundColor: "#06b6d4",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loginLink: {
    alignItems: "center",
    marginTop: 8,
  },
  loginLinkText: {
    color: "#94a3b8",
    fontSize: 14,
  },
  loginLinkBold: {
    color: "#06b6d4",
    fontWeight: "600",
  },
});
