import { useState } from "react";
import { ToastAndroid } from "react-native";
import ImagePicker, { Options } from "react-native-image-crop-picker";
import uploadToSupabase from "../app/utils/uploadToSupabase";

const useImageUpload = () => {
	const [imagePath, setImagePath] = useState<string | null>(null);

	const [loading, setLoading] = useState(true);

	const imagePickerOptions: Options = {
		mediaType: "photo",
		cropping: true,
		width: 1024,
		height: 1024,
		includeBase64: true,
		forceJpg: true,
	};

	const selectFromGallery = async () => {
		const res = await ImagePicker.openPicker(imagePickerOptions);
		if (res && res.data) {
			const imageExtension = res.path.slice(-3);
			setImagePath(`data:${res.mime};base64,${res.data}`);
			ToastAndroid.show("Uploading image", ToastAndroid.LONG);
			const uploadedPath = await uploadToSupabase(
				res.data,
				imageExtension,
				"messages"
			);
			setLoading(false);
			return uploadedPath;
		} else {
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
