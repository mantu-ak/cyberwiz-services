import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

interface DashboardStats {
  totalRequests: number;
  acceptedJobs: number;
  totalEarnings: number;
  rating: number;
  completedJobs: number;
  responseRate: number;
}

interface RecentRequest {
  id: number;
  title: string;
  service_type: string;
  location: string;
  priority: "low" | "medium" | "high" | "urgent";
  created_at: string;
  distance?: number;
}

export default function ServiceProviderHomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 12,
    acceptedJobs: 8,
    totalEarnings: 45000,
    rating: 4.7,
    completedJobs: 5,
    responseRate: 95,
  });
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([
    {
      id: 1,
      title: "CCTV Installation in Living Room",
      service_type: "CCTV Installation",
      location: "123 Main St, City",
      priority: "high",
      created_at: "2025-12-20",
      distance: 2.5,
    },
    {
      id: 2,
      title: "Security Camera Setup - Office",
      service_type: "CCTV Installation",
      location: "456 Business Ave, City",
      priority: "medium",
      created_at: "2025-12-19",
      distance: 5.2,
    },
    {
      id: 3,
      title: "Home Security System",
      service_type: "CCTV Installation",
      location: "789 Residential Ln, City",
      priority: "low",
      created_at: "2025-12-18",
      distance: 8.1,
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  }, []);

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "low":
        return "#4CAF50";
      case "medium":
        return "#FF9500";
      case "high":
        return "#FF5722";
      case "urgent":
        return "#f44336";
      default:
        return "#666";
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9C27B0" />
          <Text style={styles.loadingText}>Loading dashboard... </Text>
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
            <Text style={styles.greeting}>Welcome, {user?.name}! 👋</Text>
            <Text style={styles.subtitle}>Your service dashboard</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/(service-provider)/profile")}
          >
            {user?.profile_image ? (
              <Image
                source={{ uri: user.profile_image }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Ionicons name="briefcase" size={24} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Rating Card */}
        <View style={styles.ratingCard}>
          <View style={styles.ratingContent}>
            <View style={styles.ratingStars}>
              <Ionicons name="star" size={20} color="#FFB800" />
              <Text style={styles.ratingValue}>{stats.rating}</Text>
              <Text style={styles.ratingCount}>
                (Based on {stats.completedJobs} jobs)
              </Text>
            </View>
          </View>
          <View style={styles.responseRate}>
            <Text style={styles.responseLabel}>Response Rate</Text>
            <Text style={styles.responseValue}>{stats.responseRate}%</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="document-text"
            label="New Requests"
            value={stats.totalRequests.toString()}
            color="#2196F3"
            onPress={() => router.push("/(service-provider)/requests")}
          />
          <StatCard
            icon="checkmark-circle"
            label="Accepted Jobs"
            value={stats.acceptedJobs.toString()}
            color="#4CAF50"
            onPress={() => router.push("/(service-provider)/my-jobs")}
          />
          <StatCard
            icon="cash"
            label="Total Earnings"
            value={`₹${(stats.totalEarnings / 1000).toFixed(1)}K`}
            color="#9C27B0"
            onPress={() => Alert.alert("Earnings", "Detailed earnings report")}
          />
          <StatCard
            icon="trending-up"
            label="Completed Jobs"
            value={stats.completedJobs.toString()}
            color="#FF9500"
            onPress={() => Alert.alert("Jobs", "View completed jobs")}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <ActionButton
              icon="list"
              label="View Requests"
              onPress={() => router.push("/(service-provider)/requests")}
              color="#2196F3"
            />
            <ActionButton
              icon="checkmark-done"
              label="My Jobs"
              onPress={() => router.push("/(service-provider)/my-jobs")}
              color="#4CAF50"
            />
            <ActionButton
              icon="settings"
              label="Settings"
              onPress={() => router.push("/(service-provider)/profile")}
              color="#FF9500"
            />
          </View>
        </View>

        {/* Recent Requests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Requests</Text>
            <TouchableOpacity
              onPress={() => router.push("/(service-provider)/requests")}
            >
              <Text style={styles.seeAll}>View All →</Text>
            </TouchableOpacity>
          </View>

          {recentRequests.length > 0 ? (
            <View style={styles.requestsList}>
              {recentRequests.map((request, index) => (
                <TouchableOpacity
                  key={request.id}
                  style={[
                    styles.requestCard,
                    index !== recentRequests.length - 1 &&
                      styles.requestCardBorder,
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: "/(service-provider)/request-details",
                      params: { requestId: request.id },
                    })
                  }
                >
                  <View style={styles.requestHeader}>
                    <View style={styles.requestTitleSection}>
                      <Text style={styles.requestTitle} numberOfLines={2}>
                        {request.title}
                      </Text>
                      <Text style={styles.requestService}>
                        {request.service_type}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.priorityBadge,
                        {
                          backgroundColor:
                            getPriorityColor(request.priority) + "20",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          { color: getPriorityColor(request.priority) },
                        ]}
                      >
                        {request.priority.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.requestDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="location" size={14} color="#666" />
                      <Text style={styles.detailText} numberOfLines={1}>
                        {request.location} ({request.distance} km away)
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="time" size={14} color="#666" />
                      <Text style={styles.detailText}>
                        {new Date(request.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.sendQuoteButton}
                    onPress={() =>
                      router.push({
                        pathname: "/(service-provider)/create-quotation",
                        params: { requestId: request.id },
                      })
                    }
                  >
                    <Ionicons name="send" size={16} color="white" />
                    <Text style={styles.sendQuoteText}>Send Quote</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={40} color="#ccc" />
              <Text style={styles.emptyText}>No requests yet</Text>
            </View>
          )}
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pro Tips</Text>
          <TipCard
            icon="lightning-bolt"
            title="Quick Response"
            description="Respond to requests within 2 hours to increase acceptance rate"
          />
          <TipCard
            icon="star"
            title="Build Your Rating"
            description="Complete jobs on time and get positive reviews to boost your profile"
          />
          <TipCard
            icon="trending-up"
            title="Increase Earnings"
            description="Update your pricing and services to attract more customers"
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
  onPress,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.statCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.statIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
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

function TipCard({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.tipCard}>
      <View style={styles.tipIconContainer}>
        <Ionicons name={icon} size={20} color="#9C27B0" />
      </View>
      <View style={styles.tipContent}>
        <Text style={styles.tipTitle}>{title}</Text>
        <Text style={styles.tipDescription}>{description}</Text>
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
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#9C27B0",
  },
  profilePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#9C27B0",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  ratingContent: {
    flex: 1,
  },
  ratingStars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  ratingCount: {
    fontSize: 11,
    color: "#999",
  },
  responseRate: {
    alignItems: "center",
  },
  responseLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },
  responseValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4CAF50",
    marginTop: 4,
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
    color: "#9C27B0",
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
  requestsList: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  requestCard: {
    padding: 14,
  },
  requestCardBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 10,
  },
  requestTitleSection: {
    flex: 1,
  },
  requestTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  requestService: {
    fontSize: 11,
    color: "#9C27B0",
    fontWeight: "500",
    marginTop: 2,
  },
  priorityBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "700",
  },
  requestDetails: {
    gap: 6,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: "#666",
    flex: 1,
  },
  sendQuoteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9C27B0",
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  sendQuoteText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
  tipCard: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#9C27B0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tipIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  tipDescription: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
    lineHeight: 14,
  },
});
