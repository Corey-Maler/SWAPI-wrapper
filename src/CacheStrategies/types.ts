export interface CacheStrategy<T> {
	get: (key: string) => T | null;
	set: (key: string, value: T) => void;
	has: (key: string) => boolean;
};
