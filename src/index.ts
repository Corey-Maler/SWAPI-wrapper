import * as SWAPI from './API';

import { ForeverStrategy } from './API/CacheStrategies/forever';

import * as Film from './API/Film';
import * as Character from './API/Character';

SWAPI.setCacheStragy(new ForeverStrategy());

// teting lazy array
import { getLazyArray } from './API/LazyArray';

const testFilm = async () => {
	const film = await Film.get('1');

	console.log('Film #1 title: ', film.title);

	const character = await Character.get('1');

	console.log('Character #1 name', character.name);

	const characterByUrl = await Character.get('https://swapi.co/api/people/19/');

	console.log('Character by url name', characterByUrl.name);

	const film2 = await character.films[0];
	console.log('film via proxy', film2);

	const starship = await film2.starships[0];
	console.log('we didn\'t import starship class, vehicle1 should be just a link', starship);
};

testFilm();
