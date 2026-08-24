// app/screens/LoginPasswordScreen.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from "../../lib/supabase";
import { showToast } from "../../lib/toast";
import { useAuth } from "../../lib/useAuth";

export default function LoginPasswordScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { setOtpState } = useAuth();

  const validateInputs = () => {
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return false;
    }

    if (!password) {
      setError("Password is required");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setError("");

    try {
      const normalizedEmail = email.trim().toLowerCase();

      // Step 1: Verify email/password credentials
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

      if (signInError) {
        const message =
          signInError.message === "Invalid login credentials"
            ? "Email or password is incorrect"
            : signInError.message;

        setError(message);
        showToast(message, "error");
        setLoading(false);
        return;
      }

      if (!data?.user) {
        const message = "Authentication failed. Please try again.";
        setError(message);
        showToast(message, "error");
        setLoading(false);
        return;
      }

      await supabase.auth.signOut();

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: false,
        },
      });

      if (otpError) {
        const message = otpError.message;
        setError(message);
        showToast(message, "error");
        setLoading(false);
        return;
      }

      setOtpState(normalizedEmail);
      showToast("Verification code sent to your email.", "success");

      router.push({
        pathname: "/(auth)/verify",
        params: { email: normalizedEmail },
      });
    } catch (err) {
      const errorMsg = "An unexpected error occurred. Please try again.";
      setError(errorMsg);
      showToast(errorMsg, "error");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <View style={styles.card}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>C</Text>
        </View>

        <Text style={styles.eyebrow}>Campus Access Portal</Text>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Sign in with your student credentials to access your portal.
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.label}>Email address</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="student@school.edu"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError("");
          }}
          style={styles.input}
          placeholderTextColor="#7a89a5"
          editable={!loading}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError("");
            }}
            style={styles.passwordInput}
            placeholderTextColor="#7a89a5"
            editable={!loading}
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleText}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </Pressable>
        </View>

        <Pressable
          disabled={loading}
          onPress={handleLogin}
          style={[styles.button, loading && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>
            {loading ? "Signing in..." : "Sign in"}
          </Text>
        </Pressable>

        <Text style={styles.metaText}>
          Secure 2-factor authentication • Email + Password + OTP
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
  errorText: {
    fontSize: 14,
    color: "#d64545",
    backgroundColor: "#ffe6e6",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontWeight: "600",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a2640",
    marginBottom: 8,
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
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dfe8fb",
    borderRadius: 14,
    backgroundColor: "#f8faff",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1a2640",
  },
  toggleButton: {
    paddingHorizontal: 8,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2457d6",
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
    marginBottom: 12,
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
    marginTop: 8,
    textAlign: "center",
    color: "#6d7b93",
    fontSize: 11,
  },
});
