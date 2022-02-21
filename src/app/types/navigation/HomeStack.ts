import { User } from "../../types";

export type HomeStackNavigationParams = {
	Feed: undefined;
	Profile: Partial<User>;
};
