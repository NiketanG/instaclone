import { ScrollView, StatusBar, TouchableHighlight, View } from "react-native";
import { Appbar, Text, Title, useTheme } from "react-native-paper";
import React from "react";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProfileStackParams } from "../../types/navigation";

type Props = {
	route: RouteProp<ProfileStackParams, "Followers">;
	navigation: StackNavigationProp<ProfileStackParams, "Followers">;
};

const Followers: React.FC<Props> = ({ navigation, route }) => {
	const { colors, dark } = useTheme();
	const goBack = () => navigation.goBack();
	const viewProfile = (username: string) => {
		navigation.push("ProfilePage", {
			username,
			showBackArrow: true,
		});
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
				<Title>All Followers</Title>
				{route.params.followers.map((follower) => (
					<TouchableHighlight
						key={follower.following}
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
							<Text
								style={{
									fontWeight: "bold",
									fontSize: 16,
								}}
							>
								{follower.follower}
							</Text>
						</View>
					</TouchableHighlight>
				))}
			</ScrollView>
		</View>
	);
};

export default Followers;
