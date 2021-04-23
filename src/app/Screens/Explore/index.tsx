import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	View,
	Image,
	ScrollView,
	useWindowDimensions,
	TouchableHighlight,
	RefreshControl,
	TextInput,
} from "react-native";
import { Caption, IconButton, Text, useTheme } from "react-native-paper";
import { UserAvatar } from "../../Components/UserAvatar";

import { ExploreStackNavigationParams } from "../../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import UsersStore from "../../store/UsersStore";
import { Post } from "../../store/PostsStore";
import supabaseClient from "../../utils/supabaseClient";
import { definitions } from "../../types/supabase";
import { mapPosts } from "../../utils/utils";

type Props = {
	navigation: StackNavigationProp<ExploreStackNavigationParams, "Explore">;
};

const Explore: React.FC<Props> = ({ navigation }) => {
	const { width, height } = useWindowDimensions();
	const { colors } = useTheme();
	const imageMargin = 2;
	const imageWidth = (width - 16) / 3 - imageMargin * 2;

	const [searchTerm, setSearchTerm] = useState("");

	const [searchResults, setSearchResults] = useState<null | Array<
		definitions["users"]
	>>(null);
	const [postList, setPostList] = useState<Array<Post> | null>(null);

	const fetchPosts = async () => {
		setLoading(true);
		try {
			const postRes = await supabaseClient
				.from<definitions["posts"]>("posts")
				.select("*")
				.order("postedAt");
			if (postRes.error) return;
			if (postRes.data.length > 0) {
				setPostList(mapPosts(postRes.data));
				return;
			}
		} catch (err) {
			console.error("[fetchPosts]", err);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchPosts();
	}, []);

	const searchUser = async (username: string) => {
		setSearchTerm(username);
		if (username.length < 2) return;

		const userRes = await supabaseClient
			.from<definitions["users"]>("users")
			.select("*")
			// .ilike("name", `%${username.toLowerCase()}%`);
			// .ilike("username", `%${username.toLowerCase()}%`);
			.or(
				`name.ilike.%${username.toLowerCase()}%,username.ilike.%${username.toLowerCase()}%`
			);

		if (userRes.error) return;

		if (userRes.data.length > 0) {
			setSearchResults(userRes.data);
			UsersStore.addUsers(userRes.data);
			return;
		} else {
			setSearchResults(null);
		}
	};

	const [searchFocused, setSearchFocused] = useState(false);
	const [loading, setLoading] = useState(false);

	const goBack = () => navigation.goBack();

	const closeSearch = () => {
		setSearchFocused(false);
		setSearchTerm("");
	};

	return (
		<ScrollView
			style={{
				...styles.container,
				backgroundColor: colors.background,
				height: "100%",
			}}
		>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
				}}
			>
				{searchFocused && (
					<IconButton
						icon="arrow-left"
						onPress={closeSearch}
						size={20}
						style={{ marginTop: 12, marginRight: 8 }}
					/>
				)}

				<TextInput
					placeholder="Search"
					placeholderTextColor={"gray"}
					value={searchTerm}
					onFocus={() => setSearchFocused(true)}
					onChangeText={(text) => searchUser(text)}
					style={{
						flex: 1,
						height: 40,
						backgroundColor: "#2a2a2a",
						borderRadius: 12,
						paddingHorizontal: 16,
						color: colors.text,
					}}
				/>
			</View>
			{searchFocused ? (
				<View
					style={{
						backgroundColor: colors.background,
						zIndex: 5,
						flex: 1,
						width: "100%",
						elevation: 5,
						borderBottomEndRadius: 8,
						borderBottomStartRadius: 8,
					}}
				>
					{!searchResults && searchTerm.length >= 2 && (
						<Text
							style={{
								textAlign: "center",
								marginTop: 12,
							}}
						>
							No Users
						</Text>
					)}
					{searchResults &&
						searchResults.length > 0 &&
						searchResults?.map((user) => (
							<TouchableHighlight
								key={user.username}
								onPress={() => {
									setSearchTerm("");
									navigation.navigate("Profile", {
										username: user.username,
										profilePic: user.profilePic,
										goBack,
										showBackArrow: true,
									});
								}}
							>
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										margin: 16,
									}}
								>
									<UserAvatar
										profilePicture={user.profilePic}
									/>
									<View
										style={{
											marginHorizontal: 16,
										}}
									>
										<Text
											style={{
												fontSize: 14,
												fontWeight: "bold",
											}}
										>
											{user.username}
										</Text>
										<Caption>{user.name}</Caption>
									</View>
								</View>
							</TouchableHighlight>
						))}
				</View>
			) : (
				<ScrollView
					contentContainerStyle={{
						...styles.grid,
					}}
					style={{
						height: height - 128,
					}}
					refreshControl={
						<RefreshControl
							refreshing={loading}
							onRefresh={fetchPosts}
						/>
					}
				>
					{postList &&
						postList.map((post) => (
							<TouchableHighlight
								key={post.postId}
								onPress={() => {
									navigation.navigate("PostDetail", {
										post,
										user: {
											username: post.user,
											profilePic: undefined,
										},
									});
								}}
							>
								<Image
									source={{
										uri: post.imageUrl,
									}}
									width={imageWidth}
									height={imageWidth}
									style={{
										backgroundColor: "gray",
										margin: imageMargin,
										width: imageWidth,
										height: imageWidth,
									}}
								/>
							</TouchableHighlight>
						))}
				</ScrollView>
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 8,
		paddingTop: 8,
	},
	grid: {
		flex: 1,
		width: "100%",
		marginVertical: 12,
		flexDirection: "row",
		flexWrap: "wrap",
	},
});

export default Explore;
