# SWAPI wrapper

This library is wrapper of https://swapi.co.


## Installation

```
npm install nice-swapi
```

## Usage

```
import as * Film from 'nice-swapi/film';

const foundFilms = await Film.search('empire');

foundFilms.forEach(film => 
	console.log(film.name);
);

```

## Modules

To add required resource you should import it first. Just after importing you will be able to access to resource throught `getResource` property.

For example:
```
import 'nice-swapi/character';
import * as Film from 'nice-swapi/film';

const ep1 = await Film.get(1);

ep1.getCharacters().map(ch => {
	ch.then(character => console.log(character.name));
});

```

## Search Results

After searching you'll have a `SearchReslut` class.

```

const foundedFilms = Film.search('title');

const nextResults = await foundedFilms.next; // next is a promise with next page of results
const previous = await foundedFilms.previous; // promise with previous results or null
foundedFilms.results; // array with Films

```

## Available resources

* `Film`
* `Character`
* `Planet`
* `Species`
* `Starship`
* `Vehicle`