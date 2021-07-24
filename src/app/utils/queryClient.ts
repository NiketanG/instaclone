import { QueryClient } from "react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { createAsyncStoragePersistor } from "react-query/createAsyncStoragePersistor-experimental";

const asyncStoragePersistor = createAsyncStoragePersistor({
	storage: AsyncStorage,
});

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			cacheTime: 1000 * 60 * 60 * 12, // 24 hours
		},
	},
});

persistQueryClient({
	queryClient,
	persistor: asyncStoragePersistor,
});
