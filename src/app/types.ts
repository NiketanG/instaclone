export type Theme = "light" | "dark";

export type User = {
	username: string;
	name: string;
	bio: string | "";
	profilePic?: string;
};

export type Post = {
	postId: string;
	imageUrl: string;
	caption: string | "";
	likes: number;
	username: string;
	postedAt: Date;
};

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
