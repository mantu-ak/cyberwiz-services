import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { notificationAPI, serviceTypeAPI } from "../../services/api";

interface ServiceType {
  id: number;
  name: string;
  description: string;
  icon_url?: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function UserHomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesRes, notificationsRes] = await Promise.all([
        serviceTypeAPI.getAll(),
        notificationAPI.getAll(),
      ]);

      if (servicesRes.data.success) {
        setServiceTypes(servicesRes.data.data);
      }

      if (notificationsRes.data.success) {
        setNotifications(notificationsRes.data.data.slice(0, 3));
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const getServiceIcon = (index: number): any => {
    const icons = ["construct", "water", "flash", "home"];
    return icons[index % icons.length];
  };

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
            <Text style={styles.greeting}>Hello, {user?.name}! 👋</Text>
            <Text style={styles.subtitle}>What service do you need today?</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/(user)/profile")}
          >
            {user?.profile_image ? (
              <Image
                source={{ uri: user.profile_image }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Ionicons name="person" size={24} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Location Info */}
        <View style={styles.locationCard}>
          <Ionicons name="location" size={20} color="#007AFF" />
          <View style={styles.locationText}>
            <Text style={styles.locationLabel}>Service Location</Text>
            <Text style={styles.locationValue}>
              {user?.location || "Set your location"}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(user)/profile")}>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Quick Action Button */}
        <TouchableOpacity
          style={styles.createRequestButton}
          onPress={() => router.push("/(user)/create-request")}
          activeOpacity={0.8}
        >
          <View style={styles.createRequestContent}>
            <Ionicons name="add-circle" size={28} color="white" />
            <View style={styles.createRequestText}>
              <Text style={styles.createRequestTitle}>Create New Request</Text>
              <Text style={styles.createRequestSubtitle}>
                Get service from verified providers
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>

        {/* Services Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Services</Text>
            <TouchableOpacity
              onPress={() => router.push("/(user)/create-request")}
            >
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#007AFF"
              style={styles.loader}
            />
          ) : serviceTypes.length > 0 ? (
            <View style={styles.servicesGrid}>
              {serviceTypes.map((service, index) => (
                <TouchableOpacity
                  key={service.id}
                  style={styles.serviceCard}
                  onPress={() =>
                    router.push({
                      pathname: "/(user)/create-request",
                      params: { serviceTypeId: service.id },
                    })
                  }
                  activeOpacity={0.7}
                >
                  <View style={styles.serviceIcon}>
                    <Ionicons
                      name={getServiceIcon(index)}
                      size={32}
                      color="#007AFF"
                    />
                  </View>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDescription}>
                    {service.description?.substring(0, 30)}...
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="briefcase-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No services available</Text>
            </View>
          )}
        </View>

        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => router.push("/(user)/profile")}>
                <Text style={styles.seeAll}>View All →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.notificationsContainer}>
              {notifications.map((notification, index) => (
                <View
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    index !== notifications.length - 1 &&
                      styles.notificationBorder,
                  ]}
                >
                  <View style={styles.notificationIcon}>
                    <Ionicons
                      name={
                        notification.title.includes("Quotation")
                          ? "receipt"
                          : "notifications"
                      }
                      size={20}
                      color="#007AFF"
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>
                      {notification.title}
                    </Text>
                    <Text style={styles.notificationMessage} numberOfLines={2}>
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {new Date(notification.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  {!notification.is_read && <View style={styles.unreadDot} />}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.statsContainer}>
            <StatsCard
              icon="document-text"
              label="Requests"
              value="0"
              color="#007AFF"
            />
            <StatsCard
              icon="checkmark-circle"
              label="Completed"
              value="0"
              color="#4CAF50"
            />
            <StatsCard icon="star" label="Rating" value="4.5" color="#FF9500" />
          </View>
        </View>

        {/* Help & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Need Help?</Text>
          <TouchableOpacity style={styles.helpCard} activeOpacity={0.7}>
            <View style={styles.helpIcon}>
              <Ionicons name="help-circle" size={24} color="#FF9500" />
            </View>
            <View style={styles.helpContent}>
              <Text style={styles.helpTitle}>Contact Support</Text>
              <Text style={styles.helpDescription}>
                Were here to help you 24/7
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpCard} activeOpacity={0.7}>
            <View style={styles.helpIcon}>
              <Ionicons name="information-circle" size={24} color="#2196F3" />
            </View>
            <View style={styles.helpContent}>
              <Text style={styles.helpTitle}>How It Works</Text>
              <Text style={styles.helpDescription}>
                Learn about our service process
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>Cyberwiz Services v1.0.0</Text>
          <Text style={styles.dateText}>
            © 2025-12-20 • All rights reserved
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatsCard({
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
      <View
        style={[styles.statIconContainer, { backgroundColor: `${color}20` }]}
      >
        <Ionicons name={icon} size={24} color={color} />
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
    borderColor: "#007AFF",
  },
  profilePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    gap: 12,
  },
  locationText: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  locationValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 2,
  },
  createRequestButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createRequestContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  createRequestText: {
    flex: 1,
  },
  createRequestTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  createRequestSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  seeAll: {
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "600",
  },
  loader: {
    marginVertical: 20,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  serviceCard: {
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
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  serviceDescription: {
    fontSize: 11,
    color: "#999",
    textAlign: "center",
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
  notificationsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  notificationBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  notificationMessage: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    lineHeight: 16,
  },
  notificationTime: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF6B6B",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
  },
  helpCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  helpIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  helpDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: "#999",
  },
  dateText: {
    fontSize: 11,
    color: "#ccc",
    marginTop: 4,
  },
});
