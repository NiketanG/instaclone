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
import { BottomTabParamList } from "../../types/navigation/BottomTab";
import ImagePicker, {
	Options,
	Image as ImageResponse,
} from "react-native-image-crop-picker";

import { AppContext } from "../../utils/appContext";
import { definitions } from "../../types/supabase";
import { PostDimensions } from "../../utils/Constants";
import uploadToSupabase from "../../utils/uploadToSupabase";
import { useMutation } from "react-query";
import { newPost } from "../../../api";
import { queryClient } from "../../utils/queryClient";

type Props = {
	route: RouteProp<BottomTabParamList, "New">;
	navigation: BottomTabNavigationProp<BottomTabParamList, "New">;
};

const NewPost: React.FC<Props> = ({ navigation }) => {
	const [imagePath, setImagePath] = useState<string | null>(null);

	const { user } = useContext(AppContext);

	const imagePickerOptions: Options = {
		mediaType: "photo",
		cropping: true,
		forceJpg: true,
		width: PostDimensions.width,
		height: PostDimensions.height,
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

	const newPostMutation = useMutation<
		unknown,
		unknown,
		Pick<definitions["posts"], "caption" | "imageUrl">
	>((post) => newPost(post), {
		onSettled: () => {
			queryClient.invalidateQueries(`feedPosts`);
			if (user)
				queryClient.invalidateQueries(`userInfo_${user.username}`);
		},
	});

	const uploadPost = async () => {
		try {
			if (!imagePath) return;
			if (!user) return;
			setUploading(true);

			const imageUrl = await uploadToSupabase(imagePath, "jpg", "posts");

			if (imageUrl) {
				const data: Pick<definitions["posts"], "caption" | "imageUrl"> =
					{
						caption,
						imageUrl,
					};

				newPostMutation.mutate(data);

				setUploading(false);
				ToastAndroid.show("Posted", ToastAndroid.LONG);
				setImagePath(null);
				setCaption("");
				navigation.navigate("Home");
			} else {
				console.error("[Supabase] Post Creation failed. No Image Url");
				ToastAndroid.show(
					"An error occured while uploading the image",
					ToastAndroid.LONG
				);
				setUploading(false);
				return;
			}
		} catch (err) {
			setUploading(false);
			console.error("[uploadPost]", err);
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
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
							width={PostDimensions.width}
							height={PostDimensions.width}
							style={{
								width,
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
