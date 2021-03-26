import { Instance } from "mobx-state-tree";
import { UserModel } from "./store/UsersStore";

export type Theme = "light" | "dark";

export type Like = {
	postId: string;
	username: string;
};

export type Follower = {
	follower: string;
	following: string;
};

export type Comment = {
	commentId: string;
	postId: string;
	comment: string;
	username: string | "";
	profilePic: string | null;
	postedAt: Date;
};
