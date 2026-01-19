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
  service_type: string;
  location: string;
  priority: "low" | "medium" | "high" | "urgent";
  customer_name: string;
  customer_rating?: number;
  created_at: string;
  distance: number;
  status: "quoted" | "not_quoted";
}

type FilterStatus = "all" | "nearby" | "high_priority" | "unquoted";

export default function ServiceProviderRequestsScreen() {
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>([
    {
      id: 1,
      title: "CCTV Installation in Living Room",
      service_type: "CCTV Installation",
      location: "123 Main St, City",
      priority: "high",
      customer_name: "John Doe",
      customer_rating: 4.5,
      created_at: "2025-12-20",
      distance: 2.5,
      status: "not_quoted",
    },
    {
      id: 2,
      title: "Security Camera Setup - Office",
      service_type: "CCTV Installation",
      location: "456 Business Ave, City",
      priority: "medium",
      customer_name: "Jane Smith",
      customer_rating: 4.8,
      created_at: "2025-12-19",
      distance: 5.2,
      status: "quoted",
    },
    {
      id: 3,
      title: "Home Security System",
      service_type: "CCTV Installation",
      location: "789 Residential Ln, City",
      priority: "low",
      customer_name: "Bob Johnson",
      customer_rating: 4.3,
      created_at: "2025-12-18",
      distance: 8.1,
      status: "not_quoted",
    },
    {
      id: 4,
      title: "24/7 Surveillance Setup",
      service_type: "CCTV Installation",
      location: "321 Tech Park, City",
      priority: "urgent",
      customer_name: "Tech Corp",
      customer_rating: 4.9,
      created_at: "2025-12-20",
      distance: 1.8,
      status: "not_quoted",
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
      // Simulate API call
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
      case "nearby":
        filtered = allRequests.filter((req) => req.distance <= 5);
        break;
      case "high_priority":
        filtered = allRequests.filter(
          (req) => req.priority === "high" || req.priority === "urgent"
        );
        break;
      case "unquoted":
        filtered = allRequests.filter((req) => req.status === "not_quoted");
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
          pathname: "/(service-provider)/request-details",
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
          <Text style={styles.serviceType}>{item.service_type}</Text>
        </View>
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
      </View>

      {/* Customer Info */}
      <View style={styles.customerInfo}>
        <Ionicons name="person" size={14} color="#666" />
        <Text style={styles.customerName}>{item.customer_name}</Text>
        {item.customer_rating && (
          <>
            <Ionicons
              name="star"
              size={12}
              color="#FFB800"
              style={styles.ratingIcon}
            />
            <Text style={styles.customerRating}>{item.customer_rating}</Text>
          </>
        )}
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="location" size={14} color="#9C27B0" />
          <Text style={styles.detailText} numberOfLines={1}>
            {item.location}
          </Text>
          <Text style={styles.distance}>{item.distance} km</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="time" size={14} color="#666" />
          <Text style={styles.detailText}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Status Badge */}
      {item.status === "not_quoted" && (
        <View style={styles.statusBadge}>
          <Ionicons name="alert-circle" size={14} color="#FF9500" />
          <Text style={styles.statusText}>You havent quoted yet</Text>
        </View>
      )}

      {item.status === "quoted" && (
        <View style={[styles.statusBadge, styles.quotedBadge]}>
          <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
          <Text style={[styles.statusText, { color: "#4CAF50" }]}>
            Quotation sent
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            router.push({
              pathname: "/(service-provider)/request-details",
              params: { requestId: item.id },
            })
          }
        >
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quoteButton}
          onPress={() =>
            router.push({
              pathname: "/(service-provider)/create-quotation",
              params: { requestId: item.id },
            })
          }
        >
          <Ionicons name="send" size={14} color="white" />
          <Text style={styles.quoteButtonText}>
            {item.status === "quoted" ? "Update" : "Send"} Quote
          </Text>
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
          {(["all", "unquoted", "nearby", "high_priority"] as const).map(
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
                    : filter === "unquoted"
                    ? "Not Quoted"
                    : filter === "nearby"
                    ? "Nearby"
                    : "High Priority"}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </View>

      {/* Requests List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9C27B0" />
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
              ? "No service requests available"
              : `No ${selectedFilter} requests found`}
          </Text>
          {selectedFilter !== "all" && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => handleFilterChange("all")}
            >
              <Text style={styles.resetButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
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
    backgroundColor: "#9C27B0",
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
    backgroundColor: "#9C27B0",
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
    marginBottom: 10,
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
  serviceType: {
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
  customerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  customerName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  ratingIcon: {
    marginLeft: 8,
  },
  customerRating: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFB800",
  },
  details: {
    gap: 6,
    marginBottom: 10,
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
  distance: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9C27B0",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
    marginBottom: 10,
  },
  quotedBadge: {
    backgroundColor: "#E8F5E9",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FF9500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  viewButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#9C27B0",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9C27B0",
  },
  quoteButton: {
    flex: 1,
    backgroundColor: "#9C27B0",
    flexDirection: "row",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  quoteButtonText: {
    fontSize: 12,
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
  resetButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#9C27B0",
    borderRadius: 8,
  },
  resetButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
