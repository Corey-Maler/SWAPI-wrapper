export class Base {
	public static backend(path: string) {
		return fetch(Base.root + path).then(response => response.json());
	};

	private static root = 'https://swapi.co/api';
}
