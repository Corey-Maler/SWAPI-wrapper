import { backend } from "./Base";

export class SearchResult<T> {
	private data: any;
	private constr: any;
	private prev: SearchResult<T> | undefined;
	private readonly _results: T[];
	constructor(data: any, constr: (new(...a: any[]) => T), prev?: SearchResult<T>) {
		this.data = data;
		this.constr = constr;
		this._results = data.results.map((r: any) => new constr(r));
		this.prev = prev;
	}

	public get count(): number {
		return this.data.count;
	}

	public get results(): T[] {
		return this._results;
	}

	public get next(): null | Promise<SearchResult<T>> {
		if (this.data.next === null) {
			return null;
		}

		return backend
			.getClear(this.data.next)
			.then((data: any) => new SearchResult<T>(data, this.constr, this));
	}

	public get previous(): null | Promise<SearchResult<T>> {
		return this.prev && Promise.resolve(this.prev) || null;
	}
}

/*

	"count": 44,
	"next": "https://swapi.co/api/people/?search=e&page=2",
	"previous": null,
	"results":

*/
