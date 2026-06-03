import { Text } from "@/components/ui/Text";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  default as MaterialCommunityIcons,
  default as MaterialDesignIcons,
} from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { BlurView } from "expo-blur";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import { useUserStore } from "@/stores/useUserStore";

import { SocialLink } from "@/api/user/user.types";
import ArrowBack from "@/components/ui/ArrowBack";
import CredsInputContainer from "@/components/ui/CredsInputContainer";
import DropdownList from "@/components/ui/DropdownList";
import { modalStyles } from "@/components/ui/ModalStyles";
import ProfilePicWithRating from "@/components/ui/ProfilePicWIthRating";
import { ToggleButton } from "@/components/ui/ToggleButton";
import { CREDENTIALS, SOCIAL_PLATFORMS } from "@/constants/constants";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

type LocalSocialLink = {
  key: (typeof SOCIAL_PLATFORMS)[number]["key"];
  platform: string;
  baseUrl: string;
  nickname: string;
  isEditing: boolean;
};

export default function AccountSettingsModal() {
  const userName = useUserStore((state) => state.user?.name);
  const userRole = useUserStore((state) => state.user?.role);
  const userSocials = useUserStore((state) => state.user?.socialLinks);
  const setRole = useUserStore((state) => state.setRole);
  const updateProfileInfo = useUserStore((state) => state.updateProfileInfo);
  const updateSocials = useUserStore((state) => state.updateSocials);

  const [links, setLinks] = useState<LocalSocialLink[]>([]);
  const [pendingSelections, setPendingSelections] = useState<number[]>([]);
  const [openSelectorId, setOpenSelectorId] = useState<number | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [savingSocials, setSavingSocials] = useState(false);
  const [nameValue, setNameValue] = useState(userName ?? "");

  useEffect(() => {
    setNameValue(userName ?? "");
  }, [userName]);

  useEffect(() => {
    if (!userSocials?.length) {
      setLinks([]);
      return;
    }
    const hydrated: LocalSocialLink[] = userSocials
      .filter(
        (link, index, self) =>
          self.findIndex((l) => l.key === link.key) === index,
      )
      .map((link) => {
        const def = SOCIAL_PLATFORMS.find((p) => p.key === link.key);
        const baseUrl = def?.baseUrl ?? link.url;
        const nickname = link.url.startsWith(baseUrl)
          ? link.url.slice(baseUrl.length)
          : "";

        return {
          key: link.key as LocalSocialLink["key"],
          platform: def?.label ?? link.platform ?? link.key,
          baseUrl,
          nickname,
          isEditing: false,
        };
      });

    setLinks(hydrated);
  }, [userSocials]);

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Permission to access your photos is required :(");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: false,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      await updateProfileInfo({ avatar: result.assets[0].uri });
    } catch (err) {
      console.error(err);
    }
  };

  const handleNameBlur = async () => {
    const trimmedName = nameValue.trim();

    if (!trimmedName) {
      setNameValue(userName ?? "");
      return;
    }

    if (trimmedName === userName) return;

    try {
      await updateProfileInfo({ name: trimmedName });
    } catch {
      setNameValue(userName ?? "");
    }
  };

  const addSocialSelector = () => {
    const newId = Date.now();
    setPendingSelections((prev) => [...prev, newId]);
    setOpenSelectorId(newId);
  };

  const confirmPlatformSelection = (id: number, selectedKey: string) => {
    const platform = SOCIAL_PLATFORMS.find((p) => p.key === selectedKey);
    if (!platform) return;
    if (links.some((link) => link.key === platform.key)) return;

    setLinks((prev) => [
      ...prev,
      {
        key: platform.key,
        platform: platform.label,
        baseUrl: platform.baseUrl,
        nickname: "",
        isEditing: true,
      },
    ]);

    setPendingSelections((prev) => prev.filter((uid) => uid !== id));
    if (openSelectorId === id) setOpenSelectorId(null);
  };

  const remainingPlatforms = useMemo(
    () =>
      SOCIAL_PLATFORMS.filter(
        (platform) => !links.some((link) => link.key === platform.key),
      ),
    [links],
  );

  const updateNickname = (index: number, value: string) => {
    setLinks((prev) =>
      prev.map((link, i) =>
        i === index ? { ...link, nickname: value } : link,
      ),
    );
  };

  const setEditingState = (index: number, editing: boolean) => {
    setLinks((prev) =>
      prev.map((link, i) =>
        i === index ? { ...link, isEditing: editing } : link,
      ),
    );
  };

  const handleBlur = useCallback(
    (index: number) => {
      const targetLink = links[index];
      const trimmed = targetLink.nickname.trim();

      const payload: SocialLink = {
        key: targetLink.key,
        platform: targetLink.platform,
        url: `${targetLink.baseUrl}${trimmed}`.replace(/\s+/g, ""),
      };

      setLinks((prev) =>
        prev.map((link, i) =>
          i === index ? { ...link, nickname: trimmed, isEditing: false } : link,
        ),
      );

      setSavingSocials(true);

      updateSocials(payload);

      setSavingSocials(false);
    },
    [links, updateSocials],
  );

  return (
    <Modal
      visible={true}
      transparent
      animationType="slide"
      onRequestClose={() => router.dismissAll()}
      statusBarTranslucent={true}
    >
      <SafeAreaView style={modalStyles.safeArea}>
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          intensity={10}
          tint="dark"
          style={StyleSheet.absoluteFill}
        >
          <TouchableWithoutFeedback onPress={() => router.dismissAll()}>
            <View
              style={[
                modalStyles.modalOverlay,
                { justifyContent: "center", paddingTop: 0 },
              ]}
            >
              <ArrowBack
                onPress={() => {
                  router.dismiss();
                  router.navigate("/(screens)/burger-menu");
                }}
              />

              <View
                style={{
                  ...modalStyles.modalContainer,
                  borderWidth: 3,
                  borderRadius: 16,
                  overflow: "hidden",
                  maxHeight: "90%",
                }}
              >
                <ScrollView
                  bounces={false}
                  overScrollMode="never"
                  keyboardShouldPersistTaps="handled"
                >
                  <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                    accessible={false}
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "center",
                        padding: 12,
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          style={{
                            width: 106,
                            height: 120,
                            borderWidth: 1,
                            borderColor: COLORS.primary,
                            borderRadius: 6,
                            overflow: "hidden",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 7,
                          }}
                          activeOpacity={0.7}
                          onPress={pickImage}
                        >
                          <ProfilePicWithRating
                            width={106}
                            height={120}
                            smallOrLarge="small"
                            border={false}
                            displayRating={false}
                          />
                          <View
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              borderRadius: 6,
                              backgroundColor: "rgba(0,0,0,0.7)",
                            }}
                          />
                          <MaterialDesignIcons
                            name="camera-plus-outline"
                            size={24}
                            color={COLORS.secondary}
                            style={{
                              transform: [{ scaleX: -1 }],
                              position: "absolute",
                              right: 0,
                              left: 0,
                              top: 0,
                              bottom: 0,
                              textAlign: "center",
                              textAlignVertical: "center",
                            }}
                          />
                        </TouchableOpacity>

                        <View
                          style={{ flexDirection: "column", marginLeft: 8 }}
                        >
                          <View style={{ marginBottom: 8 }}>
                            <CredsInputContainer
                              text={nameValue}
                              subtext="Nickname"
                              style={{ paddingVertical: 6, marginTop: 6 }}
                              onChangeText={setNameValue}
                              onBlur={handleNameBlur}
                            />
                          </View>

                          <View
                            style={{
                              marginLeft: "auto",
                              flexDirection: "row",
                              gap: 4,
                              borderWidth: 2,
                              borderColor: COLORS.primary,
                              padding: 6,
                              paddingVertical: 10,
                              borderRadius: 8,
                            }}
                          >
                            <ToggleButton
                              active={userRole === "Producer"}
                              icon={MaterialCommunityIcons}
                              iconName="account-music-outline"
                              label="Producer"
                              width={90}
                              onPress={() => setRole("Producer")}
                            />

                            <ToggleButton
                              active={userRole === "DJ"}
                              icon={Feather}
                              iconName="headphones"
                              label="DJ"
                              width={90}
                              onPress={() => setRole("DJ")}
                            />
                          </View>
                        </View>
                      </View>

                      <View style={{ alignItems: "center", marginTop: 16 }}>
                        <CredsInputContainer
                          text={CREDENTIALS.email}
                          subtext="Email address"
                        />
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: 16,
                        }}
                      >
                        <CredsInputContainer
                          text={CREDENTIALS.password}
                          subtext="Password"
                          secureText={!showPassword}
                        >
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setShowPassword((prev) => !prev)}
                            style={{ paddingHorizontal: 12 }}
                          >
                            <Octicons
                              name={showPassword ? "eye" : "eye-closed"}
                              size={20}
                              color={
                                showPassword ? COLORS.secondary : "#808080"
                              }
                            />
                          </TouchableOpacity>
                        </CredsInputContainer>
                      </View>

                      <DropdownList
                        title="Payment settings"
                        iconName="wallet"
                        icon={MaterialIcons}
                        marginTop={32}
                      >
                        <View style={{ padding: 8, gap: 12 }}>
                          <CredsInputContainer
                            text={CREDENTIALS.cardholderName}
                            subtext="Cardholder Name"
                          />
                          <CredsInputContainer
                            text={CREDENTIALS.cardNumber}
                            subtext="Card Number"
                          />
                          <View
                            style={{
                              flexDirection: "row",
                              width: "100%",
                              gap: 8,
                            }}
                          >
                            <CredsInputContainer
                              text={CREDENTIALS.cvv}
                              subtext="CVV"
                              style={{ flex: 1 }}
                            />
                            <CredsInputContainer
                              text={CREDENTIALS.expirationDate}
                              subtext="Expiration Date"
                              style={{ flex: 1 }}
                            />
                          </View>
                        </View>
                      </DropdownList>

                      <DropdownList
                        title="Social media"
                        iconName="groups"
                        icon={MaterialIcons}
                        marginTop={16}
                      >
                        <View style={{ padding: 8, gap: 12 }}>
                          {links.map((link, index) =>
                            link.isEditing ? (
                              <CredsInputContainer
                                key={link.key}
                                text={link.baseUrl + link.nickname}
                                subtext={link.platform}
                                onChangeText={(value) => {
                                  const nickname = value.startsWith(
                                    link.baseUrl,
                                  )
                                    ? value.slice(link.baseUrl.length)
                                    : value;
                                  updateNickname(index, nickname);
                                }}
                                onBlur={() => handleBlur(index)}
                              />
                            ) : (
                              <View style={{ marginTop: 16 }} key={link.key}>
                                <View
                                  style={{
                                    borderWidth: 1,
                                    borderBottomWidth: 0,
                                    borderColor: COLORS.secondary,
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
                                    {link.platform}
                                  </Text>
                                </View>
                                <Pressable
                                  onPress={() => {
                                    const fullUrl = `${
                                      link.baseUrl
                                    }${link.nickname.trim()}`.replace(
                                      /\s+/g,
                                      "",
                                    );
                                    Linking.openURL(fullUrl);
                                  }}
                                  onLongPress={() =>
                                    setEditingState(index, true)
                                  }
                                  style={({ pressed }) => [
                                    {
                                      borderWidth: 1,
                                      borderColor: COLORS.secondary,
                                      borderRadius: 8,
                                      paddingVertical: 20,
                                      paddingHorizontal: SPACING.medium,
                                      opacity: pressed ? 0.8 : 1,
                                    },
                                  ]}
                                  delayLongPress={200}
                                >
                                  <Text style={{ color: COLORS.text }}>
                                    {link.baseUrl + link.nickname}
                                  </Text>
                                  <Text
                                    style={{
                                      color: COLORS.secondary,
                                      fontSize: 11,
                                      marginTop: 6,
                                    }}
                                  >
                                    Long-press to edit
                                  </Text>
                                </Pressable>
                              </View>
                            ),
                          )}

                          {pendingSelections.map((id) => (
                            <View
                              key={id}
                              style={{
                                borderWidth: 1,
                                borderColor: COLORS.primary,
                                borderRadius: 8,
                                overflow: "hidden",
                              }}
                            >
                              <TouchableOpacity
                                activeOpacity={0.8}
                                style={{
                                  padding: SPACING.medium,
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                                onPress={() =>
                                  setOpenSelectorId(
                                    openSelectorId === id ? null : id,
                                  )
                                }
                              >
                                <Text
                                  style={{
                                    fontSize: FONT_SIZES.small,
                                    color: COLORS.text,
                                  }}
                                >
                                  Select platform…
                                </Text>
                                <MaterialIcons
                                  name={
                                    openSelectorId === id
                                      ? "keyboard-arrow-up"
                                      : "keyboard-arrow-down"
                                  }
                                  size={20}
                                  color={COLORS.primary}
                                />
                              </TouchableOpacity>

                              {openSelectorId === id &&
                                remainingPlatforms.map((platform) => (
                                  <TouchableOpacity
                                    key={platform.key}
                                    onPress={() =>
                                      confirmPlatformSelection(id, platform.key)
                                    }
                                    style={{
                                      padding: SPACING.medium,
                                      borderTopWidth: 1,
                                      borderColor: COLORS.primary,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: FONT_SIZES.small,
                                        color: COLORS.text,
                                      }}
                                    >
                                      {platform.label}
                                    </Text>
                                  </TouchableOpacity>
                                ))}
                            </View>
                          ))}

                          {remainingPlatforms.length > 0 &&
                          pendingSelections.length <
                            remainingPlatforms.length ? (
                            <TouchableOpacity
                              activeOpacity={0.8}
                              style={{
                                borderWidth: 1,
                                borderColor: COLORS.primary,
                                borderRadius: 8,
                                padding: 10,
                                alignItems: "center",
                                justifyContent: "center",
                                width: 50,
                              }}
                              onPress={addSocialSelector}
                            >
                              <Octicons
                                name="plus"
                                size={24}
                                color={COLORS.primary}
                              />
                            </TouchableOpacity>
                          ) : null}

                          {savingSocials ? (
                            <Text
                              style={{
                                color: COLORS.primary,
                                fontSize: 12,
                                marginTop: 8,
                              }}
                            >
                              Saving…
                            </Text>
                          ) : null}
                        </View>
                      </DropdownList>

                      <View
                        style={{
                          width: "100%",
                          paddingVertical: 12,
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => setNotifications((prev) => !prev)}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Ionicons
                            name={
                              notifications
                                ? "notifications-outline"
                                : "notifications-off-outline"
                            }
                            size={20}
                            color={notifications ? COLORS.secondary : "#808080"}
                            style={{ marginLeft: 6 }}
                          />
                          <Text
                            style={{
                              fontSize: FONT_SIZES.medium,
                              color: COLORS.text,
                              marginLeft: 8,
                            }}
                          >
                            Notifications
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </BlurView>
      </SafeAreaView>
    </Modal>
  );
}

const style = StyleSheet.create({});
