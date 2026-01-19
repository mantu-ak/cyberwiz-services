import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  customer_name: string;
  customer_phone: string;
  customer_rating: number;
  service_type_name: string;
  priority: "low" | "medium" | "high" | "urgent";
  created_at: string;
  images: {
    id: number;
    image_url: string;
    image_type: string;
  }[];
}

export default function RequestDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const requestId = parseInt(params.requestId as string);

  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequestDetails();
  }, []);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      setRequest({
        id: requestId,
        title: "CCTV Installation in Living Room",
        description:
          "Need to install 4 CCTV cameras with night vision capability.  Room dimensions are 20x15 feet.  Prefer cameras with motion detection and remote viewing app.",
        location: "123 Main St, City",
        latitude: 28.7041,
        longitude: 77.1025,
        customer_name: "John Doe",
        customer_phone: "+91-9876543210",
        customer_rating: 4.5,
        service_type_name: "CCTV Installation",
        priority: "high",
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
      });
    } catch (error) {
      console.error("Failed to fetch request details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9C27B0" />
        </View>
      </SafeAreaView>
    );
  }

  if (!request) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#f44336" />
          <Text style={styles.errorText}>Request not found</Text>
        </View>
      </SafeAreaView>
    );
  }

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#9C27B0" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Request Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Request Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View>
              <Text style={styles.requestTitle}>{request.title}</Text>
              <Text style={styles.serviceType}>
                {request.service_type_name}
              </Text>
            </View>
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
                {request.priority.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          {request.description && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.sectionContent}>{request.description}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={18} color="#9C27B0" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{request.location}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar" size={18} color="#2196F3" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Requested On</Text>
                <Text style={styles.infoValue}>
                  {new Date(request.created_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.customerCard}>
            <View style={styles.customerHeader}>
              <View style={styles.customerAvatar}>
                <Ionicons name="person" size={24} color="white" />
              </View>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{request.customer_name}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#FFB800" />
                  <Text style={styles.customerRating}>
                    {request.customer_rating} • Active Customer
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.customerDetails}>
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="call" size={18} color="white" />
                <Text style={styles.contactButtonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.contactButton, styles.messageButton]}
              >
                <Ionicons name="chatbubble" size={18} color="#9C27B0" />
                <Text style={[styles.contactButtonText, { color: "#9C27B0" }]}>
                  Message
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Images */}
        {request.images && request.images.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Uploaded Photos ({request.images.length})
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imagesList}
            >
              {request.images.map((image, index) => (
                <View key={index} style={styles.imageCard}>
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

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              router.push({
                pathname: "/(service-provider)/create-quotation",
                params: { requestId: request.id },
              })
            }
          >
            <Ionicons name="send" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Send Quotation</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Ionicons name="bookmark" size={20} color="#9C27B0" />
            <Text style={styles.secondaryButtonText}>Save for Later</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
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
  infoCard: {
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
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  serviceType: {
    fontSize: 12,
    color: "#9C27B0",
    fontWeight: "500",
    marginTop: 2,
  },
  priorityBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  priorityText: {
    fontSize: 14,
    fontWeight: "700",
  },
  infoSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 13,
    color: "#333",
    fontWeight: "600",
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  customerCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  customerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  customerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#9C27B0",
    justifyContent: "center",
    alignItems: "center",
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  customerRating: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  customerDetails: {
    flexDirection: "row",
    gap: 10,
  },
  contactButton: {
    flex: 1,
    backgroundColor: "#9C27B0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  messageButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#9C27B0",
  },
  contactButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  imagesList: {
    marginTop: 8,
  },
  imageCard: {
    width: 120,
    height: 120,
    marginRight: 12,
    borderRadius: 12,
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
  actionSection: {
    gap: 10,
  },
  primaryButton: {
    backgroundColor: "#9C27B0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#9C27B0",
  },
  secondaryButtonText: {
    color: "#9C27B0",
    fontSize: 16,
    fontWeight: "600",
  },
});
