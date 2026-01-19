import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function UserTypeSelectionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="logo-ionic" size={40} color="#007AFF" />
          <Text style={styles.title}>Cyberwiz Services</Text>
          <Text style={styles.subtitle}>Choose your account type</Text>
        </View>

        {/* User Type Cards */}
        <View style={styles.cardsContainer}>
          {/* Customer Card */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/(auth)/register")}
          >
            <View style={[styles.cardIcon, { backgroundColor: "#E3F2FD" }]}>
              <Ionicons name="person" size={40} color="#007AFF" />
            </View>
            <Text style={styles.cardTitle}>Customer</Text>
            <Text style={styles.cardDescription}>
              Request services in your area
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.getStarted}>Get Started</Text>
              <Ionicons name="arrow-forward" size={20} color="#007AFF" />
            </View>
          </TouchableOpacity>

          {/* Service Provider Card */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/(auth)/service-provider-register")}
          >
            <View style={[styles.cardIcon, { backgroundColor: "#F3E5F5" }]}>
              <Ionicons name="briefcase" size={40} color="#9C27B0" />
            </View>
            <Text style={styles.cardTitle}>Service Provider</Text>
            <Text style={styles.cardDescription}>
              Offer your services and grow your business
            </Text>
            <View style={styles.cardFooter}>
              <Text style={[styles.getStarted, { color: "#9C27B0" }]}>
                Get Started
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#9C27B0" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Already have account */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  cardsContainer: {
    gap: 16,
    marginVertical: 40,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  getStarted: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
});
