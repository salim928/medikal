import { useLocalSearchParams } from "expo-router";
import { View, StyleSheet, Text } from "react-native";
import { useDaily } from "@daily-co/react-native";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export default function ConsultationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const daily = useDaily();
  const [roomUrl, setRoomUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const initRoom = async () => {
      try {
        setLoading(true);
        const response = await apiClient.post("/appointments/video-room", {
          appointmentId: id,
        });
        setRoomUrl(response.data.url);

        // Join the room
        await daily?.join({
          url: response.data.url,
          token: response.data.token,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to join room");
      } finally {
        setLoading(false);
      }
    };

    initRoom();
  }, [id, daily]);

  const handleLeave = async () => {
    await daily?.leave();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Joining consultation...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <Text>Video stream appears here</Text>
      </View>
      <Button title="End Consultation" onPress={handleLeave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  videoContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "#ff6b6b",
    fontSize: 16,
  },
});