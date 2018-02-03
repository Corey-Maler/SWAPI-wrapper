import { backend, Base } from './Base';
import { CURL, ID, getCurl } from './utils';
import { getLazyArray } from './LazyArray';
import { SearchResult } from './SearchResults';

export class Vehicle extends Base<any> {
	public readonly films: any;
	constructor(data: any) {
		super(data);

		this.films = this.getFilmList(data);
	}

	public get cargeCapacity(): number {
		return +this.data.cargo_capacity;
	}

	public get consumables(): string {
		return this.data.consumables;
	}

	public get costInCredits(): number {
		return +this.data.cost_in_credits;
	}

	public get crew(): number {
		return +this.data.crew;
	}

	public get length(): number {
		return parseFloat(this.data.length);
	}

	public get manufacturer(): string {
		return this.data.manufacturer;
	}

	public get maxAtmospheringSpeed(): number {
		return +this.data.max_atmosphering_speed;
	}

	public get model(): string {
		return this.data.model;
	}

	public get name(): string {
		return this.data.name;
	}

	public get passengers(): number {
		return +this.data.passengers;
	}

	public get vehicleClass(): string {
		return this.data.vehicle_class;
	}
}

export const get = async (id: CURL | ID) => {
	const data = await backend.get(id, '/vehicle/');
	return new Vehicle(data);
}

export const search = async (query: string) => {
	const data = await backend.get(`?search=${query}`, '/vehicle/', false);
	return new SearchResult(data, Vehicle);
}

// little trick to make it support modules
Base.prototype.getVehicleList = (data: any) => {
	const urls = data.characters;
	return getLazyArray(urls, get);
}

/*

{
    "cargo_capacity": "50000",
    "consumables": "2 months",
    "cost_in_credits": "150000",
    "created": "2014-12-10T15:36:25.724000Z",
    "crew": "46",
    "edited": "2014-12-10T15:36:25.724000Z",
    "length": "36.8",
    "manufacturer": "Corellia Mining Corporation",
    "max_atmosphering_speed": "30",
    "model": "Digger Crawler",
    "name": "Sand Crawler",
    "passengers": "30",
    "pilots": [],
    "films": [
        "https://swapi.co/api/films/1/"
    ],
    "url": "https://swapi.co/api/vehicles/4/",
    "vehicle_class": "wheeled"
}
*/