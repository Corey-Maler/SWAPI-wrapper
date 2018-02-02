import { Base } from './Base';

export class Character extends Base {
	private data: any;
	constructor(data: any) {
		super();

		this.data = data;
	}

	public get name() {
		return this.data.name;
	}
}

export const get = async (id: string) => {
	const data = await Base.backend(`/people/${id}`);
	return new Character(data);
}
