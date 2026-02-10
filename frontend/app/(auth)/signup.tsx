import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { signup } from "@/utils/api";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { saveParent } from "@/utils/storage";

const Signup = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);

      const res = await signup({ name, email, password });

      if (res.parentId) {
        await saveParent(res.parentId);
        router.replace("/(auth)/child");
      } else {
        alert(res.error || "Signup failed");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Branding */}
      <Text style={styles.appName}>NeuroSense</Text>
      <Text style={styles.subtitle}>Create Parent Account</Text>

      <View style={styles.card}>
        <Input label="Full Name" value={name} onChangeText={setName} />

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
          title={loading ? "Creating account..." : "Signup"}
          onPress={onSignup}
          disabled={!name || !email || !password || loading}
        />

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Signup;

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

  loginLink: {
    marginTop: 12,
    alignItems: "center",
  },

  loginText: {
    color: "#555",
  },

  loginBold: {
    color: "#4f7cff",
    fontWeight: "600",
  },
});
