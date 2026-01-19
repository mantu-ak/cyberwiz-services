import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { useAuth } from "../../contexts/AuthContext";
import { serviceProviderAPI, serviceTypeAPI } from "../../services/api";

interface ServiceType {
  id: number;
  name: string;
  description: string;
}

export default function ServiceProviderRegisterScreen() {
  const router = useRouter();
  const { register, user } = useAuth();
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    businessName: "",
    ownerName: "",
    ownerEmail: "",
    phoneNumber: "",
    location: "",
    description: "",
  });
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [businessLicense, setBusinessLicense] = useState<any>(null);
  const [businessLogo, setBusinessLogo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    fetchServiceTypes();
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
      setLoadingServices(false);
    }
  };

  const pickImage = async (type: "license" | "logo") => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const image = {
          uri: result.assets[0].uri,
          name: `${type}_${Date.now()}.jpg`,
          type: "image/jpeg",
        };

        if (type === "license") {
          setBusinessLicense(image);
        } else {
          setBusinessLogo(image);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleRegister = async () => {
    // Validation
    if (!formData.email || !formData.password || !formData.businessName) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    if (selectedServices.length === 0) {
      Alert.alert("Validation Error", "Please select at least one service");
      return;
    }

    try {
      setLoading(true);

      // First register as user
      await register({
        name: formData.ownerName,
        email: formData.email,
        password: formData.password,
        phone: formData.phoneNumber,
        location: formData.location,
      });

      // Then register as service provider
      const formDataMultipart = new FormData();
      formDataMultipart.append("business_name", formData.businessName);
      formDataMultipart.append("owner_name", formData.ownerName);
      formDataMultipart.append("owner_email", formData.ownerEmail);
      formDataMultipart.append("phone_number", formData.phoneNumber);
      formDataMultipart.append("location", formData.location);
      formDataMultipart.append("description", formData.description);

      if (businessLicense) {
        formDataMultipart.append("business_license", businessLicense);
      }

      if (businessLogo) {
        formDataMultipart.append("business_logo", businessLogo);
      }

      selectedServices.forEach((serviceId) => {
        formDataMultipart.append("service_type_ids[]", serviceId.toString());
      });

      await serviceProviderAPI.register(formDataMultipart as any);

      Alert.alert(
        "Success",
        "Registration submitted!  Your account will be reviewed by our team."
      );
      // Navigation happens automatically via AuthContext
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error.response?.data?.error || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingServices) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#9C27B0" />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="briefcase" size={50} color="#9C27B0" />
          <Text style={styles.title}>Become a Service Provider</Text>
          <Text style={styles.subtitle}>Register your business</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <SectionTitle title="Account Details" />

          <InputField
            label="Email Address"
            icon="mail"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text: string) =>
              setFormData({ ...formData, email: text })
            }
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <InputField
            label="Password"
            icon="lock"
            placeholder="Create a password"
            value={formData.password}
            onChangeText={(text: string) =>
              setFormData({ ...formData, password: text })
            }
            secureTextEntry
            editable={!loading}
          />

          <SectionTitle title="Business Information" />

          <InputField
            label="Business Name"
            icon="storefront"
            placeholder="Enter business name"
            value={formData.businessName}
            onChangeText={(text: string) =>
              setFormData({ ...formData, businessName: text })
            }
            editable={!loading}
          />

          <InputField
            label="Owner Name"
            icon="person"
            placeholder="Enter owner name"
            value={formData.ownerName}
            onChangeText={(text: string) =>
              setFormData({ ...formData, ownerName: text })
            }
            editable={!loading}
          />

          <InputField
            label="Owner Email"
            icon="mail"
            placeholder="Enter owner email"
            value={formData.ownerEmail}
            onChangeText={(text: string) =>
              setFormData({ ...formData, ownerEmail: text })
            }
            keyboardType="email-address"
            editable={!loading}
          />

          <InputField
            label="Phone Number"
            icon="call"
            placeholder="Enter phone number"
            value={formData.phoneNumber}
            onChangeText={(text: string) =>
              setFormData({ ...formData, phoneNumber: text })
            }
            keyboardType="phone-pad"
            editable={!loading}
          />

          <InputField
            label="Location"
            icon="location"
            placeholder="Enter business location"
            value={formData.location}
            onChangeText={(text: string) =>
              setFormData({ ...formData, location: text })
            }
            editable={!loading}
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your business"
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              multiline
              numberOfLines={4}
              editable={!loading}
            />
          </View>

          <SectionTitle title="Services" />

          <Text style={styles.label}>Select Services You Provide</Text>
          {serviceTypes.map((service) => (
            <ServiceTypeCheckbox
              key={service.id}
              service={service}
              isSelected={selectedServices.includes(service.id)}
              onPress={() => {
                if (selectedServices.includes(service.id)) {
                  setSelectedServices(
                    selectedServices.filter((id) => id !== service.id)
                  );
                } else {
                  setSelectedServices([...selectedServices, service.id]);
                }
              }}
            />
          ))}

          <SectionTitle title="Documents" />

          {/* Business License */}
          <TouchableOpacity
            style={styles.fileUploadButton}
            onPress={() => pickImage("license")}
            disabled={loading}
          >
            <Ionicons
              name={businessLicense ? "checkmark-circle" : "document"}
              size={24}
              color={businessLicense ? "#4CAF50" : "#9C27B0"}
            />
            <View style={styles.fileUploadText}>
              <Text style={styles.fileUploadLabel}>Business License</Text>
              <Text style={styles.fileUploadDescription}>
                {businessLicense ? businessLicense.name : "Tap to upload"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Business Logo */}
          <TouchableOpacity
            style={styles.fileUploadButton}
            onPress={() => pickImage("logo")}
            disabled={loading}
          >
            <Ionicons
              name={businessLogo ? "checkmark-circle" : "image"}
              size={24}
              color={businessLogo ? "#4CAF50" : "#9C27B0"}
            />
            <View style={styles.fileUploadText}>
              <Text style={styles.fileUploadLabel}>Business Logo</Text>
              <Text style={styles.fileUploadDescription}>
                {businessLogo ? businessLogo.name : "Tap to upload"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.buttonText}>Submit Registration</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Sign In Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function InputField({ label, icon, secureTextEntry, ...props }: any) {
  const [showPassword, setShowPassword] = React.useState(!secureTextEntry);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name={icon} size={20} color="#999" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          secureTextEntry={secureTextEntry && !showPassword}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function ServiceTypeCheckbox({
  service,
  isSelected,
  onPress,
}: {
  service: ServiceType;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.checkboxContainer, isSelected && styles.checkboxSelected]}
      onPress={onPress}
    >
      <Ionicons
        name={isSelected ? "checkbox" : "checkbox-outline"}
        size={24}
        color={isSelected ? "#9C27B0" : "#999"}
      />
      <View style={styles.checkboxText}>
        <Text style={styles.checkboxLabel}>{service.name}</Text>
        <Text style={styles.checkboxDescription}>{service.description}</Text>
      </View>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  form: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    textAlignVertical: "top",
  },
  eyeIcon: {
    padding: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 8,
    gap: 12,
  },
  checkboxSelected: {
    borderColor: "#9C27B0",
    backgroundColor: "#F3E5F5",
  },
  checkboxText: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  checkboxDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  fileUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 12,
    gap: 12,
  },
  fileUploadText: {
    flex: 1,
  },
  fileUploadLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  fileUploadDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  button: {
    backgroundColor: "#9C27B0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  signInLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9C27B0",
  },
});
