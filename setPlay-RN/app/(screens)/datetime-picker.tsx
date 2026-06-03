import { Text } from "@/components/ui/Text";
import { COLORS, FONT_SIZES } from "@/constants/theme";
import { useGigStore } from "@/stores/useGigStore";
import { formatDate } from "@/utils/formatDate";
import { router } from "expo-router";
import React, { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import WheelPicker from "react-native-wheel-picker-expo";

export default function DateTimeSwiperModal() {
  const dateOptions = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const label = formatDate(date.toISOString());
    return {
      label,
      value: label,
      dateObj: date,
    };
  });

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour12 = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? "AM" : "PM";
    const label = `${hour12} ${period}`;
    return { label, value: label, hour24: i };
  });

  const updateGigStepOne = useGigStore((state) => state.updateGigDraft);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedStartIndex, setSelectedStartIndex] = useState(0);
  const [selectedEndIndex, setSelectedEndIndex] = useState(1);

  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={() => router.back()}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Select</Text>

          <View style={styles.row}>
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Date:</Text>
              <WheelPicker
                items={dateOptions}
                onChange={({ index }) => setSelectedDateIndex(index)}
                initialSelectedIndex={selectedDateIndex}
                height={170}
                width="100%"
                selectedStyle={{
                  borderColor: COLORS.primary,
                  borderWidth: 2,
                }}
                backgroundColor={COLORS.background}
              />
            </View>

            <View style={styles.verticalLine} />

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Start Time:</Text>
              <WheelPicker
                items={timeOptions}
                onChange={({ index }) => {
                  setSelectedStartIndex(index);
                  if (index >= selectedEndIndex) {
                    setSelectedEndIndex((index + 1) % timeOptions.length);
                  }
                }}
                initialSelectedIndex={selectedStartIndex}
                height={170}
                width="100%"
                selectedStyle={{
                  borderColor: COLORS.primary,
                  borderWidth: 2,
                }}
                backgroundColor={COLORS.background}
              />
            </View>

            <View style={styles.verticalLine} />

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>End Time:</Text>
              <WheelPicker
                items={timeOptions}
                onChange={({ index }) => setSelectedEndIndex(index)}
                initialSelectedIndex={selectedEndIndex}
                height={170}
                width="100%"
                selectedStyle={{
                  borderColor: COLORS.primary,
                  borderWidth: 2,
                }}
                backgroundColor={COLORS.background}
              />
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.submitBtn}
            onPress={() => {
              const selectedDate = dateOptions[selectedDateIndex].dateObj;
              const startHour = timeOptions[selectedStartIndex].hour24;

              const dateTimeISO = new Date(selectedDate);
              dateTimeISO.setHours(startHour, 0, 0, 0);

              updateGigStepOne({
                date: dateOptions[selectedDateIndex].value,
                time: `${timeOptions[selectedStartIndex].value} - ${timeOptions[selectedEndIndex].value}`,
                dateISO: dateTimeISO.toISOString(),
              });
              router.back();
            }}
          >
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  container: {
    width: "90%",
    backgroundColor: COLORS.background,
    borderColor: COLORS.primary,
    borderWidth: 3,
    borderRadius: 15,
    paddingBottom: 12,
  },
  title: {
    paddingHorizontal: 12,
    paddingTop: 12,
    color: COLORS.text,
    fontSize: FONT_SIZES.medium,
    marginBottom: 16,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  pickerContainer: {
    flex: 1,
  },
  verticalLine: {
    width: 1,
    backgroundColor: COLORS.primary,
    height: 170,
    alignSelf: "flex-end",
  },
  label: {
    color: COLORS.text,
    fontSize: FONT_SIZES.small,
    borderBottomColor: COLORS.primary,
    borderBottomWidth: 1,
    paddingBottom: 4,
    paddingHorizontal: 12,
  },
  submitBtn: {
    marginTop: 20,
    backgroundColor: COLORS.background,
    padding: 15,
    marginHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
    width: "50%",
    alignSelf: "flex-end",
  },
  submitText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.medium,
  },
});
