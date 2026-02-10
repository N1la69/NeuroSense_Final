import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { getParent, saveChild } from "@/utils/storage";
import { addChild } from "@/utils/api";
import Input from "@/components/Input";
import Button from "@/components/Button";

const ChildOnboard = () => {
  const router = useRouter();

  const [childName, setChildName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | "">("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const parentId = await getParent();

      if (!parentId) {
        alert("Parent session missing. Please login again.");
        router.replace("/(auth)/login");
        return;
      }

      const res = await addChild({
        parentId,
        childName,
        age: Number(age),
        gender,
      });

      if (res.childId) {
        await saveChild(res.childId);
        router.replace("/(dashboard)/home");
      } else {
        alert(res.error || "Failed to save child info");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const GenderOption = ({ label }: { label: "Male" | "Female" | "Other" }) => (
    <TouchableOpacity
      style={[styles.genderBox, gender === label && styles.genderSelected]}
      onPress={() => setGender(label)}
    >
      <Text
        style={[
          styles.genderText,
          gender === label && styles.genderTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.appName}>NeuroSense</Text>
      <Text style={styles.subtitle}>Child Information</Text>

      <View style={styles.card}>
        <Input
          label="Child Name"
          value={childName}
          onChangeText={setChildName}
        />

        <Input
          label="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderRow}>
          <GenderOption label="Male" />
          <GenderOption label="Female" />
          <GenderOption label="Other" />
        </View>

        <Button
          title={loading ? "Saving..." : "Continue"}
          onPress={onSubmit}
          disabled={!childName || !age || !gender || loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChildOnboard;

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

  label: {
    marginTop: 8,
    marginBottom: 6,
    color: "#444",
    fontWeight: "500",
  },

  genderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  genderBox: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 4,
    alignItems: "center",
  },

  genderSelected: {
    backgroundColor: "#4f7cff",
    borderColor: "#4f7cff",
  },

  genderText: {
    color: "#555",
  },

  genderTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
});
