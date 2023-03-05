import React, { useCallback, useMemo, useRef } from "react";

import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { ToastAndroid, useWindowDimensions } from "react-native";
import { newMessage } from "../../../../api";
import ShareModal from "../../../Components/Post/ShareModal";
import { UserMin } from "../../../types";
import { RootStackNavProps } from "../../../types/navigation/RootStack";
import { useTheme } from "react-native-paper";

const PostShareMenu = ({
	navigation,
	route,
}: RootStackNavProps<"PostShareMenu">) => {
	const modalData = route.params;
	const menuModalref = useRef<BottomSheet>(null);

	const { height } = useWindowDimensions();

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

	const onClose = () => {
		navigation.goBack();
	};

	const sendPost = async (user: UserMin) => {
		if (!modalData) return;
		if (route.params.type === "POST") {
			await newMessage({
				message_type: "POST",
				postId: modalData?.postId,
				receiver: user.username,
			});
			ToastAndroid.show("Post shared!", ToastAndroid.SHORT);
		} else if (route.params.type === "STORY") {
			await newMessage({
				message_type: "STORY",
				storyId: route.params?.storyId,
				receiver: user.username,
			});
			ToastAndroid.show("Story shared!", ToastAndroid.SHORT);
		}
		onClose();
	};

	const renderMenuModal = () =>
		modalData && <ShareModal sendMessage={sendPost} />;

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
			ref={menuModalref}
			// onCloseEnd={onClose}
			enablePanDownToClose
			backdropComponent={renderBackdrop}
			index={0}
			onChange={handleSheetChanges}
		>
			{renderMenuModal}
		</BottomSheet>
	);
};

export default PostShareMenu;
