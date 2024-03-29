import React, { useContext, useState } from "react";
import { ToastAndroid, View } from "react-native";
import { Button, useTheme, Title, Caption } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { SignInNavigationParams } from "../../types/navigation/SignInStack";
import { AppContext } from "../../utils/appContext";
import supabaseClient from "../../utils/supabaseClient";

import { Linking } from "react-native";
type Props = {
	navigation: StackNavigationProp<SignInNavigationParams, "Login">;
};

import { InAppBrowser } from "react-native-inappbrowser-reborn";
import { parseParams } from "../../utils/utils";
import { checkUserExists } from "../../../api";
import Config from "react-native-config";
const Login: React.FC<Props> = ({ navigation }) => {
	const { setSignupDone, setUser } = useContext(AppContext);

	const [loading, setLoading] = useState(false);

	const redirectUri = "com.nikketan.instaclone://";

	const authUrl = `${Config.SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${redirectUri}`;

	const { colors } = useTheme();

	const openGithub = () => Linking.openURL("https://github.com/NiketanG");

	// useEffect(() => {
	// 	if (currUser && currUser.email) {
	// 		navigation.navigate("Signup", {
	// 			email: currUser.email,
	// 			name: currUser.user_metadata.full_name,
	// 			profilePic: currUser.user_metadata.avatar_url,
	// 		});
	// 	}
	// }, [currUser, navigation]);

	const signIn = async () => {
		try {
			setLoading(true);
			const res = await InAppBrowser.openAuth(authUrl, redirectUri);
			if (!res || res.type !== "success") {
				return null;
			}

			console.log(res);

			const params = parseParams(res.url.replace(`${redirectUri}#`, ""));
			if (!params?.refresh_token || !params?.access_token) {
				setLoading(false);
				return null;
			}

			const { data, error } = await supabaseClient.auth.setSession({
				refresh_token: params.refresh_token,
				access_token: params.access_token,
			});

			console.log("data", data);
			const user = data.user;

			if (error) {
				console.error(error);
				setLoading(false);
			}
			if (!user || !user.email) {
				console.error("[signIn] No User/email", user);
				setLoading(false);

				return null;
			}
			const userExists = await checkUserExists(user.email);

			console.log("userExists", userExists);
			if (userExists) {
				setUser(userExists);
				setSignupDone(true);
			} else {
				navigation.navigate("Signup", {
					email: user.email,
					name: user.user_metadata.full_name,
					profilePic: user.user_metadata.avatar_url,
				});
			}
		} catch (err) {
			console.error("[signIn]", err);
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
			setLoading(false);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
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
						onPress={signIn}
						loading={loading}
						disabled={loading}
						mode="contained"
						style={{
							padding: 4,
						}}
						color={colors.surface}
						icon="google"
					>
						Continue with Google
					</Button>
				</View>

				<Caption onPress={openGithub}>
					Developed by Niketan Gulekar
				</Caption>
			</View>
		</>
	);
};

export default Login;
