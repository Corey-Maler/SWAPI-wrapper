import { Base, backend} from './Base';
import { CURL, ID, getCurl } from './utils';
import { getLazyArray } from './LazyArray';
import { SearchResult } from './SearchResults';

export class Starship extends Base<any> {
	// Okay. For typescript nothing wrong with this string
	// but if we will export it as js library
	// everybody can change it
	// or not? Actually I don't know, does typescript set "modifieble" to false
	// with Object.defineProperty
	constructor(data: any) {
		super(data);

	}

	public get name(): string {
		return this.data.name;
	}

	public get model(): string {
		return this.data.model;
	}

	public get manufacturer(): string {
		return this.data.manufacturer;
	}

	public get costInCredits(): number {
		return +this.data.cost_in_credits;
	}

	public get length(): number {
		return +this.length;
	}

	public get maxAtmospheringSpeed(): number {
		return parseInt(this.data.max_atmosphering_speed, 10);
	}

	public get crew(): number {
		return +this.data.crew;
	}

	public get passengers(): number {
		return +this.data.passengers;
	}

	public get cargoCapacity(): number {
		return +this.data.cargo_capacity;
	}

	public get consumables(): string {
		return this.data.consumables;
	}

	public get hyperdriveRaing(): string {
		return this.data.hyperdrive_rating;
	}

	public get MGLT(): number {
		return +this.data.MGLT;
	}

	public get starshipClass(): string {
		return this.data.starship_class;
	}

	public get pilots(): any[] {
		return this.data.pilots;
	}

	public get films(): CURL[] {
		return this.data.films[];
	}
}

export const get = async (id: CURL | ID) => {
	const data = await backend.get(id, '/starships/');
	return new Starship(data);
}

export const search = async (query: string) => {
	const data = await backend.get(`?search=${query}`, '/starships/', false);
	return new SearchResult(data, Starship);
}

declare module './Base' {
	// tslint:disable-next-line:no-shadowed-variable
	interface Base<T> {
		getStarships(): Array<Promise<Starship>> | null;
	}
}

// little trick to make it support modules
Base.prototype.getStarships = function() {
	if (this.data.starships) {
		return getLazyArray(this.data.starships, get);
	}

	return null;
}

/*
{
	"name": "Death Star",
	"model": "DS-1 Orbital Battle Station",
	"manufacturer": "Imperial Department of Military Research, Sienar Fleet Systems",
	"cost_in_credits": "1000000000000",
	"length": "120000",
	"max_atmosphering_speed": "n/a",
	"crew": "342953",
	"passengers": "843342",
	"cargo_capacity": "1000000000000",
	"consumables": "3 years",
	"hyperdrive_rating": "4.0",
	"MGLT": "10",
	"starship_class": "Deep Space Mobile Battlestation",
	"pilots": [],
	"films": [
		"https://swapi.co/api/films/1/"
	],
	"created": "2014-12-10T16:36:50.509000Z",
	"edited": "2014-12-22T17:35:44.452589Z",
	"url": "https://swapi.co/api/starships/9/"
}
*/