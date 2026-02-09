import { TextInput, View, Text } from "react-native";

export default function Input({ label, ...props }: any) {
  return (
    <View style={{ marginVertical: 6 }}>
      <Text>{label}</Text>
      <TextInput
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 8,
        }}
        {...props}
      />
    </View>
  );
}
