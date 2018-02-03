import { backend, Base } from './Base';
import { CURL, ID, getCurl } from './utils';
import { getLazyArray } from './LazyArray';
import { SearchResult } from './SearchResults';

export class Character extends Base<any> {
	constructor(data: any) {
		super(data);
	}

	public get name(): string {
		return this.data.name;
	}

	public get height(): number {
		return +this.data.height;
	}

	public get mass(): number {
		return +this.data.mass;
	}

	public get hairColor(): string {
		return this.data.hair_color;
	}

	public get eyeColor(): string {
		return this.data.eye_color;
	}

	public get birthYear(): string {
		return this.data.birth_year;
	}

	public get gender(): 'male' | 'female' {
		return this.data.gender;
	}

	public get CURL(): string {
		return getCurl(this.data);
	}

	public get films(): CURL[] {
		return this.data.films;
	}

	public get vehicles(): CURL[] {
		return this.data.vehicles;
	}

	public get species(): string[] {
		return this.data.species;
	}

	public get starships(): string[] {
		return this.data.starships;
	}
}

export const get = async (id: CURL | ID) => {
	const data = await backend.get(id, '/people/');
	return new Character(data);
}

export const search = async (query: string) => {
	const data = await backend.get(`?search=${query}`, '/people/', false);
	return new SearchResult(data, Character);
}

declare module './Base' {
	// tslint:disable-next-line:no-shadowed-variable
	interface Base<T> {
		getCharacters(): Array<Promise<Character>> | null;
	}
}

// little trick to make it support modules
Base.prototype.getCharacters = function() {
	if (this.data.people) {
		return getLazyArray(this.data.people, get);
	}

	if (this.data.characters) {
		return getLazyArray(this.data.people, get);
	}

	return null;
}

/*
{
	"name": "Luke Skywalker",
	"height": "172",
	"mass": "77",
	"hair_color": "blond",
	"skin_color": "fair",
	"eye_color": "blue",
	"birth_year": "19BBY",
	"gender": "male",
	"homeworld": "https://swapi.co/api/planets/1/",
	"films": [
		"https://swapi.co/api/films/2/",
		"https://swapi.co/api/films/6/",
		"https://swapi.co/api/films/3/",
		"https://swapi.co/api/films/1/",
		"https://swapi.co/api/films/7/"
	],
	"species": [
		"https://swapi.co/api/species/1/"
	],
	"vehicles": [
		"https://swapi.co/api/vehicles/14/",
		"https://swapi.co/api/vehicles/30/"
	],
	"starships": [
		"https://swapi.co/api/starships/12/",
		"https://swapi.co/api/starships/22/"
	],
	"created": "2014-12-09T13:50:51.644000Z",
	"edited": "2014-12-20T21:17:56.891000Z",
	"url": "https://swapi.co/api/people/1/"
}
*/
