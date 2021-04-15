import React, { useContext, useState } from "react";
import { ToastAndroid, View } from "react-native";
import { GoogleSignin } from "@react-native-community/google-signin";
import { Button, useTheme } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { SignInNavigationParams } from "../../types/navigation";
import { AppContext } from "../../utils/authContext";
import supabaseClient from "../../utils/supabaseClient";
import { definitions } from "../../types/supabase";

GoogleSignin.configure({
	webClientId:
		"281495387223-budng5an5ustskq9am3u48hac42m4jcv.apps.googleusercontent.com",
});

type Props = {
	navigation: StackNavigationProp<SignInNavigationParams, "Login">;
};

const Login: React.FC<Props> = ({ navigation }) => {
	const {
		setSignupDone,
		setUsername,
		setName,
		setProfilePic,
		setEmail,
	} = useContext(AppContext);

	const [loading, setLoading] = useState(false);

	const signIn = async () => {
		try {
			setLoading(true);

			const res = await GoogleSignin.signIn();

			if (res.user.email) {
				const userExists = await supabaseClient
					.from<definitions["users"]>("users")
					.select("*")
					.eq("email", res.user.email);

				if (
					userExists &&
					userExists.data &&
					userExists.data.length > 0
				) {
					setEmail(userExists.data[0].email);
					setUsername(userExists.data[0].username);
					setName(userExists.data[0].name);
					if (userExists.data[0].profilePic)
						setProfilePic(userExists.data[0].profilePic);
					setLoading(false);
					setSignupDone(true);
					ToastAndroid.show("Logged in", ToastAndroid.LONG);
				} else {
					setLoading(false);
					setSignupDone(false);
					navigation.navigate("Signup", {
						name: res.user.name,
						email: res.user.email,
						profilePic: res.user.photo,
					});
				}
			} else {
				console.error("[GoogleAuth] No Email Returned");
				ToastAndroid.show("An error occured", ToastAndroid.LONG);
			}
		} catch (err) {
			console.error(err);
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
		}
	};

	const { colors } = useTheme();
	return (
		<View
			style={{
				backgroundColor: colors.background,
				display: "flex",
				height: "100%",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
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
	);
};

export default Login;
