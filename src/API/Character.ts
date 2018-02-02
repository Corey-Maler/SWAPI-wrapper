import { backend, Base } from './Base';
import { CURL, ID, isCurl, isID } from './utils';
import { getLazyArray } from './LazyArray';

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

// little trick to make it support modules
Base.prototype.getCharactersList = (data) => {
	const urls = data.characters;
	return getLazyArray(urls, get);
}
