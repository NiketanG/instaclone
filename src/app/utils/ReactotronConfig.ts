import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mst } from "reactotron-mst";
import React from "react";
import PostsStore from "../store/PostsStore";
import UsersStore from "../store/UsersStore";

Reactotron.configure() // controls connection & communication settings
	.use(mst())
	.useReactNative() // add all built-in react native plugins
	.connect();
