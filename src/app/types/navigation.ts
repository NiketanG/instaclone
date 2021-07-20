import { User } from "../store/UsersStore";
import { definitions } from "./supabase";

export type MessageStackNavigationParams = {
	ChatList: undefined;
	NewChat: undefined;
	Messages: Partial<User>;
	Post: definitions["posts"];
	Profile: Partial<User>;
};
