import { Pressable, View } from "react-native";

export default function ColorBall({ color, onPress }: any) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 35,
          backgroundColor: color,
          margin: 10,

          shadowColor: color,
          shadowOpacity: 0.6,
          shadowRadius: 10,
        }}
      />
    </Pressable>
  );
}
