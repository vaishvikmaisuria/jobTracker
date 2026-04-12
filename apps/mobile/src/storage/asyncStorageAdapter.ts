import AsyncStorage from "@react-native-async-storage/async-storage";
import type { IAsyncStorageAdapter } from "@job-tracker/storage";

export const asyncStorageAdapter: IAsyncStorageAdapter = {
	async getItem(key) {
		return AsyncStorage.getItem(key);
	},
	async setItem(key, value) {
		await AsyncStorage.setItem(key, value);
	},
};
