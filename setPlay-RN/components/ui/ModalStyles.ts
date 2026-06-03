import { COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const modalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  dotsbackground: {
    position: "absolute",
    opacity: 0.5,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    paddingTop: "15%",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#141319",
    borderRadius: 10,
    borderColor: COLORS.primary,
    borderWidth: 2,
    alignItems: "center",
    paddingTop: 12,
  },
  column: {
    width: "100%",
    marginBottom: 12,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginHorizontal: 12,
  },
  icon: {
    marginRight: SPACING.small,
  },
  inputContent: {
    position: "relative",
    height: 35,
    width: "100%",
  },
  placeholder: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -10 }],
    color: COLORS.primary,
    fontSize: FONT_SIZES.small,
  },
  placeholderActive: {
    top: 0,
    fontSize: 12,
  },
  inputText: {
    color: COLORS.text,
    marginTop: 12,
    fontSize: FONT_SIZES.small,
  },
  list: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    position: "absolute",
    top: "100%",
    width: "92%",
    zIndex: 10,
    marginHorizontal: 14,
  },
  listItem: {
    paddingHorizontal: 35,
    paddingVertical: 14,
    backgroundColor: "transparent",
  },
  listItemSelected: {
    backgroundColor: COLORS.primary,
    color: COLORS.text,
  },
  listItemText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.small,
  },
  startBidWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 12,
    marginBottom: SPACING.medium,
    gap: SPACING.small,
  },
  startBidContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    height: 60,
    width: 80,
  },
  startBidInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONT_SIZES.small,
    paddingHorizontal: SPACING.medium,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  nextButtonDisabled: {
    backgroundColor: "#BBBBBB",
  },
  nextButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
  },
  iconSpacing: {
    borderWidth: 1,
    padding: 12,
    borderColor: COLORS.primary,
    borderRadius: 5,
  },
});
