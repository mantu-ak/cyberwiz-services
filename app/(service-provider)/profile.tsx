import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
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

export default function ServiceProviderProfileScreen() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    businessName: "Tech Solutions CCTV",
    ownerName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    experience: "5",
    description:
      "Professional CCTV installation and maintenance services with 5 years of experience.",
  });
  const [tempData, setTempData] = useState(profileData);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        Alert.alert("Success", "Profile photo updated");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleSaveProfile = async () => {
    if (!tempData.businessName || !tempData.ownerName) {
      Alert.alert("Validation Error", "Please fill in required fields");
      return;
    }

    try {
      setEditing(true);
      // Call API to update profile
      setProfileData(tempData);
      updateUser({
        ...user!,
        name: tempData.ownerName,
        email: tempData.email,
        phone: tempData.phone,
        location: tempData.location,
      });
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setEditing(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout? ", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            onPress={() => {
              if (isEditing) {
                setTempData(profileData);
                setIsEditing(false);
              } else {
                setTempData(profileData);
                setIsEditing(true);
              }
            }}
          >
            <Text style={styles.editButton}>
              {isEditing ? "Cancel" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Picture Section */}
        <View style={styles.profilePictureSection}>
          <TouchableOpacity onPress={handlePickImage} disabled={!isEditing}>
            {user?.profile_image ? (
              <Image
                source={{ uri: user.profile_image }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Ionicons name="briefcase" size={50} color="white" />
              </View>
            )}
            {isEditing && (
              <View style={styles.cameraOverlay}>
                <Ionicons name="camera" size={24} color="white" />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.profileNameSection}>
            <Text style={styles.profileName}>{profileData.businessName}</Text>
            <Text style={styles.profileStatus}>Service Provider Account</Text>
            <View style={styles.approvalBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
              <Text style={styles.approvalText}>Verified</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatCard label="Jobs" value="8" />
          <StatCard label="Completed" value="7" />
          <StatCard label="Rating" value="4.7" />
        </View>

        {/* Profile Form */}
        <View style={styles.formSection}>
          <ProfileField
            label="Business Name"
            icon="storefront"
            value={isEditing ? tempData.businessName : profileData.businessName}
            editable={isEditing}
            onChangeText={(text: string) =>
              setTempData({ ...tempData, businessName: text })
            }
          />

          <ProfileField
            label="Owner Name"
            icon="person"
            value={isEditing ? tempData.ownerName : profileData.ownerName}
            editable={isEditing}
            onChangeText={(text: string) =>
              setTempData({ ...tempData, ownerName: text })
            }
          />

          <ProfileField
            label="Email Address"
            icon="mail"
            value={isEditing ? tempData.email : profileData.email}
            editable={isEditing && false}
            keyboardType="email-address"
          />

          <ProfileField
            label="Phone Number"
            icon="call"
            value={isEditing ? tempData.phone : profileData.phone}
            editable={isEditing}
            onChangeText={(text: string) =>
              setTempData({ ...tempData, phone: text })
            }
            keyboardType="phone-pad"
          />

          <ProfileField
            label="Location"
            icon="location"
            value={isEditing ? tempData.location : profileData.location}
            editable={isEditing}
            onChangeText={(text: string) =>
              setTempData({ ...tempData, location: text })
            }
          />

          <ProfileField
            label="Years of Experience"
            icon="briefcase"
            value={isEditing ? tempData.experience : profileData.experience}
            editable={isEditing}
            onChangeText={(text: string) =>
              setTempData({ ...tempData, experience: text })
            }
            keyboardType="number-pad"
          />

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={[styles.fieldInput, styles.textArea]}
              value={isEditing ? tempData.description : profileData.description}
              editable={isEditing}
              onChangeText={(text) =>
                setTempData({ ...tempData, description: text })
              }
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {isEditing && (
          <TouchableOpacity
            style={[styles.saveButton, editing && styles.saveButtonDisabled]}
            onPress={handleSaveProfile}
            disabled={editing}
          >
            {editing ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="white" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          <ServiceBadge name="CCTV Installation" onPress={() => {}} />
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <SettingItem
            icon="notifications"
            label="Notifications"
            subtitle="Manage notification preferences"
            onPress={() =>
              Alert.alert("Coming Soon", "Notification settings coming soon")
            }
          />

          <SettingItem
            icon="document-text"
            label="Terms & Conditions"
            subtitle="Read our terms"
            onPress={() =>
              Alert.alert(
                "Terms & Conditions",
                "Terms & Conditions content here"
              )
            }
          />

          <SettingItem
            icon="shield-checkmark"
            label="Privacy Policy"
            subtitle="Read our privacy policy"
            onPress={() =>
              Alert.alert("Privacy Policy", "Privacy Policy content here")
            }
          />
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>Account</Text>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="white" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Cyberwiz Services v1.0.0</Text>
          <Text style={styles.copyrightText}>
            © 2025 Cyberwiz Services. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileField({ label, icon, ...props }: any) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldInputContainer}>
        <Ionicons name={icon} size={18} color="#999" style={styles.fieldIcon} />
        <TextInput style={styles.fieldInput} {...props} />
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

function ServiceBadge({
  name,
  onPress,
}: {
  name: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.serviceBadge}>
      <Ionicons name="checkmark" size={16} color="#9C27B0" />
      <Text style={styles.serviceName}>{name}</Text>
    </View>
  );
}

function SettingItem({
  icon,
  label,
  subtitle,
  onPress,
}: {
  icon: any;
  label: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon} size={20} color="#9C27B0" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  editButton: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9C27B0",
  },
  profilePictureSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#9C27B0",
  },
  profilePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#9C27B0",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FF9500",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  profileNameSection: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  profileStatus: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  approvalBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  approvalText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4CAF50",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#9C27B0",
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
  },
  formSection: {
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
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  fieldInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 12,
  },
  fieldIcon: {
    marginRight: 8,
  },
  fieldInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#333",
  },
  textArea: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
  dangerTitle: {
    color: "#f44336",
  },
  serviceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3E5F5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9C27B0",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  settingSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF9500",
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  versionSection: {
    alignItems: "center",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginTop: 20,
  },
  versionText: {
    fontSize: 12,
    color: "#999",
  },
  copyrightText: {
    fontSize: 11,
    color: "#ccc",
    marginTop: 4,
  },
});
