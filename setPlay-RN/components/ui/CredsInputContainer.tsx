import { Text } from "@/components/ui/Text";
import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { COLORS, FONT_SIZES, SPACING } from "../../constants/theme";

interface CredsInputContainerProps {
  text: string | number;
  subtext: string;
  secureText?: boolean;
  style?: object;
  children?: React.ReactNode;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
}

const CredsInputContainer: React.FC<CredsInputContainerProps> = ({
  text,
  subtext,
  style,
  secureText,
  children,
  onChangeText,
  onBlur,
}) => {
  const [inputValue, setInputValue] = useState(String(text));

  return (
    <View
      style={[
        {
          borderWidth: 1,
          borderColor: COLORS.primary,
          alignItems: "center",
          borderRadius: 8,
          marginTop: 16,
          flexDirection: "row",
          paddingVertical: SPACING.small,
        },
        style,
      ]}
    >
      <View
        style={{
          borderWidth: 1,
          borderBottomWidth: 0,
          borderColor: COLORS.primary,
          paddingHorizontal: 4,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          position: "absolute",
          left: 8,
          top: -18,
        }}
      >
        <Text
          style={{
            color: COLORS.text,
            fontSize: 12,
          }}
        >
          {subtext}
        </Text>
      </View>
      <TextInput
        style={{
          flex: 1,
          color: COLORS.text,
          fontSize: FONT_SIZES.small,
          paddingHorizontal: SPACING.medium,
        }}
        value={inputValue}
        onChangeText={(val) => {
          setInputValue(val);
          if (onChangeText) {
            onChangeText(val);
          }
        }}
        secureTextEntry={secureText}
        onBlur={onBlur}
      />
      {children}
    </View>
  );
};

export default CredsInputContainer;
