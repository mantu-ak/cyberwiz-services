import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface RequestDetail {
  id: number;
  title: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  location: string;
  description: string;
  service_type: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "assigned" | "quoted" | "completed";
  created_at: string;
  images: { id: number; image_url: string; image_type: string }[];
  quotations: {
    id: number;
    provider_name: string;
    amount: number;
    status: string;
  }[];
}

export default function RequestDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const requestId = parseInt(params.requestId as string);

  const [request] = useState<RequestDetail>({
    id: requestId,
    title: "CCTV Installation in Living Room",
    customer_name: "John Doe",
    customer_email: "john@example.com",
    customer_phone: "+91-9876543210",
    location: "123 Main St, Mumbai",
    description: "Need 4 CCTV cameras with night vision in 20x15 feet room",
    service_type: "CCTV Installation",
    priority: "high",
    status: "quoted",
    created_at: "2025-12-20",
    images: [
      {
        id: 1,
        image_url: "https://via.placeholder.com/300",
        image_type: "location",
      },
      {
        id: 2,
        image_url: "https://via.placeholder.com/300",
        image_type: "requirement",
      },
    ],
    quotations: [
      {
        id: 1,
        provider_name: "Tech Solutions CCTV",
        amount: 25000,
        status: "pending",
      },
      {
        id: 2,
        provider_name: "SecureView Services",
        amount: 28000,
        status: "pending",
      },
    ],
  });

  const getPriorityColor = (priority: string): string => {
    const colors: { [key: string]: string } = {
      low: "#4CAF50",
      medium: "#FF9500",
      high: "#FF5722",
      urgent: "#f44336",
    };
    return colors[priority] || "#666";
  };

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      pending: "#FF9500",
      assigned: "#2196F3",
      quoted: "#9C27B0",
      completed: "#4CAF50",
    };
    return colors[status] || "#666";
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
          <Text style={styles.headerTitle}>Request Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Request Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.requestTitle}>{request.title}</Text>
              <Text style={styles.serviceType}>{request.service_type}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(request.status) + "20" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(request.status) },
                ]}
              >
                {request.status.charAt(0).toUpperCase() +
                  request.status.slice(1)}
              </Text>
            </View>
          </View>

          <View style={styles.priorityRow}>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(request.priority) + "20" },
              ]}
            >
              <Text
                style={[
                  styles.priorityText,
                  { color: getPriorityColor(request.priority) },
                ]}
              >
                {request.priority.toUpperCase()} PRIORITY
              </Text>
            </View>
            <Text style={styles.dateText}>
              {new Date(request.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <DetailItem
            icon="person"
            label="Name"
            value={request.customer_name}
          />
          <DetailItem
            icon="mail"
            label="Email"
            value={request.customer_email}
          />
          <DetailItem
            icon="call"
            label="Phone"
            value={request.customer_phone}
          />
          <DetailItem
            icon="location"
            label="Location"
            value={request.location}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Request Description</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{request.description}</Text>
          </View>
        </View>

        {/* Images */}
        {request.images.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Uploaded Images</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imagesList}
            >
              {request.images.map((image) => (
                <View key={image.id} style={styles.imageCard}>
                  <Image
                    source={{ uri: image.image_url }}
                    style={styles.image}
                  />
                  <Text style={styles.imageLabel}>{image.image_type}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Quotations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Quotations ({request.quotations.length})
          </Text>
          {request.quotations.map((quote) => (
            <View key={quote.id} style={styles.quotationCard}>
              <View style={styles.quotationHeader}>
                <View>
                  <Text style={styles.quotationProvider}>
                    {quote.provider_name}
                  </Text>
                  <Text style={styles.quotationAmount}>
                    ₹{quote.amount.toLocaleString()}
                  </Text>
                </View>
                <View
                  style={[
                    styles.quotationStatus,
                    {
                      backgroundColor:
                        quote.status === "pending" ? "#FFF3E0" : "#E8F5E9",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.quotationStatusText,
                      {
                        color:
                          quote.status === "pending" ? "#FF9500" : "#4CAF50",
                      },
                    ]}
                  >
                    {quote.status.charAt(0).toUpperCase() +
                      quote.status.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Admin Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin Actions</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert("Contact", "Customer contact options")}
          >
            <Ionicons name="call" size={18} color="white" />
            <Text style={styles.actionButtonText}>Contact Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => Alert.alert("Flag", "Flag this request for review")}
          >
            <Ionicons name="flag" size={18} color="#FF6B6B" />
            <Text style={[styles.actionButtonText, { color: "#FF6B6B" }]}>
              Flag Request
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailItem}>
      <Ionicons name={icon} size={18} color="#FF6B6B" />
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
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
  summaryCard: {
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
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 10,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  serviceType: {
    fontSize: 12,
    color: "#FF6B6B",
    fontWeight: "500",
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
  priorityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "700",
  },
  dateText: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 8,
    gap: 12,
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
  imagesList: {
    marginBottom: 12,
  },
  imageCard: {
    width: 120,
    height: 120,
    marginRight: 12,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageLabel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "white",
    fontSize: 10,
    fontWeight: "600",
    padding: 4,
    textAlign: "center",
  },
  quotationCard: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  quotationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quotationProvider: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  quotationAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF6B6B",
    marginTop: 2,
  },
  quotationStatus: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quotationStatusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
