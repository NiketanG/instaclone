import React, { useEffect, useRef, useState } from "react";
import { Appbar, Divider, useTheme } from "react-native-paper";
import { FlatList, StatusBar, useWindowDimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProfileStackParams } from "../../types/navigation";
import { RouteProp } from "@react-navigation/native";
import { definitions } from "../../types/supabase";
import Post from "../../Components/Post";
import PostBottomSheetWrapper from "../../Components/PostBottomSheetWrapper";

type Props = {
	navigation: StackNavigationProp<ProfileStackParams, "Posts">;
	route: RouteProp<ProfileStackParams, "Posts">;
};

const PostList: React.FC<Props> = ({ navigation, route }) => {
	const listRef = useRef<FlatList>(null);
	const goBack = () => {
		if (route.params.goBack) {
			route.params.goBack();
		} else {
			navigation.goBack();
		}
	};

	const { colors } = useTheme();

	useEffect(() => {
		if (route.params?.postId && route.params?.postList) {
			const postIndex = route.params.postList.findIndex(
				(post) => post.postId === route.params.postId
			);

			listRef.current?.scrollToIndex({
				index: postIndex,
			});
		}
	}, [route]);

	const { width } = useWindowDimensions();

	const getItemLayout = (
		data: Array<definitions["posts"]> | null | undefined,
		index: number
	): {
		length: number;
		offset: number;
		index: number;
	} => {
		const postItemHeight = width + 234;
		return {
			index,
			length: postItemHeight,
			offset: postItemHeight * index,
		};
	};

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
		<>
			<StatusBar
				backgroundColor="black"
				barStyle="light-content"
				animated
			/>
			<Appbar.Header
				style={{
					backgroundColor: "black",
				}}
			>
				<Appbar.BackAction onPress={goBack} />
				<Appbar.Content title="Posts" />
			</Appbar.Header>

			<PostBottomSheetWrapper
				onClose={onClose}
				openedModalData={openedModalData}
			>
				{route.params.postList && (
					<FlatList
						ref={listRef}
						getItemLayout={getItemLayout}
						data={route.params.postList.sort(
							(a, b) =>
								new Date(b.postedAt).getTime() -
								new Date(a.postedAt).getTime()
						)}
						ItemSeparatorComponent={Divider}
						renderItem={({ item }) => (
							<Post
								closeModal={closeModal}
								openModal={openModal}
								caption={item.caption}
								imageUrl={item.imageUrl}
								postId={item.postId}
								postedAt={item.postedAt}
								user={{
									username: item.user,
									profilePic: undefined,
								}}
							/>
						)}
						keyExtractor={(item) => item.postId.toString()}
						bouncesZoom
						bounces
						snapToAlignment={"start"}
						showsVerticalScrollIndicator
						style={{
							backgroundColor: colors.background,
						}}
					/>
				)}
			</PostBottomSheetWrapper>
		</>
	);
};

export default PostList;
