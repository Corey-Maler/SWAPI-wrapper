import { ID, isCurl, isID, CURL, getCurl} from './utils';

import { CacheStrategy } from './CacheStrategies/types';

export class Base<T> {
	public static root = 'https://swapi.co/api';

	protected data: T;

	constructor(data: T) {
		this.data = data;
	}

	public getCharactersList(data: any) {
		return data.characters;
	}

	public getPeopleList(data: any) {
		return data.people;
	}

	public getFilmList(data: any) {
		return data.films;
	}

	public getPlanetsList(data: any) {
		return data.planets;
	}

	public getStarshipList(data: any) {
		return data.starships;
	}

	public getVehicleList(data: any) {
		return data.vehicleList;
	}

	public getSpeciesList(data: any) {
		return data.species;
	}

	public get CURL(): string {
		return getCurl(this.data);
	}
}

let currentCacheStrategy: CacheStrategy<any> | null = null;

export const backend = {
	get(id: ID | CURL, path: string) {
		let query;
		if (typeof id === 'string' && id.includes(path)) {
			query = id;
		} else {
			query = Base.root + path + id + '/';
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
