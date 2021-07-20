import { ScrollView, StatusBar, TouchableHighlight, View } from "react-native";
import { Appbar, Button, Text, Title, useTheme } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProfileStackParams } from "../../types/navigation/ProfileStack";
import FollowersStore from "../../store/FollowersStore";
import useCurrentUser from "../../utils/useCurrentUser";

type Props = {
	route: RouteProp<ProfileStackParams, "Following">;
	navigation: StackNavigationProp<ProfileStackParams, "Following">;
};

const Following: React.FC<Props> = ({ navigation, route }) => {
	const { colors, dark } = useTheme();
	const goBack = () => navigation.goBack();

	const currentUser = useCurrentUser();
	const [isCurrentUser, setIsCurrentUser] = useState(false);
	useEffect(() => {
		if (route.params.username === currentUser?.username) {
			setIsCurrentUser(true);
		} else {
			setIsCurrentUser(false);
		}
	}, [currentUser, route.params.username]);

	const viewProfile = (username: string) => {
		navigation.push("Profile", {
			username,
		});
	};

	const [following, setFollowing] = useState(() => route.params.following);

	const unfollowUser = async (username: string) => {
		if (!route.params.username || !isCurrentUser) return;

		FollowersStore.unfollowUser(username, route.params.username);
		setFollowing(
			following.filter(
				(e) =>
					e.follower !== route.params.username &&
					e.following !== username
			)
		);
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
				<Appbar.Content title={"Following"} />
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
								{isCurrentUser && (
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
