import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Profile</Text>
        </View>

        {/* Admin Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileIcon}>
            <Ionicons name="shield-checkmark" size={50} color="white" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.adminName}>Administrator</Text>
            <Text style={styles.adminEmail}>{user?.email}</Text>
            <View style={styles.roleBadge}>
              <Ionicons name="checkmark-circle" size={12} color="white" />
              <Text style={styles.roleBadgeText}>Admin Account</Text>
            </View>
          </View>
        </View>

        {/* Admin Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin Statistics</Text>
          <View style={styles.statsContainer}>
            <StatCard label="Approvals" value="8" icon="checkmark" />
            <StatCard label="Rejections" value="2" icon="close" />
            <StatCard label="Users" value="156" icon="people" />
          </View>
        </View>

        {/* System Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Management</Text>

          <SettingItem
            icon="people"
            label="Manage Users"
            subtitle="View and manage user accounts"
            onPress={() => Alert.alert("Users", "User management panel")}
          />

          <SettingItem
            icon="briefcase"
            label="Manage Providers"
            subtitle="Approve/Reject service providers"
            onPress={() => router.push("/(admin)/providers")}
          />

          <SettingItem
            icon="document-text"
            label="Manage Requests"
            subtitle="Monitor service requests"
            onPress={() => router.push("/(admin)/requests")}
          />

          <SettingItem
            icon="settings"
            label="System Settings"
            subtitle="Configure system preferences"
            onPress={() => Alert.alert("Settings", "System settings panel")}
          />
        </View>

        {/* Support & Reporting */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Reporting</Text>

          <SettingItem
            icon="document"
            label="Generate Reports"
            subtitle="Create system reports"
            onPress={() => Alert.alert("Reports", "Report generation panel")}
          />

          <SettingItem
            icon="help-circle"
            label="Help & Documentation"
            subtitle="View admin documentation"
            onPress={() => Alert.alert("Help", "Admin help documentation")}
          />

          <SettingItem
            icon="mail"
            label="Contact Support"
            subtitle="Get technical support"
            onPress={() =>
              Alert.alert("Support", "Support contact information")
            }
          />
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>
            Danger Zone
          </Text>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="white" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Cyberwiz Services Admin v1.0.0</Text>
          <Text style={styles.copyrightText}>
            © 2025 Cyberwiz Services. All rights reserved.
          </Text>
          <Text style={styles.dateText}>Last login: 2025-12-20</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingItem({
  icon,
  label,
  subtitle,
  onPress,
}: {
  icon: any;
  label: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon} size={20} color="#FF6B6B" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={20} color="#FF6B6B" />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
  },
  adminName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  adminEmail: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FF6B6B",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  dangerTitle: {
    color: "#f44336",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFEBEE",
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF6B6B",
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFEBEE",
    justifyContent: "center",
    alignItems: "center",
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  settingSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF9500",
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
    marginBottom: 10,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  versionSection: {
    alignItems: "center",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginTop: 20,
  },
  versionText: {
    fontSize: 12,
    color: "#999",
  },
  copyrightText: {
    fontSize: 11,
    color: "#ccc",
    marginTop: 4,
  },
  dateText: {
    fontSize: 11,
    color: "#ccc",
    marginTop: 4,
  },
});
