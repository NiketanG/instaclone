import React from "react";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

type AvatarProps = {
	profilePicture?: string | null;
	size?: number;
	onPress?: () => void;
};
export const UserAvatar: React.FC<AvatarProps> = ({
	profilePicture,
	size = 22,
	onPress,
}) => (
	// <Avatar.Icon {...props} icon="heart" size={30} />
	<TouchableOpacity onPress={onPress}>
		{profilePicture ? (
			<Image
				source={{
					uri: profilePicture,
				}}
				width={size}
				height={size}
				style={{
					width: size,
					height: size,
					borderRadius: size / 2,
				}}
			/>
		) : (
			<Image
				source={require("../../../assets/images/account_circle.png")}
				width={size}
				height={size}
				style={{
					width: size,
					height: size,
					borderRadius: size / 2,
				}}
			/>
		)}
	</TouchableOpacity>
);
