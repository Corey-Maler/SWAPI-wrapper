import { CacheStrategy } from './types';

// most easiest cache realisation. Just remember everything until tab reload
export class ForeverStrategy<T> implements CacheStrategy<T> {
	private memory: Map<string, T> = new Map();
	public get(key: string) {
		return this.memory.get(key);
	}

	public set(key: string, value: T) {
		this.memory.set(key, value);
	}

	public has(key: string) {
		return this.memory.has(key);
	}
}
