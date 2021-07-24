import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React from "react";
import {
	Image,
	RefreshControl,
	ScrollView,
	StatusBar,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from "react-native";
import { useQuery } from "react-query";
import { getNotifications } from "../../../api";
import Error from "../../Components/Error";
import { UserAvatar } from "../../Components/UserAvatar";
import { NotificationsNavigationProp } from "../../types/navigation/ActivityStack";
import { BottomTabParamList } from "../../types/navigation/BottomTab";
import { definitions } from "../../types/supabase";
import { getTimeDistance } from "../../utils/utils";

type Props = {
	route: RouteProp<BottomTabParamList, "Notifications">;
	navigation: BottomTabNavigationProp<BottomTabParamList, "Notifications">;
};

type NotificationProps = {
	type: "LIKE" | "COMMENT" | "FOLLOW";
	post?: Pick<
		definitions["posts"],
		"caption" | "imageUrl" | "postedAt" | "postId"
	>;
	comment?: Pick<definitions["comments"], "comment" | "id" | "postedAt">;
	byUser: Pick<definitions["users"], "name" | "username" | "profilePic">;
	createdOn: string;
};

const NotificationItem: React.FC<NotificationProps> = ({
	type,
	byUser: user,
	post,
	createdOn: time,
	comment,
}) => {
	const { width } = useWindowDimensions();
	const navigation = useNavigation<NotificationsNavigationProp>();
	const openNotification = () => {
		if ((type === "LIKE" || type === "COMMENT") && post) {
			navigation.navigate("Post" as any, {
				screen: "Post",
				params: {
					post: {
						...post,
						user: user.username,
					},
					user,
				},
			});
		}
		if (type === "FOLLOW") navigation.navigate("Profile", user);
	};
	return (
		<TouchableOpacity
			onPress={openNotification}
			style={{
				marginVertical: 12,
				display: "flex",
				flexDirection: "row",
				maxWidth: width,
				alignItems: "center",
				justifyContent: "space-between",
			}}
		>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					overflow: "hidden",
					alignItems: "center",
					flex: 1,
				}}
			>
				<UserAvatar
					size={28}
					profilePicture={user.profilePic}
					onPress={() => navigation.navigate("Profile", user)}
				/>
				<View
					style={{
						display: "flex",
						flexDirection: "column",
						marginLeft: 12,
						marginRight: 12,
					}}
				>
					<Text style={{ color: "white" }} textBreakStrategy="simple">
						{(() => {
							switch (type) {
								case "LIKE":
									return `${user.name} liked your post.`;
								case "COMMENT":
									return `${user.name} commented your post: ${comment?.comment}`;
								case "FOLLOW":
									return `${user.name} started following you.`;
							}
						})()}
					</Text>

					<Text
						style={{
							color: "white",
							opacity: 0.5,
							fontSize: 11,
							marginTop: 2,
						}}
					>
						{getTimeDistance(time)} ago
					</Text>
				</View>
			</View>
			{post && (
				<Image
					source={{
						uri: post?.imageUrl,
					}}
					width={64}
					height={64}
					style={{
						height: 48,
						width: 48,
					}}
				/>
			)}
		</TouchableOpacity>
	);
};

const Activity: React.FC<Props> = () => {
	const { data, error, refetch, isFetching } = useQuery(
		"fetchNotifications",
		() => getNotifications()
	);
	return (
		<>
			<StatusBar backgroundColor="black" barStyle="light-content" />
			{error && <Error />}
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={isFetching}
						onRefresh={refetch}
					/>
				}
				contentContainerStyle={{
					display: "flex",
					flex: 1,
					paddingHorizontal: 16,
					paddingVertical: 16,
					flexDirection: "column",
				}}
			>
				<Text
					style={{
						fontSize: 20,
						fontWeight: "bold",
						color: "white",
					}}
				>
					Activity
				</Text>
				<View
					style={{
						marginTop: 12,
					}}
				>
					{data?.map((notif) => (
						<NotificationItem
							createdOn={notif.createdOn}
							type={notif.type as any}
							byUser={notif.byUser}
							comment={notif.comment}
							key={notif.id}
							post={notif.post}
						/>
					))}
				</View>
			</ScrollView>
		</>
	);
};

export default Activity;
