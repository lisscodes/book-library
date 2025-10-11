import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ftzjtnelcmbbczpkrigd.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0emp0bmVsY21iYmN6cGtyaWdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2OTA2MDksImV4cCI6MjA3NTI2NjYwOX0.jSo_BfKXDWPwHex-pEJkQGsS-QvUPG9sD7RdyBufl3o";

export const supabase = createClient(supabaseUrl, supabaseKey);
