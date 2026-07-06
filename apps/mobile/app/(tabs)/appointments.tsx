import { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { useAppointments } from "@/hooks/useAppointments";
import { Button } from "@/components/ui/Button";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";

export default function AppointmentsScreen() {
  const router = useRouter();
  const { appointments, isLoading, error, refetch } = useAppointments();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load appointments</Text>
          <Button title="Retry" onPress={() => refetch()} />
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={({ item }) => <AppointmentCard appointment={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No appointments scheduled</Text>
              <Button
                title="Book Appointment"
                onPress={() => router.push("/book")}
              />
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContent: {
    padding: 12,
    gap: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    color: "#dc2626",
    marginBottom: 16,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
});