import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

Reactotron.configure() // controls connection & communication settings
	.useReactNative() // add all built-in react native plugins
	.asyncStorageHandler(AsyncStorage)
	.connect();
