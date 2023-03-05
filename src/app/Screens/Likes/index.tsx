import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { FlatList, StatusBar, useWindowDimensions, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
	Appbar,
	Caption,
	Divider,
	Text,
	TextInput,
	useTheme,
} from "react-native-paper";
import { UserAvatar } from "../../Components/UserAvatar";
import { LikeFull } from "../../types";
import { PostStackParamsList } from "../../types/navigation/PostStack";
import { definitions } from "../../types/supabase";

type Props = {
	route: RouteProp<PostStackParamsList, "Likes">;
	navigation: StackNavigationProp<PostStackParamsList, "Likes">;
};

type LikeListItemProps = {
	item: LikeFull;
	openProfile: (user: Partial<definitions["users"]>) => void;
};

const LikeListItem: React.FC<LikeListItemProps> = ({ item, openProfile }) => {
	return (
		<TouchableOpacity
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				margin: 16,
			}}
			onPress={() => openProfile(item.user)}
		>
			<UserAvatar size={32} profilePicture={item.user?.profilePic} />
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
					{item.user.username}
				</Text>
				<Caption>{item.user?.name}</Caption>
			</View>
		</TouchableOpacity>
	);
};

const Likes: React.FC<Props> = ({ route, navigation }) => {
	const { colors } = useTheme();
	const [searchTerm, setSearchTerm] = useState("");

	const [searchResults, setSearchResults] = useState<LikeFull[] | null>(null);

	useEffect(() => {
		if (searchTerm.length > 0) {
			setSearchResults(
				route.params.likes?.filter((item) =>
					item.user.username.includes(searchTerm.toLowerCase())
				)
			);
		} else {
			setSearchResults(null);
		}
	}, [route.params.likes, searchTerm]);
	const { height } = useWindowDimensions();

	const openProfile = (user: Partial<definitions["users"]>) =>
		navigation.navigate("Profile", user);

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
								color: colors.onBackground,
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
				data={searchResults ? searchResults : route.params.likes}
				ItemSeparatorComponent={Divider}
				renderItem={({ item }) => (
					<LikeListItem item={item} openProfile={openProfile} />
				)}
				keyExtractor={(item) => item.user.username}
				bouncesZoom
				bounces
			/>
		</View>
	);
};

export default Likes;
