import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type UserRole = "patient" | "doctor" | "nurse" | "midwife" | "lawyer";

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
}

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: { primary: string; secondary: string };
}

const roleOptions: RoleOption[] = [
  {
    id: "patient",
    title: "Patient",
    description: "I'm seeking healthcare services",
    icon: "person",
    colors: { primary: "#06b6d4", secondary: "#3b82f6" },
  },
  {
    id: "doctor",
    title: "Doctor",
    description: "I'm a licensed medical doctor",
    icon: "medkit",
    colors: { primary: "#10b981", secondary: "#059669" },
  },
  {
    id: "nurse",
    title: "Nurse",
    description: "I'm a registered nurse",
    icon: "heart",
    colors: { primary: "#ec4899", secondary: "#f43f5e" },
  },
  {
    id: "midwife",
    title: "Midwife",
    description: "I'm a certified midwife",
    icon: "body",
    colors: { primary: "#a855f7", secondary: "#ec4899" },
  },
  {
    id: "lawyer",
    title: "Healthcare Lawyer",
    description: "I provide legal services",
    icon: "scale",
    colors: { primary: "#f59e0b", secondary: "#f97316" },
  },
];

export function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>
            Select how you'll be using MediConnect
          </Text>
        </View>

        <View style={styles.rolesContainer}>
          {roleOptions.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.roleCard,
                selectedRole === role.id && styles.roleCardSelected,
              ]}
              onPress={() => handleSelect(role.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: role.colors.primary },
                ]}
              >
                <Ionicons name={role.icon} size={32} color="white" />
              </View>

              <View style={styles.roleInfo}>
                <Text style={styles.roleTitle}>{role.title}</Text>
                <Text style={styles.roleDescription}>{role.description}</Text>
              </View>

              {selectedRole === role.id && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {selectedRole && (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>
              Continue as {roleOptions.find((r) => r.id === selectedRole)?.title}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        )}
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
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
  },
  rolesContainer: {
    gap: 16,
    marginBottom: 24,
  },
  roleCard: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#334155",
  },
  roleCardSelected: {
    borderColor: "#10b981",
    backgroundColor: "#1e3a32",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: "#94a3b8",
  },
  checkmark: {
    marginLeft: 8,
  },
  continueButton: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
