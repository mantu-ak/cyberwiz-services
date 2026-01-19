import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

interface AdminStats {
  totalUsers: number;
  totalProviders: number;
  totalRequests: number;
  pendingApprovals: number;
  totalEarnings: number;
  completedJobs: number;
}

export default function AdminHomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 156,
    totalProviders: 34,
    totalRequests: 289,
    pendingApprovals: 8,
    totalEarnings: 1250000,
    completedJobs: 145,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchStats();
    }, [])
  );

  const fetchStats = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome Admin! 👋</Text>
            <Text style={styles.subtitle}>System Dashboard</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/(admin)/profile")}
          >
            <View style={styles.profilePlaceholder}>
              <Ionicons name="shield-checkmark" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Alert Card - Pending Approvals */}
        {stats.pendingApprovals > 0 && (
          <TouchableOpacity
            style={styles.alertCard}
            onPress={() => router.push("/(admin)/providers")}
            activeOpacity={0.7}
          >
            <View style={styles.alertIcon}>
              <Ionicons name="alert-circle" size={24} color="#FF6B6B" />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>
                {stats.pendingApprovals} Pending Approvals
              </Text>
              <Text style={styles.alertSubtitle}>
                Service providers waiting for verification
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        )}

        {/* Main Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="people"
            label="Total Users"
            value={stats.totalUsers.toString()}
            color="#2196F3"
          />
          <StatCard
            icon="briefcase"
            label="Service Providers"
            value={stats.totalProviders.toString()}
            color="#9C27B0"
          />
          <StatCard
            icon="document-text"
            label="Total Requests"
            value={stats.totalRequests.toString()}
            color="#FF9500"
          />
          <StatCard
            icon="checkmark-done-circle"
            label="Completed Jobs"
            value={stats.completedJobs.toString()}
            color="#4CAF50"
          />
          <StatCard
            icon="cash"
            label="Total Earnings"
            value={`₹${(stats.totalEarnings / 100000).toFixed(1)}L`}
            color="#FF6B6B"
          />
          <StatCard
            icon="hourglass"
            label="Pending Approvals"
            value={stats.pendingApprovals.toString()}
            color="#FF9500"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <ActionButton
              icon="people"
              label="Verify Provider"
              onPress={() => router.push("/(admin)/providers")}
              color="#9C27B0"
            />
            <ActionButton
              icon="document-text"
              label="View Requests"
              onPress={() => router.push("/(admin)/requests")}
              color="#2196F3"
            />
            <ActionButton
              icon="settings"
              label="Settings"
              onPress={() => router.push("/(admin)/profile")}
              color="#FF6B6B"
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>View All →</Text>
            </TouchableOpacity>
          </View>

          <ActivityItem
            icon="person-add"
            title="New User Registration"
            description="John Smith signed up"
            time="2 hours ago"
            color="#2196F3"
          />
          <ActivityItem
            icon="checkmark"
            title="Provider Approved"
            description="Tech Solutions CCTV verified"
            time="5 hours ago"
            color="#4CAF50"
          />
          <ActivityItem
            icon="document-text"
            title="New Service Request"
            description="CCTV installation in downtown area"
            time="8 hours ago"
            color="#FF9500"
          />
        </View>

        {/* System Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Status</Text>
          <StatusItem label="Database" status="Operational" color="#4CAF50" />
          <StatusItem label="API Server" status="Operational" color="#4CAF50" />
          <StatusItem
            label="File Storage"
            status="Operational"
            color="#4CAF50"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
  color,
}: {
  icon: any;
  label: string;
  onPress: () => void;
  color: string;
}) {
  return (
    <TouchableOpacity
      style={[styles.actionButton, { borderColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name={icon} size={24} color={color} />
      <Text style={[styles.actionButtonText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function ActivityItem({
  icon,
  title,
  description,
  time,
  color,
}: {
  icon: any;
  title: string;
  description: string;
  time: string;
  color: string;
}) {
  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityDescription}>{description}</Text>
      </View>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
  );
}

function StatusItem({
  label,
  status,
  color,
}: {
  label: string;
  status: string;
  color: string;
}) {
  return (
    <View style={styles.statusItem}>
      <Text style={styles.statusLabel}>{label}</Text>
      <View style={styles.statusBadge}>
        <View style={[styles.statusDot, { backgroundColor: color }]} />
        <Text style={styles.statusValue}>{status}</Text>
      </View>
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
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  profilePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
  },
  alertCard: {
    backgroundColor: "#FFEBEE",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B6B",
    gap: 12,
  },
  alertIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF6B6B",
  },
  alertSubtitle: {
    fontSize: 12,
    color: "#C62828",
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: "48%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  seeAll: {
    fontSize: 13,
    color: "#FF6B6B",
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: "white",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  activityItem: {
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
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  activityDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  activityTime: {
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
});
