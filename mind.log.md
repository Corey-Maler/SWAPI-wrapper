Hi! I'm Konstantin Zarvansky

This is initial commit and I will use this file to log most of my minds while developing solution

I will start from searching some webpack-typescript-lib boilerplate.

https://github.com/lomboboo/webpack-typescript-boilerplate this one looks good and enought modern. Use it.

"Error: Cannot find module 'hard-source-webpack-plugin'" -- not so good boilerplate :) Let's fix it.

Problem caused by windows: package can't be installed on this OS. Okay, I'll try to use bash-in-windows (I hate npm modules that requires compilation. There are always problems with them).

"Module build failed: Error: Node Sass does not yet support your current environment: Linux 64-bit with Unsupported runtime (59)" Did I mention that I hate native modules? node-sass probably most-annoying from them.

Blue Screen Of Death. I'm lucky today.

Okay, let's just clean src and boilerpate and finally start coding.


So, when everything is ready for work, is better time to think how exactly I will implement it.

Correct way to implement it:

- main module, that allow us to use different backend (we can choose and extends to use XML instead JSON, for example)
- standard backend with fetch api
- modules that implement parts of query, for example vechicle or plane

Then code will looks like:
```
import * as SWAPI from 'swapi';
import { jsonBackend } from 'swapi/backends';

SWAPI.setBackend(jsonBackend);
// SWAPI.authorize(credentials); // there is no authorization in SWAPI.co, I know, this is just an example
```

and usage
```
import * as Planet from 'swapi/planet';
import * as Character from 'swapi/character';

async function getPlanet() {
	const planet = await Planet.get('id');
}

async function getListOfCharactesNames(film) {
	const characters = await Promise.all(film.characters.map(character =>  Character.get(character)))
	return characters.map(character => character.name);
}

Character.search('Luke') // => promise with list of Lukes.
```

Somewhere inside it should contains cache to reduce queries and time.

This way is good enought: easy to use, easy to extend, support tree-shaking and a lot of another benifits.

BUT!

But this way is boring. I want to get something interesting, funny. Let's say I want next API:

```

const NewHope = await Film.findExactly('A New Hope');

for (const character of Film.characters) {
	console.log(character.name);
}

```

We can do it by recursivity loading whole data. What is really bad. Or use sync requests.
But we have async generators ( https://github.com/jhusain/asyncgenerator )!
What? Widtdrawown? Three years ago? Okay. Sad. js-observable is not way to use there.

So, let's than implement something like this:

```
const character = await Film.characters[0];
console.log(character.name);
```

Then will decide what to do with loops.

######################################

First part is basic API, some abstract classes, class hierarchy.

Okay it works. Let's go deeper. Current tslint little bit annoying. In work I use from microsoft with some tweaks.

So, why getters? Why I choose this way to implement class?
1. This data is readonly by defenition.
2. It will take a lot of code and bytes in final code, but this allow you to describe every single line of object. When somebody will use this class, he can just type film.producer and "IntelliSense" (in vscode, I don't know how this called in IDEA) will show defenition of field.
Of course we can make some "magic" in declaration file and extend given data with custom fields. It will take much less memory, code, but still will be useful in case of IDE suggestions. From other side it will increase probability of mistakes and will take more time. So, just for test task getters is enought.

Can I skip getters declaration part? It has to be done in real world and I will complete it after sending results, but for time-saving I'll skip it.

Film close to be completed. But last 5 properties is the most interesting part. Let's first implement basic Character class.

I just noticed that "data" has "any" type. This is really bad. It should has a real type. But I'll leave it like that for now.

Now let's connect them. Let's film.characters[0] will return promise with Character class in resolution.

First of all, we have problem: method "get" requires id as number, but inside film response it's a string.
Let's make two different types and typeguards. It will help us in future.

Done.


Now I wanna make possible to use API in next case:
```
const aNewHope = Film.get(1);
const character = await aNewHope.characters[0];
console.log(character.name);
```

The problem is how to make it "lazy". Of couse we do something like 
```
class Whatever {
	constructor(data: WhateverData) {
		this.data = data;
		this.charactersRequests = this.data.characters.map(curl => Character.get(curl));
	}
}
```

But this means that after loading film we will load all characters just in few seconds even if we never use them.

Obserable (like rxjs) can be lazy. But in this particular task they are overhead.

We can make pseudo-array with thousands of getters for i = 0..1000, like in mobx. In mobx it works just fine.

In fact you then code will look like:
```
for (let i = 0; i < 1000; i++) {
	Object.defineProperty(this, ...);
}
```

But I want something new and interesting. I've never used es6 Proxy. I really beilive that their time become right now! (Actually at this moment I'm not sure that this will work, so, real-time experiment in test task. Why not?)

And let's make this file as markdown.

P.S. After calling class as "lazy array" I'm pretty sure that this library exists. At least sounds cool!

Works just perfect!

(Oh, yes, I hope you are using one of this https://caniuse.com/#search=proxy browsers. This)

So. Proxy works. Let's finally implement `Characters` property in `Film` class.