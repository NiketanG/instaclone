import React, { useState } from "react";
import {
	RefreshControl,
	FlatList,
	StatusBar,
	View,
	useWindowDimensions,
} from "react-native";
import {
	ActivityIndicator,
	Appbar,
	Divider,
	Text,
	useTheme,
} from "react-native-paper";
import { observer } from "mobx-react-lite";
import useFeed from "../../utils/useFeed";
import { HomeStackNavigationParams } from "../../types/navigation";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Post from "../../Components/Post";
import PostBottomSheetWrapper from "../../Components/PostBottomSheetWrapper";

type Props = {
	route: RouteProp<HomeStackNavigationParams, "Home">;
	navigation: StackNavigationProp<HomeStackNavigationParams, "Home">;
	openMessages: () => void;
};

const Home: React.FC<Props> = observer(({ openMessages }) => {
	const { colors, dark } = useTheme();

	const { fetchFeed, loading, posts: feedPosts } = useFeed();

	const { height } = useWindowDimensions();

	const [openedModalData, setOpenedModalData] = useState<{
		modalType: "MENU" | "SHARE";
		username: string;
		postId: number;
	} | null>(null);

	const closeModal = () => setOpenedModalData(null);

	const onClose = () => setOpenedModalData(null);

	const openModal = (
		modalType: "MENU" | "SHARE",
		username: string,
		postId: number
	) =>
		setOpenedModalData({
			modalType,
			postId: postId,
			username: username,
		});

	return (
		<View
			style={{
				flex: 1,
				display: "flex",
				backgroundColor: colors.background,
			}}
		>
			<StatusBar
				backgroundColor={colors.background}
				barStyle={dark ? "light-content" : "dark-content"}
				animated
			/>

			<Appbar.Header
				style={{
					zIndex: 0,
					elevation: 0,
					backgroundColor: colors.background,
				}}
			>
				<Appbar.Content title="Instaclone" />

				<Appbar.Action icon="send-outline" onPress={openMessages} />
			</Appbar.Header>

			{loading && (
				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<ActivityIndicator color={colors.text} />
				</View>
			)}

			<PostBottomSheetWrapper
				onClose={onClose}
				openedModalData={openedModalData}
			>
				{!loading && feedPosts && (
					<FlatList
						ListEmptyComponent={
							<View
								style={{
									display: "flex",
									flexDirection: "column",
									height:
										height - (StatusBar.currentHeight || 0),
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Text>Nothing to see here, yet.</Text>
							</View>
						}
						data={feedPosts
							.slice()
							.sort(
								(a, b) =>
									new Date(b.postedAt).getTime() -
									new Date(a.postedAt).getTime()
							)}
						ItemSeparatorComponent={Divider}
						renderItem={({ item }) => (
							<Post
								openModal={openModal}
								closeModal={closeModal}
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
						style={{
							backgroundColor: colors.background,
						}}
						refreshControl={
							<RefreshControl
								refreshing={loading}
								onRefresh={fetchFeed}
							/>
						}
					/>
				)}
			</PostBottomSheetWrapper>
		</View>
	);
});

export default Home;
