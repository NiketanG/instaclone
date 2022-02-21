import { useNavigation } from "@react-navigation/core";
import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import {
	DeviceEventEmitter,
	StyleSheet,
	TouchableWithoutFeedback,
	useWindowDimensions,
	View,
} from "react-native";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import { useMemoOne } from "use-memo-one";
import { newMessage } from "../../api";
import { UserMin } from "../types";
import { FeedNavigationProp } from "../types/navigation/PostStack";
import { AppContext } from "../utils/appContext";
import { PostModal } from "./Post/PostMenuModal";
import ShareModal from "./Post/ShareModal";

const PostBottomSheetWrapper: React.FC<any> = () => {
	const navigation = useNavigation<FeedNavigationProp>();
	const menuModalref = useRef<BottomSheet>(null);
	const shareModalRef = useRef<BottomSheet>(null);

	const { height } = useWindowDimensions();
	const { user: currentUser } = useContext(AppContext);

	const [modalData, setModalData] = useState<{
		modalType: "MENU" | "SHARE";
		postId: number;
		user: UserMin;
	} | null>(null);

	const handler = (data: {
		modalType: "MENU" | "SHARE";
		postId: number;
		user: UserMin;
	}) => {
		setModalData(data);
		if (data.modalType === "MENU") menuModalref.current?.snapTo(0);
		if (data.modalType === "SHARE") shareModalRef.current?.snapTo(1);
	};

	useEffect(() => {
		const listener = DeviceEventEmitter.addListener(
			"PostModalOpen",
			handler
		);

		return () => {
			listener.remove();
		};
	}, []);

	const fall = useMemoOne(() => new Animated.Value(1), []);

	const renderHeader = () => (
		<TouchableWithoutFeedback>
			<View
				style={{
					...styles.panelHeader,
					backgroundColor: "#1f1f1f",
				}}
			>
				<View style={styles.panelHandle} />
			</View>
		</TouchableWithoutFeedback>
	);

	const renderMenuModal = () =>
		modalData && (
			<PostModal
				viewProfile={viewProfile}
				username={modalData.user.username}
				postId={modalData.postId}
				ownPost={currentUser?.username === modalData.user.username}
				closeModal={() => closeModal("MENU")}
			/>
		);

	const sendPost = (user: UserMin) => {
		newMessage({
			message_type: "POST",
			postId: modalData?.postId,
			receiver: user.username,
		});
	};

	const renderShareModal = () =>
		modalData && (
			<ShareModal
				sendMessage={sendPost}
				closeModal={() => closeModal("SHARE")}
			/>
		);

	const viewProfile = () =>
		modalData &&
		navigation.navigate("Profile", {
			username: modalData?.user.username,
			isCurrentUser: false,
		} as any);

	const onClose = () => {
		modalData && closeModal(modalData.modalType);
	};
	const closeModal = (modalType: "MENU" | "SHARE") => {
		if (modalType === "MENU") {
			menuModalref.current?.snapTo(2);
		} else {
			shareModalRef.current?.snapTo(2);
		}
		setModalData(null);
	};

	return (
		<>
			<BottomSheet
				snapPoints={[
					modalData?.user.username === currentUser?.username
						? 204
						: 104,
					0,
					0,
				]}
				renderContent={renderMenuModal}
				ref={menuModalref}
				renderHeader={renderHeader}
				initialSnap={2}
				callbackNode={fall}
				onCloseEnd={onClose}
			/>

			<BottomSheet
				snapPoints={[height, height / 2, 0]}
				renderContent={renderShareModal}
				ref={shareModalRef}
				initialSnap={2}
				callbackNode={fall}
				renderHeader={renderHeader}
				onCloseEnd={onClose}
			/>
			<TouchableWithoutFeedback onPress={onClose}>
				<Animated.View
					pointerEvents={modalData !== null ? "box-only" : "none"}
					style={[
						styles.shadowContainer,
						{
							opacity: Animated.interpolateNode(fall, {
								inputRange: [0, 1],
								outputRange: [0.5, 0],
							}),
						},
					]}
				/>
			</TouchableWithoutFeedback>
		</>
	);
};

const styles = StyleSheet.create({
	panelHeader: {
		width: "100%",
		height: 24,
		alignItems: "center",
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		paddingHorizontal: 16,
	},
	panelHandle: {
		width: 40,
		height: 4,
		backgroundColor: "#646464",
		borderRadius: 4,
		marginVertical: 16,
	},
	// Shadow
	shadowContainer: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "#000",
	},
});

export default PostBottomSheetWrapper;
