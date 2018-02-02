import { backend, Base } from './Base';
import { CURL, ID, isCurl, isID } from './utils';

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

export const get = async (id: CURL | ID) => {
	const data = await backend.get(id, '/people/');
	return new Character(data);
}
