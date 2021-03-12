import React, { useContext } from "react";
import { ToastAndroid, View } from "react-native";
import { GoogleSignin } from "@react-native-community/google-signin";
import auth from "@react-native-firebase/auth";
import { Button } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { StackNavigationProp } from "@react-navigation/stack";
import { SignInNavigationParams } from "../../types/navigation";
import { AppContext } from "../../utils/authContext";

GoogleSignin.configure({
	webClientId:
		"281495387223-budng5an5ustskq9am3u48hac42m4jcv.apps.googleusercontent.com",
});

type Props = {
	navigation: StackNavigationProp<SignInNavigationParams, "Login">;
};

const Login: React.FC<Props> = ({ navigation }) => {
	const usersCollection = firestore().collection("users");
	const { setSignupDone, setUsername, setName, setProfilePic } = useContext(
		AppContext
	);

	const signIn = async () => {
		try {
			const { idToken } = await GoogleSignin.signIn();
			const googleCredential = auth.GoogleAuthProvider.credential(
				idToken
			);

			const res = await auth().signInWithCredential(googleCredential);
			if (res.user.email) {
				const userExists = await usersCollection
					.where("email", "==", res.user.email.toLowerCase())
					.get();
				if (
					userExists.docs.length > 0 &&
					userExists.docs[0].get("username")?.toString() !== "" &&
					userExists.docs[0].get("name")?.toString() !== ""
				) {
					setUsername(userExists.docs[0].get("username"));
					setName(userExists.docs[0].get("name"));
					setProfilePic(userExists.docs[0].get("profilePic"));
					setSignupDone(true);
				} else {
					setSignupDone(false);
					navigation.navigate("Signup");
				}
			}
		} catch (err) {
			console.error(err);
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
		}
	};
	return (
		<View
			style={{
				display: "flex",
				height: "100%",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Button
				mode="contained"
				style={{
					padding: 4,
				}}
				color="white"
				icon="google"
				onPress={signIn}
			>
				Continue with Google
			</Button>
		</View>
	);
};

export default Login;
