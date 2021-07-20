import { useNavigation } from "@react-navigation/core";
import React, { useContext, useEffect, useRef } from "react";
import {
	StyleSheet,
	TouchableWithoutFeedback,
	useWindowDimensions,
	View,
} from "react-native";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import { useMemoOne } from "use-memo-one";
import { AppContext } from "../utils/appContext";
import { PostModal } from "./Post/PostMenuModal";
import PostShareModal from "./Post/PostShareModal";

type Props = {
	openedModalData: {
		modalType: "MENU" | "SHARE";
		username: string;
		postId: number;
	} | null;
	onClose: () => void;
};
const PostBottomSheetWrapper: React.FC<Props> = ({
	openedModalData,
	onClose,
	children,
}) => {
	const navigation = useNavigation();
	const menuModalref = useRef<BottomSheet>(null);
	const shareModalRef = useRef<BottomSheet>(null);

	const { height } = useWindowDimensions();
	const { user: currentUser } = useContext(AppContext);

	useEffect(() => {
		if (openedModalData?.modalType && openedModalData.postId) {
			if (openedModalData.modalType === "MENU") {
				menuModalref.current?.snapTo(0);
			} else {
				shareModalRef.current?.snapTo(0);
			}
		}
	}, [openedModalData]);

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
		openedModalData && (
			<PostModal
				viewProfile={viewProfile}
				username={openedModalData.username}
				postId={openedModalData.postId}
				ownPost={currentUser?.username === openedModalData.username}
				closeModal={() => closeModal("MENU")}
			/>
		);

	const renderShareModal = () =>
		openedModalData && (
			<PostShareModal
				postId={openedModalData.postId}
				closeModal={() => closeModal("SHARE")}
			/>
		);

	const viewProfile = () =>
		openedModalData &&
		navigation.navigate("Profile", {
			username: openedModalData?.username,
			isCurrentUser: false,
		});

	const closeModal = (modalType: "MENU" | "SHARE") => {
		if (modalType === "MENU") {
			menuModalref.current?.snapTo(2);
		} else {
			shareModalRef.current?.snapTo(2);
		}
	};

	return (
		<>
			<BottomSheet
				snapPoints={[
					openedModalData?.username === currentUser?.username
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
				snapPoints={[height / 1.5 + 24, 0, 0]}
				renderContent={renderShareModal}
				ref={shareModalRef}
				initialSnap={2}
				callbackNode={fall}
				renderHeader={renderHeader}
				onCloseEnd={onClose}
			/>
			{children}
			<Animated.View
				pointerEvents={!openedModalData?.postId ? "none" : "box-only"}
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
