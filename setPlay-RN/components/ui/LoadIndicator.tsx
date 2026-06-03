import { COLORS } from "@/constants/theme";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface LoadIndicatorProps {
  isLoading: boolean;
}

const LoadIndicator = ({ isLoading }: LoadIndicatorProps) => {
  if (!isLoading) return null;

  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};

export default LoadIndicator;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 80,
  },
});
