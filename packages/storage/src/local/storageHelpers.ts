import type {
	ISyncStorageAdapter,
	IAsyncStorageAdapter,
} from "../interfaces/IStorageAdapter";

export const browserStorageAdapter: ISyncStorageAdapter = {
	getItem(key) {
		if (typeof window === "undefined") return null;
		try {
			return window.localStorage.getItem(key);
		} catch {
			return null;
		}
	},
	setItem(key, value) {
		if (typeof window === "undefined") return;
		try {
			window.localStorage.setItem(key, value);
		} catch {
			// Ignore quota/security failures and keep repository APIs predictable.
		}
	},
};

export function readCollectionSync<T>(
	adapter: ISyncStorageAdapter,
	key: string,
): T[] {
	try {
		const raw = adapter.getItem(key);
		return raw ? (JSON.parse(raw) as T[]) : [];
	} catch {
		return [];
	}
}

export async function readCollectionAsync<T>(
	adapter: IAsyncStorageAdapter,
	key: string,
): Promise<T[]> {
	try {
		const raw = await adapter.getItem(key);
		return raw ? (JSON.parse(raw) as T[]) : [];
	} catch {
		return [];
	}
}

export function writeCollectionSync<T>(
	adapter: ISyncStorageAdapter,
	key: string,
	data: T[],
): void {
	adapter.setItem(key, JSON.stringify(data));
}

export async function writeCollectionAsync<T>(
	adapter: IAsyncStorageAdapter,
	key: string,
	data: T[],
): Promise<void> {
	await adapter.setItem(key, JSON.stringify(data));
}
