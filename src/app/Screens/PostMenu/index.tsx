import React, { useCallback, useContext, useMemo, useRef } from "react";

import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { PostModal } from "../../Components/Post/PostMenuModal";
import { UserMin } from "../../types";
import { RootStackNavProps } from "../../types/navigation/RootStack";
import { AppContext } from "../../utils/appContext";

const PostMenu = ({ navigation, route }: RootStackNavProps<"PostMenu">) => {
	const modalData = route.params as { postId: number; user: UserMin };
	const menuModalref = useRef<BottomSheet>(null);

	const { user: currentUser } = useContext(AppContext);

	const snapPoints = useMemo(
		() =>
			modalData?.user.username === currentUser?.username ? [204] : [104],
		[modalData, currentUser]
	);

	// []

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

	const onClose = () => {};

	const viewProfile = () => {
		modalData &&
			navigation.navigate(
				"Profile" as any,
				{
					username: modalData?.user.username,
					isCurrentUser: false,
				} as any
			);
	};

	const renderMenuModal = () =>
		modalData && (
			<PostModal
				viewProfile={viewProfile}
				username={modalData.user.username}
				postId={modalData.postId}
				ownPost={currentUser?.username === modalData.user.username}
				closeModal={() => onClose()}
			/>
		);

	return (
		<BottomSheet
			handleIndicatorStyle={{
				backgroundColor: "#dadada",
			}}
			backgroundStyle={{
				backgroundColor: "#1f1f1f",
			}}
			snapPoints={snapPoints}
			ref={menuModalref}
			// onCloseEnd={onClose}
			enablePanDownToClose
			backdropComponent={renderBackdrop}
			index={0}
			onChange={handleSheetChanges}
		>
			{renderMenuModal()}
		</BottomSheet>
	);
};

export default PostMenu;
