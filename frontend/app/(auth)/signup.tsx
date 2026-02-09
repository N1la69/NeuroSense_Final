import { useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { signup } from "@/utils/api";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignup = async () => {
    await signup({ name, email, password });
    router.replace("/(auth)/login");
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
