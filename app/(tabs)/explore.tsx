import { StyleSheet, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function CampusInfoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#EEF4FF", dark: "#0A122C" }}
      headerImage={
        <IconSymbol size={280} color="#7C9EFF" name="graduationcap.fill" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Campus info</ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Student support</ThemedText>
        <ThemedText>Academic office: 9:00 AM–5:00 PM</ThemedText>
        <ThemedText>IT help desk: support@school.edu</ThemedText>
        <ThemedText>Library access: available for all students</ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Quick reminders</ThemedText>
        <View style={styles.listItem}>
          <ThemedText>• Submit course registration before Friday.</ThemedText>
        </View>
        <View style={styles.listItem}>
          <ThemedText>• Keep your email verified for portal access.</ThemedText>
        </View>
        <View style={styles.listItem}>
          <ThemedText>• Always use the newest OTP code when you sign in.</ThemedText>
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -40,
    right: -20,
    position: "absolute",
    opacity: 0.15,
    transform: [{ rotate: "-15deg" }],
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
    marginTop: 8,
  },
  card: {
    gap: 12,
    marginBottom: 16,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.08)",
    backgroundColor: "#FFFFFF",
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  listItem: {
    paddingVertical: 4,
  },
});
