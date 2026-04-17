import { supabase } from "@/app/lib/supabase";

export const logout = async () => {
  await supabase.auth.signOut();
  window.location.href = "/login";
};