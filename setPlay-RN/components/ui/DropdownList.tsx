import { modalStyles } from "@/components/ui/ModalStyles";
import { Text } from "@/components/ui/Text";
import { COLORS, FONT_SIZES } from "@/constants/theme";
import { useDropdownAnimation } from "@/hooks/useDropdownAnimation";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { ComponentProps, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

interface DropdownListProps {
  title: string;
  icon?: React.ElementType;
  iconName?: string;
  marginTop: number;
  children?: React.ReactNode;
}

const DropdownList: React.FC<DropdownListProps> = ({
  title,
  icon,
  iconName,
  children,
  marginTop,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const { open, close, animatedContainerStyle, animatedContentStyle } =
    useDropdownAnimation(contentHeight);

  const IconComponent =
    icon ??
    ((props: { name: IoniconsName; size: number; color: string }) => (
      <Ionicons {...props} />
    ));

  const iconColor = title === "Social media" ? COLORS.alert : COLORS.primary;

  const handleLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0 && h !== contentHeight) {
      setContentHeight(h);
    }
  };

  const toggleDropdown = () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <View style={modalStyles.column}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.headerBase,
          isOpen ? styles.headerOpen : styles.headerClosed,
          { marginTop: marginTop },
        ]}
        onPress={toggleDropdown}
      >
        <IconComponent
          name={iconName}
          size={24}
          color={iconColor}
          style={styles.headerIcon}
        />
        <Text style={styles.headerText}>{title}</Text>
        <MaterialIcons
          name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          style={styles.arrowIcon}
          color={COLORS.primary}
        />
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.animatedContainerBase,
          isOpen
            ? styles.animatedContainerOpen
            : styles.animatedContainerClosed,
          animatedContainerStyle,
        ]}
      >
        <View onLayout={handleLayout} style={styles.measureView}>
          {children}
        </View>
        <Animated.View style={animatedContentStyle}>{children}</Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBase: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    width: "100%",
  },
  headerClosed: {
    borderBottomWidth: 1,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  headerOpen: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerIcon: {
    marginRight: 7,
  },
  headerText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.medium,
  },
  arrowIcon: {
    marginLeft: "auto",
  },
  animatedContainerBase: {
    overflow: "hidden",
    borderColor: COLORS.primary,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  animatedContainerOpen: {
    borderWidth: 1,
  },
  animatedContainerClosed: {
    borderWidth: 0,
  },
  measureView: {
    position: "absolute",
    opacity: 0,
    width: "100%",
  },
});

export default React.memo(DropdownList);
