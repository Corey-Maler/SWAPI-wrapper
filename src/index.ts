import * as Film from './API/Film';

const testFilm = async () => {
	const film = await Film.get('1');

	console.log('Film #1 title: ', film.title);
};

testFilm();
