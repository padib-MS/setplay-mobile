import { modalStyles } from "@/components/ui/ModalStyles";
import { Text } from "@/components/ui/Text";
import { DEFAULT_THUMBHASH, LOCATIONS, VENUES } from "@/constants/constants";
import { COLORS } from "@/constants/theme";
import { useGigStore } from "@/stores/useGigStore";
import { LegendList } from "@legendapp/list";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { router, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StepOneModal() {
  const pathname = usePathname();
  const isDateTimePickerOpen = pathname.includes("datetime-picker");
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setIsKeyboardOpen(true),
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setIsKeyboardOpen(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const [activeList, setActiveList] = useState<
    "location" | "dateTime" | "venueType" | null
  >(null);
  const updateGigStepOne = useGigStore((state) => state.updateGigDraft);
  const gigDraft = useGigStore((state) => state.gigDraft);

  const renderItem = ({ item }: { item: string }) => {
    const isSelected =
      (activeList === "location" && item === gigDraft?.location) ||
      (activeList === "dateTime" &&
        item === gigDraft?.date &&
        gigDraft?.time) ||
      (activeList === "venueType" && item === gigDraft?.venue);

    return (
      <TouchableOpacity
        style={[
          modalStyles.listItem,
          isSelected && modalStyles.listItemSelected,
        ]}
        onPress={() => {
          if (activeList === "location") updateGigStepOne({ location: item });
          if (activeList === "dateTime")
            updateGigStepOne({ date: item, dateISO: item, time: item });
          if (activeList === "venueType") updateGigStepOne({ venue: item });
          setActiveList(null);
        }}
      >
        <Text style={modalStyles.listItemText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={true}
      transparent={true}
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
            <KeyboardAvoidingView
              behavior="padding"
              style={[
                modalStyles.modalOverlay,
                {
                  justifyContent:
                    isKeyboardOpen || isDateTimePickerOpen
                      ? "flex-start"
                      : "center",
                },
              ]}
              keyboardVerticalOffset={Platform.OS === "android" ? -200 : 0}
            >
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View
                  style={{ ...modalStyles.modalContainer, paddingBottom: 0 }}
                >
                  <View style={modalStyles.column}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={modalStyles.input}
                      onPress={() =>
                        setActiveList(
                          activeList === "location" ? null : "location",
                        )
                      }
                    >
                      <Image
                        source={require("@/assets/icons/Crosshair.svg")}
                        style={{ ...modalStyles.icon, width: 24, height: 24 }}
                        transition={100}
                        contentFit="cover"
                        cachePolicy="memory"
                        placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
                      />
                      <View style={modalStyles.inputContent}>
                        <Text
                          style={[
                            modalStyles.placeholder,
                            gigDraft?.location && modalStyles.placeholderActive,
                          ]}
                        >
                          Location
                        </Text>
                        <Text style={modalStyles.inputText}>
                          {gigDraft?.location}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {activeList === "location" && (
                      <LegendList
                        data={LOCATIONS.map((l) => l.name)}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.toString()}
                        style={modalStyles.list}
                        recycleItems={true}
                        estimatedItemSize={150}
                        showsVerticalScrollIndicator={false}
                      />
                    )}
                  </View>
                  <View style={modalStyles.column}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={modalStyles.input}
                      onPress={() => router.push("/(screens)/datetime-picker")}
                    >
                      <Image
                        source={require("@/assets/icons/Calendar2.svg")}
                        style={{ ...modalStyles.icon, width: 24, height: 24 }}
                        transition={100}
                        contentFit="cover"
                        cachePolicy="memory"
                        placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
                      />
                      <View style={modalStyles.inputContent}>
                        <Text
                          style={[
                            modalStyles.placeholder,
                            gigDraft?.date &&
                              gigDraft?.time &&
                              modalStyles.placeholderActive,
                          ]}
                        >
                          Date/Time
                        </Text>
                        <Text style={modalStyles.inputText}>
                          {gigDraft?.date && gigDraft?.time ? (
                            <>
                              {gigDraft.date} / {gigDraft.time}
                            </>
                          ) : null}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={modalStyles.column}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={modalStyles.input}
                      onPress={() =>
                        setActiveList(
                          activeList === "venueType" ? null : "venueType",
                        )
                      }
                    >
                      <Image
                        source={require("@/assets/icons/Building.svg")}
                        style={{ ...modalStyles.icon, width: 24, height: 24 }}
                        transition={100}
                        contentFit="cover"
                        cachePolicy="memory"
                        placeholder={{ thumbhash: DEFAULT_THUMBHASH }}
                      />
                      <View style={modalStyles.inputContent}>
                        <Text
                          style={[
                            modalStyles.placeholder,
                            gigDraft?.venue && modalStyles.placeholderActive,
                          ]}
                        >
                          Venue Type
                        </Text>
                        <Text style={modalStyles.inputText}>
                          {gigDraft?.venue}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {activeList === "venueType" && (
                      <View
                        style={{
                          backgroundColor: COLORS.background,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: COLORS.primary,
                          marginHorizontal: 12,
                          position: "absolute",
                          maxHeight: 170,
                          top: 60,
                          zIndex: 1,
                        }}
                      >
                        <ScrollView
                          bounces={false}
                          overScrollMode="never"
                          keyboardShouldPersistTaps="always"
                        >
                          {VENUES.map((item) => {
                            const isSelected = item === gigDraft?.venue;
                            return (
                              <TouchableOpacity
                                key={item}
                                style={[
                                  modalStyles.listItem,
                                  isSelected && modalStyles.listItemSelected,
                                ]}
                                onPress={() => {
                                  updateGigStepOne?.({ venue: item });
                                  setActiveList(null);
                                }}
                              >
                                <Text style={modalStyles.listItemText}>
                                  {item}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                  {/* <View style={modalStyles.startBidWrapper}>
                    <Text style={{ color: COLORS.text, fontSize: 14 }}>
                      Start bid
                    </Text>
                    <View style={modalStyles.startBidContainer}>
                      <TextInput
                        style={modalStyles.startBidInput}
                        keyboardType="numeric"
                        maxLength={3}
                        onChangeText={(input) => {
                          const numericInput = input.replace(/[^0-9]/g, "");
                          updateGigStepOne?.({
                            bid: Number(numericInput) ?? null,
                          });
                        }}
                        value={gigDraft?.bid ? gigDraft.bid.toString() : ""}
                        textAlignVertical="top"
                      />
                      <FontAwesome
                        name="dollar"
                        size={20}
                        color="#4CAF50"
                        style={{ marginRight: 10 }}
                      />
                    </View>
                  </View> */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={[
                      modalStyles.nextButton,
                      (!gigDraft?.location ||
                        !gigDraft?.date ||
                        !gigDraft?.time ||
                        !gigDraft?.venue) &&
                        // !gigDraft?.bid
                        modalStyles.nextButtonDisabled,
                    ]}
                    disabled={
                      !gigDraft?.location ||
                      !gigDraft?.date ||
                      !gigDraft?.time ||
                      !gigDraft?.venue
                      // !gigDraft?.bid
                    }
                    onPress={() => {
                      router.navigate("/(screens)/step-two");
                    }}
                  >
                    <Text style={modalStyles.nextButtonText}>
                      Next: Step 1 of 2
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </BlurView>
      </SafeAreaView>
    </Modal>
  );
}
