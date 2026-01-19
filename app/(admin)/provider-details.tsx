import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface ProviderDetail {
  id: number;
  business_name: string;
  owner_name: string;
  owner_email: string;
  phone_number: string;
  location: string;
  description: string;
  services: string[];
  total_jobs: number;
  rating: number;
  approval_status: "pending" | "approved" | "rejected";
  approved_at?: string;
  business_license_url?: string;
  business_logo_url?: string;
}

export default function ProviderDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const providerId = parseInt(params.providerId as string);

  const [provider] = useState<ProviderDetail>({
    id: providerId,
    business_name: "Tech Solutions CCTV",
    owner_name: "Raj Kumar",
    owner_email: "raj@techsolutions.com",
    phone_number: "+91-9876543210",
    location: "Mumbai, Maharashtra",
    description:
      "Professional CCTV installation and maintenance services with 5+ years of experience.",
    services: ["CCTV Installation"],
    total_jobs: 8,
    rating: 4.7,
    approval_status: "approved",
    approved_at: "2025-12-10",
    business_logo_url: "https://via.placeholder.com/100",
    business_license_url: "https://via.placeholder.com/300",
  });

  const handleSuspend = () => {
    Alert.alert(
      "Suspend Provider",
      "Are you sure you want to suspend this provider? ",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Suspend",
          onPress: () => {
            Alert.alert("Success", "Provider suspended");
            router.back();
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#FF6B6B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Provider Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Provider Card */}
        <View style={styles.providerCard}>
          {provider.business_logo_url && (
            <Image
              source={{ uri: provider.business_logo_url }}
              style={styles.businessLogo}
            />
          )}
          <View style={styles.providerInfo}>
            <Text style={styles.businessName}>{provider.business_name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFB800" />
              <Text style={styles.rating}>{provider.rating}</Text>
              <Text style={styles.jobs}>• {provider.total_jobs} Jobs</Text>
            </View>
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
              <Text style={styles.statusText}>Approved</Text>
            </View>
          </View>
        </View>

        {/* Owner Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Owner Information</Text>
          <DetailCard
            label="Owner Name"
            value={provider.owner_name}
            icon="person"
          />
          <DetailCard label="Email" value={provider.owner_email} icon="mail" />
          <DetailCard label="Phone" value={provider.phone_number} icon="call" />
          <DetailCard
            label="Location"
            value={provider.location}
            icon="location"
          />
        </View>

        {/* Business Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{provider.description}</Text>
          </View>
          <View style={styles.servicesContainer}>
            <Text style={styles.servicesLabel}>Services Provided:</Text>
            {provider.services.map((service, index) => (
              <View key={index} style={styles.serviceBadge}>
                <Ionicons name="checkmark" size={12} color="#FF6B6B" />
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents</Text>
          {provider.business_license_url && (
            <TouchableOpacity
              style={styles.documentCard}
              onPress={() =>
                Alert.alert("View License", "Business license document")
              }
            >
              <Ionicons name="document" size={24} color="#FF6B6B" />
              <View style={styles.documentInfo}>
                <Text style={styles.documentTitle}>Business License</Text>
                <Text style={styles.documentSubtitle}>Verified</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <StatCard
              label="Total Jobs"
              value={provider.total_jobs.toString()}
            />
            <StatCard label="Rating" value={provider.rating.toString()} />
          </View>
        </View>

        {/* Admin Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin Actions</Text>
          <TouchableOpacity
            style={styles.suspendButton}
            onPress={handleSuspend}
          >
            <Ionicons name="ban" size={18} color="white" />
            <Text style={styles.suspendButtonText}>Suspend Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  return (
    <View style={styles.detailCard}>
      <Ionicons name={icon} size={18} color="#FF6B6B" />
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
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
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  providerCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  businessLogo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#f0f0f0",
  },
  providerInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFB800",
  },
  jobs: {
    fontSize: 12,
    color: "#666",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4CAF50",
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
  detailCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 8,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginTop: 2,
  },
  descriptionBox: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  servicesContainer: {
    marginBottom: 12,
  },
  servicesLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  serviceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 6,
    gap: 8,
  },
  serviceText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 12,
    marginBottom: 8,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  documentSubtitle: {
    fontSize: 11,
    color: "#4CAF50",
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF6B6B",
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
  },
  suspendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f44336",
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  suspendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
