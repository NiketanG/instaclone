import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme } from "../types";

type ContextType = {
	signupDone: boolean;
	setSignupDone: (newState: boolean) => void;

	username: string | null;
	setUsername: (newUsername: string) => void;

	email: string | null;
	setEmail: (newEmail: string) => void;

	name: string | null;
	setName: (newName: string) => void;

	bio: string | null;
	setBio: (newBio: string) => void;

	profilePic: string | null;
	setProfilePic: (newPic: string) => void;

	theme: Theme;
	setTheme: (newTheme: Theme) => void;

	signout: () => void;
};

export const AppContext = createContext<ContextType>({
	signupDone: false,
	setSignupDone: () => {},

	username: null,
	setUsername: () => {},

	email: null,
	setEmail: () => {},

	name: null,
	setName: () => {},

	bio: null,
	setBio: () => {},

	theme: "dark",
	setTheme: () => {},

	profilePic: null,
	setProfilePic: () => {},

	signout: () => {},
});

type Props = {
	children: React.ReactNode;
};
const AppContextProvider: React.FC<Props> = ({ children }) => {
	const [signupDone, setSignupDone] = useState(false);
	const [username, setUsername] = useState<string | null>(null);
	const [name, setName] = useState<string | null>(null);
	const [profilePic, setProfilePic] = useState<string | null>(null);
	const [bio, setBio] = useState<string | null>(null);
	const [email, setEmail] = useState<string | null>(null);

	const updateBio = (newBio: string) => {
		setBio(newBio);
		AsyncStorage.setItem("bio", newBio);
	};

	const updateProfilePic = (newProfilePic: string) => {
		setProfilePic(newProfilePic);
		AsyncStorage.setItem("profilePic", newProfilePic);
	};

	const updateUsername = (newUsername: string) => {
		setUsername(newUsername);
		AsyncStorage.setItem("username", newUsername);
	};

	const updateEmail = (newEmail: string) => {
		setEmail(newEmail);
		AsyncStorage.setItem("email", newEmail);
	};

	const updateName = (newName: string) => {
		setName(newName);
		AsyncStorage.setItem("name", newName);
	};

	const [theme, setTheme] = useState<Theme>("dark");
	const updateTheme = (newTheme: Theme) => {
		setTheme(newTheme);
		AsyncStorage.setItem("theme", newTheme.toString());
	};

	const updateSignUpDone = (newState: boolean) => {
		setSignupDone(newState);
		AsyncStorage.setItem("signupDone", newState ? "true" : "false");
	};

	useEffect(() => {
		AsyncStorage.getItem("signupDone").then((res) =>
			setSignupDone(res === "true")
		);
		AsyncStorage.getItem("username").then((res) => setUsername(res));
		AsyncStorage.getItem("email").then((res) => setEmail(res));
		AsyncStorage.getItem("bio").then((res) => setBio(res));
		AsyncStorage.getItem("name").then((res) => setName(res));
		AsyncStorage.getItem("profilePic").then((res) => setProfilePic(res));
	}, []);

	const signout = async () => {
		await AsyncStorage.removeItem("signupDone");
		await AsyncStorage.removeItem("username");
		await AsyncStorage.removeItem("bio");
		await AsyncStorage.removeItem("email");
		await AsyncStorage.removeItem("name");
		await AsyncStorage.removeItem("profilePic");
		setSignupDone(false);
		setProfilePic(null);
		setUsername(null);
		setName(null);
		setEmail(null);
		setBio(null);
	};

	return (
		<AppContext.Provider
			value={{
				signupDone,
				setSignupDone: updateSignUpDone,

				profilePic,
				setProfilePic: updateProfilePic,

				username,
				setUsername: updateUsername,

				name,
				setName: updateName,

				email,
				setEmail,

				bio,
				setBio: updateBio,

				theme,
				setTheme: updateTheme,

				signout,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;
