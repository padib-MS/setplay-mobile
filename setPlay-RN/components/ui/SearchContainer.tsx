import { Text } from "@/components/ui/Text";
import { DEFAULT_THUMBHASH } from "@/constants/constants";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchProps {
  type: "modal" | "textInput";
  query?: string;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

const SearchContainer = ({
  type,
  query,
  onClear,
  placeholder,
  onChangeText,
}: SearchProps) => {
  return (
    <TouchableOpacity
      style={
        type === "modal"
          ? styles.searchContainer
          : {
              ...styles.searchContainer,
              borderLeftWidth: 0,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }
      }
      activeOpacity={1}
      onPress={
        type === "modal" ? () => router.push("/(screens)/search") : undefined
      }
    >
      <Image
        source={require("@/assets/icons/Glass.svg")}
        style={{ marginHorizontal: SPACING.xSmall, width: 20, height: 20 }}
        cachePolicy="memory"
        contentFit="contain"
        placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
      />
      {type === "textInput" ? (
        <TextInput
          style={styles.searchBar}
          value={query}
          onChangeText={onChangeText}
          placeholder={placeholder ?? "Search..."}
          placeholderTextColor={COLORS.primary}
          returnKeyType="search"
          onSubmitEditing={Keyboard.dismiss}
        />
      ) : (
        <Text style={styles.searchBar}>Search</Text>
      )}

      {query && query.length > 0 ? (
        <TouchableOpacity
          onPress={onClear}
          style={{ zIndex: 1 }}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      ) : null}

      <View
        style={{
          position: "absolute",
          right: 0,
          width: "45%",
          height: 48,
        }}
      >
        <Image
          source={require("@/assets/icons/search-bg.svg")}
          style={{ width: "100%", height: "100%" }}
          placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
          transition={200}
          contentFit="cover"
          cachePolicy="memory"
        />
        <LinearGradient
          colors={["rgba(20,19,25,0.4)", "rgba(20,19,25,0.95)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: SPACING.small,
    paddingVertical: 9,
    overflow: "hidden",
  },
  searchBar: {
    flex: 1,
    fontSize: FONT_SIZES.small,
    color: COLORS.primary,
    padding: SPACING.xSmall,
    zIndex: 1,
  },
});

export default SearchContainer;
