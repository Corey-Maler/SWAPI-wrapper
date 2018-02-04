import { ID, isCurl, isID, CURL, getCurl} from './utils';

import { CacheStrategy } from './CacheStrategies/types';

export class Base<T> {
	public static root = 'https://swapi.co/api';

	protected data: T;

	constructor(data: T) {
		this.data = data;
	}

	public get CURL(): string {
		return getCurl(this.data);
	}
}

let currentCacheStrategy: CacheStrategy<any> | null = null;

export const backend = {
	getClear(url: CURL) {
		return fetch(url).then((response: any) => response.json());
	},
	get(id: ID | CURL, resource: string, autoclose?: boolean) {
		let query;
		if (typeof id === 'string' && id.includes(resource)) {
			query = id;
		} else {
			query = Base.root + resource + id + (autoclose ? '/' : '');
		}

		let request;
		if (currentCacheStrategy !== null && currentCacheStrategy.has(query)) {
			request = currentCacheStrategy.get(query);
		} else {
			request = fetch(query);
		}

		return request.then((response: any) => response.json());
	},
	setCacheStrategy(cs: CacheStrategy<any> | null) {
		currentCacheStrategy = cs;
	}
};
