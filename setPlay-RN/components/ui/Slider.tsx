import { Text } from "@/components/ui/Text";
import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import React from "react";
import { StyleSheet, View } from "react-native";
interface SliderProps {
  title: string;
  values: number[] | number;
  min?: number;
  max: number;
  step: number;
  onValuesChange: (values: number[]) => void;
  formatValue?: (value: number) => string;
  icons: React.ReactNode;
  singleValue?: boolean;
}

const Slider: React.FC<SliderProps> = ({
  title,
  values,
  min,
  max,
  step,
  onValuesChange,
  formatValue,
  icons,
  singleValue = false,
}) => {
  const normalizedValues = Array.isArray(values) ? values : [values];

  const getDisplayValue = (idx: number) => {
    const value = normalizedValues[idx];
    if (value === undefined) return "";
    return formatValue ? formatValue(value) : value.toString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {icons && <View style={styles.iconContainer}>{icons}</View>}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.sliderContainer}>
        <MultiSlider
          sliderLength={280}
          values={normalizedValues}
          min={min}
          max={max}
          step={step}
          onValuesChange={onValuesChange}
          selectedStyle={{
            borderColor: COLORS.primary,
            borderWidth: 2,
            height: 12,
            backgroundColor: COLORS.secondary,
            borderRadius: 8,
          }}
          unselectedStyle={{
            backgroundColor: COLORS.background,
            height: 12,
            borderWidth: 2,
            borderColor: COLORS.primary,
            borderRadius: 8,
          }}
          markerStyle={{
            backgroundColor: "#fff",
            width: 20,
            height: 20,
            bottom: -5,
          }}
          allowOverlap={false}
          snapped={true}
        />
      </View>
      <View style={styles.rangeContainer}>
        {singleValue ? (
          <Text style={styles.rangeText}>{getDisplayValue(0)}</Text>
        ) : (
          <>
            <Text style={styles.rangeText}>{getDisplayValue(0)}</Text>
            <Text style={styles.rangeText}>{getDisplayValue(1)}</Text>
          </>
        )}
      </View>
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: SPACING.small,
  },
  title: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
  },
  sliderContainer: {
    alignItems: "center",
    width: "100%",
  },
  rangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  rangeText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
  },
});
