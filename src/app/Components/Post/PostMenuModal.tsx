import React from "react";
import { ToastAndroid, useWindowDimensions, View } from "react-native";
import { List } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { deletePost } from "../../../api";
import { useMutation } from "react-query";
import { useContext } from "react";
import { AppContext } from "../../utils/appContext";
import { queryClient } from "../../utils/queryClient";
import { UserFull } from "../../types";
import { FeedNavigationProp } from "../../types/navigation/PostStack";

type ModalProps = {
	closeModal: () => void;
	ownPost: boolean;
	postId: number;
	username: string;
	viewProfile: () => void;
};

export const PostModal: React.FC<ModalProps> = ({
	postId,
	closeModal,
	ownPost,
	viewProfile,
}) => {
	const { width } = useWindowDimensions();
	const navigation = useNavigation<FeedNavigationProp>();
	const { user: currUser } = useContext(AppContext);

	const deletePostMutation = useMutation<boolean | null, unknown, number>(
		(postToDelete) => deletePost(postToDelete),
		{
			onMutate: async (postToDelete) => {
				if (!currUser) return null;
				await queryClient.cancelQueries(
					`userInfo_${currUser.username}`
				);

				const currUserData = queryClient.getQueryData<
					UserFull | null | undefined
				>(`userInfo_${currUser.username}`);

				let posts;
				if (currUserData) {
					posts = currUserData.posts.filter(
						(item) => item.postId !== postToDelete
					);
					queryClient.setQueryData<UserFull>(
						`userInfo_${currUser.username}`,
						{
							...currUserData,
							posts,
						}
					);
				}

				return { currUserData };
			},
			onSettled: () => {
				queryClient.invalidateQueries(`feedPosts`);
				if (currUser)
					queryClient.invalidateQueries(
						`userInfo_${currUser.username}`
					);
			},
		}
	);
	const postDelete = async () => {
		try {
			deletePostMutation.mutate(postId);
			closeModal();
			navigation.goBack();
		} catch (err) {
			console.error("[deletePost]", err);
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
		}
	};

	const editPost = () => {
		navigation.navigate("EditPost", {
			postId,
		});
		closeModal();
	};

	const openProfile = () => {
		closeModal();
		viewProfile();
	};

	return (
		<View
			style={{
				width,
				backgroundColor: "#1f1f1f",
				justifyContent: "center",
				paddingVertical: 16,
				zIndex: 6,
				elevation: 6,
			}}
		>
			{ownPost && (
				<>
					<List.Item
						title="Delete Post"
						onPress={postDelete}
						style={{
							paddingHorizontal: 16,
						}}
					/>
					<List.Item
						title="Edit Post"
						onPress={editPost}
						style={{
							paddingHorizontal: 16,
						}}
					/>
				</>
			)}

			<List.Item
				title="View Profile"
				onPress={openProfile}
				style={{
					paddingHorizontal: 16,
				}}
			/>
		</View>
	);
};
