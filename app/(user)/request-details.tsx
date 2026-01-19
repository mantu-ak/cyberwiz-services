import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { serviceRequestAPI } from "../../services/api";

interface Quotation {
  id: number;
  provider_id: number;
  business_name: string;
  provider_name: string;
  amount: number;
  installation_days: number;
  distance_km: number;
  notes: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  created_at: string;
}

export default function RequestDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const requestId = parseInt(params.requestId as string);

  const [request, setRequest] = useState<any>(null);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingQuote, setAcceptingQuote] = useState<number | null>(null);

  useEffect(() => {
    fetchRequestDetails();
  }, []);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const response = await serviceRequestAPI.getById(requestId);
      if (response.data.success) {
        setRequest(response.data.data);
        setQuotations(response.data.data.quotations || []);
      }
    } catch (error) {
      console.error("Failed to fetch request details:", error);
      Alert.alert("Error", "Failed to load request details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuotation = async (quotationId: number) => {
    Alert.alert("Confirm", "Are you sure you want to accept this quotation?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Accept",
        onPress: async () => {
          try {
            setAcceptingQuote(quotationId);
            // Call API to accept quotation
            // await quotationAPI.acceptQuotation(quotationId);
            Alert.alert(
              "Success",
              "Quotation accepted!  The provider will contact you soon."
            );
            fetchRequestDetails();
          } catch (error) {
            Alert.alert("Error", "Failed to accept quotation");
          } finally {
            setAcceptingQuote(null);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
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
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#007AFF" />
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
            <View style={styles.statusBadge}>
              <Ionicons
                name={getStatusIcon(request.status)}
                size={16}
                color={getStatusColor(request.status)}
              />
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

          {request.description && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.sectionContent}>{request.description}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={18} color="#007AFF" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{request.location}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar" size={18} color="#4CAF50" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Requested On</Text>
                <Text style={styles.infoValue}>
                  {new Date(request.created_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Ionicons
                name="alert-circle"
                size={18}
                color={getPriorityColor(request.priority)}
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Priority</Text>
                <Text style={styles.infoValue}>
                  {request.priority.charAt(0).toUpperCase() +
                    request.priority.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Images Section */}
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
              {request.images.map((image: any, index: number) => (
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

        {/* Quotations Section */}
        <View style={styles.section}>
          <View style={styles.quotationsHeader}>
            <Text style={styles.sectionTitle}>
              Quotations ({quotations.length})
            </Text>
            {quotations.length === 0 && (
              <Text style={styles.waitingText}>Waiting for quotes... </Text>
            )}
          </View>

          {quotations.length > 0 ? (
            quotations.map((quote) => (
              <View key={quote.id} style={styles.quotationCard}>
                <View style={styles.quotationHeader}>
                  <View>
                    <Text style={styles.providerName}>
                      {quote.business_name}
                    </Text>
                    <Text style={styles.providerDetail}>
                      {quote.provider_name}
                    </Text>
                  </View>
                  <View style={styles.quoteStatus}>
                    <Text style={styles.quoteStatusText}>
                      {quote.status === "pending"
                        ? "Pending"
                        : quote.status.charAt(0).toUpperCase() +
                          quote.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.quotationDetails}>
                  <QuotationDetail
                    icon="cash"
                    label="Quoted Amount"
                    value={`₹${quote.amount.toLocaleString()}`}
                  />
                  <QuotationDetail
                    icon="time"
                    label="Installation Days"
                    value={`${quote.installation_days} days`}
                  />
                  <QuotationDetail
                    icon="navigate"
                    label="Distance"
                    value={`${quote.distance_km.toFixed(1)} km`}
                  />
                </View>

                {quote.notes && (
                  <View style={styles.notesSection}>
                    <Text style={styles.notesLabel}>Providers Notes</Text>
                    <Text style={styles.notesText}>{quote.notes}</Text>
                  </View>
                )}

                {quote.status === "pending" && (
                  <View style={styles.quotationActions}>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() =>
                        Alert.alert("Rejected", "Quotation rejected")
                      }
                    >
                      <Ionicons name="close" size={18} color="#f44336" />
                      <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      disabled={acceptingQuote === quote.id}
                      onPress={() => handleAcceptQuotation(quote.id)}
                    >
                      {acceptingQuote === quote.id ? (
                        <ActivityIndicator color="white" size={18} />
                      ) : (
                        <>
                          <Ionicons name="checkmark" size={18} color="white" />
                          <Text style={styles.acceptButtonText}>Accept</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyQuotes}>
              <Ionicons name="document-outline" size={40} color="#ccc" />
              <Text style={styles.emptyQuotesText}>
                No quotations yet. Service providers will send their quotes
                soon.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.spacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

function QuotationDetail({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={16} color="#007AFF" />
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

function getStatusIcon(status: string): any {
  const statusIcons: { [key: string]: any } = {
    pending: "time",
    assigned: "person-add",
    quoted: "receipt",
    accepted: "checkmark-circle",
    completed: "checkmark-done-circle",
    rejected: "close-circle",
    cancelled: "ban",
  };
  return statusIcons[status] || "help-circle";
}

function getStatusColor(status: string): string {
  const statusColors: { [key: string]: string } = {
    pending: "#FF9500",
    assigned: "#2196F3",
    quoted: "#9C27B0",
    accepted: "#4CAF50",
    completed: "#4CAF50",
    rejected: "#f44336",
    cancelled: "#999",
  };
  return statusColors[status] || "#666";
}

function getPriorityColor(priority: string): string {
  const colors: { [key: string]: string } = {
    low: "#4CAF50",
    medium: "#FF9500",
    high: "#FF5722",
    urgent: "#f44336",
  };
  return colors[priority] || "#666";
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
  errorButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  errorButtonText: {
    color: "white",
    fontWeight: "600",
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
    color: "#007AFF",
    fontWeight: "500",
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
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
  quotationsHeader: {
    marginBottom: 16,
  },
  waitingText: {
    fontSize: 12,
    color: "#FF9500",
    fontWeight: "500",
  },
  quotationCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  quotationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  providerName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  providerDetail: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  quoteStatus: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  quoteStatusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#007AFF",
  },
  quotationDetails: {
    gap: 10,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
    fontWeight: "700",
    color: "#333",
    marginTop: 2,
  },
  notesSection: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  notesText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  quotationActions: {
    flexDirection: "row",
    gap: 10,
  },
  rejectButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f44336",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  rejectButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#f44336",
  },
  acceptButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  acceptButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "white",
  },
  emptyQuotes: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyQuotesText: {
    fontSize: 13,
    color: "#999",
    marginTop: 12,
    textAlign: "center",
  },
  spacing: {
    height: 20,
  },
});
