import { useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { signup } from "@/utils/api";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { saveParent } from "@/utils/storage";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignup = async () => {
    const res = await signup({ name, email, password });

    if (res.parentId) {
      await saveParent(res.parentId);

      router.replace("/(auth)/child");
    } else {
      alert(res.error || "Signup failed");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Create Parent Account</Text>

      <Input label="Name" value={name} onChangeText={setName} />
      <Input label="Email" value={email} onChangeText={setEmail} />
      <Input
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Signup" onPress={onSignup} />
    </View>
  );
}
