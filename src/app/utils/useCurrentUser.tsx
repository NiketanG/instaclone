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
	const { user, setUser } = useContext(AppContext);

	const fetchUser = async (currentEmail: string) => {
		const userRes = await supabaseClient
			.from<definitions["users"]>("users")
			.select("*")
			.eq("email", currentEmail);
		if (userRes.error || userRes.data.length === 0) {
			console.error(
				userRes.error || "[useCurrentUser] No user data returned"
			);
			return null;
		} else {
			return userRes.data[0];
		}
	};

	useEffect(() => {
		if (user) {
			const data: CurrentUser = user;
			setCurrentUser(data);
		}
	}, [user]);

	useEffect(() => {
		if (user)
			fetchUser(user.email).then((userData) => {
				if (userData) {
					const data: CurrentUser = userData;
					setUser(data);
					setCurrentUser(data);
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);
	return currentUser;
};

export default useCurrentUser;
