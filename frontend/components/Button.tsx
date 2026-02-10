import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
};

const Button = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
      style={[
        styles.base,
        variant === "primary" ? styles.primary : styles.secondary,
        isDisabled && styles.disabled,
      ]}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  base: {
    padding: 13,
    borderRadius: 12,
    marginVertical: 6,
    alignItems: "center",
  },

  primary: {
    backgroundColor: "#4f7cff",
  },

  secondary: {
    backgroundColor: "#e8eeff",
  },

  disabled: {
    opacity: 0.6,
  },

  text: {
    color: "white",
    fontWeight: "600",
  },
});
