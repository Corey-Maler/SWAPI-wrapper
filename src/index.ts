import * as Film from './API/Film';
import * as Character from './API/Character';

const testFilm = async () => {
	const film = await Film.get('1');

	console.log('Film #1 title: ', film.title);

	const character = await Character.get('1');

	console.log('Character #1 name', character.name);

	const characterByUrl = await Character.get('https://swapi.co/api/people/19/');

	console.log('Character by url name', characterByUrl.name);
};

testFilm();
