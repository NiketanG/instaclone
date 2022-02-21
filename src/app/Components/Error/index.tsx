import React from "react";
import { Text, View } from "react-native";
type Props = {
	message?: string;
};
const Error: React.FC<Props> = ({ message = "Oops! An error occured" }) => {
	return (
		<View
			style={{
				backgroundColor: "red",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				paddingVertical: 4,
			}}
		>
			<Text
				style={{
					color: "white",
				}}
			>
				{message}
			</Text>
		</View>
	);
};

export default Error;
