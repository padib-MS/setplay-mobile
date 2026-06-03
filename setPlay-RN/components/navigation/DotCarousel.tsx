import { COLORS } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type RouteConfig = { key: string; title: string };

type DotCarouselProps = {
  routes: RouteConfig[];
  index: number;
  style?: StyleProp<ViewStyle>;
};

export default function DotCarousel({
  routes,
  index,
  style,
}: DotCarouselProps) {
  return (
    <SafeAreaView pointerEvents="box-none" edges={["bottom"]} style={style}>
      <View style={styles.track}>
        {routes.map((route, idx) => {
          const focused = idx === index;
          return (
            <View
              key={route.key}
              style={styles.dotSlot}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
            >
              {focused && <View style={styles.outerLight} />}

              <View style={[styles.dot, focused && styles.dotActive]}>
                {focused && (
                  <LinearGradient
                    colors={["#50ABE0", "#5EC598"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0.8, y: 1 }}
                    locations={[0.625, 1]}
                    style={StyleSheet.absoluteFill}
                  />
                )}
              </View>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  track: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
    gap: 4,
  },
  dotSlot: {
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.primary,
    overflow: "hidden",
  },
  outerLight: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 25,
    backgroundColor: "transparent",
    boxShadow: `0 0 15px 3px ${COLORS.text}50`,
  },
  dotActive: {
    borderWidth: 0,
    shadowColor: "rgba(130, 231, 255, 0.6)",
    width: 12,
    height: 12,
  },
});
