import { ID, isCurl, isID, CURL, getCurl} from './utils';

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

export const backend = {
	get(id: ID | CURL, path: string) {
		let query;
		if (isCurl(id)) {
			query = id;
		} else {
			query = Base.root + path + id + '/';
		}
		return fetch(query).then(response => response.json());
	}
};
