// screens/VerifyOtpScreen.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from "../../lib/supabase";
import { showToast } from "../../lib/toast";
import { useAuth } from "../../lib/useAuth";

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { email = "" } = useLocalSearchParams<{ email?: string }>();
  const emailStr = String(email);
  const { clearOtpState } = useAuth();

  const [token, setToken] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  async function resendCode() {
    if (!emailStr || resending) return;

    setResending(true);
    const { error: resendError } = await supabase.auth.signInWithOtp({
      email: emailStr,
      options: { shouldCreateUser: true },
    });
    setResending(false);

    if (resendError) {
      showToast(resendError.message, "error");
      return;
    }

    setToken("");
    setError("");
    showToast("A new verification code has been sent.", "success");
  }

  async function handleVerifyOtp() {
    if (!token || token.length !== 6) {
      const message = "Please enter all 6 digits";
      setError(message);
      showToast(message, "error");
      return;
    }

    setVerifying(true);
    setError("");

    try {
      const { data, error: otpError } = await supabase.auth.verifyOtp({
        email: emailStr,
        token,
        type: "email",
      });

      if (otpError) {
        const message =
          otpError.message === "Token has expired"
            ? "Verification code has expired. Please sign in again."
            : otpError.message;

        setError(message);
        showToast(message, "error");
        setVerifying(false);
        return;
      }

      if (data?.session) {
        clearOtpState();
        showToast("Verification successful. Welcome back!", "success");
        router.replace("/(tabs)");
      } else {
        const message = "Invalid verification code";
        setError(message);
        showToast(message, "error");
        setVerifying(false);
      }
    } catch (err) {
      const message = "Verification failed. Please try again.";
      setError(message);
      showToast(message, "error");
      console.error("OTP verification error:", err);
      setVerifying(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <View style={styles.card}>
        <View style={styles.stepPill}>
          <Text style={styles.stepPillText}>Step 2 of 2</Text>
        </View>

        <Text style={styles.title}>Check your inbox</Text>
        <Text style={styles.subtitle}>Enter the 6-digit code we sent to</Text>
        <Text style={styles.email}>{emailStr || "your student email"}</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          placeholder="123456"
          keyboardType="number-pad"
          value={token}
          onChangeText={(text) => {
            setToken(text);
            setError("");
          }}
          maxLength={6}
          style={[styles.input, error ? styles.inputError : null]}
          placeholderTextColor="#7a89a5"
          editable={!verifying}
        />

        <Pressable
          disabled={verifying}
          onPress={handleVerifyOtp}
          style={[styles.button, verifying && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>
            {verifying ? "Verifying..." : "Verify and continue"}
          </Text>
        </Pressable>

        <Pressable
          disabled={resending || verifying}
          onPress={resendCode}
          style={styles.resendButton}
        >
          <Text style={styles.resendText}>
            {resending ? "Sending a new code..." : "Resend code"}
          </Text>
        </Pressable>

        <Text style={styles.metaText}>
          Your code expires soon. Never share it with anyone.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef4ff",
    justifyContent: "center",
    padding: 24,
  },
  glowOne: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#b9d5ff",
    opacity: 0.32,
    top: 70,
    left: -30,
  },
  glowTwo: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#dbeaff",
    opacity: 0.52,
    bottom: 40,
    right: -60,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 28,
    padding: 26,
    shadowColor: "#192b4d",
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
    zIndex: 1,
  },
  stepPill: {
    alignSelf: "flex-start",
    backgroundColor: "#e7efff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 14,
  },
  stepPillText: {
    color: "#2457d6",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#101b34",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#4d5e7a",
    marginBottom: 4,
  },
  email: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1d3557",
    marginBottom: 18,
  },
  errorText: {
    fontSize: 14,
    color: "#d64545",
    backgroundColor: "#ffe6e6",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#dfe8fb",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#f8faff",
    fontSize: 22,
    letterSpacing: 8,
    textAlign: "center",
    color: "#1a2640",
    marginBottom: 16,
  },
  inputError: {
    borderColor: "#d64545",
    backgroundColor: "#fff8f8",
  },
  button: {
    backgroundColor: "#0d8b5c",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#0d8b5c",
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    marginBottom: 12,
  },
  resendButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  resendText: {
    color: "#2457d6",
    fontSize: 14,
    fontWeight: "700",
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
    textAlign: "center",
    color: "#6d7b93",
    fontSize: 11,
  },
});
