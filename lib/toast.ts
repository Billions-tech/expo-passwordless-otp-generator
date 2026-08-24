import Toast from "react-native-toast-message";

export type ToastType = "success" | "error" | "info";

export function showToast(message: string, type: ToastType = "info") {
  const titleMap = {
    success: "✓ Success",
    error: "⚠ Error",
    info: "ℹ Info",
  };

  Toast.show({
    type,
    text1: titleMap[type],
    text2: message,
    autoHide: true,
  });
}
