import { Instance, SnapshotOut, types } from "mobx-state-tree";

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
	.actions((self) => ({
		addUser(user: User) {
			self.users.push(user);
		},
		deleteUser(username: string) {
			const userToDelete = self.users.find(
				(user) => user.username === username
			);
			if (userToDelete) self.users.remove(userToDelete);
		},
		editUser(username: string, newData: User) {
			const userToEdit = self.users.findIndex(
				(user) => user.username === username
			);
			if (userToEdit) Object.assign(self.users[userToEdit], newData);
		},
	}))
	.views((self) => ({
		getUser(username: string) {
			return self.users.find((user) => user.username === username);
		},
	}))
	.create({
		users: [],
	});

type UserType = Instance<typeof UserModel>;
export interface User extends UserType {}

type UserSnapshotType = SnapshotOut<typeof UserModel>;
export interface UserSnapshot extends UserSnapshotType {}

export default UsersStore;
