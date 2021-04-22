import React from "react";
import { ToastAndroid, useWindowDimensions, View } from "react-native";
import { List } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import PostsStore from "../../store/PostsStore";

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
	const navigation = useNavigation();
	const deletePost = async () => {
		try {
			await PostsStore.deletePost(postId);
			closeModal();
			navigation.goBack();
		} catch (err) {
			console.error("[deletePost]", err);
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
		}
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
				<List.Item
					title="Delete Post"
					onPress={deletePost}
					style={{
						paddingHorizontal: 16,
					}}
				/>
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
