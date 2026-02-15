import { View } from "react-native";

export default function Balloon({ y }: { y: number }) {
  return (
    <View
      style={{
        position: "absolute",
        left: "50%",
        marginLeft: -25,
        top: y,
        width: 50,
        height: 70,
        borderRadius: 25,
        backgroundColor: "#ff4d6d",
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 6,
      }}
    />
  );
}
