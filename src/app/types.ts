export type Theme = "light" | "dark";

export type User = {
	username: string;
	email: string;
	name: string;
	bio?: string;
	profilePic?: string;
};
