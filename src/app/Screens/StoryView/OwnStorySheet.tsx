import React, { useCallback, useMemo } from "react";

import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import {
	ScrollView,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from "react-native";
import { useTheme } from "react-native-paper";
import { UserAvatar } from "../../Components/UserAvatar";
import { definitions } from "../../types/supabase";
import { RootStackNavProps } from "../../types/navigation/RootStack";

const OwnStorySheet = ({
	navigation,
	route,
}: RootStackNavProps<"StorySheet">) => {
	const { height } = useWindowDimensions();
	const sheetRef = React.useRef<BottomSheet>(null);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const snapPoints = useMemo(() => [height / 2, height], []);

	// callbacks
	const handleSheetChanges = useCallback(
		(index: number) => {
			if (index === -1) {
				navigation.goBack();
			}
		},
		[navigation]
	);

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0}
				backdropComponent={renderBackdrop}
				disappearsOnIndex={-1}
				style={{
					...props.style,
				}}
			/>
		),
		[]
	);

	const openProfile = (
		userItem: Pick<definitions["users"], "name" | "username" | "profilePic">
	) => {
		navigation.navigate("Root" as any, {
			screen: "Tabs",
			params: {
				screen: "Home",
				params: {
					screen: "Feed",
					params: {
						screen: "Profile",
						params: userItem,
					},
				},
			},
		});
	};

	const renderContent = () => (
		<View
			style={{
				backgroundColor: colors.surface,
				padding: 16,
				height: height,
			}}
		>
			<Text style={{ color: "white", fontWeight: "bold" }}>Views</Text>
			<ScrollView
				style={{
					marginTop: 12,
				}}
			>
				{route.params.views?.map((item) => (
					<TouchableOpacity
						onPress={() => openProfile(item.user)}
						key={item.id}
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<UserAvatar profilePicture={item.user.profilePic} />
						<View
							style={{
								marginLeft: 12,
							}}
						>
							<Text
								style={{
									color: "white",
									fontWeight: "bold",
								}}
							>
								{item.user.username}
							</Text>
							<Text
								style={{
									color: "white",
									opacity: 0.5,
								}}
							>
								{item.user.name}
							</Text>
						</View>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);

	const { colors } = useTheme();

	return (
		<BottomSheet
			handleIndicatorStyle={{
				backgroundColor: "#dadada",
			}}
			backgroundStyle={{
				backgroundColor: colors.surface,
			}}
			snapPoints={snapPoints}
			ref={sheetRef}
			// onCloseEnd={onClose}
			enablePanDownToClose
			backdropComponent={renderBackdrop}
			index={0}
			onChange={handleSheetChanges}
		>
			{renderContent}
		</BottomSheet>
	);
};

export default OwnStorySheet;
