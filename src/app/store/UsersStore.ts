import { Instance, SnapshotOut, types, flow } from "mobx-state-tree";
import { definitions } from "../types/supabase";
import { editUserInDb, fetchUserFromDb } from "../utils/supabaseUtils";

export const UserModel = types.model("User", {
	username: types.identifier,
	name: types.string,
	bio: types.maybe(types.string),
	profilePic: types.maybe(types.string),
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
		const addUser = (newUser: User) => {
			if (!self.users.find((user) => user.username === newUser.username))
				self.users.push(newUser);
		};
		const addUsers = (users: Array<definitions["users"]>) => {
			self.users.concat(users);
		};
		const deleteUser = (username: string) => {
			const userToDelete = self.users.find(
				(user) => user.username === username
			);
			if (userToDelete) self.users.remove(userToDelete);
		};

		const editUser = flow(function* (username: string, newData: User) {
			console.log("username", username);
			let userToEdit = self.users.find(
				(user) => user.username === username
			);
			console.log("userToEdit", userToEdit);
			if (userToEdit) {
				userToEdit = {
					...userToEdit,
					...newData,
				};
			}
			console.log("username2", username);
			console.log("editedUser", userToEdit);
			yield editUserInDb(username, newData);
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
				console.error(err);
			}
			return user;
		});

		return { addUsers, getUser, setUsers, addUser, deleteUser, editUser };
	})

	.create({
		users: [],
	});

type UserType = Instance<typeof UserModel>;
export interface User extends UserType {}

type UserSnapshotType = SnapshotOut<typeof UserModel>;
export interface UserSnapshot extends UserSnapshotType {}

export default UsersStore;
