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

interface ServiceProvider {
  id: number;
  business_name: string;
  owner_name: string;
  owner_email: string;
  phone_number: string;
  location: string;
  approval_status: "pending" | "approved" | "rejected";
  created_at: string;
  services: string[];
}

type FilterStatus = "all" | "pending" | "approved" | "rejected";

export default function ProvidersScreen() {
  const router = useRouter();
  const [providers, setProviders] = useState<ServiceProvider[]>([
    {
      id: 1,
      business_name: "Tech Solutions CCTV",
      owner_name: "Raj Kumar",
      owner_email: "raj@techsolutions.com",
      phone_number: "+91-9876543210",
      location: "Mumbai, Maharashtra",
      approval_status: "pending",
      created_at: "2025-12-18",
      services: ["CCTV Installation"],
    },
    {
      id: 2,
      business_name: "SecureView Services",
      owner_name: "Priya Sharma",
      owner_email: "priya@secureview.com",
      phone_number: "+91-8765432109",
      location: "Delhi, Delhi",
      approval_status: "pending",
      created_at: "2025-12-19",
      services: ["CCTV Installation", "Home Security"],
    },
    {
      id: 3,
      business_name: "SafeGuard CCTV",
      owner_name: "Amit Patel",
      owner_email: "amit@safeguard.com",
      phone_number: "+91-7654321098",
      location: "Bangalore, Karnataka",
      approval_status: "approved",
      created_at: "2025-12-10",
      services: ["CCTV Installation"],
    },
  ]);
  const [filteredProviders, setFilteredProviders] =
    useState<ServiceProvider[]>(providers);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>("pending");

  useFocusEffect(
    React.useCallback(() => {
      fetchProviders();
    }, [])
  );

  const fetchProviders = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      filterProviders(providers, selectedFilter);
    } catch (error) {
      console.error("Failed to fetch providers:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchProviders();
    setRefreshing(false);
  }, []);

  const filterProviders = (
    allProviders: ServiceProvider[],
    filterType: FilterStatus
  ) => {
    let filtered = allProviders;

    switch (filterType) {
      case "pending":
        filtered = allProviders.filter((p) => p.approval_status === "pending");
        break;
      case "approved":
        filtered = allProviders.filter((p) => p.approval_status === "approved");
        break;
      case "rejected":
        filtered = allProviders.filter((p) => p.approval_status === "rejected");
        break;
      default:
        filtered = allProviders;
    }

    setFilteredProviders(filtered);
  };

  const handleFilterChange = (filter: FilterStatus) => {
    setSelectedFilter(filter);
    filterProviders(providers, filter);
  };

  const handleApprove = (providerId: number) => {
    Alert.alert(
      "Approve Provider",
      "Are you sure you want to approve this provider?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: () => {
            setProviders(
              providers.map((p) =>
                p.id === providerId ? { ...p, approval_status: "approved" } : p
              )
            );
            filterProviders(providers, selectedFilter);
            Alert.alert("Success", "Provider approved successfully!");
          },
          style: "default",
        },
      ]
    );
  };

  const handleReject = (providerId: number) => {
    Alert.prompt(
      "Reject Provider",
      "Please provide a reason for rejection:  ",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          onPress: (reason: string | undefined) => {
            // ADD TYPE HERE
            if (!reason) {
              Alert.alert("Error", "Please provide a reason");
              return;
            }

            setProviders(
              providers.map((p) =>
                p.id === providerId ? { ...p, approval_status: "rejected" } : p
              )
            );
            filterProviders(providers, selectedFilter);
            Alert.alert("Success", "Provider rejected successfully! ");
          },
          style: "destructive",
        },
      ],
      "plain-text"
    );
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "pending":
        return "#FF9500";
      case "approved":
        return "#4CAF50";
      case "rejected":
        return "#f44336";
      default:
        return "#666";
    }
  };

  const renderProviderCard = ({ item }: { item: ServiceProvider }) => (
    <View style={styles.providerCard}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.businessInfo}>
          <Text style={styles.businessName}>{item.business_name}</Text>
          <Text style={styles.ownerName}>{item.owner_name}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.approval_status) + "20" },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(item.approval_status) },
            ]}
          >
            {item.approval_status.charAt(0).toUpperCase() +
              item.approval_status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <DetailRow icon="mail" value={item.owner_email} />
        <DetailRow icon="call" value={item.phone_number} />
        <DetailRow icon="location" value={item.location} />
      </View>

      {/* Services */}
      <View style={styles.servicesContainer}>
        {item.services.map((service, index) => (
          <View key={index} style={styles.serviceBadge}>
            <Text style={styles.serviceText}>{service}</Text>
          </View>
        ))}
      </View>

      {/* Date */}
      <Text style={styles.dateText}>
        Registered: {new Date(item.created_at).toLocaleDateString()}
      </Text>

      {/* Actions */}
      {item.approval_status === "pending" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => handleReject(item.id)}
          >
            <Ionicons name="close" size={18} color="white" />
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => handleApprove(item.id)}
          >
            <Ionicons name="checkmark" size={18} color="white" />
            <Text style={styles.approveButtonText}>Approve</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.approval_status === "approved" && (
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            router.push({
              pathname: "/(admin)/provider-details",
              params: { providerId: item.id },
            })
          }
        >
          <Text style={styles.viewButtonText}>View Profile</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Service Providers</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{filteredProviders.length}</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabs}
        >
          {(["pending", "approved", "rejected", "all"] as const).map(
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

      {/* Providers List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading providers...</Text>
        </View>
      ) : filteredProviders.length > 0 ? (
        <FlatList
          data={filteredProviders}
          renderItem={renderProviderCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="briefcase-outline" size={60} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No Providers Found</Text>
          <Text style={styles.emptyStateSubtitle}>
            {selectedFilter === "pending"
              ? "No pending approvals"
              : `No ${selectedFilter} providers`}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

function DetailRow({ icon, value }: { icon: any; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={14} color="#666" style={styles.detailIcon} />
      <Text style={styles.detailText} numberOfLines={1}>
        {value}
      </Text>
    </View>
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
  providerCard: {
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
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  ownerName: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
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
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailIcon: {
    width: 20,
  },
  detailText: {
    fontSize: 12,
    color: "#666",
    flex: 1,
  },
  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  serviceBadge: {
    backgroundColor: "#F3E5F5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  serviceText: {
    fontSize: 11,
    color: "#9C27B0",
    fontWeight: "600",
  },
  dateText: {
    fontSize: 11,
    color: "#999",
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  approveButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  approveButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  rejectButton: {
    flex: 1,
    backgroundColor: "#f44336",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  rejectButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  viewButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
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
