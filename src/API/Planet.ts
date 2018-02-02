import { backend, Base } from './Base';
import { CURL, ID, getCurl } from './utils';
import { getLazyArray } from './LazyArray';

export class Planet extends Base<any> {
	public readonly films: any;
	constructor(data: any) {
		super(data);

		this.films = this.getFilmList(data);
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
}

export const get = async (id: CURL | ID) => {
	const data = await backend.get(id, '/planets/');
	return new Planet(data);
}

// little trick to make it support modules
Base.prototype.getPlanetsList = (data: any) => {
	const urls = data.characters;
	return getLazyArray(urls, get);
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
