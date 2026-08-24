export const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  "https://oyfilrgjhcagymdizuyn.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.EXPO_PUBLIC_SUPABASE_KEY ??
  "sb_publishable_ceaiqJ6OMeBe1CX8p_D8MA_VbMwyMTe";

export const APP_SCHEME = process.env.EXPO_PUBLIC_APP_SCHEME ?? "campusaccess";
