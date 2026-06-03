import { Text } from "@/components/ui/Text";
import { COLORS } from "@/constants/theme";
import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This page doesn’t exist.</Text>

        <Link href="/(tabs)/home" style={styles.link}>
          <Text>Go back home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 24,
  },
  link: {
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
  },
});
