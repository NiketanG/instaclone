import { StackNavigationProp } from "@react-navigation/stack";
import React, { createContext, useState } from "react";
import { HomeStackNavigationParams } from "../types/navigation";

type NavigationContextType = {
	homePageNavigation: StackNavigationProp<
		HomeStackNavigationParams,
		"Home"
	> | null;

	setHomePageNavigation: (
		newHomeNavigation: StackNavigationProp<
			HomeStackNavigationParams,
			"Home"
		>
	) => void;
};

export const NavigationContext = createContext<NavigationContextType>({
	homePageNavigation: null,
	setHomePageNavigation: () => {},
});

type Props = {
	children: React.ReactNode;
};
const NavigationContextProvider: React.FC<Props> = ({ children }) => {
	const [
		homePageNavigation,
		setHomePageNavigation,
	] = useState<StackNavigationProp<HomeStackNavigationParams, "Home"> | null>(
		null
	);

	const updateHomePageNavigation = (
		newHomeNavigation: StackNavigationProp<
			HomeStackNavigationParams,
			"Home"
		>
	) => setHomePageNavigation(newHomeNavigation);

	return (
		<NavigationContext.Provider
			value={{
				homePageNavigation,
				setHomePageNavigation: updateHomePageNavigation,
			}}
		>
			{children}
		</NavigationContext.Provider>
	);
};

export default NavigationContextProvider;
