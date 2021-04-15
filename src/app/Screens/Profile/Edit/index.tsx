import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Appbar,
	Colors,
	Text,
	TextInput,
	Title,
	useTheme,
} from "react-native-paper";
import { ProfileStackParams } from "../../../types/navigation";
import { Image, StatusBar, ToastAndroid, View } from "react-native";
import { AppContext } from "../../../utils/authContext";
import Icon from "react-native-vector-icons/Ionicons";
import ImagePicker, {
	Options,
	Image as ImageResponse,
} from "react-native-image-crop-picker";
import { TouchableHighlight } from "react-native-gesture-handler";

import "react-native-get-random-values";
import UsersStore from "../../../store/UsersStore";
import supabaseClient from "../../../utils/supabaseClient";
import { definitions } from "../../../types/supabase";
import uploadToCloudinary from "../../../utils/uploadToCloudinary";
import useCurrentUser from "../../../utils/useCurrentUser";
type Props = {
	navigation: StackNavigationProp<ProfileStackParams, "Settings">;
};

const EditProfile: React.FC<Props> = ({ navigation }) => {
	const currentUser = useCurrentUser();

	const goBack = () => navigation.goBack();

	const [username, setUsername] = useState("");
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const [imagePath, setImagePath] = useState<string | null>(null);

	const {
		setProfilePic: updateProfilePic,
		setUsername: updateUsername,
		setName: updateName,
		setBio: updateBio,
	} = useContext(AppContext);

	useEffect(() => {
		if (currentUser) {
			setUsername(currentUser.username);
			setName(currentUser.name || "");
			setBio(currentUser.bio || "");
			if (currentUser.profilePic) setImagePath(currentUser.profilePic);
			setLoading(false);
		} else {
			setLoading(true);
		}
	}, [currentUser]);

	const { colors } = useTheme();

	const [loading, setLoading] = useState(false);
	const [usernameAvailable, setUsernameAvailable] = useState(true);

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
			console.error(err);
		}
	};

	const updateProfile = async () => {
		try {
			if (username.length < 3) return;
			if (!currentUser?.email) {
				console.error("No email");
				return;
			}
			setLoading(true);

			if (username !== currentUser.username) {
				const userExists = await supabaseClient
					.from<definitions["users"]>("users")
					.select("*")
					.eq("username", username.toLowerCase());

				if (userExists?.error) {
					console.error(userExists.error);
					ToastAndroid.show("An error occured", ToastAndroid.LONG);
				}
				if (
					userExists &&
					userExists.data &&
					userExists.data.length > 0
				) {
					setLoading(false);
					setUsernameAvailable(false);
					return;
				} else {
					setUsernameAvailable(true);
				}
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

			await UsersStore.editUser(currentUser.username, {
				username: username.toLowerCase(),
				name,
				bio,
				profilePic: userImagePath || "",
			});

			updateName(name);
			updateBio(bio);
			updateUsername(username);
			if (userImagePath) updateProfilePic(userImagePath);

			ToastAndroid.show("Profile updated", ToastAndroid.LONG);
			navigation.goBack();
		} catch (err) {
			console.error(err);
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
		} finally {
			setLoading(false);
		}
	};
	return (
		<>
			{loading && (
				<View
					style={{
						width: "100%",
						height: "100%",
						justifyContent: "center",
						zIndex: 10,
						elevation: 10,
						backgroundColor: "rgba(0,0,0,0.6)",
						position: "absolute",
					}}
				>
					<ActivityIndicator
						animating={true}
						color={Colors.blue500}
						size={48}
					/>
				</View>
			)}
			<StatusBar backgroundColor="black" barStyle="light-content" />
			<Appbar.Header
				style={{
					backgroundColor: "black",
				}}
			>
				<Appbar.Action icon="arrow-left" onPress={goBack} />
				<Appbar.Content title="Edit Profile" />
				<Appbar.Action icon="check" onPress={updateProfile} />
			</Appbar.Header>
			<View
				style={{
					padding: 16,
					flex: 1,
					backgroundColor: colors.background,
				}}
			>
				<View
					style={{
						display: "flex",
						alignItems: "center",
					}}
				>
					{imagePath ? (
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
					) : (
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
					)}
					<Title onPress={selectFromGallery}>Change Picture</Title>
				</View>

				<Text
					style={{
						color: colors.placeholder,
					}}
				>
					Name
				</Text>
				<TextInput
					placeholder="Name"
					value={name}
					onChangeText={(text) => setName(text)}
					style={{
						height: 48,
						marginTop: 8,
						marginBottom: 16,
					}}
				/>

				<Text
					style={{
						color: colors.placeholder,
					}}
				>
					Username
				</Text>
				<TextInput
					placeholder="Username"
					value={username}
					onChangeText={(text) => setUsername(text)}
					style={{
						height: 48,
						marginTop: 8,
						marginBottom: 16,
					}}
					error={!usernameAvailable}
				/>
				{!usernameAvailable && (
					<Text
						style={{
							color: Colors.red500,
							marginHorizontal: 8,
							marginBottom: 8,
							marginTop: -8,
						}}
					>
						Username is already taken. Please choose a different one
					</Text>
				)}

				<Text
					style={{
						color: colors.placeholder,
					}}
				>
					Bio
				</Text>
				<TextInput
					placeholder="Bio"
					value={bio}
					onChangeText={(text) => setBio(text)}
					multiline
					style={{
						marginTop: 8,
						marginBottom: 16,
					}}
				/>
			</View>
		</>
	);
};

export default EditProfile;
