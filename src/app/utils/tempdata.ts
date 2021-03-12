type User = {
	username: string;
	name: string | "";
	bio: string | "";
	profilePic?: string;
	followers: Array<User>;
	following: Array<User>;
	posts: Array<Post>;
};

type Post = {
	postId: number;
	username: string;
	imageUrl: string;
	caption: string | "";
	likes: number;
	postedAt: number;
};

export const PostsList: Array<Post> = [
	{
		imageUrl: "https://picsum.photos/500",
		caption: "New Post 2",
		username: "test",
		postId: 2,
		likes: 0,
		postedAt: 1614704108341,
	},
	{
		imageUrl: "https://picsum.photos/700",
		caption: "New Post",
		username: "nikketan",
		postId: 0,
		likes: 0,
		postedAt: 1614703922684,
	},
	{
		imageUrl: "https://picsum.photos/600",
		caption: "New Post 2",
		username: "nikketan",
		postId: 1,
		likes: 0,
		postedAt: 1614703942492,
	},
];

export const Users: Array<User> = [
	{
		username: "nikketan",
		bio: `// 19 //\nToxic | Rude | Weird | Genius`,
		followers: [],
		following: [],
		profilePic: "https://picsum.photos/600",
		name: "Niketan Gulekar",
		posts: PostsList.filter((post) => post.username === "nikketan"),
	},
	{
		username: "test",
		bio: `Test Bio`,
		followers: [],
		following: [],
		name: "Test User",
		posts: PostsList.filter((post) => post.username === "test"),
	},
];
