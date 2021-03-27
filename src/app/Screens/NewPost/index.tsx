import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import React, { useContext, useRef, useState } from "react";
import {
	Image,
	ScrollView,
	StatusBar,
	ToastAndroid,
	useWindowDimensions,
	View,
} from "react-native";
import {
	ActivityIndicator,
	Appbar,
	Button,
	TextInput,
	Colors,
	useTheme,
} from "react-native-paper";
import { TabNavigationParams } from "../../types/navigation";
import ImagePicker, {
	Options,
	Image as ImageResponse,
} from "react-native-image-crop-picker";
import { firebase } from "@react-native-firebase/storage";
import firestore, {
	FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import "react-native-get-random-values";
import { nanoid } from "nanoid";
import { AppContext } from "../../utils/authContext";
import PostsStore from "../../store/PostsStore";

type Props = {
	route: RouteProp<TabNavigationParams, "New">;
	navigation: BottomTabNavigationProp<TabNavigationParams, "New">;
};

const NewPost: React.FC<Props> = ({ navigation }) => {
	const [imagePath, setImagePath] = useState<string | null>(null);

	const { username } = useContext(AppContext);

	const imagePickerOptions: Options = {
		mediaType: "photo",
		cropping: true,
		width: 1024,
		height: 1024,
	};

	const handleImage = (res: ImageResponse) => {
		if (res.path) {
			setImagePath(res.path);
		}
	};

	const selectFromGallery = async () => {
		try {
			const res = await ImagePicker.openPicker(imagePickerOptions);
			if (res) handleImage(res);
		} catch (err) {
			console.error(err);
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
		}
	};

	// const openCamera = async () => {
	// 	try {
	// 		const res = await ImagePicker.openCamera(imagePickerOptions);
	// 		if (res) handleImage(res);
	// 	} catch (err) {
	// 		console.error(err);
	// 		ToastAndroid.show("An error occured", ToastAndroid.LONG);
	// 	}
	// };

	const { width } = useWindowDimensions();

	const goBack = () => {
		if (imagePath) {
			setImagePath(null);
		} else {
			navigation.goBack();
		}
	};
	const [caption, setCaption] = useState("");
	const [uploading, setUploading] = useState(false);

	const postsCollection = firestore().collection("posts");

	const storageBucket = firebase
		.app()
		.storage("gs://instaclone-5e1b6.appspot.com/");

	const uploadPost = async () => {
		try {
			if (!imagePath) return;
			setUploading(true);
			const imageId = nanoid();
			const imageRef = storageBucket.ref(imageId);
			const task = await imageRef.putFile(imagePath);
			const imageUrl = await imageRef.getDownloadURL();

			if (task && imageUrl) {
				const newPost = await postsCollection.add({
					postId: imageId,
					caption,
					imageUrl,
					username,
					postedAt: firestore.FieldValue.serverTimestamp(),
					likes: 0,
				});
				setUploading(false);
				ToastAndroid.show("Posted", ToastAndroid.LONG);
				setImagePath(null);
				const data = await newPost.get();

				if (username) {
					PostsStore.addPost({
						caption,
						imageUrl,
						likes: 0,
						postId: newPost.id,
						postedAt: (data.get(
							"postedAt"
						) as FirebaseFirestoreTypes.Timestamp)
							.toDate()
							.toISOString(),
						username,
					});
				}
				setCaption("");
				navigation.navigate("Home");
			} else {
				console.error("[Firestore] Post Creation failed");
				ToastAndroid.show("An error occured", ToastAndroid.LONG);
				setUploading(false);
				return;
			}
		} catch (err) {
			console.error(err);
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
		} finally {
			setUploading(false);
		}
	};

	const { colors } = useTheme();
	const scrollView = useRef<ScrollView>(null);

	const onFocus = () => {
		scrollView.current?.scrollToEnd();
	};

	return (
		<>
			{uploading && (
				<View
					style={{
						width: width,
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
			<View
				style={{
					height: "100%",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Appbar.Header
					style={{
						backgroundColor: "black",
					}}
				>
					<Appbar.Action icon="close" onPress={goBack} />
					<Appbar.Content title="New Post" />

					<Appbar.Action
						icon="arrow-right"
						disabled={!imagePath}
						onPress={uploadPost}
					/>
				</Appbar.Header>

				{imagePath ? (
					<ScrollView
						ref={scrollView}
						style={{
							marginBottom: 16,
						}}
					>
						<Image
							source={{
								uri: imagePath,
							}}
							width={width}
							height={width}
							style={{
								width: width,
								height: width,
							}}
						/>
						<View
							style={{
								marginHorizontal: 16,
								marginTop: 16,
							}}
						>
							<View>
								<TextInput
									value={caption}
									onChangeText={(text) => setCaption(text)}
									maxLength={126}
									placeholder="Caption"
									mode="outlined"
									onFocus={onFocus}
									textAlignVertical="center"
								/>
							</View>
						</View>
					</ScrollView>
				) : (
					<View
						style={{
							flexGrow: 1,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							backgroundColor: colors.background,
							justifyContent: "center",
						}}
					>
						<Button
							onPress={selectFromGallery}
							style={{ width: 256 }}
							mode="contained"
							color={colors.primary}
						>
							Select from Gallery
						</Button>
						{/* <Button
							onPress={openCamera}
							style={{ marginTop: 16, width: 256 }}
							mode="contained"
							icon="camera"
						>
							Launch Camera
						</Button> */}
					</View>
				)}
			</View>
		</>
	);
};

export default NewPost;
