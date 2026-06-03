import { Text } from "@/components/ui/Text";
import { COLORS, FONT_SIZES } from "@/constants/theme";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type ConfirmDialogProps = {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
};

export function ConfirmDialog({
  visible,
  onDismiss,
  onConfirm,
  title,
  message,
  confirmText = "Yes",
  cancelText = "No",
  destructive = true,
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onDismiss}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                onConfirm();
                onDismiss();
              }}
              style={styles.confirmButton}
            >
              <Text
                style={[
                  styles.confirmText,
                  destructive && { color: COLORS.alert },
                ]}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  dialog: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 10,
    borderColor: COLORS.primary,
    borderWidth: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    lineHeight: 26,
    color: COLORS.text,
    fontSize: FONT_SIZES.large,
    marginBottom: 10,
  },
  message: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  cancelText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.medium,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#d4d4d4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmText: {
    fontSize: FONT_SIZES.medium,
  },
});
