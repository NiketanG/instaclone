import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Config from "react-native-config";

if (!Config.SUPABASE_URL || !Config.SUPABASE_KEY) {
	console.error("[Supabase] URL and Key not found in environment variables.");
}
const supabaseClient = createClient(
	"https://klmmjevfuntzgwauurst.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNzM4MTkwNCwiZXhwIjoxOTMyOTU3OTA0fQ.IF-DHFRfZ_vaaP6o5-LwFn7wCTimgCc025ENRCMJe-k",
	{
		localStorage: AsyncStorage as any,
	}
);

export default supabaseClient;
