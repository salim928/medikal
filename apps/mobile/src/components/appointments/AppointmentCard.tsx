import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

interface Appointment {
  id: string;
  providerName: string;
  scheduledAt: string;
  status: string;
  reason: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "in_progress":
        return "#3b82f6";
      case "pending":
        return "#f59e0b";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/appointments/${appointment.id}`)}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.providerName}>{appointment.providerName}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(appointment.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {appointment.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.dateTime}>
          📅 {new Date(appointment.scheduledAt).toLocaleString()}
        </Text>
        <Text style={styles.reason} numberOfLines={2}>
          {appointment.reason}
        </Text>
      </View>

      <View style={styles.arrow}>
        <Text style={styles.arrowText}>→</Text>
      </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  providerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  dateTime: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  reason: {
    fontSize: 12,
    color: "#999",
  },
  arrow: {
    marginLeft: 12,
  },
  arrowText: {
    fontSize: 20,
    color: "#0066cc",
  },
});