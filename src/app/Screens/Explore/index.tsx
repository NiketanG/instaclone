import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
	Image,
	RefreshControl,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableHighlight,
	useWindowDimensions,
	View,
} from "react-native";
import {
	ActivityIndicator,
	Caption,
	IconButton,
	Text,
	useTheme,
} from "react-native-paper";
import { useQuery } from "react-query";
import { getExplorePosts, searchUsers } from "../../../api";
import Error from "../../Components/Error";
import { UserAvatar } from "../../Components/UserAvatar";
import { ExploreStackNavigationParams } from "../../types/navigation/ExploreStack";

type Props = {
	navigation: StackNavigationProp<ExploreStackNavigationParams, "Explore">;
};

const Explore: React.FC<Props> = ({ navigation }) => {
	const { width, height } = useWindowDimensions();
	const { colors } = useTheme();
	const imageMargin = 2;
	const imageWidth = (width - 16) / 3 - imageMargin * 2;

	const [searchTerm, setSearchTerm] = useState("");

	const { data, isLoading, error, refetch } = useQuery("explorePosts", () =>
		getExplorePosts()
	);

	const { data: searchResults, isLoading: isLoadingSearch } = useQuery(
		`searchResults_${searchTerm}`,
		() => searchUsers(searchTerm),
		{
			enabled: searchTerm.length > 0,
		}
	);

	const searchUser = async (username: string) => {
		setSearchTerm(username);
		if (username.length < 2) return;
	};

	const [searchFocused, setSearchFocused] = useState(false);

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
			{error && <Error />}
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
						color: colors.onBackground,
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
					{isLoadingSearch && (
						<ActivityIndicator style={{ marginTop: 16 }} />
					)}
					{!isLoading && searchResults?.length === 0 && (
						<Text
							style={{
								textAlign: "center",
								marginTop: 12,
							}}
						>
							No Users
						</Text>
					)}
					{!isLoading &&
						searchResults &&
						searchResults.length > 0 &&
						searchResults?.map((user) => (
							<TouchableHighlight
								key={user.username}
								onPress={() => {
									setSearchTerm("");
									navigation.navigate("PostsList" as any, {
										screen: "Profile",
										params: {
											username: user.username,
											profilePic: user.profilePic,
										},
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
							refreshing={isLoading}
							onRefresh={refetch}
						/>
					}
				>
					{data
						?.sort((a, b) => b.likes.length - a.likes.length)
						.map((post) => (
							<TouchableHighlight
								key={post.postId}
								onPress={() => {
									navigation.navigate("PostsList" as any, {
										screen: "PostsList",
										params: {
											postId: post.postId,
											postList: data.sort(
												(a, b) =>
													b.likes.length -
													a.likes.length
											),
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
