import React, { useContext, useState } from "react";
import { ToastAndroid, View } from "react-native";
import { GoogleSignin } from "@react-native-community/google-signin";
import { Button, useTheme, Title, Caption } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { SignInNavigationParams } from "../../types/navigation/SignInStack";
import { AppContext } from "../../utils/appContext";
import supabaseClient from "../../utils/supabaseClient";
import { definitions } from "../../types/supabase";
import Config from "react-native-config";
import { Linking } from "react-native";

if (!Config.GOOGLE_CLIENT_ID) {
	console.error("[Login] GOOGLE_CLIENT_ID Not found");
}
GoogleSignin.configure({
	webClientId: Config.GOOGLE_CLIENT_ID,
});

type Props = {
	navigation: StackNavigationProp<SignInNavigationParams, "Login">;
};

const Login: React.FC<Props> = ({ navigation }) => {
	const { setSignupDone, setUser } = useContext(AppContext);

	const [loading, setLoading] = useState(false);

	const signIn = async () => {
		setLoading(true);

		try {
			const res = await GoogleSignin.signIn();

			if (!res.user.email) {
				console.error("[GoogleAuth] No Email Returned");
				ToastAndroid.show("An error occured", ToastAndroid.LONG);
				setLoading(false);
				return;
			}

			const userExists = await supabaseClient
				.from<definitions["users"]>("users")
				.select("*")
				.eq("email", res.user.email);

			if (userExists && userExists.data && userExists.data.length > 0) {
				const user = userExists.data[0];
				setLoading(false);
				setSignupDone(true);
				ToastAndroid.show("Logged in", ToastAndroid.LONG);
				setUser(user);
			} else {
				setLoading(false);
				setSignupDone(false);
				console.log("Logged In");
				navigation.navigate("Signup", {
					name: res.user.name,
					email: res.user.email,
					profilePic: res.user.photo,
				});
			}
		} catch (err) {
			console.error("[signIn]", err);
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
			setLoading(false);
		}
	};

	const { colors } = useTheme();

	const openGithub = () => Linking.openURL("https://github.com/NiketanG");
	return (
		<View
			style={{
				backgroundColor: colors.background,
				flex: 1,
				paddingHorizontal: 32,
				paddingVertical: 16,
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<View
				style={{
					justifyContent: "center",
					alignItems: "center",
					flexGrow: 1,
				}}
			>
				<Title
					style={{
						height: 48,
					}}
				>
					Instaclone
				</Title>
				<Button
					loading={loading}
					mode="contained"
					style={{
						padding: 4,
					}}
					color={colors.surface}
					icon="google"
					onPress={signIn}
				>
					Continue with Google
				</Button>
			</View>

			<Caption onPress={openGithub}>Developed by Niketan Gulekar</Caption>
		</View>
	);
};

export default Login;
