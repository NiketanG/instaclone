import React from "react";
import Post from "../Post";
import { Post as PostType } from "../../types";

export const PostContainer: React.FC<{ item: PostType }> = ({ item }) => (
	<Post
		postId={item.postId}
		caption={item.caption}
		imageUrl={item.imageUrl}
		likes={item.likes}
		postedAt={item.postedAt}
		user={{
			username: item.username,
		}}
	/>
);
