import { useContext, useEffect, useState } from "react";
import { definitions } from "../types/supabase";
import { AppContext } from "./appContext";
import supabaseClient from "./supabaseClient";

type CurrentUser = {
	name: string;
	bio?: string;
	username: string;
	profilePic?: string;
	email: string;
};
const useCurrentUser = () => {
	const [currentUser, setCurrentUser] = useState<CurrentUser>();
	const {
		email,
		name,
		bio,
		profilePic,
		username,
		setEmail,
		setBio,
		setProfilePic,
		setName,
	} = useContext(AppContext);

	const fetchUser = async (currentEmail: string) => {
		const user = await supabaseClient
			.from<definitions["users"]>("users")
			.select("*")
			.eq("email", currentEmail);
		if (user.error || user.data.length === 0) {
			console.error(
				user.error || "[useCurrentUser] No user data returned"
			);
			return null;
		} else {
			return user.data[0];
		}
	};

	useEffect(() => {
		if (email && username && name) {
			const data: CurrentUser = {
				email,
				username,
				name,
			};
			if (bio) data.bio = bio;
			if (profilePic) data.profilePic = profilePic;

			setCurrentUser(data);
		}
	}, [bio, email, name, profilePic, username]);

	useEffect(() => {
		if (email && username) {
			fetchUser(email).then((userData) => {
				if (userData) {
					setEmail(userData.email);
					setName(userData.name);
					if (userData.bio) setBio(userData.bio);
					if (userData.profilePic) setProfilePic(userData.profilePic);
					setCurrentUser({
						email: userData.email,
						name: userData.name,
						username: userData.username,
						bio: userData.bio,
						profilePic: userData.profilePic,
					});
				}
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [email, username]);
	return currentUser;
};

export default useCurrentUser;
