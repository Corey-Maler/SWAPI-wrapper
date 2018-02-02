import { ID, isCurl, isID, CURL} from './utils';

export class Base {

	public static root = 'https://swapi.co/api';
}

export const backend = {
	get(id: ID | CURL, path: string) {
		let query;
		if (isCurl(id)) {
			query = id;
		} else {
			query = Base.root + path + id + '/';
		}
		return fetch(query).then(response => response.json());
	}
};
