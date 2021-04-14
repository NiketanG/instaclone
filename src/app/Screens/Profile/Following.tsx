import { ScrollView, StatusBar, TouchableHighlight, View } from "react-native";
import { Appbar, Button, Text, Title, useTheme } from "react-native-paper";
import React, { useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProfileStackParams } from "../../types/navigation";
import FollowersStore from "../../store/FollowersStore";

type Props = {
	route: RouteProp<ProfileStackParams, "Following">;
	navigation: StackNavigationProp<ProfileStackParams, "Following">;
};

const Following: React.FC<Props> = ({ navigation, route }) => {
	const { colors, dark } = useTheme();
	const goBack = () => navigation.goBack();
	const viewProfile = (username: string) => {
		navigation.push("ProfilePage", {
			username,
			isCurrentUser: false,
		});
	};

	const [following, setFollowing] = useState(() => route.params.following);

	const unfollowUser = async (username: string) => {
		if (!route.params.username || !route.params.isCurrentUser) return;

		const res = FollowersStore.unfollowUser(
			username,
			route.params.username
		).then();
		if (res) {
			setFollowing(
				following.filter(
					(e) =>
						e.follower !== route.params.username &&
						e.following !== username
				)
			);
		}
	};

	return (
		<View
			style={{
				backgroundColor: colors.background,
				flex: 1,
			}}
		>
			<StatusBar
				backgroundColor={colors.background}
				barStyle={dark ? "light-content" : "dark-content"}
				animated
			/>
			<Appbar.Header
				style={{
					backgroundColor: "black",
				}}
			>
				<Appbar.Action icon="arrow-left" onPress={goBack} />
				<Appbar.Content title={route.params.username || "Following"} />
			</Appbar.Header>

			<ScrollView
				style={{
					padding: 16,
				}}
			>
				<Title>All Following</Title>
				{following &&
					following.map((follower) => (
						<TouchableHighlight
							key={follower.following}
							onPress={() => viewProfile(follower.following)}
						>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									justifyContent: "space-between",

									paddingVertical: 8,
									alignItems: "center",
								}}
							>
								<Text
									style={{
										fontWeight: "bold",
										fontSize: 16,
									}}
								>
									{follower.following}
								</Text>
								{route.params.isCurrentUser && (
									<Button
										mode="outlined"
										onPress={() => {
											unfollowUser(follower.following);
										}}
									>
										Unfollow
									</Button>
								)}
							</View>
						</TouchableHighlight>
					))}
			</ScrollView>
		</View>
	);
};

export default Following;
