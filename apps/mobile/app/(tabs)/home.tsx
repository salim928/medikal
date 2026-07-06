import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/Button";

export default function HomeScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/(auth)/login");
    }
  }, [user, loading]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {user?.email}</Text>
        <Text style={styles.subtitle}>Your health companion</Text>
      </View>

      <View style={styles.quickActions}>
        <Button
          title="View Appointments"
          onPress={() => router.push("/(tabs)/appointments")}
          style={styles.actionButton}
        />
        <Button
          title="Book Appointment"
          onPress={() => router.push("/book")}
          style={styles.actionButton}
        />
        <Button
          title="Medical Records"
          onPress={() => router.push("/(tabs)/records")}
          style={styles.actionButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#0066cc",
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 8,
  },
  quickActions: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    paddingVertical: 16,
  },
});