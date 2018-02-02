import { Base } from './Base';

export class Film extends Base {
	private data: any;
	constructor(data: any) {
		super();

		this.data = data;
	}

	public get title(): string {
		return this.data.title;
	}
}

export const get = async (id: string) => {
	const data = await Base.backend(`/films/${id}`);
	return new Film(data);
}
