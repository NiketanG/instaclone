import React from "react";
import { Image } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";

type AvatarProps = {
	profilePicture?: string | null;
	size?: number;
	onPress?: () => void;
};
export const UserAvatar: React.FC<AvatarProps> = ({
	profilePicture,
	size = 22,
	onPress,
}) => {
	// <Avatar.Icon {...props} icon="heart" size={30} />
	return profilePicture ? (
		<TouchableHighlight onPress={onPress}>
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
		</TouchableHighlight>
	) : (
		<TouchableHighlight onPress={onPress}>
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
		</TouchableHighlight>
	);
};
