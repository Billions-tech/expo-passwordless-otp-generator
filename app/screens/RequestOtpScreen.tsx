// screens/RequestOtpScreen.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from "../../lib/supabase";
import { showToast } from "../../lib/toast";

export default function RequestOtpScreen() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const router = useRouter();

  async function sendOtp() {
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      showToast("Enter your school email address.", "error");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(normalized)) {
      showToast("Enter a valid email address.", "error");
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: normalized,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        const message =
          error.status === 500
            ? "Email delivery is temporarily unavailable. Check Supabase Auth email settings."
            : error.message;
        showToast(message, "error");
        return;
      }

      showToast("Your 6-digit sign-in code is on its way.", "success");
      router.push({
        pathname: "/(auth)/verify",
        params: { email: normalized },
      });
    } catch (requestError) {
      console.error("OTP request error:", requestError);
      showToast(
        "Could not reach the sign-in service. Check your connection and try again.",
        "error",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <View style={styles.card}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>C</Text>
        </View>

        <Text style={styles.eyebrow}>Campus Access</Text>
        <Text style={styles.title}>Your campus, unlocked</Text>
        <Text style={styles.subtitle}>
          Enter your university email and we&apos;ll send a secure sign-in code.
        </Text>

        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="student@school.edu"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#7a89a5"
        />

        <Pressable
          disabled={sending}
          onPress={sendOtp}
          style={[styles.button, sending && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>
            {sending ? "Sending code…" : "Send login code"}
          </Text>
        </Pressable>

        <Text style={styles.metaText}>
          Secure email sign-in • no password required
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#edf4ff",
    justifyContent: "center",
    padding: 24,
  },
  glowOne: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#9db9ff",
    opacity: 0.32,
    top: 80,
    left: -40,
  },
  glowTwo: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#cfe1ff",
    opacity: 0.45,
    bottom: 50,
    right: -60,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 28,
    padding: 26,
    shadowColor: "#202b4d",
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
    zIndex: 1,
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#2457d6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },
  eyebrow: {
    color: "#2457d6",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#101b34",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#4d5e7a",
    lineHeight: 22,
    marginBottom: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dfe8fb",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#f8faff",
    fontSize: 16,
    color: "#1a2640",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#2457d6",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#2457d6",
    shadowOpacity: 0.24,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  metaText: {
    marginTop: 12,
    textAlign: "center",
    color: "#6d7b93",
    fontSize: 12,
  },
});
