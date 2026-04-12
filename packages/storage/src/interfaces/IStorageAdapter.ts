export interface ISyncStorageAdapter {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
}

export interface IAsyncStorageAdapter {
	getItem(key: string): Promise<string | null>;
	setItem(key: string, value: string): Promise<void>;
}
