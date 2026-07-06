import { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, RefreshControl } from "react-native";
import { useMedicalRecords } from "@/hooks/useMedicalRecords";
import { Button } from "@/components/ui/Button";
import { MedicalRecordCard } from "@/components/records/MedicalRecordCard";

export default function RecordsScreen() {
  const { records, isLoading, error, refetch } = useMedicalRecords();
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
          <Text style={styles.errorText}>Failed to load records</Text>
          <Button title="Retry" onPress={() => refetch()} />
        </View>
      ) : (
        <FlatList
          data={records}
          renderItem={({ item }) => <MedicalRecordCard record={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No medical records</Text>
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
  },
});