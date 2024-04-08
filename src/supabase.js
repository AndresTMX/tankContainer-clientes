import { createClient } from "@supabase/supabase-js";

const db = import.meta.env.VITE_URL_DATABASE;
const key = import.meta.env.VITE_KEY_SUPABASE;

const supabase = createClient(db, key);

export default supabase