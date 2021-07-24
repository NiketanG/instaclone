import { StackNavigationProp } from "@react-navigation/stack";
import { User } from "../../types";
import { definitions } from "../supabase";

export type MessageStackNavigationParams = {
	ChatList: undefined;
	NewChat: undefined;
	Messages: Pick<definitions["users"], "name" | "profilePic" | "username">;
	Post: definitions["posts"];
	Profile: Partial<User>;
};
export type MessagesNavigationProp = StackNavigationProp<
	MessageStackNavigationParams,
	"Messages"
>;
