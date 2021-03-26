import { types } from "mobx-state-tree";
import PostsStore from "./PostsStore";
import UsersStore from "./UsersStore";

export const RootStoreModel = types.model({
	posts: PostsStore,
	users: UsersStore,
});

const RootStore = RootStoreModel.create({
	posts: [],
	users: [],
});

export default RootStore;
