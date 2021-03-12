import React from "react";
import {
	StyleSheet,
	View,
	Image,
	ScrollView,
	useWindowDimensions,
} from "react-native";

import { TextInput } from "react-native-paper";
import { PostsList } from "../../utils/tempdata";

const Explore = () => {
	const { width } = useWindowDimensions();
	const imageMargin = 2;
	const imageWidth = (width - 16) / 3 - imageMargin * 2;

	return (
		<ScrollView style={styles.container}>
			<TextInput
				placeholder="Search"
				dense
				style={{
					borderRadius: 8,
				}}
			/>
			<View style={styles.grid}>
				{PostsList.map((post) => (
					<Image
						key={post.postId}
						source={{
							uri: post.imageUrl,
						}}
						width={imageWidth}
						height={imageWidth}
						style={{
							backgroundColor: "gray",
							margin: imageMargin,
							width: imageWidth,
							height: imageWidth,
						}}
					/>
				))}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 8,
		marginTop: 8,
	},
	grid: {
		display: "flex",
		width: "100%",

		marginVertical: 12,
		flexDirection: "row",
		flexWrap: "wrap",
	},
});

export default Explore;
