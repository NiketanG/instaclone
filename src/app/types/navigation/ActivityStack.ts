import { StackNavigationProp } from "@react-navigation/stack";
import { User } from "../../types";
import { definitions } from "../supabase";

export type ActivityStackNavigationParams = {
	Notifications: undefined;
	Post: {
		post: definitions["posts"];
		user: Pick<definitions["users"], "name" | "profilePic" | "username">;
	};
	Profile: Partial<User>;
};

export type NotificationsNavigationProp = StackNavigationProp<
	ActivityStackNavigationParams,
	"Notifications"
>;
