import { useState } from "react";
import { View, TextInput, StyleSheet, ScrollView, Text } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSignIn() {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Get user role and redirect to role-specific home
      const role = data.user?.user_metadata?.role || "patient";
      console.log("🔐 Login successful, role:", role);
      
      router.replace("/(tabs)/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>MediConnect</Text>
        <Text style={styles.subtitle}>Sign In</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <Button
          title={loading ? "Signing in..." : "Sign In"}
          onPress={handleSignIn}
          disabled={loading}
          style={styles.button}
        />

        <Button
          title="Create Account"
          onPress={() => router.push("/(auth)/signup")}
          disabled={loading}
          variant="secondary"
          style={styles.button}
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
  content: {
    padding: 24,
    justifyContent: "center",
    minHeight: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0066cc",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "white",
  },
  button: {
    marginBottom: 12,
  },
  error: {
    color: "#dc2626",
    marginBottom: 16,
    textAlign: "center",
  },
});