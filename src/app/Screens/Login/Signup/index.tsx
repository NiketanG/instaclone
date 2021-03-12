import React, { useContext, useEffect, useState } from "react";
import { Image, ToastAndroid, TouchableHighlight, View } from "react-native";
import { TextInput, Button, Title, Text, Colors } from "react-native-paper";
import ImagePicker, {
	Options,
	Image as ImageResponse,
} from "react-native-image-crop-picker";

import firestore from "@react-native-firebase/firestore";
import { firebase } from "@react-native-firebase/storage";
import Icon from "react-native-vector-icons/Ionicons";

import auth from "@react-native-firebase/auth";
import { AppContext } from "../../../utils/authContext";

const Signup = () => {
	const [username, setUsername] = useState("");
	const [name, setName] = useState("");

	const {
		setSignupDone,
		setUsername: saveUsername,
		setProfilePic,
	} = useContext(AppContext);

	useEffect(() => {
		let isMounted = true;
		if (isMounted) {
			const currentUser = auth().currentUser;
			if (currentUser) {
				if (currentUser.displayName) {
					setName(currentUser.displayName);
					setUsername(
						currentUser?.displayName.split(" ")[0].toLowerCase()
					);
				}

				setImagePath(currentUser.photoURL);
			}
		}
		return () => {
			isMounted = false;
		};
	}, []);

	const [usernameAvailable, setUsernameAvailable] = useState(true);
	const [loading, setLoading] = useState(false);

	const [imagePath, setImagePath] = useState<string | null>(null);

	const imagePickerOptions: Options = {
		mediaType: "photo",
		cropping: true,
		width: 1024,
		height: 1024,
	};

	const handleImage = (res: ImageResponse) =>
		res.path ? setImagePath(res.path) : false;

	const selectFromGallery = async () => {
		try {
			const res = await ImagePicker.openPicker(imagePickerOptions);
			if (res) handleImage(res);
		} catch (err) {
			console.error(err);
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
		}
	};

	const storageBucket = firebase
		.app()
		.storage("gs://instaclone-5e1b6.appspot.com/");

	const usersCollection = firestore().collection("users");
	const signUp = async () => {
		try {
			if (username.length < 3) return;

			setLoading(true);

			const userExists = await usersCollection
				.where("username", "==", username.toLowerCase())
				.get();

			if (userExists.docs.length > 0) {
				setUsernameAvailable(false);
				return;
			} else {
				setUsernameAvailable(true);
			}

			let userImagePath;
			if (imagePath) {
				const imageRef = storageBucket.ref(username);
				if (imagePath.startsWith("http")) {
					userImagePath = imagePath;
				} else {
					await imageRef.putFile(imagePath);
					userImagePath = await imageRef.getDownloadURL();
				}
			}

			await usersCollection.add({
				username: username.toLowerCase(),
				name,
				profilePic: userImagePath || "",
				email: auth().currentUser?.email,
			});

			setSignupDone(true);
			saveUsername(username.toLowerCase());
			if (userImagePath) setProfilePic(userImagePath);
			setImagePath(null);
			ToastAndroid.show("Signed up", ToastAndroid.LONG);
		} catch (err) {
			console.error(err);
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<View
				style={{
					margin: 16,
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					flex: 1,
				}}
			>
				<View
					style={{
						display: "flex",
						flexGrow: 1,
					}}
				>
					<Title>Signup</Title>
					<View
						style={{
							display: "flex",
							alignItems: "center",
							marginVertical: 16,
						}}
					>
						{!imagePath ? (
							<Icon.Button
								style={{
									margin: 0,
									paddingLeft: 16,
									paddingRight: 0,
								}}
								onPress={selectFromGallery}
								backgroundColor="transparent"
								name="person-circle"
								size={96}
							/>
						) : (
							<TouchableHighlight
								onPress={selectFromGallery}
								style={{
									borderRadius: 48,
								}}
							>
								<Image
									source={{
										uri: imagePath,
									}}
									width={96}
									height={96}
									style={{
										borderRadius: 48,
										width: 96,
										height: 96,
									}}
								/>
							</TouchableHighlight>
						)}
					</View>
					<TextInput
						placeholder="Username"
						value={username}
						onChangeText={(text) => setUsername(text)}
						style={{
							height: 48,
							marginTop: 16,
						}}
					/>
					{!usernameAvailable && (
						<Text
							style={{
								color: Colors.red500,
								marginHorizontal: 8,
								marginTop: 8,
							}}
						>
							Username is already taken. Please choose a different
							one
						</Text>
					)}
					<TextInput
						placeholder="Name"
						value={name}
						onChangeText={(text) => setName(text)}
						style={{
							marginTop: 16,
							height: 48,
						}}
					/>
				</View>
				<Button
					mode="contained"
					icon="arrow-right"
					onPress={signUp}
					loading={loading}
					disabled={username.length < 1 || name.length < 1}
				>
					Let's Go
				</Button>
			</View>
		</>
	);
};

export default Signup;
