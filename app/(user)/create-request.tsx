import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { serviceRequestAPI, serviceTypeAPI } from "../../services/api";

interface ServiceType {
  id: number;
  name: string;
  description: string;
}

interface SelectedImage {
  uri: string;
  name: string;
  type: string;
  imageType: "location" | "requirement" | "area_to_cover" | "other";
}

export default function CreateRequestScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();

  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedServiceType, setSelectedServiceType] = useState<number | null>(
    params.serviceTypeId ? parseInt(params.serviceTypeId as string) : null
  );
  const [showServicePicker, setShowServicePicker] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: user?.location || "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
  });

  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchServiceTypes();
    requestLocationPermission();
  }, []);

  const fetchServiceTypes = async () => {
    try {
      const response = await serviceTypeAPI.getAll();
      if (response.data.success) {
        setServiceTypes(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch service types:", error);
    } finally {
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setCoordinates({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.error("Failed to get location:", error);
    }
  };

  const pickImage = async (imageType: SelectedImage["imageType"]) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const image = {
          uri: result.assets[0].uri,
          name: `${imageType}_${Date.now()}.jpg`,
          type: "image/jpeg",
          imageType,
        };
        setSelectedImages([...selectedImages, image]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedServiceType) {
      Alert.alert("Validation Error", "Please select a service type");
      return;
    }

    if (!formData.title.trim()) {
      Alert.alert("Validation Error", "Please enter a request title");
      return;
    }

    if (selectedImages.length === 0) {
      Alert.alert("Validation Error", "Please add at least one image");
      return;
    }

    try {
      setSubmitting(true);

      const formDataMultipart = new FormData();
      formDataMultipart.append(
        "service_type_id",
        selectedServiceType.toString()
      );
      formDataMultipart.append("title", formData.title);
      formDataMultipart.append("description", formData.description);
      formDataMultipart.append("location", formData.location);
      formDataMultipart.append("priority", formData.priority);

      if (coordinates) {
        formDataMultipart.append("latitude", coordinates.latitude.toString());
        formDataMultipart.append("longitude", coordinates.longitude.toString());
      }

      selectedImages.forEach((image) => {
        formDataMultipart.append("images", {
          uri: image.uri,
          name: image.name,
          type: image.type,
        } as any);
        formDataMultipart.append("image_types", image.imageType);
      });

      const response = await serviceRequestAPI.create(formDataMultipart as any);

      if (response.data.success) {
        Alert.alert("Success", "Service request created successfully! ", [
          {
            text: "View Details",
            onPress: () =>
              router.push({
                pathname: "/(user)/my-requests",
              }),
          },
          {
            text: "Done",
            onPress: () => router.back(),
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to create request"
      );
    } finally {
      setSubmitting(false);
    }
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

  const selectedServiceName = serviceTypes.find(
    (s) => s.id === selectedServiceType
  )?.name;

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
          <Text style={styles.title}>Create Service Request</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Service Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Type *</Text>
          <TouchableOpacity
            style={styles.serviceSelector}
            onPress={() => setShowServicePicker(!showServicePicker)}
          >
            <View style={styles.serviceSelectorContent}>
              <Ionicons
                name="layers"
                size={20}
                color="#007AFF"
                style={styles.icon}
              />
              <Text style={styles.serviceSelectorText}>
                {selectedServiceName || "Select a service"}
              </Text>
            </View>
            <Ionicons
              name={showServicePicker ? "chevron-up" : "chevron-down"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>

          {showServicePicker && (
            <View style={styles.serviceDropdown}>
              {serviceTypes.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceOption,
                    selectedServiceType === service.id &&
                      styles.serviceOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedServiceType(service.id);
                    setShowServicePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.serviceOptionText,
                      selectedServiceType === service.id &&
                        styles.serviceOptionTextSelected,
                    ]}
                  >
                    {service.name}
                  </Text>
                  {selectedServiceType === service.id && (
                    <Ionicons name="checkmark" size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Request Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Request Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., CCTV installation in living room"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              editable={!submitting}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Provide more details about your requirement"
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              multiline
              numberOfLines={4}
              editable={!submitting}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <View style={styles.locationInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your location"
                value={formData.location}
                onChangeText={(text) =>
                  setFormData({ ...formData, location: text })
                }
                editable={!submitting}
              />
              {coordinates && (
                <View style={styles.gpsIcon}>
                  <Ionicons name="location" size={20} color="#4CAF50" />
                </View>
              )}
            </View>
            {coordinates && (
              <Text style={styles.helperText}>✓ Location captured</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityButtons}>
              {(["low", "medium", "high", "urgent"] as const).map(
                (priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      formData.priority === priority &&
                        styles.priorityButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, priority })}
                  >
                    <Text
                      style={[
                        styles.priorityButtonText,
                        formData.priority === priority &&
                          styles.priorityButtonTextSelected,
                      ]}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
        </View>

        {/* Images */}
        <View style={styles.section}>
          <View style={styles.imagesHeader}>
            <Text style={styles.sectionTitle}>Upload Photos *</Text>
            <Text style={styles.imagesCount}>
              {selectedImages.length} image(s)
            </Text>
          </View>

          {selectedImages.length > 0 && (
            <View style={styles.imagesList}>
              {selectedImages.map((image, index) => (
                <View key={index} style={styles.imageCard}>
                  <Image source={{ uri: image.uri }} style={styles.image} />
                  <View style={styles.imageLabel}>
                    <Text style={styles.imageLabelText}>{image.imageType}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={styles.imageUploadButtons}>
            <ImageUploadButton
              icon="camera"
              label="Take Photo"
              onPress={() => {
                // Camera functionality would be implemented here
                Alert.alert("Coming Soon", "Camera feature coming soon");
              }}
              disabled={submitting}
            />
            <ImageUploadButton
              icon="image"
              label="Upload Photo"
              onPress={() => pickImage("other")}
              disabled={submitting}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            submitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="send" size={20} color="white" />
              <Text style={styles.submitButtonText}>Submit Request</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.spacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ImageUploadButton({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: any;
  label: string;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.imageUploadButton,
        disabled && styles.imageUploadButtonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons name={icon} size={24} color="#007AFF" />
      <Text style={styles.imageUploadButtonText}>{label}</Text>
    </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  serviceSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  serviceSelectorContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  serviceSelectorText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  icon: {
    marginRight: 0,
  },
  serviceDropdown: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginTop: 8,
    overflow: "hidden",
  },
  serviceOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  serviceOptionSelected: {
    backgroundColor: "#E3F2FD",
  },
  serviceOptionText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  serviceOptionTextSelected: {
    color: "#007AFF",
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
  },
  textArea: {
    paddingVertical: 12,
    textAlignVertical: "top",
  },
  locationInputContainer: {
    position: "relative",
  },
  gpsIcon: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  helperText: {
    fontSize: 12,
    color: "#4CAF50",
    marginTop: 6,
    fontWeight: "500",
  },
  priorityButtons: {
    flexDirection: "row",
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "white",
    alignItems: "center",
  },
  priorityButtonSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#E3F2FD",
  },
  priorityButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  priorityButtonTextSelected: {
    color: "#007AFF",
  },
  imagesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  imagesCount: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  imagesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  imageCard: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
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
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 4,
  },
  imageLabelText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  removeImageButton: {
    position: "absolute",
    top: 4,
    right: 4,
  },
  imageUploadButtons: {
    flexDirection: "row",
    gap: 12,
  },
  imageUploadButton: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderStyle: "dashed",
    paddingVertical: 16,
    alignItems: "center",
    gap: 8,
  },
  imageUploadButtonDisabled: {
    opacity: 0.5,
  },
  imageUploadButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#007AFF",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
