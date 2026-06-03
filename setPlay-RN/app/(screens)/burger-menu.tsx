import DropdownList from "@/components/ui/DropdownList";
import { modalStyles } from "@/components/ui/ModalStyles";
import ProfilePicWithRating from "@/components/ui/ProfilePicWIthRating";
import { Text } from "@/components/ui/Text";
import { COLORS, FONT_SIZES } from "@/constants/theme";
import { useUserStore } from "@/stores/useUserStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  default as MaterialDesignIcons,
  default as MaterialIcons,
} from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function BurgerMenu() {
  const userName = useUserStore((state) => state.user?.name);
  const userRole = useUserStore((state) => state.user?.role);

  return (
    <Modal
      visible={true}
      animationType="fade"
      transparent
      onRequestClose={() => router.dismissAll()}
      statusBarTranslucent={true}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={() => router.dismissAll()}
      >
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          intensity={10}
          tint="dark"
          style={StyleSheet.absoluteFill}
        >
          <View style={styles.menuContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.menu}>
                <View style={{ flexDirection: "row" }}>
                  <ProfilePicWithRating width={80} height={80} />
                  <View
                    style={{
                      flexDirection: "column",
                      borderWidth: 1,
                      borderColor: COLORS.primary,
                      marginLeft: 16,
                      width: "100%",
                      flexShrink: 1,
                      borderRadius: 8,
                      padding: 8,
                    }}
                  >
                    <Text style={styles.title}>
                      {userName?.toUpperCase() ?? ""}
                    </Text>
                  </View>
                  <View style={{ ...modalStyles.column, width: 35 }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        position: "absolute",
                        right: 0,
                        paddingTop: 2,
                      }}
                      onPress={() => {
                        router.dismiss();
                        router.navigate("/(screens)/account-settings");
                      }}
                    >
                      <Ionicons
                        name="settings-outline"
                        size={24}
                        color={COLORS.secondary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View
                  style={{
                    borderWidth: 1,
                    borderColor: COLORS.primary,
                    paddingVertical: 8,
                    paddingHorizontal: 6,
                    borderRadius: 8,
                    marginTop: 4,
                    flexDirection: "row",
                    gap: 3,
                    alignItems: "center",
                    width: 80,
                  }}
                >
                  {userRole === "DJ" ? (
                    <>
                      <Image
                        source={require("@/assets/icons/DJ.svg")}
                        style={{ width: 14, height: 14 }}
                      />
                      <Text
                        style={{
                          color: COLORS.secondary,
                          fontSize: 12,
                        }}
                      >
                        DJ
                      </Text>
                    </>
                  ) : userRole === "Producer" ? (
                    <>
                      <Image
                        source={require("@/assets/icons/Producer.svg")}
                        style={{ width: 14, height: 14 }}
                      />
                      <Text
                        style={{
                          color: COLORS.secondary,
                          fontSize: 12,
                        }}
                      >
                        Producer
                      </Text>
                    </>
                  ) : null}
                </View>

                <DropdownList
                  title="Wallet and Payment"
                  icon={MaterialIcons}
                  iconName="wallet"
                  marginTop={32}
                >
                  <View>
                    <View
                      style={{
                        padding: 12,
                        paddingBottom: 16,
                        flexDirection: "row",
                        gap: 6,
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <MaterialDesignIcons
                        name="credit-card"
                        size={24}
                        color={COLORS.secondary}
                      />
                      <Text style={{ color: COLORS.text }} />
                    </View>
                    <TouchableOpacity activeOpacity={0.9}>
                      <LinearGradient
                        colors={["#50ABE0", "#5EC598"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.8, y: 1 }}
                        locations={[0.625, 1]}
                        style={{
                          paddingHorizontal: 15,
                          width: "100%",
                          paddingVertical: 12,
                        }}
                      >
                        <Text
                          style={{
                            color: COLORS.text,
                            fontSize: FONT_SIZES.small,
                            textAlign: "center",
                          }}
                        >
                          Add Funds
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <View
                      style={{
                        padding: 12,
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "flex-start",
                        height: 150,
                        justifyContent: "flex-start",
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.text,
                          textAlign: "center",
                          fontSize: 14,
                          margin: "auto",
                        }}
                      >
                        No Payment History
                      </Text>
                    </View>
                  </View>
                </DropdownList>

                <View
                  style={{
                    ...modalStyles.column,
                    position: "absolute",
                    bottom: 0,
                    paddingBottom: 12,
                    alignSelf: "center",
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      borderWidth: 2,
                      borderColor: COLORS.primary,
                      padding: 16,
                      borderRadius: 8,
                      justifyContent: "center",
                      flexDirection: "row",
                      gap: 7,
                    }}
                  >
                    <Octicons
                      name="sign-out"
                      size={20}
                      color={COLORS.primary}
                    />
                    <Text
                      style={{
                        color: COLORS.primary,
                        fontSize: FONT_SIZES.medium,
                      }}
                    >
                      Sign Out
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  menu: {
    position: "absolute",
    left: 0,
    height: "90%",
    width: "85%",
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderWidth: 2,
    borderBottomColor: COLORS.primary,
    borderRightWidth: 2,
    borderRightColor: COLORS.primary,
    borderTopColor: COLORS.primary,
    borderBottomRightRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: FONT_SIZES.large,
    color: COLORS.secondary,
    marginBottom: 20,
  },
});
