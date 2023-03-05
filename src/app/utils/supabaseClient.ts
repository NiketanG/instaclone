import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Config from "react-native-config";

if (!Config.SUPABASE_URL || !Config.SUPABASE_KEY) {
	console.error("[Supabase] URL and Key not found in environment variables.");
}
const supabaseClient = createClient(
	Config.SUPABASE_URL!,
	Config.SUPABASE_KEY!,
	{
		localStorage: AsyncStorage as any,
	}
);

export default supabaseClient;
