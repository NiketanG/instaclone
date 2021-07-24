import { ScrollView, StatusBar, TouchableHighlight, View } from "react-native";
import { Appbar, Text, useTheme } from "react-native-paper";
import React from "react";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProfileStackParams } from "../../types/navigation/ProfileStack";
import { UserMin } from "../../types";
import { UserAvatar } from "../../Components/UserAvatar";

type Props = {
	route: RouteProp<ProfileStackParams, "Followers">;
	navigation: StackNavigationProp<ProfileStackParams, "Followers">;
};

const Followers: React.FC<Props> = ({ navigation, route }) => {
	const { colors, dark } = useTheme();
	const goBack = () => navigation.goBack();
	const viewProfile = (user: UserMin) => {
		navigation.navigate("Profile", user);
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
				<Appbar.Content title={"Followers"} />
			</Appbar.Header>

			<ScrollView
				style={{
					padding: 16,
				}}
			>
				{route.params.followers.map((follower) => (
					<TouchableHighlight
						key={follower.follower.username}
						onPress={() => viewProfile(follower.follower)}
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
										follower.follower.profilePic
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
										{follower.follower.username}
									</Text>
									<Text
										style={{
											opacity: 0.7,
										}}
									>
										{follower.follower.name}
									</Text>
								</View>
							</View>
						</View>
					</TouchableHighlight>
				))}
			</ScrollView>
		</View>
	);
};

export default Followers;
