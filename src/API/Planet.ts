import { backend, Base } from './Base';
import { CURL, ID, getCurl } from './utils';
import { getLazyArray } from './LazyArray';
import { SearchResult } from './SearchResults';

export class Planet extends Base<any> {
	constructor(data: any) {
		super(data);
	}

	public get name(): string {
		return this.data.name;
	}

	public get rotationPeriod(): number {
		return +this.data.rotation_period;
	}

	public get diameter(): number {
		return +this.data.diameter;
	}

	public get climate(): string {
		return this.data.climate;
	}

	public get gravity(): string {
		return this.data.gravity;
	}

	public get terrain(): string[] {
		return this.data.terrain.split(',');
	}

	public get surfaceWater(): number {
		return +this.data.surface_water;
	}

	public get population(): number {
		return +this.data.population;
	}

	public get residents(): any {
		return this.data.residents;
	}

	public get films(): CURL[] {
		return this.data.films;
	}
}

export const get = async (id: CURL | ID) => {
	const data = await backend.get(id, '/planets/');
	return new Planet(data);
}

export const search = async (query: string) => {
	const data = await backend.get(`?search=${query}`, '/planet/', false);
	return new SearchResult(data, Planet);
}

declare module './Base' {
	// tslint:disable-next-line:no-shadowed-variable
	interface Base<T> {
		getPlanets(): Array<Promise<Planet>> | null;
	}
}

// little trick to make it support modules
Base.prototype.getPlanets = function() {
	if (this.data.planets) {
		return getLazyArray(this.data.planets, get);
	}

	return null;
}

/*
{
	"name": "Yavin IV",
	"rotation_period": "24",
	"orbital_period": "4818",
	"diameter": "10200",
	"climate": "temperate, tropical",
	"gravity": "1 standard",
	"terrain": "jungle, rainforests",
	"surface_water": "8",
	"population": "1000",
	"residents": [],
	"films": [
		"https://swapi.co/api/films/1/"
	],
	"created": "2014-12-10T11:37:19.144000Z",
	"edited": "2014-12-20T20:58:18.421000Z",
	"url": "https://swapi.co/api/planets/3/"
}
*/
