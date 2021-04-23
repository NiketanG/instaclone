import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { FlatList, StatusBar, useWindowDimensions, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
	Appbar,
	useTheme,
	ActivityIndicator,
	TextInput,
	Divider,
	Text,
	Caption,
} from "react-native-paper";
import { UserAvatar } from "../../Components/UserAvatar";
import { Like } from "../../store/LikesStore";
import { PostStackNavigationParams } from "../../types/navigation";
import usePost from "../../utils/usePost";
import useUser from "../../utils/useUser";

type Props = {
	route: RouteProp<PostStackNavigationParams, "EditPost">;
	navigation: StackNavigationProp<PostStackNavigationParams, "EditPost">;
};

type LikeListItemProps = {
	item: Like;
	openProfile: (username: string) => void;
};

const LikeListItem: React.FC<LikeListItemProps> = ({ item, openProfile }) => {
	const { user } = useUser(item.user);
	return (
		<TouchableOpacity
			key={item.user}
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				margin: 16,
			}}
			onPress={() => openProfile(item.user)}
		>
			<UserAvatar size={32} profilePicture={user?.profilePic} />
			<View
				style={{
					marginLeft: 16,
				}}
			>
				<Text
					style={{
						fontSize: 18,
					}}
				>
					{item.user}
				</Text>
				<Caption>{user?.name}</Caption>
			</View>
		</TouchableOpacity>
	);
};

const Likes: React.FC<Props> = ({ route, navigation }) => {
	const { colors } = useTheme();
	const { likes, loading } = usePost(route.params.postId);
	const [searchTerm, setSearchTerm] = useState("");

	const [searchResults, setSearchResults] = useState<Like[] | null>(null);

	useEffect(() => {
		if (searchTerm.length > 0) {
			setSearchResults(
				likes.filter((item) =>
					item.user.includes(searchTerm.toLowerCase())
				)
			);
		} else {
			setSearchResults(null);
		}
	}, [likes, searchTerm]);
	const { height } = useWindowDimensions();

	const openProfile = () => {};

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
				<Appbar.Content title="Likes" />
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

			<FlatList
				ListHeaderComponent={
					<>
						<TextInput
							placeholder="Search"
							placeholderTextColor={"gray"}
							onChangeText={(text) => setSearchTerm(text)}
							style={{
								flex: 1,
								marginHorizontal: 16,
								marginVertical: 16,
								height: 40,
								backgroundColor: "#3a3a3a",
								borderRadius: 6,
								paddingHorizontal: 16,
								color: colors.text,
							}}
						/>
						<Divider />
					</>
				}
				ListEmptyComponent={
					<View
						style={{
							display: "flex",
							flexDirection: "column",
							height: height - (StatusBar.currentHeight || 0),
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Text>Nothing to see here, yet.</Text>
					</View>
				}
				data={searchResults ? searchResults : likes}
				ItemSeparatorComponent={Divider}
				renderItem={({ item }) => (
					<LikeListItem item={item} openProfile={openProfile} />
				)}
				keyExtractor={(item) => item.user}
				bouncesZoom
				bounces
			/>
		</View>
	);
};

export default Likes;
