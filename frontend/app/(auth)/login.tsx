import { useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { login } from "@/utils/api";
import { saveToken } from "@/utils/storage";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    const res = await login({ email, password });

    if (res.token) {
      await saveToken(res.token);
      router.replace("/(dashboard)/home");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Parent Login</Text>

      <Input label="Email" value={email} onChangeText={setEmail} />
      <Input
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={onLogin} />

      <Button
        title="Go to Signup"
        onPress={() => router.push("/(auth)/signup")}
      />
    </View>
  );
}
