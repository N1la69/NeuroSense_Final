import { Pressable, View } from "react-native";

export default function ColorBall({ color, onPress }: any) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          width: 70,
          height: 70,
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
