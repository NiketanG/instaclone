import { useState } from "react";
import { ToastAndroid } from "react-native";
import ImagePicker, { Options } from "react-native-image-crop-picker";
import uploadToCloudinary from "./uploadToCloudinary";

const useImageUpload = () => {
	const [imagePath, setImagePath] = useState<string | null>(null);

	const [loading, setLoading] = useState(true);

	const imagePickerOptions: Options = {
		mediaType: "photo",
		cropping: true,
		width: 1024,
		height: 1024,
		includeBase64: true,
	};

	const selectFromGallery = async () => {
		try {
			const res = await ImagePicker.openPicker(imagePickerOptions);
			if (res && res.data) {
				setImagePath(`data:${res.mime};base64,${res.data}`);
				ToastAndroid.show("Uploading image", ToastAndroid.LONG);
				const uploadedPath = await uploadToCloudinary(
					`data:${res.mime};base64,${res.data}`
				);
				setLoading(false);

				return uploadedPath;
			} else {
				return null;
			}
		} catch (err) {
			console.error("[selectFromGallery]", err);
			ToastAndroid.show("An error occured", ToastAndroid.LONG);
			return null;
		}
	};

	return {
		imagePath,
		loading,
		selectFromGallery,
	};
};

export default useImageUpload;
