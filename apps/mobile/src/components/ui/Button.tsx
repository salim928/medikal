import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "destructive";
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: "sm" | "md" | "lg";
}

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  style,
  textStyle,
  size = "md",
}: ButtonProps) {
  const baseStyles = StyleSheet.create({
    button: {
      paddingVertical: size === "sm" ? 8 : size === "lg" ? 16 : 12,
      paddingHorizontal: size === "sm" ? 12 : size === "lg" ? 24 : 16,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      fontSize: size === "sm" ? 12 : size === "lg" ? 18 : 14,
      fontWeight: "600",
    },
  });

  const variantStyles = {
    primary: {
      button: { backgroundColor: "#0066cc" },
      text: { color: "white" },
    },
    secondary: {
      button: { backgroundColor: "#e0e0e0" },
      text: { color: "#333" },
    },
    destructive: {
      button: { backgroundColor: "#dc2626" },
      text: { color: "white" },
    },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        baseStyles.button,
        variantStyles[variant].button,
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <Text
        style={[baseStyles.text, variantStyles[variant].text, textStyle]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}