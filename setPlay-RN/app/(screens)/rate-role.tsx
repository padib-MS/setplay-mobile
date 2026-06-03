import { Text } from "@/components/ui/Text";
import { RATING_CRITERIAS } from "@/constants/constants";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import { useGigStore } from "@/stores/useGigStore";
import { useUserStore } from "@/stores/useUserStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function RateModal() {
  const [ratings, setRatings] = useState<number[]>([0, 0, 0, 0]);
  const [note, setNote] = useState<string | undefined>();
  const setRating = useUserStore((s) => s.setRating);
  const djId = useGigStore(
    (s) => s.gigsByTab["my"].find((g) => g.id === s.selectedGigId)?.dj.id,
  );
  const producerId = useGigStore(
    (s) =>
      s.gigsByTab["my"].find((g) => g.id === s.selectedGigId)?.producer?.id,
  );
  const selectedGig = useGigStore((g) => g.selectedGigId);
  const userRole = useUserStore((r) => r.user?.role);
  const loadMyGigs = useGigStore((s) => s.loadMyGigs);

  const handleStarPress = (rowIndex: number, star: number) => {
    setRatings((prev) => {
      const updated = [...prev];
      updated[rowIndex] = star;
      return updated;
    });
  };
  const allRated = ratings.every((r) => r > 0);

  const averageRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;

  const submitRating = async () => {
    if (userRole === "Producer") {
      await setRating(averageRating, "DJ", djId!, selectedGig!, note);
    } else {
      await setRating(
        averageRating,
        "Producer",
        producerId!,
        selectedGig!,
        note,
      );
    }

    router.dismissAll();
    setRatings([0, 0, 0, 0]);

    await loadMyGigs();
  };
  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={() => router.back()}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={() => router.back()}>
          <BlurView
            experimentalBlurMethod="dimezisBlurView"
            intensity={10}
            tint="dark"
            style={styles.blur}
          >
            <TouchableWithoutFeedback>
              <View style={styles.container}>
                <Text style={styles.title}>
                  Rate {userRole === "DJ" ? "Producer" : "DJ"} Performance
                </Text>
                <Text style={{ ...styles.question, marginBottom: 16 }}>
                  Overall - {allRated ? averageRating.toFixed(1) : 0}/5.0
                </Text>

                {(userRole === "DJ"
                  ? RATING_CRITERIAS.forDJ
                  : RATING_CRITERIAS.forProducer
                ).map((question, index) => (
                  <View key={index} style={styles.criteriaRow}>
                    <Text style={styles.question}>{question}</Text>
                    <View style={styles.starsRow}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                          key={star}
                          onPress={() => handleStarPress(index, star)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.star,
                              {
                                color:
                                  star <= ratings[index] ? "#FFD700" : "#666",
                              },
                            ]}
                          >
                            ★
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}

                <View
                  style={{
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      ...styles.title,
                      marginBottom: SPACING.small,
                      fontSize: FONT_SIZES.medium,
                    }}
                  >
                    ADD A NOTE{" "}
                    <Text
                      style={{
                        ...styles.question,
                        color: `${COLORS.text}80`,
                      }}
                    >
                      — optional
                    </Text>
                  </Text>

                  <TextInput
                    style={styles.notes}
                    placeholderTextColor={"#666"}
                    placeholder="Anything that stood out, good or bad..."
                    multiline
                    textAlignVertical="top"
                    maxLength={200}
                    value={note}
                    onChangeText={setNote}
                  />
                </View>

                <View style={styles.warningRow}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={14}
                    color={`${COLORS.text}99`}
                  />
                  <Text style={styles.warningText}>
                    Acceptance is final and cannot be changed once submitted.
                  </Text>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      {
                        backgroundColor: !allRated ? "#666" : COLORS.primary,
                      },
                    ]}
                    disabled={!allRated}
                    onPress={submitRating}
                  >
                    <Text style={styles.submitText}>Submit Review</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      {
                        borderWidth: 1,
                        borderColor: COLORS.primary,
                        backgroundColor: "transparent",
                      },
                    ]}
                    onPress={() => router.dismissAll()}
                  >
                    <Text style={styles.submitText}>Later</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </BlurView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  blur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: COLORS.background + "CC",
    borderRadius: 10,
    padding: 24,
    width: "90%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  title: {
    color: COLORS.text,
    fontSize: 20,
    marginBottom: SPACING.xSmall,
  },
  criteriaRow: {
    width: "100%",
    marginBottom: 16,
    alignItems: "center",
  },
  question: {
    color: COLORS.text,
    fontSize: 13,
    textAlign: "center",
    marginBottom: 8,
    opacity: 0.8,
  },
  starsRow: {
    flexDirection: "row",
  },
  star: {
    fontSize: 28,
    marginHorizontal: 4,
  },
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  warningText: {
    color: `${COLORS.text}99`,
    fontSize: 11,
  },
  buttonRow: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: SPACING.medium,
    marginTop: 8,
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
  },
  submitText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  notes: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: SPACING.small,
    marginBottom: 8,
    minHeight: 100,
    color: COLORS.text,
  },
});
