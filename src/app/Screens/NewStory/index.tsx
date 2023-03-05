import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	Image,
	Linking,
	StatusBar,
	StyleSheet,
	Text,
	ToastAndroid,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { useIsAppForeground } from "../../../hooks/useIsAppForeground";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import RNFetchBlob from "rn-fetch-blob";

import { useWindowDimensions } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { StoryDimensions } from "../../utils/Constants";
import ImagePicker, {
	Options,
	Image as ImageResponse,
} from "react-native-image-crop-picker";
import { TapGestureHandler } from "react-native-gesture-handler";
import uploadToSupabase from "../../utils/uploadToSupabase";
import { useMutation } from "react-query";
import { newStory } from "../../../api";
import { definitions } from "../../types/supabase";
import { AppContext } from "../../utils/appContext";
import { queryClient } from "../../utils/queryClient";
import { TabsNavigationProp } from "../../types/navigation/SwipeTab";

const NewStory = () => {
	const checkPermissions = async () => {
		const cameraPermission = await Camera.getCameraPermissionStatus();
		if (cameraPermission === "not-determined") {
			requestPermissions();
		}
		if (cameraPermission === "denied") openSettings();
	};

	const openSettings = () => {
		ToastAndroid.show(
			"Camera permission denied. Please allow it.,",
			ToastAndroid.LONG
		);
		Linking.openSettings();
	};
	const requestPermissions = async () => {
		const newCameraPermission = await Camera.requestCameraPermission();
		if (newCameraPermission === "denied") openSettings();
	};

	useEffect(() => {
		checkPermissions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const devices = useCameraDevices();
	const [cameraDevice, setCameraDevice] = useState<"back" | "front">("back");

	const [flashState, setFlashState] = useState<"on" | "off" | "auto">("off");

	const toggleFlash = () => {
		if (flashState === "on") setFlashState("off");
		if (flashState === "off") setFlashState("auto");
		if (flashState === "auto") setFlashState("on");
	};

	const [base64Data, setBase64Data] = useState<string | null>(null);
	const [imageExtension, setImageExtension] = useState<string | null>(null);

	const isAppForeground = useIsAppForeground();
	const isFocused = useIsFocused();
	const camera = useRef<Camera>(null);
	const takePicture = async () => {
		const photo = await camera.current?.takePhoto({
			flash: flashState,
			skipMetadata: true,
			qualityPrioritization: "speed",
		});

		if (photo) {
			setImagePath(`file://${photo.path}`);
			const base64Image = await RNFetchBlob.fs.readFile(
				photo.path,
				"base64"
			);

			setBase64Data(base64Image);
			setImageExtension(photo.path.slice(-3));
		}
	};

	const { width, height } = useWindowDimensions();
	const [imagePath, setImagePath] = useState<string | null>(null);

	const imagePickerOptions: Options = {
		mediaType: "photo",
		cropping: true,
		width: StoryDimensions.width,
		height: StoryDimensions.height,
		includeBase64: true,
		forceJpg: true,
	};
	const [uploading, setUploading] = useState(false);

	const handleImage = (res: ImageResponse) => {
		if (res.data) {
			setImagePath(`data:${res.mime};base64,${res.data}`);
			setBase64Data(res.data);
		}
	};

	const selectFromGallery = async () => {
		try {
			const res = await ImagePicker.openPicker(imagePickerOptions);
			if (res) handleImage(res);
		} catch (err) {
			console.error("[selectFromGallery]", err);
		}
	};

	const toggleCamera = useCallback(() => {
		setCameraDevice((currState) =>
			currState === "back" ? "front" : "back"
		);
	}, []);
	const { user: currUser } = useContext(AppContext);

	const newStoryMutation = useMutation<
		definitions["stories"] | null,
		unknown,
		Pick<definitions["stories"], "imageUrl">
	>((story) => newStory(story), {
		//
		onSettled: () => {
			queryClient.invalidateQueries(`feedStories`);
			if (currUser)
				queryClient.invalidateQueries(`userInfo_${currUser.username}`);
		},
	});

	const navigation = useNavigation<TabsNavigationProp>();
	const goBack = () => {
		if (imagePath || base64Data || imageExtension) {
			setImagePath(null);
			setBase64Data(null);
			setImageExtension(null);
		} else {
			navigation.navigate("Tabs");
		}
	};

	const onDoubleTap = useCallback(() => {
		toggleCamera();
	}, [toggleCamera]);

	const submitStory = async () => {
		if (!base64Data) return null;
		setUploading(true);
		const imageRes = await uploadToSupabase(
			base64Data,
			imageExtension || "jpg",
			"stories"
		);

		if (imageRes) {
			newStoryMutation.mutate({
				imageUrl: imageRes,
			});
			navigation.navigate("Tabs");
			ToastAndroid.show("Uploaded", ToastAndroid.LONG);
			setUploading(false);
			setBase64Data(null);
			setImageExtension(null);
			setImagePath(null);
		} else {
			ToastAndroid.show("Oops! An error occured", ToastAndroid.LONG);
			setUploading(false);
		}
	};

	return (
		<SafeAreaView
			style={{
				flex: 1,
			}}
		>
			<StatusBar backgroundColor="black" barStyle="light-content" />
			{uploading && (
				<TouchableOpacity
					activeOpacity={1}
					style={{
						width,
						flex: 1,
						height,
						justifyContent: "center",
						zIndex: 20,
						elevation: 20,
						backgroundColor: "rgba(0,0,0,0.6)",
						position: "absolute",
					}}
				>
					<ActivityIndicator animating={true} size={48} />
				</TouchableOpacity>
			)}
			{!imagePath ? (
				<>
					{devices?.back && devices[cameraDevice] ? (
						<TapGestureHandler
							onEnded={onDoubleTap}
							numberOfTaps={2}
						>
							<Camera
								ref={camera}
								style={StyleSheet.absoluteFill}
								device={devices[cameraDevice] || devices.back}
								isActive={isFocused && isAppForeground}
								photo={true}
								enableZoomGesture
								focusable
								preset="low"
							/>
						</TapGestureHandler>
					) : (
						<View
							style={{
								flex: 1,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text
								style={{
									textAlign: "center",
									color: "white",
								}}
							>
								Loading
							</Text>
						</View>
					)}
					<View
						style={{
							position: "absolute",
							zIndex: 10,
							elevation: 2,
							bottom: 32,
							left: 0,
							width,
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							paddingHorizontal: 32,
						}}
					>
						<AntDesign
							name="picture"
							color="white"
							size={32}
							onPress={selectFromGallery}
						/>
						<TouchableOpacity
							onPress={takePicture}
							style={{
								borderWidth: 2,
								borderColor: "white",
								borderRadius: 48,
								padding: 5,
							}}
						>
							<View
								style={{
									width: 72,
									height: 72,
									backgroundColor: "white",
									borderRadius: 48,
								}}
							/>
						</TouchableOpacity>
						<Ionicons
							name="camera-reverse-outline"
							color="white"
							size={32}
							onPress={toggleCamera}
						/>
					</View>
					<View
						style={{
							position: "absolute",
							zIndex: 10,
							elevation: 2,
							top: 32,
							left: 0,
							width,
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							paddingHorizontal: 32,
						}}
					>
						<MaterialIcons
							name={`flash-${flashState}`}
							color="white"
							size={32}
							onPress={toggleFlash}
						/>
						<AntDesign
							name="close"
							color="white"
							size={28}
							onPress={goBack}
						/>
					</View>
				</>
			) : (
				<View
					style={{
						flex: 1,
						width,
						height,
					}}
				>
					<Image
						source={{
							uri: imagePath,
						}}
						width={StoryDimensions.width}
						height={StoryDimensions.height}
						style={{
							borderRadius: 8,
							width: width,
							height:
								(width * StoryDimensions.height) /
								StoryDimensions.width,
						}}
					/>
					<View
						style={{
							position: "absolute",
							zIndex: 10,
							elevation: 2,
							left: 0,
							width,
							height,
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
							alignItems: "flex-end",
							paddingHorizontal: 32,
							paddingVertical: 32,
						}}
					>
						<AntDesign
							name="close"
							color="white"
							size={28}
							onPress={goBack}
						/>
						<TouchableOpacity
							onPress={submitStory}
							style={{
								backgroundColor: "white",
								paddingHorizontal: 24,
								paddingVertical: 12,
								borderRadius: 32,
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Text style={{ color: "black", marginRight: 6 }}>
								Upload
							</Text>
							<AntDesign name="right" color="black" />
						</TouchableOpacity>
					</View>
				</View>
			)}
		</SafeAreaView>
	);
};

export default NewStory;
