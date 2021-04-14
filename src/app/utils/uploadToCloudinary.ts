const uploadToCloudinary = async (base64String: string) => {
	const formData = new FormData();
	formData.append("file", base64String);
	formData.append("upload_preset", "insta_clone");
	formData.append("cloud_name", "nikketan");

	const res = await fetch(
		"https://api.cloudinary.com/v1_1/nikketan/image/upload",
		{
			method: "post",
			body: formData,
		}
	);
	const imageRes = await res.json();

	return imageRes.secure_url;
};

export default uploadToCloudinary;
