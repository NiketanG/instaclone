import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import Post from "../../Components/Post";
import PostBottomSheetWrapper from "../../Components/PostBottomSheetWrapper";
import { ExploreStackNavigationParams } from "../../types/navigation";

type Props = {
	route: RouteProp<ExploreStackNavigationParams, "PostDetail">;
	navigation: StackNavigationProp<ExploreStackNavigationParams, "PostDetail">;
};

const PostDetail: React.FC<Props> = ({ route, navigation }) => {
	const { colors } = useTheme();
	const [openedModalData, setOpenedModalData] = useState<{
		modalType: "MENU" | "SHARE";
		username: string;
		postId: number;
	} | null>(null);

	const closeModal = () => {
		setOpenedModalData(null);
	};
	const onClose = () => setOpenedModalData(null);

	const openModal = (
		modalType: "MENU" | "SHARE",
		username: string,
		postId: number
	) => {
		setOpenedModalData({
			modalType,
			postId: postId,
			username: username,
		});
	};

	return (
		<View
			style={{
				backgroundColor: colors.background,
				flex: 1,
			}}
		>
			<Appbar.Header
				style={{
					backgroundColor: colors.background,
				}}
			>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Post" />
			</Appbar.Header>

			<PostBottomSheetWrapper
				onClose={onClose}
				openedModalData={openedModalData}
			>
				<Post
					openModal={openModal}
					closeModal={closeModal}
					caption={route.params.post.caption}
					imageUrl={route.params.post.imageUrl}
					postId={route.params.post.postId}
					postedAt={route.params.post.postedAt}
					user={route.params.user}
				/>
			</PostBottomSheetWrapper>
		</View>
	);
};

export default PostDetail;
