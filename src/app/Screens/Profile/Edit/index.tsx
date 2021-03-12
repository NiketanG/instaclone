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
import firestore from "@react-native-firebase/firestore";
import { firebase } from "@react-native-firebase/storage";
import auth from "@react-native-firebase/auth";
import "react-native-get-random-values";
import { nanoid } from "nanoid";
type Props = {
	navigation: StackNavigationProp<ProfileStackParams, "Settings">;
};

const EditProfile: React.FC<Props> = ({ navigation }) => {
	const goBack = () => navigation.goBack();

	const currentUser = auth().currentUser;

	const [username, setUsername] = useState("");
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const [profilePic, setProfilePic] = useState("");
	const {
		bio: savedBio,
		name: savedName,
		username: savedUsername,
		profilePic: savedProfilePic,
		setProfilePic: updateProfilePic,
		setUsername: updateUsername,
		setName: updateName,
		setBio: updateBio,
	} = useContext(AppContext);

	useEffect(() => {
		setUsername(savedUsername || "");
		setName(savedName || "");
		setBio(savedBio || "");
		if (savedProfilePic) setProfilePic(savedProfilePic);
	}, [savedBio, savedName, savedUsername, savedProfilePic]);

	const { colors } = useTheme();

	const [loading, setLoading] = useState(false);
	const [usernameAvailable, setUsernameAvailable] = useState(true);
	const imagePickerOptions: Options = {
		mediaType: "photo",
		cropping: true,
		width: 1024,
		height: 1024,
	};

	const handleImage = (res: ImageResponse) =>
		res.path ? setProfilePic(res.path) : false;

	const selectFromGallery = async () => {
		try {
			const res = await ImagePicker.openPicker(imagePickerOptions);
			if (res) handleImage(res);
		} catch (err) {
			console.error(err);
		}
	};

	const storageBucket = firebase
		.app()
		.storage("gs://instaclone-5e1b6.appspot.com/");

	const usersCollection = firestore().collection("users");

	const updateProfile = async () => {
		try {
			if (username.length < 3) return;
			if (!currentUser) return;
			setLoading(true);

			const userRes = await usersCollection
				.where("email", "==", currentUser.email)
				.get();

			if (!(userRes.docs.length > 0)) {
				return;
			}
			const user = userRes.docs[0];

			if (user.data().username !== username) {
				const usernameExists = await usersCollection
					.where("username", "==", username.toLowerCase())
					.get();

				if (usernameExists.docs.length > 0) {
					setUsernameAvailable(false);
					return;
				} else {
					setUsernameAvailable(true);
				}
			}

			let userImagePath;
			if (profilePic) {
				const imageId = nanoid();
				const imageRef = storageBucket.ref(imageId);
				if (profilePic.startsWith("http")) {
					userImagePath = profilePic;
				} else {
					await imageRef.putFile(profilePic);
					userImagePath = await imageRef.getDownloadURL();
				}
			}

			await usersCollection.doc(user.id).update({
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
					{profilePic ? (
						<TouchableHighlight
							onPress={selectFromGallery}
							style={{
								borderRadius: 48,
							}}
						>
							<Image
								source={{
									uri: profilePic,
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
