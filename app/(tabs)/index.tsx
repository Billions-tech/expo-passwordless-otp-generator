// app/(tabs)/index.tsx
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/useAuth";

export default function HomeScreen() {
  const router = useRouter();
  const { session } = useAuth();

  const email = session?.user?.email ?? "student@school.edu";
  const userId = session?.user?.id ?? "ST-2048";

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/(auth)/request");
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#EEF4FF", dark: "#0A122C" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.heroImage}
        />
      }
    >
      <ThemedView style={styles.headerRow}>
        <View>
          <ThemedText style={styles.greeting}>Good morning</ThemedText>
          <ThemedText type="title">Student Portal</ThemedText>
        </View>
        <Pressable onPress={signOut} style={styles.logoutButton}>
          <ThemedText style={styles.logoutText}>Log out</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <ThemedText style={styles.avatarText}>S</ThemedText>
        </View>
        <View style={styles.profileTextWrap}>
          <ThemedText type="subtitle">{email}</ThemedText>
          <ThemedText style={styles.mutedText}>Student ID: {userId}</ThemedText>
        </View>
      </ThemedView>

      <View style={styles.statsRow}>
        <ThemedView style={[styles.statCard, styles.primaryCard]}>
          <ThemedText style={styles.statLabel}>Attendance</ThemedText>
          <ThemedText style={styles.statValue}>92%</ThemedText>
        </ThemedView>

        <ThemedView style={[styles.statCard, styles.secondaryCard]}>
          <ThemedText style={styles.statLabelSecondary}>Classes</ThemedText>
          <ThemedText style={styles.statValueSecondary}>5</ThemedText>
        </ThemedView>
      </View>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Quick actions</ThemedText>
        <View style={styles.row}>
          <Pressable style={[styles.btn, styles.btnPrimary]}>
            <ThemedText style={styles.btnText}>Timetable</ThemedText>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnSecondary]}>
            <ThemedText style={styles.btnTextSecondary}>Results</ThemedText>
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable style={[styles.btn, styles.btnOutline]}>
            <ThemedText style={styles.btnOutlineText}>Support</ThemedText>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnSecondary]}>
            <ThemedText style={styles.btnTextSecondary}>Profile</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  greeting: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
    marginBottom: 2,
  },
  heroImage: {
    height: 180,
    width: 280,
    bottom: -20,
    right: -20,
    position: "absolute",
    opacity: 0.12,
  },
  logoutButton: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "700",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.06)",
    marginBottom: 20,
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#3B82F6",
    fontSize: 20,
    fontWeight: "800",
  },
  profileTextWrap: {
    flex: 1,
  },
  mutedText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 24,
    padding: 18,
    minHeight: 100,
    justifyContent: "center",
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  primaryCard: {
    backgroundColor: "#3B82F6",
  },
  secondaryCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.06)",
  },
  statLabel: {
    color: "#E0F2FE",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
  },
  statLabelSecondary: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  statValueSecondary: {
    color: "#1E293B",
    fontSize: 32,
    fontWeight: "800",
  },
  card: {
    gap: 16,
    marginBottom: 20,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.06)",
    backgroundColor: "#FFFFFF",
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    gap: 14,
  },
  btn: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: {
    backgroundColor: "#3B82F6",
  },
  btnSecondary: {
    backgroundColor: "#F1F5F9",
  },
  btnOutline: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  btnTextSecondary: {
    color: "#475569",
    fontWeight: "700",
    fontSize: 14,
  },
  btnOutlineText: {
    color: "#1E293B",
    fontWeight: "700",
    fontSize: 14,
  },
});
