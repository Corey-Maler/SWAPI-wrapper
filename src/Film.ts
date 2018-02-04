import { Base, backend} from './Base';
import { CURL, ID, getCurl } from './utils';
import { getLazyArray } from './LazyArray';
import { SearchResult } from './SearchResults';

export class Film extends Base<any> {
	// Okay. For typescript nothing wrong with this string
	// but if we will export it as js library
	// everybody can change it
	// or not? Actually I don't know, does typescript set "modifieble" to false
	// with Object.defineProperty

	constructor(data: any) {
		super(data);
	}

	/**
	 * Film title
	 */
	public get title(): string {
		return this.data.title;
	}

	/**
	 * Number of episode.
	 */
	public get episode_id(): number {
		return this.data.episode_id;
	}

	/**
	 * Film opening
	 */
	public get opening(): string {
		return this.data.opening_crawl;
	}

	/**
	 * Film director
	 */
	public get director(): string {
		return this.data.director;
	}

	public get producer(): string {
		return this.data.producer;
	}

	public get releaseDate(): string {
		return this.data.release_date;
	}
	public get characters(): CURL[] {
		return this.data.characters;
	}
	public get planets(): CURL[] {
		return this.data.planets;
	}

	public get starships(): CURL[] {
		return this.data.starships;
	}
	public get vehicles(): CURL[] {
		return this.data.vehicles;
	}
	public get species(): CURL[] {
		return this.data.species;
	}
}

export const get = async (id: CURL | ID) => {
	const data = await backend.get(id, '/films/');
	return new Film(data);
}

export const search = async (query: string) => {
	const data = await backend.get(`?search=${query}`, '/films/', false);
	return new SearchResult(data, Film);
}

declare module './Base' {
	// tslint:disable-next-line:no-shadowed-variable
	interface Base<T> {
		getFilms(): Array<Promise<Film>> | null;
	}
}

// little trick to make it support modules
Base.prototype.getFilms = function() {
	if (this.data.films) {
		return getLazyArray(this.data.films, get);
	}

	return null;
}

/*

"title": "A New Hope",
	"episode_id": 4,
	"opening_crawl": "It is a period of
	 civil war.\r\nRebel spaceships, striking
	 from a hidden base, have won\r\ntheir first victory against
	 the evil Galactic Empire.\r\n\r\nDuring the battle, Rebel
	 spies managed to steal secret\r\nplans to the Empire's
	 ultimate weapon, the DEATH\r\nSTAR, an armored space
	 station with enough power\r\nto destroy an entire planet.
	 Pursued by the Empire's\r\nsinister agents, Princess
	 Leia races home aboard her\r\nstarship, custodian of the
	 nstolen plans that can save her\r\npeople and restore\r\nfreedom to the galaxy....",
	"director": "George Lucas",
	"producer": "Gary Kurtz, Rick McCallum",
	"release_date": "1977-05-25",
	"characters": [
		"https://swapi.co/api/people/1/",
		"https://swapi.co/api/people/2/",
		"https://swapi.co/api/people/3/",
		"https://swapi.co/api/people/4/",
		"https://swapi.co/api/people/5/",
		"https://swapi.co/api/people/6/",
		"https://swapi.co/api/people/7/",
		"https://swapi.co/api/people/8/",
		"https://swapi.co/api/people/9/",
		"https://swapi.co/api/people/10/",
		"https://swapi.co/api/people/12/",
		"https://swapi.co/api/people/13/",
		"https://swapi.co/api/people/14/",
		"https://swapi.co/api/people/15/",
		"https://swapi.co/api/people/16/",
		"https://swapi.co/api/people/18/",
		"https://swapi.co/api/people/19/",
		"https://swapi.co/api/people/81/"
	],
	"planets": [
		"https://swapi.co/api/planets/2/",
		"https://swapi.co/api/planets/3/",
		"https://swapi.co/api/planets/1/"
	],
	"starships": [
		"https://swapi.co/api/starships/2/",
		"https://swapi.co/api/starships/3/",
		"https://swapi.co/api/starships/5/",
		"https://swapi.co/api/starships/9/",
		"https://swapi.co/api/starships/10/",
		"https://swapi.co/api/starships/11/",
		"https://swapi.co/api/starships/12/",
		"https://swapi.co/api/starships/13/"
	],
	"vehicles": [
		"https://swapi.co/api/vehicles/4/",
		"https://swapi.co/api/vehicles/6/",
		"https://swapi.co/api/vehicles/7/",
		"https://swapi.co/api/vehicles/8/"
	],
	"species": [
		"https://swapi.co/api/species/5/",
		"https://swapi.co/api/species/3/",
		"https://swapi.co/api/species/2/",
		"https://swapi.co/api/species/1/",
		"https://swapi.co/api/species/4/"
	],
	"created": "2014-12-10T14:23:31.880000Z",
	"edited": "2015-04-11T09:46:52.774897Z",
	"url": "https://swapi.co/api/films/1/"
*/
