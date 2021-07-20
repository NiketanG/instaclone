import { useContext, useEffect, useState } from "react";
import CommentsStore, { Comment } from "../store/CommentsStore";
import LikesStore, { Like } from "../store/LikesStore";
import { AppContext } from "./appContext";
import {
	deleteCommentFromDb,
	fetchCommentsFromDb,
	getLikesFromDb,
	likePostInDb,
	newCommentInDb,
	unlikePostInDb,
} from "./supabaseUtils";
import { uniqueList } from "./utils";

type PostData = {
	loading: boolean;
	liked: boolean;
	likes: Like[];
	comments: Comment[];
	toggleLike: () => void;
	addComment: (comment: Pick<Comment, "comment" | "postId" | "user">) => void;
	deleteComment: (commentId: number) => void;
};
const usePost = (postId?: number | null): PostData => {
	const [loading, setLoading] = useState(true);
	const { user: currentUser } = useContext(AppContext);
	const [likes, setLikes] = useState<Array<Like>>([]);
	const [comments, setComments] = useState<Array<Comment>>([]);
	const [liked, setLiked] = useState(false);

	const fetchPostData = async () => {
		if (!postId)
			return {
				likes: [],
				comments: [],
			};

		try {
			const likesData = await getLikesFromDb(postId);
			const commentsData = await fetchCommentsFromDb(postId);

			if (likesData.length > 0)
				LikesStore.setLikes(
					uniqueList<Like>(LikesStore.likes, likesData, "id")
				);

			if (commentsData)
				CommentsStore.setComments(
					uniqueList<Comment>(
						CommentsStore.comments,
						commentsData,
						"id"
					)
				);

			const isLiked = likesData.find(
				(like) =>
					like.postId === postId &&
					like.user === currentUser?.username
			)
				? true
				: false;

			return {
				liked: isLiked,
				likes: likesData,
				comments: commentsData || [],
			};
		} catch (err) {
			console.error("[fetchPostData]", err);
			return {
				likes: [],
				comments: [],
			};
		}
	};

	const toggleLike = () => (liked ? unlikePost() : likePost());

	const likePost = async () => {
		if (!postId) return false;
		setLiked(true);
		const like = await likePostInDb(postId);
		if (like) {
			LikesStore.addLike(like);
			setLikes([...likes, like]);
		}
	};

	const unlikePost = async () => {
		if (!(postId && currentUser)) return false;
		setLiked(false);
		setLikes(
			likes.filter(
				(like) =>
					like.postId !== postId && like.user !== currentUser.username
			)
		);
		LikesStore.deleteLike({
			postId,
			user: currentUser.username,
		});
		await unlikePostInDb(postId);
	};

	const addComment = async (
		comment: Pick<Comment, "comment" | "postId" | "user">
	) => {
		const newComment = await newCommentInDb(comment);
		if (newComment) {
			setComments([...comments, newComment]);
			CommentsStore.addComment(newComment);
		}
	};

	const deleteComment = async (commentId: number) => {
		const tempComments = comments.filter(
			(comment) => comment.id !== commentId
		);
		setComments(tempComments);
		await deleteCommentFromDb(commentId);
		CommentsStore.deleteComment(commentId);
	};

	useEffect(() => {
		if (postId && currentUser) {
			const likesData = LikesStore.likes.filter(
				(post) => post.postId === postId
			);
			if (likesData) {
				const isLiked = likesData.find(
					(like) =>
						like.postId === postId &&
						like.user === currentUser.username
				)
					? true
					: false;
				setLiked(isLiked);
				setLikes(likesData);
			}

			const commentsData = CommentsStore.comments.filter(
				(comment) => comment.postId === postId
			);
			if (commentsData) setComments(commentsData);
			setLoading(false);
		}
	}, [currentUser, postId]);

	const fetchPost = async () => {
		const postData = await fetchPostData();
		if (postData) {
			if (postData.likes) {
				setLikes(postData.likes);
			}
			if (postData.comments) {
				setComments(postData.comments);
			}
			if (postData.liked) {
				setLiked(postData.liked);
			}

			setLoading(false);
		}
	};

	useEffect(() => {
		if (postId) fetchPost();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postId, currentUser]);

	if (!postId)
		return {
			comments,
			likes,
			liked,
			loading,
			toggleLike,
			addComment,
			deleteComment,
		};

	return {
		comments,
		likes,
		loading,
		liked,
		toggleLike,
		addComment,
		deleteComment,
	};
};

export default usePost;
