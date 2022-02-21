import { ScrollView, StatusBar, TouchableHighlight, View } from "react-native";
import { Appbar, Button, Text, useTheme } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProfileStackParams } from "../../types/navigation/ProfileStack";
import { UserMin } from "../../types";
import { useContext } from "react";
import { AppContext } from "../../utils/appContext";
import { UserAvatar } from "../../Components/UserAvatar";
import { unfollowUser } from "../../../api";

type Props = {
	route: RouteProp<ProfileStackParams, "Following">;
	navigation: StackNavigationProp<ProfileStackParams, "Following">;
};

const Following: React.FC<Props> = ({ navigation, route }) => {
	const { colors, dark } = useTheme();
	const goBack = () => navigation.goBack();

	const { user: currentUser } = useContext(AppContext);
	const [isCurrentUser, setIsCurrentUser] = useState(false);
	useEffect(() => {
		if (route.params.username === currentUser?.username) {
			setIsCurrentUser(true);
		} else {
			setIsCurrentUser(false);
		}
	}, [currentUser, route.params.username]);

	const viewProfile = (user: UserMin) => navigation.navigate("Profile", user);

	const [following, setFollowing] = useState(() => route.params.following);

	const userUnfollow = async (username: string) => {
		if (!route.params.username || !isCurrentUser) return;

		unfollowUser(username);
		setFollowing(
			following.filter(
				(e) =>
					e.follower !== route.params.username &&
					e.following.username !== username
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
				{following &&
					following.map((follower) => (
						<TouchableHighlight
							key={follower.following.username}
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
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
									}}
								>
									<UserAvatar
										size={32}
										profilePicture={
											follower.following.profilePic
										}
									/>
									<View
										style={{
											marginLeft: 12,
										}}
									>
										<Text
											style={{
												fontWeight: "bold",
												fontSize: 16,
											}}
										>
											{follower.following.username}
										</Text>
										<Text
											style={{
												opacity: 0.7,
											}}
										>
											{follower.following.name}
										</Text>
									</View>
								</View>
								{isCurrentUser && (
									<Button
										mode="outlined"
										onPress={() => {
											userUnfollow(
												follower.following.username
											);
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
