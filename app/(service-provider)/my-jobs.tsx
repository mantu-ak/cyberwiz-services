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

interface Job {
  id: number;
  title: string;
  customer_name: string;
  location: string;
  status: "in_progress" | "completed" | "pending_approval";
  amount: number;
  customer_rating?: number;
  completed_date?: string;
  created_at: string;
}

type JobFilter = "all" | "in_progress" | "completed" | "pending";

export default function MyJobsScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 1,
      title: "CCTV Installation in Living Room",
      customer_name: "John Doe",
      location: "123 Main St, City",
      status: "completed",
      amount: 15000,
      customer_rating: 4.8,
      completed_date: "2025-12-15",
      created_at: "2025-12-10",
    },
    {
      id: 2,
      title: "Security Camera Setup - Office",
      customer_name: "Jane Smith",
      location: "456 Business Ave, City",
      status: "in_progress",
      amount: 25000,
      created_at: "2025-12-18",
    },
    {
      id: 3,
      title: "Home Security System",
      customer_name: "Bob Johnson",
      location: "789 Residential Ln, City",
      status: "pending_approval",
      amount: 18000,
      created_at: "2025-12-12",
    },
  ]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<JobFilter>("all");

  useFocusEffect(
    React.useCallback(() => {
      fetchJobs();
    }, [])
  );

  const fetchJobs = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      filterJobs(jobs, selectedFilter);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  }, []);

  const filterJobs = (allJobs: Job[], filterType: JobFilter) => {
    let filtered = allJobs;

    switch (filterType) {
      case "in_progress":
        filtered = allJobs.filter((job) => job.status === "in_progress");
        break;
      case "completed":
        filtered = allJobs.filter((job) => job.status === "completed");
        break;
      case "pending":
        filtered = allJobs.filter((job) => job.status === "pending_approval");
        break;
      default:
        filtered = allJobs;
    }

    setFilteredJobs(filtered);
  };

  const handleFilterChange = (filter: JobFilter) => {
    setSelectedFilter(filter);
    filterJobs(jobs, filter);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "in_progress":
        return "#2196F3";
      case "completed":
        return "#4CAF50";
      case "pending_approval":
        return "#FF9500";
      default:
        return "#666";
    }
  };

  const getStatusIcon = (status: string): any => {
    switch (status) {
      case "in_progress":
        return "build";
      case "completed":
        return "checkmark-done-circle";
      case "pending_approval":
        return "time";
      default:
        return "help-circle";
    }
  };

  const renderJobCard = ({ item }: { item: Job }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() =>
        router.push({
          pathname: "/(service-provider)/job-details",
          params: { jobId: item.id },
        })
      }
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.titleSection}>
          <Text style={styles.jobTitle} numberOfLines={2}>
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
          <Ionicons
            name={getStatusIcon(item.status)}
            size={16}
            color={getStatusColor(item.status)}
          />
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status === "in_progress"
              ? "In Progress"
              : item.status === "completed"
              ? "Completed"
              : "Pending"}
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

      {/* Rating & Amount */}
      <View style={styles.footer}>
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountValue}>
            ₹{item.amount.toLocaleString()}
          </Text>
        </View>

        {item.customer_rating && item.status === "completed" && (
          <View style={styles.ratingSection}>
            <Ionicons name="star" size={16} color="#FFB800" />
            <Text style={styles.ratingText}>{item.customer_rating}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            router.push({
              pathname: "/(service-provider)/job-details",
              params: { jobId: item.id },
            })
          }
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Jobs</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{filteredJobs.length}</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabs}
        >
          {(["all", "in_progress", "completed", "pending"] as const).map(
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
                    : filter === "in_progress"
                    ? "In Progress"
                    : filter === "completed"
                    ? "Completed"
                    : "Pending"}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </View>

      {/* Jobs List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9C27B0" />
          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      ) : filteredJobs.length > 0 ? (
        <FlatList
          data={filteredJobs}
          renderItem={renderJobCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="briefcase-outline" size={60} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No Jobs Found</Text>
          <Text style={styles.emptyStateSubtitle}>
            {selectedFilter === "all"
              ? "You haven't accepted any jobs yet"
              : `No ${selectedFilter} jobs found`}
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
  jobCard: {
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
  jobTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  customerName: {
    fontSize: 12,
    color: "#9C27B0",
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
    justifyContent: "space-between",
    gap: 10,
  },
  amountSection: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },
  amountValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9C27B0",
    marginTop: 2,
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF9500",
  },
  viewButton: {
    backgroundColor: "#9C27B0",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewButtonText: {
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
});
