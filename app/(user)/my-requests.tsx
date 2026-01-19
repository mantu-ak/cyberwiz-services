import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { serviceRequestAPI } from "../../services/api";

interface ServiceRequest {
  id: number;
  title: string;
  description: string;
  service_type_name: string;
  status:
    | "pending"
    | "assigned"
    | "quoted"
    | "accepted"
    | "rejected"
    | "completed"
    | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  location: string;
  created_at: string;
  quotations?: any[];
}

type FilterStatus = "all" | "pending" | "quoted" | "accepted" | "completed";

export default function MyRequestsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>(
    []
  );
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
      const response = await serviceRequestAPI.getAll();
      if (response.data.success) {
        setRequests(response.data.data);
        filterRequests(response.data.data, selectedFilter);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      Alert.alert("Error", "Failed to load your requests");
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
    if (filterType === "all") {
      setFilteredRequests(allRequests);
    } else {
      setFilteredRequests(
        allRequests.filter((req) => req.status === filterType)
      );
    }
  };

  const handleFilterChange = (filter: FilterStatus) => {
    setSelectedFilter(filter);
    filterRequests(requests, filter);
  };

  const getStatusColor = (status: ServiceRequest["status"]): string => {
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
      case "rejected":
        return "#f44336";
      case "cancelled":
        return "#999";
      default:
        return "#666";
    }
  };

  const getStatusIcon = (status: ServiceRequest["status"]): any => {
    switch (status) {
      case "pending":
        return "time";
      case "assigned":
        return "person-add";
      case "quoted":
        return "receipt";
      case "accepted":
        return "checkmark-circle";
      case "completed":
        return "checkmark-done-circle";
      case "rejected":
        return "close-circle";
      case "cancelled":
        return "ban";
      default:
        return "help-circle";
    }
  };

  const getPriorityColor = (priority: ServiceRequest["priority"]): string => {
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
          pathname: "/(user)/request-details",
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
          <Text style={styles.serviceType}>{item.service_type_name}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + "20" },
          ]}
        >
          <Ionicons
            name={getStatusIcon(item.status)}
            size={16}
            color={getStatusColor(item.status)}
          />
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location" size={16} color="#666" />
          <Text style={styles.detailText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.detailText}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <View
            style={[
              styles.priorityDot,
              { backgroundColor: getPriorityColor(item.priority) },
            ]}
          />
          <Text style={styles.detailText}>
            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}{" "}
            Priority
          </Text>
        </View>
      </View>

      {/* Quotations Count */}
      {item.quotations && item.quotations.length > 0 && (
        <View style={styles.quotationsSection}>
          <Ionicons name="receipt" size={16} color="#9C27B0" />
          <Text style={styles.quotationsText}>
            {item.quotations.length} quotation
            {item.quotations.length > 1 ? "s" : ""} received
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </View>
      )}

      {/* Footer */}
      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            router.push({
              pathname: "/(user)/request-details",
              params: { requestId: item.id },
            })
          }
        >
          <Text style={styles.viewButtonText}>View Details</Text>
          <Ionicons name="arrow-forward" size={14} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Requests</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/(user)/create-request")}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterTabs}
        contentContainerStyle={styles.filterTabsContent}
      >
        {(["all", "pending", "quoted", "accepted", "completed"] as const).map(
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

      {/* Requests List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading your requests...</Text>
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
          <Ionicons name="folder-open" size={60} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No Requests Found</Text>
          <Text style={styles.emptyStateSubtitle}>
            {selectedFilter === "all"
              ? "Create your first service request"
              : `No ${selectedFilter} requests yet`}
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => router.push("/(user)/create-request")}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.emptyStateButtonText}>Create Request</Text>
          </TouchableOpacity>
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
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  filterTabs: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  filterTabsContent: {
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
    backgroundColor: "#007AFF",
  },
  filterTabText: {
    fontSize: 13,
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
    padding: 16,
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
    gap: 12,
  },
  titleSection: {
    flex: 1,
  },
  requestTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  serviceType: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  cardDetails: {
    gap: 8,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: "#666",
    flex: 1,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  quotationsSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3E5F5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  quotationsText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9C27B0",
    flex: 1,
  },
  cardFooter: {
    alignItems: "flex-end",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007AFF",
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
  emptyStateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    gap: 8,
  },
  emptyStateButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
