import { useState } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type InputProps = {
  label: string;
  error?: string;
  secureTextEntry?: boolean;
} & React.ComponentProps<typeof TextInput>;

const Input = ({ label, error, secureTextEntry, ...props }: InputProps) => {
  const [focused, setFocused] = useState(false);
  const [hide, setHide] = useState(secureTextEntry);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputContainer,
          focused && styles.focused,
          error && styles.errorBorder,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholderTextColor="#999"
          secureTextEntry={hide}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity onPress={() => setHide(!hide)}>
            <Text style={styles.toggle}>{hide ? "Show" : "Hide"}</Text>
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
  },

  label: {
    marginBottom: 4,
    color: "#444",
    fontWeight: "500",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },

  focused: {
    borderColor: "#4f7cff",
  },

  errorBorder: {
    borderColor: "#ff4d4d",
  },

  input: {
    flex: 1,
    paddingVertical: 10,
    color: "#111",
  },

  toggle: {
    color: "#4f7cff",
    fontWeight: "500",
    marginLeft: 8,
  },

  error: {
    color: "#ff4d4d",
    marginTop: 4,
    fontSize: 12,
  },
});
