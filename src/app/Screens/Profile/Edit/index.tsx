import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import {
	Image,
	Keyboard,
	ScrollView,
	StatusBar,
	ToastAndroid,
	View,
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import ImagePicker, {
	Image as ImageResponse,
	Options,
} from "react-native-image-crop-picker";
import {
	ActivityIndicator,
	Appbar,
	Text,
	TextInput,
	Title,
	useTheme,
} from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { useMutation } from "react-query";
import { editUser, isUsernameAvailable } from "../../../../api";
import { ProfileStackParams } from "../../../types/navigation/ProfileStack";
import { definitions } from "../../../types/supabase";
import { AppContext } from "../../../utils/appContext";
import { queryClient } from "../../../utils/queryClient";
import uploadToSupabase from "../../../utils/uploadToSupabase";

type Props = {
	navigation: StackNavigationProp<ProfileStackParams, "Settings">;
};

const EditProfile: React.FC<Props> = ({ navigation }) => {
	const goBack = () => navigation.goBack();

	const [username, setUsername] = useState("");
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const [imagePath, setImagePath] = useState<string | null>(null);

	const { user, setUser } = useContext(AppContext);

	useEffect(() => {
		if (user) {
			setUsername(user.username);
			setName(user.name);
			setBio(user.bio || "");
			if (user.profilePic) setImagePath(user.profilePic);
		}
	}, [user]);

	const { colors } = useTheme();

	const [loading, setLoading] = useState(false);
	const [usernameAvailable, setUsernameAvailable] = useState(true);

	const imagePickerOptions: Options = {
		mediaType: "photo",
		cropping: true,
		width: 256,
		forceJpg: true,
		height: 256,
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
		}
	};

	const editProfileMutation = useMutation<
		unknown,
		unknown,
		Partial<
			Pick<
				definitions["users"],
				"name" | "username" | "bio" | "profilePic"
			>
		>
	>((userToUpdate) => editUser(userToUpdate), {
		onSettled: () => {
			user && queryClient.invalidateQueries(`userInfo_${user.username}`);
		},
	});

	const profileUpdate = async () => {
		if (!user) return;
		try {
			if (username.length < 3) return;
			Keyboard.dismiss();
			setLoading(true);

			if (username !== user.username) {
				const isUsernameAvail = await isUsernameAvailable(username);
				if (isUsernameAvail === null) {
					ToastAndroid.show("An error occured", ToastAndroid.LONG);
				}
				if (isUsernameAvail === false) {
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
					userImagePath = await uploadToSupabase(
						imagePath,
						"jpg",
						"profilePictures"
					);
				}
			}

			const dataToUpdate: Partial<
				Pick<
					definitions["users"],
					"username" | "name" | "bio" | "profilePic"
				>
			> = {};
			if (name) dataToUpdate.name = name;
			if (bio) dataToUpdate.bio = bio;
			if (username) dataToUpdate.username = username;
			if (userImagePath) dataToUpdate.profilePic = userImagePath;
			editProfileMutation.mutate(dataToUpdate);

			setUser({
				...user,
				...dataToUpdate,
			});

			ToastAndroid.show("Profile updated", ToastAndroid.LONG);
			navigation.goBack();
		} catch (err) {
			console.error("[updateProfile]", err);
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
					<ActivityIndicator animating={true} size={48} />
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
				<Appbar.Action icon="check" onPress={profileUpdate} />
			</Appbar.Header>
			<ScrollView
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
						color: colors.onSurface,
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
						color: colors.onSurface,
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
							color: "red",
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
						color: colors.onBackground,
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
				<Text
					style={{
						color: colors.onSurface,
					}}
				>
					Email
				</Text>
				<TextInput
					placeholder="Email"
					value={user?.email}
					disabled
					dense
					style={{
						marginTop: 8,
						marginBottom: 16,
					}}
				/>
			</ScrollView>
		</>
	);
};

export default EditProfile;
