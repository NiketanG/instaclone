import supabaseClient from "./supabaseClient";
import { decode } from "base64-arraybuffer";
import { nanoid } from "nanoid";

const uploadToSupabase = async (
	base64Image: string,
	imageExtension = "jpg",
	bucketName = "stories"
): Promise<string | null> => {
	try {
		const { data, error } = await supabaseClient.storage
			.from(bucketName)
			.upload(`${nanoid()}.${imageExtension}`, decode(base64Image), {
				contentType: `image/${imageExtension}`,
			});
		if (!data) {
			console.error("[uploadToSupabase] Data is null");
			return null;
		}

		if (error) {
			console.error("[uploadToSupabase] upload: ", error);
			return null;
		}
		const { publicURL, error: urlError } = supabaseClient.storage
			.from(bucketName)
			.getPublicUrl(data.Key.replace(`${bucketName}/`, ""));

		if (urlError) {
			console.error("[uploadToSupabase] PublicURL: ", urlError);
			return null;
		}

		if (!publicURL) {
			console.error("[uploadToSupabase] publicURL is null");
			return null;
		}

		return publicURL;
	} catch (err) {
		console.error(err);
		return null;
	}
};

export default uploadToSupabase;
