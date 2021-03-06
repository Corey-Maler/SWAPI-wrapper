import { backend, Base } from './Base';
import { CURL, ID, getCurl } from './utils';
import { getLazyArray } from './LazyArray';
import { SearchResult } from './SearchResults';

export class Species extends Base<any> {
	constructor(data: any) {
		super(data);
	}

	public get name(): string {
		return this.data.name;
	}

	public get average_height(): number {
		return +this.data.height;
	}

	public get average_lifespan(): number {
		return +this.average_lifespan;
	}

	public get classification(): string {
		return this.data.classification;
	}

	public get designation(): string {
		return this.data.designation;
	}

	public get hairColors(): string {
		return this.data.hair_colors;
	}

	public get eyeColors(): string {
		return this.data.eye_colors;
	}

	public get homeworld(): string {
		return this.data.homeworld;
	}

	public get language(): string {
		return this.data.language;
	}

	public get skinColors(): string {
		return this.data.skin_colors;
	}

	public get films(): CURL[] {
		return this.data.films;
	}

	public get characters(): CURL[] {
		return this.data.people;
	}
}

export const get = async (id: CURL | ID) => {
	const data = await backend.get(id, '/species/');
	return new Species(data);
}

export const search = async (query: string) => {
	const data = await backend.get(`?search=${query}`, '/species/', false);
	return new SearchResult(data, Species);
}

declare module './Base' {
	// tslint:disable-next-line:no-shadowed-variable
	interface Base<T> {
		getSpacies(): Array<Promise<Species>> | null;
	}
}

// little trick to make it support modules
Base.prototype.getSpacies = function() {
	if (this.data.spacies) {
		return getLazyArray(this.data.spacies, get);
	}

	return null;
}
/*

{
    "average_height": "2.1",
    "average_lifespan": "400",
    "classification": "Mammal",
    "created": "2014-12-10T16:44:31.486000Z",
    "designation": "Sentient",
    "edited": "2014-12-10T16:44:31.486000Z",
    "eye_colors": "blue, green, yellow, brown, golden, red",
    "hair_colors": "black, brown",
    "homeworld": "https://swapi.co/api/planets/14/",
    "language": "Shyriiwook",
    "name": "Wookie",
    "people": [
        "https://swapi.co/api/people/13/"
    ],
    "films": [
        "https://swapi.co/api/films/1/",
        "https://swapi.co/api/films/2/"
    ],
    "skin_colors": "gray",
    "url": "https://swapi.co/api/species/3/"
}
*/
