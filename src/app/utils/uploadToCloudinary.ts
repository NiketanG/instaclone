import Config from "react-native-config";

if (!Config.CLOUDINARY_CLOUD_NAME || !Config.CLOUDINARY_UPLOAD_PRESET) {
	console.error("[Supabase] URL and Key not found in environment variables.");
}

const uploadToCloudinary = async (base64String: string) => {
	const formData = new FormData();
	formData.append("file", base64String);
	formData.append("upload_preset", Config.CLOUDINARY_UPLOAD_PRESET);
	formData.append("cloud_name", Config.CLOUDINARY_CLOUD_NAME);

	const res = await fetch(
		`https://api.cloudinary.com/v1_1/${Config.CLOUDINARY_CLOUD_NAME}/image/upload`,
		{
			method: "post",
			body: formData,
		}
	);
	const imageRes = await res.json();

	return imageRes.secure_url;
};

export default uploadToCloudinary;
