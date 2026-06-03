import { COLORS, SPACING } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

interface SeparatorProps {
  color?: string;
  marginHorizontal?: number;
}

const Separator: React.FC<SeparatorProps> = ({
  color = COLORS.text,
  marginHorizontal,
}) => {
  return (
    <View
      style={[styles.separator, { backgroundColor: color, marginHorizontal }]}
    />
  );
};

const styles = StyleSheet.create({
  separator: {
    height: "100%",
    width: 1,
    marginHorizontal: SPACING.small,
  },
});

export default Separator;
