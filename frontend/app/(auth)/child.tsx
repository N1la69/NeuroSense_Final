import { useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { getParent } from "@/utils/storage";
import { addChild } from "@/utils/api";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function ChildOnboard() {
  const router = useRouter();

  const [childName, setChildName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const onSubmit = async () => {
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
      router.replace("/(dashboard)/home");
    } else {
      alert(res.error || "Failed to save child info");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Child Information</Text>

      <Input label="Child Name" value={childName} onChangeText={setChildName} />
      <Input label="Age" value={age} onChangeText={setAge} />
      <Input label="Gender" value={gender} onChangeText={setGender} />

      <Button title="Continue" onPress={onSubmit} />
    </View>
  );
}
