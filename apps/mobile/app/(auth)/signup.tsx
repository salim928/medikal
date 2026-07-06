import { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { RoleSelector, type UserRole } from "@/components/auth/RoleSelector";
import { PatientRegistrationForm } from "@/components/auth/PatientRegistrationForm";
import { Ionicons } from "@expo/vector-icons";

export default function SignupScreen() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const router = useRouter();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleBack = () => {
    setSelectedRole(null);
  };

  // Show role selector if no role is selected
  if (!selectedRole) {
    return <RoleSelector onRoleSelect={handleRoleSelect} />;
  }

  // Show appropriate registration form based on selected role
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#06b6d4" />
        <Text style={styles.backButtonText}>Back to role selection</Text>
      </TouchableOpacity>

      {selectedRole === "patient" && <PatientRegistrationForm />}
      
      {/* Placeholder for other roles - implement similar to PatientRegistrationForm */}
      {selectedRole === "doctor" && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Doctor registration coming soon...</Text>
          <Text style={styles.placeholderSubtext}>
            This will include license verification
          </Text>
        </View>
      )}
      
      {selectedRole === "nurse" && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Nurse registration coming soon...</Text>
          <Text style={styles.placeholderSubtext}>
            This will include license verification
          </Text>
        </View>
      )}
      
      {selectedRole === "midwife" && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Midwife registration coming soon...</Text>
          <Text style={styles.placeholderSubtext}>
            This will include certification details
          </Text>
        </View>
      )}
      
      {selectedRole === "lawyer" && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Healthcare Lawyer registration coming soon...
          </Text>
          <Text style={styles.placeholderSubtext}>
            This will include bar license verification
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 8,
  },
  backButtonText: {
    color: "#06b6d4",
    fontSize: 16,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  placeholderText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  placeholderSubtext: {
    color: "#94a3b8",
    fontSize: 14,
    textAlign: "center",
  },
});