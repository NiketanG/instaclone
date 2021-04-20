import React, { useContext, useEffect, useState } from "react";
import { Image, ToastAndroid, TouchableHighlight, View } from "react-native";
import {
	TextInput,
	Button,
	Title,
	Text,
	Colors,
	useTheme,
} from "react-native-paper";
import ImagePicker, {
	Options,
	Image as ImageResponse,
} from "react-native-image-crop-picker";
import Icon from "react-native-vector-icons/Ionicons";

import { AppContext } from "../../../utils/appContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { SignInNavigationParams } from "../../../types/navigation";
import { RouteProp } from "@react-navigation/core";
import { definitions } from "../../../types/supabase";
import supabaseClient from "../../../utils/supabaseClient";
import uploadToCloudinary from "../../../utils/uploadToCloudinary";
type Props = {
	navigation: StackNavigationProp<SignInNavigationParams, "Signup">;
	route: RouteProp<SignInNavigationParams, "Signup">;
};

const Signup: React.FC<Props> = ({ route }) => {
	const [username, setUsername] = useState("");
	const [name, setName] = useState("");

	const {
		setSignupDone,
		setUsername: saveUsername,
		setProfilePic,
		setEmail,
		setName: updateName,
	} = useContext(AppContext);

	useEffect(() => {
		let isMounted = true;
		if (isMounted) {
			const currentUser = route.params;

			if (currentUser) {
				if (currentUser.name) {
					setName(currentUser.name);
					setUsername(currentUser?.name.split(" ")[0].toLowerCase());
				}
				setImagePath(currentUser.profilePic);
			}
		}
		return () => {
			isMounted = false;
		};
	}, [route.params]);

	const [usernameAvailable, setUsernameAvailable] = useState(true);
	const [loading, setLoading] = useState(false);

	const [imagePath, setImagePath] = useState<string | null>(null);

	const imagePickerOptions: Options = {
		mediaType: "photo",
		cropping: true,
		width: 1024,
		height: 1024,
		includeBase64: true,
	};

	const handleImage = (res: ImageResponse) => {
		res.data ? setImagePath(`data:${res.mime};base64,${res.data}`) : false;
	};

	const selectFromGallery = async () => {
		try {
			const res = await ImagePicker.openPicker(imagePickerOptions);
			if (res) handleImage(res);
		} catch (err) {
			console.error("[selectFromGallery]", err);
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
		}
	};

	const signUp = async () => {
		try {
			if (username.length < 3) return;

			setLoading(true);
			const userExists = await supabaseClient
				.from<definitions["users"]>("users")
				.select("*")
				.eq("username", username.toLowerCase());
			if (userExists?.error) {
				console.error(userExists.error);
				ToastAndroid.show("An error occured", ToastAndroid.LONG);
			}
			if (userExists && userExists.data && userExists.data.length > 0) {
				setLoading(false);
				setUsernameAvailable(false);
				return;
			} else {
				setUsernameAvailable(true);
			}

			let userImagePath;
			if (imagePath) {
				if (imagePath.startsWith("http")) {
					userImagePath = imagePath;
				} else {
					userImagePath = await uploadToCloudinary(imagePath);
				}
			}
			const newUserRes = await supabaseClient
				.from<definitions["users"]>("users")
				.insert([
					{
						bio: "",
						email: route.params.email,
						username: username.toLowerCase(),
						name,
						profilePic: userImagePath?.toString() || "",
					},
				]);

			if (newUserRes.error) {
				setLoading(false);
				console.error(newUserRes.error);
				ToastAndroid.show(
					"Error while creating user",
					ToastAndroid.LONG
				);
			}

			updateName(name);
			setEmail(route.params.email);
			setLoading(false);
			setSignupDone(true);
			saveUsername(username.toLowerCase());
			if (userImagePath) setProfilePic(userImagePath);
			setImagePath(null);
			ToastAndroid.show("Signed up", ToastAndroid.LONG);
		} catch (err) {
			setLoading(false);
			console.error("[signUp]", err);
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
		}
	};

	const { colors } = useTheme();
	return (
		<>
			<View
				style={{
					backgroundColor: colors.background,
					padding: 16,
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
						<Text
							onPress={selectFromGallery}
							style={{
								marginVertical: 8,
							}}
						>
							Change Picture
						</Text>
					</View>
					<TextInput
						placeholder="Username"
						value={username}
						onChangeText={(text) => setUsername(text)}
						style={{
							backgroundColor: colors.surface,
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
							backgroundColor: colors.surface,
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
