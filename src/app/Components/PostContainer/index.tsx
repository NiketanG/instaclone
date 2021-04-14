import React from "react";
import { definitions } from "../../types/supabase";
import Post from "../Post";

export const PostContainer: React.FC<{
	item: definitions["posts"];
}> = ({ item }) => {
	return (
		<Post
			postId={item.postId}
			caption={item.caption}
			imageUrl={item.imageUrl}
			postedAt={item.postedAt}
			user={{
				username: item.user,
			}}
		/>
	);
};
