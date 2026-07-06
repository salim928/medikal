import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface MedicalRecord {
  id: string;
  title: string;
  recordType: string;
  createdAt: string;
}

interface MedicalRecordCardProps {
  record: MedicalRecord;
}

export function MedicalRecordCard({ record }: MedicalRecordCardProps) {
  const router = useRouter();

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "consultation_note":
        return "📝";
      case "prescription":
        return "💊";
      case "lab_result":
        return "🧪";
      case "imaging":
        return "🖼️";
      case "discharge_summary":
        return "📋";
      default:
        return "📄";
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/records/${record.id}`)}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getRecordIcon(record.recordType)}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{record.title}</Text>
        <Text style={styles.type}>{record.recordType}</Text>
        <Text style={styles.date}>
          {new Date(record.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  type: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  date: {
    fontSize: 11,
    color: "#999",
  },
  arrow: {
    fontSize: 18,
    color: "#0066cc",
  },
});