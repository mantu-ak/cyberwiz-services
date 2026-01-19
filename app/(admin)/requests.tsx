import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ServiceRequest {
  id: number;
  title: string;
  service_type_name: string;
  customer_name: string;
  location: string;
  status:
    | "pending"
    | "assigned"
    | "quoted"
    | "accepted"
    | "completed"
    | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  quotations_count: number;
  created_at: string;
}

type FilterStatus = "all" | "pending" | "assigned" | "completed";

export default function RequestsScreen() {
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>([
    {
      id: 1,
      title: "CCTV Installation in Living Room",
      service_type_name: "CCTV Installation",
      customer_name: "John Doe",
      location: "123 Main St, City",
      status: "pending",
      priority: "high",
      quotations_count: 0,
      created_at: "2025-12-20",
    },
    {
      id: 2,
      title: "Security Camera Setup - Office",
      service_type_name: "CCTV Installation",
      customer_name: "Jane Smith",
      location: "456 Business Ave, City",
      status: "quoted",
      priority: "medium",
      quotations_count: 2,
      created_at: "2025-12-19",
    },
    {
      id: 3,
      title: "Home Security System",
      service_type_name: "CCTV Installation",
      customer_name: "Bob Johnson",
      location: "789 Residential Ln, City",
      status: "completed",
      priority: "low",
      quotations_count: 1,
      created_at: "2025-12-10",
    },
  ]);
  const [filteredRequests, setFilteredRequests] =
    useState<ServiceRequest[]>(requests);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>("all");

  useFocusEffect(
    React.useCallback(() => {
      fetchRequests();
    }, [])
  );

  const fetchRequests = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      filterRequests(requests, selectedFilter);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  }, []);

  const filterRequests = (
    allRequests: ServiceRequest[],
    filterType: FilterStatus
  ) => {
    let filtered = allRequests;

    switch (filterType) {
      case "pending":
        filtered = allRequests.filter((r) => r.status === "pending");
        break;
      case "assigned":
        filtered = allRequests.filter((r) => r.status === "assigned");
        break;
      case "completed":
        filtered = allRequests.filter((r) => r.status === "completed");
        break;
      default:
        filtered = allRequests;
    }

    setFilteredRequests(filtered);
  };

  const handleFilterChange = (filter: FilterStatus) => {
    setSelectedFilter(filter);
    filterRequests(requests, filter);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "pending":
        return "#FF9500";
      case "assigned":
        return "#2196F3";
      case "quoted":
        return "#9C27B0";
      case "accepted":
        return "#4CAF50";
      case "completed":
        return "#4CAF50";
      case "cancelled":
        return "#999";
      default:
        return "#666";
    }
  };

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

  const renderRequestCard = ({ item }: { item: ServiceRequest }) => (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() =>
        router.push({
          pathname: "/(admin)/request-details",
          params: { requestId: item.id },
        })
      }
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.titleSection}>
          <Text style={styles.requestTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.customerName}>{item.customer_name}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + "20" },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="location" size={14} color="#666" />
          <Text style={styles.detailText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={14} color="#666" />
          <Text style={styles.detailText}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor(item.priority) + "20" },
          ]}
        >
          <Text
            style={[
              styles.priorityText,
              { color: getPriorityColor(item.priority) },
            ]}
          >
            {item.priority.charAt(0).toUpperCase()}
          </Text>
        </View>

        {item.quotations_count > 0 && (
          <View style={styles.quoteBadge}>
            <Ionicons name="receipt" size={12} color="#9C27B0" />
            <Text style={styles.quoteText}>{item.quotations_count} Quotes</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            router.push({
              pathname: "/(admin)/request-details",
              params: { requestId: item.id },
            })
          }
        >
          <Text style={styles.viewButtonText}>Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Service Requests</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{filteredRequests.length}</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabs}
        >
          {(["all", "pending", "assigned", "completed"] as const).map(
            (filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterTab,
                  selectedFilter === filter && styles.filterTabActive,
                ]}
                onPress={() => handleFilterChange(filter)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    selectedFilter === filter && styles.filterTabTextActive,
                  ]}
                >
                  {filter === "all"
                    ? "All"
                    : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </View>

      {/* Requests List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading requests...</Text>
        </View>
      ) : filteredRequests.length > 0 ? (
        <FlatList
          data={filteredRequests}
          renderItem={renderRequestCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="document-outline" size={60} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No Requests Found</Text>
          <Text style={styles.emptyStateSubtitle}>
            {selectedFilter === "all"
              ? "No service requests"
              : `No ${selectedFilter} requests`}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  badgeContainer: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  filterContainer: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  filterTabs: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  filterTabActive: {
    backgroundColor: "#FF6B6B",
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  filterTabTextActive: {
    color: "white",
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
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  requestCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 10,
  },
  titleSection: {
    flex: 1,
  },
  requestTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  customerName: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  details: {
    gap: 6,
    marginBottom: 12,
    paddingBottom: 12,
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
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  priorityBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "700",
  },
  quoteBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F3E5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  quoteText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9C27B0",
  },
  viewButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: "auto",
  },
  viewButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: "white",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginTop: 16,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
});
