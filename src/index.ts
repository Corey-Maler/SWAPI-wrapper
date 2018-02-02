import * as Film from './API/Film';
import * as Character from './API/Character';

const testFilm = async () => {
	const film = await Film.get('1');

	console.log('Film #1 title: ', film.title);

	const character = await Character.get('1');
};

testFilm();
