import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { login } from "@/utils/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { saveParent } from "@/utils/storage";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const res = await login({ email, password });

      if (res.parentId) {
        await saveParent(res.parentId);
        router.replace("/(dashboard)/home");
      } else {
        alert(res.error || "Login failed");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* App Branding */}
      <Text style={styles.appName}>NeuroSense</Text>
      <Text style={styles.subtitle}>Parent Login</Text>

      <View style={styles.card}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button
          title={loading ? "Logging in..." : "Login"}
          onPress={onLogin}
          disabled={!email || !password || loading}
        />

        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => router.push("/(auth)/signup")}
        >
          <Text style={styles.signupText}>
            New here? <Text style={styles.signupBold}>Create account</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f7ff",
    justifyContent: "center",
  },

  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4f7cff",
    textAlign: "center",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  signupLink: {
    marginTop: 12,
    alignItems: "center",
  },

  signupText: {
    color: "#555",
  },

  signupBold: {
    color: "#4f7cff",
    fontWeight: "600",
  },
});
