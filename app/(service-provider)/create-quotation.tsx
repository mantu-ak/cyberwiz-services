import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface RequestDetails {
  id: number;
  title: string;
  location: string;
  description: string;
  distance: number;
  customer_name: string;
}

export default function CreateQuotationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const requestId = parseInt(params.requestId as string);

  const [request, setRequest] = useState<RequestDetails>({
    id: requestId,
    title: "CCTV Installation in Living Room",
    location: "123 Main St, City",
    description: "Need to install 4 CCTV cameras with night vision",
    distance: 2.5,
    customer_name: "John Doe",
  });

  const [quotation, setQuotation] = useState({
    amount: "",
    installationDays: "",
    notes: "",
    terms: "",
  });

  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!quotation.amount || !quotation.installationDays) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      // Call API to create quotation
      // await quotationAPI.create({
      //   request_id: requestId,
      //   amount:  parseFloat(quotation.amount),
      //   installation_days: parseInt(quotation.installationDays),
      //   notes: quotation.notes,
      // });

      Alert.alert("Success", "Quotation sent to customer!", [
        {
          text: "View Requests",
          onPress: () => router.replace("/(service-provider)/requests"),
        },
        {
          text: "Done",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to create quotation"
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (): number => {
    const amount = parseFloat(quotation.amount) || 0;
    return amount;
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
          <Text style={styles.title}>Create Quotation</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Request Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Request Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Title</Text>
              <Text style={styles.summaryValue}>{request.title}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Customer</Text>
              <Text style={styles.summaryValue}>{request.customer_name}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Location</Text>
              <Text style={styles.summaryValue}>{request.location}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Distance</Text>
              <Text style={styles.summaryValue}>{request.distance} km</Text>
            </View>
            {request.description && (
              <>
                <View style={styles.divider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Description</Text>
                  <Text style={styles.summaryValue}>{request.description}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Quotation Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quotation Details</Text>

          {/* Amount */}
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Text style={styles.label}>
                Quoted Amount <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.hint}>Enter amount in rupees</Text>
            </View>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                value={quotation.amount}
                onChangeText={(text) =>
                  setQuotation({ ...quotation, amount: text })
                }
                keyboardType="decimal-pad"
                editable={!loading}
              />
            </View>
          </View>

          {/* Installation Days */}
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Text style={styles.label}>
                Installation Duration <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.hint}>Number of days required</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Number of days"
                value={quotation.installationDays}
                onChangeText={(text) =>
                  setQuotation({ ...quotation, installationDays: text })
                }
                keyboardType="number-pad"
                editable={!loading}
              />
              <Text style={styles.inputSuffix}>days</Text>
            </View>
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Text style={styles.label}>Notes for Customer</Text>
              <Text style={styles.hint}>
                Add any special details or requirements
              </Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g., Installation includes cable management, testing, and documentation"
              value={quotation.notes}
              onChangeText={(text) =>
                setQuotation({ ...quotation, notes: text })
              }
              multiline
              numberOfLines={4}
              editable={!loading}
            />
          </View>
        </View>

        {/* Cost Breakdown */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.collapsibleHeader}
            onPress={() =>
              setExpandedSection(
                expandedSection === "breakdown" ? null : "breakdown"
              )
            }
          >
            <Text style={styles.sectionTitle}>Cost Breakdown</Text>
            <Ionicons
              name={
                expandedSection === "breakdown" ? "chevron-up" : "chevron-down"
              }
              size={20}
              color="#9C27B0"
            />
          </TouchableOpacity>

          {expandedSection === "breakdown" && (
            <View style={styles.breakdownContainer}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Labour Cost</Text>
                <Text style={styles.breakdownValue}>
                  ₹{quotation.amount || "0"}
                </Text>
              </View>
              <View style={styles.breakdownDivider} />
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Travel Allowance</Text>
                <Text style={styles.breakdownValue}>₹0</Text>
              </View>
              <View style={styles.breakdownDivider} />
              <View style={[styles.breakdownRow, styles.breakdownTotal]}>
                <Text style={styles.breakdownTotalLabel}>Total Amount</Text>
                <Text style={styles.breakdownTotalValue}>
                  ₹{calculateTotal() || "0"}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Terms & Conditions */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.collapsibleHeader}
            onPress={() =>
              setExpandedSection(expandedSection === "terms" ? null : "terms")
            }
          >
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>
            <Ionicons
              name={expandedSection === "terms" ? "chevron-up" : "chevron-down"}
              size={20}
              color="#9C27B0"
            />
          </TouchableOpacity>

          {expandedSection === "terms" && (
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                • Payment Terms: 50% advance, 50% on completion
              </Text>
              <Text style={styles.termsText}>
                • Timeline: Installation will be completed within the mentioned
                days
              </Text>
              <Text style={styles.termsText}>
                • Warranty: All equipment comes with manufacturer warranty
              </Text>
              <Text style={styles.termsText}>
                • Cancellation: 24 hours notice required for cancellation
              </Text>
              <Text style={styles.termsText}>
                • Support: 30 days free technical support included
              </Text>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="send" size={20} color="white" />
              <Text style={styles.submitButtonText}>Send Quotation</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.spacing} />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
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
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputHeader: {
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  required: {
    color: "#f44336",
  },
  hint: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "700",
    color: "#9C27B0",
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#333",
  },
  inputSuffix: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  textArea: {
    textAlignVertical: "top",
    paddingVertical: 12,
  },
  collapsibleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  breakdownContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 8,
    padding: 16,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  breakdownLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 8,
  },
  breakdownTotal: {
    backgroundColor: "#F3E5F5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 4,
    borderRadius: 8,
  },
  breakdownTotalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  breakdownTotalValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9C27B0",
  },
  termsContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 8,
    padding: 14,
  },
  termsText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
    marginBottom: 8,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9C27B0",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  spacing: {
    height: 20,
  },
});
