import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.email?.[0].toUpperCase() || "U"}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuItem}>
          <Text style={styles.menuItemText}>Email</Text>
          <Text style={styles.menuItemValue}>{user?.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <Button
          title="Edit Profile"
          onPress={() => {}}
          style={styles.menuButton}
        />
        <Button
          title="Security Settings"
          onPress={() => {}}
          style={styles.menuButton}
        />
        <Button
          title="Notifications"
          onPress={() => {}}
          style={styles.menuButton}
        />
      </View>

      <View style={styles.section}>
        <Button
          title="Sign Out"
          onPress={handleLogout}
          variant="destructive"
          style={styles.logoutButton}
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
    alignItems: "center",
    paddingVertical: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  section: {
    backgroundColor: "white",
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  menuItemValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  menuButton: {
    marginBottom: 10,
  },
  logoutButton: {
    marginVertical: 8,
  },
});