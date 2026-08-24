/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

type ThemeName = "light" | "dark";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light,
) {
  const theme: ThemeName = useColorScheme() === "dark" ? "dark" : "light";
  const colorFromProps = theme === "light" ? props.light : props.dark;

  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[theme][colorName];
}
