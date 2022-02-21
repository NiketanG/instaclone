import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, User } from "../types";

type ContextType = {
	loading: boolean;

	signupDone: boolean;
	setSignupDone: (newState: boolean) => void;

	user: User | null;
	setUser: (newUser: User) => void;

	theme: Theme;
	setTheme: (newTheme: Theme) => void;

	signout: () => void;
};

export const AppContext = createContext<ContextType>({
	loading: false,
	signupDone: false,
	setSignupDone: () => {},

	user: null,
	setUser: (_newUser: User) => {},

	theme: "dark",
	setTheme: () => {},

	signout: () => {},
});

type Props = {
	children: React.ReactNode;
};
const AppContextProvider: React.FC<Props> = ({ children }) => {
	const [loading, setLoading] = useState(true);
	const [signupDone, setSignupDone] = useState(false);

	const [user, setUser] = useState<User | null>(null);

	const updateUser = (newUser: User) => {
		setUser(newUser);
		AsyncStorage.setItem("user", JSON.stringify(newUser));
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

	const fetchUser = async () => {
		const signupDoneRes = await AsyncStorage.getItem("signupDone");
		const userRes = await AsyncStorage.getItem("user");
		if (signupDoneRes === "true") setSignupDone(true);
		if (userRes) setUser(JSON.parse(userRes));
		setLoading(false);
	};

	useEffect(() => {
		fetchUser();
	}, []);

	const signout = async () => {
		await AsyncStorage.removeItem("signupDone");
		await AsyncStorage.removeItem("user");
		setSignupDone(false);
		setUser(null);
	};

	return (
		<AppContext.Provider
			value={{
				loading,
				signupDone,
				setSignupDone: updateSignUpDone,

				user,
				setUser: updateUser,

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
