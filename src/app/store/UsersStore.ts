import { Instance, SnapshotOut, types, flow } from "mobx-state-tree";
import { editUserInDb, fetchUserFromDb } from "../utils/firebaseUtils";

export const UserModel = types.model("User", {
	username: types.identifier,
	name: types.string,
	bio: types.optional(types.string, ""),
	profilePic: types.maybeNull(types.string),
	// profilePic: types.maybe(types.string),
});

const UsersStore = types
	.model("Users", {
		users: types.array(UserModel),
	})
	.actions((self) => {
		const setUsers = (users: Array<User>) => {
			self.users.replace(users);
		};
		const addUser = (user: User) => {
			self.users.push(user);
		};
		const deleteUser = (username: string) => {
			const userToDelete = self.users.find(
				(user) => user.username === username
			);
			if (userToDelete) self.users.remove(userToDelete);
		};
		const editUser = flow(function* (
			userId: string,
			username: string,
			newData: User
		) {
			const userToEdit = self.users.findIndex(
				(user) => user.username === username
			);
			if (userToEdit) Object.assign(self.users[userToEdit], newData);
			yield editUserInDb(userId, newData);
		});

		const getUser = flow(function* (username: string) {
			let user = self.users.find(
				(userToFind) => userToFind.username === username
			);
			try {
				const fetchedUser: User = yield fetchUserFromDb(username);
				user = fetchedUser;
				if (!user) {
					self.users.push(fetchedUser);
				}
			} catch (err) {
				console.log(err);
			}
			return user;
		});

		return {
			getUser,
			setUsers,
			addUser,
			deleteUser,
			editUser,
		};
	})

	.create({
		users: [],
	});

type UserType = Instance<typeof UserModel>;
export interface User extends UserType {}

type UserSnapshotType = SnapshotOut<typeof UserModel>;
export interface UserSnapshot extends UserSnapshotType {}

export default UsersStore;
