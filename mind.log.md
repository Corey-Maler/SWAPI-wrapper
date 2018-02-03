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

Sounds strange, but now completed most of libraty. I mean okay, it still contains only two methods, no typeguarding, no caching, nothing. But in fact -- everything what last is just a lot of "monkey-coding". Skeleton is ready :)

You may ask me: what is going on? Why in `Base` class a lot of methods like 
```
public getCharactersList(data: any) {
	return data.characters;
}
```

What is ```Base.prototype.getCharactersList```? Why didn't you implement this method inside Base class?

Okay. First of all -- circular dependency is not good idea. In fact it even doesn't work properly, caz can't define classes in this way. Probably this is error in typesript compiler or webpack builder, it should work with es6 imports.

Secondly -- it allow you to extends your library. If you don't need "Character" -- it will not load code of this class. If you need -- you can import this file and it will authomaticly mount to base prototype and works just fine. In fact RXJS5 modules system builder based on this idea. Check https://github.com/ReactiveX/rxjs/blob/master/src/add/operator/audit.ts

Unfortunately in typescript it's pretty tricky. Really tricky, in vanillaJS this is a really good way to make your library modular and extendable.

So, now I will just fulfiel last part of code, create more classes and so on.

I just noticed that all this staff with Base class and prototype extension is useless in this particular case. Use can use just singletone object "DataProcessors" instead.

Even more, now all this methods like "getVehicleList" is public and global, you can easily get access to them, but using internal object will hide it.

No, with base class it looks more nice, so I will use it anyway. (Of course in real world I will use most satisfied way, not more beautiful)

###########################

In this moment I think that there are still thousands places to improve. But let me show, how will I implement Cache strategy by modules and I think, that it's enought

## Summary

For now there is implemented:
- module structure. You can easily extend and import what you want, you can change cache strategy
- lazy loading
- interesting ORM-like API

What have to be implemented:
- strong types. No more "any"
- different backends
- documentation

### How it works

You have some system utilities, and entry point (/API/index.ts). Via entry point you can configure this api library. Entry point just store you configuration in it's own scope, but this configuration is singlepoint. In most cases this is bad behaviour, but if your library can't be attached twice on the same page -- you can use this method.

All entries of API saved in different files and nowhere included. When user include this file it authomaticly patches base class prototype and this single class now available throuhgt another classes.

If some class included, you can easily get object of it, passing throught property in another. For example, if you include both Character and Film classes, you can in Film class object write:
```
const character = await film.characters[0];
character.name // Luke Skywalker
```

# Let's improve our code

After while I noticed that my "Lazy array" actually not an array. It even doesn't looks lika array. We need to fix it.

What do we know about it? It can't be changed dynamecly, so we can use real array and `freeze` it after filling. To make it lazy we need to set getters somehow one elements, accesable by index. So, we can make this trick with our knowledge about arrays in js. By some historical reasons, regular (not typed) array in js is just usual object. We you are writing
```
const t = [0, 1, 2];
```

In fact it's equal to:
```
const t = {0: 1, 1: 2, 2: 3};

t.__proto__ = Array.prototype.

// Somewhere inside engine: t[[Class]] = 'Array';
// You cannot override this [Class] property manually, so that's why this code is not equivalent

```

It means that we can still use `Object.defineProperty` as well instead `Proxy`.

### Search!

Let's implement searching. It will be as `Module.search(): Promise<SearchResult<Module>>`

### More typings

Let's fix "any" type in Lazy Array.

Actually in typescript it's pretty difficult and tricky to redeclare module. In pure js you can just change "prototype", but in typescript you can make something like "patch" of external module declaration, but intertnal not. I will try to find a way.

### Big problem

The reason why you cannot redeclare type/module/whatever is: you can use this types inside this modules and redeclaration will break this parts of code.
The right way is only extend module. But you cannot declare getter/setter via prototype, so I have only one way: extend `Base` class with some new methods like `getFilms(): LazyArray<Film>`.

That's why I actually love typescript: if you decied to do some stupid API just because you can do this with power of javascript, you won't be able to do it because of limitations of typescript (or you will lose typeguarding).

Again -- you can redecrale parts and my idea will work if I will separait my code as few npm-modules. But now I will just extend `Base` class with some methods.

By the way, it's much better to insert another method when extending API instead modifying existing because if somebody will use your API and after while he will import another module which change existing behaviour, probably he will have to rewrite thousands lines of broken code.

Funny, but webpack-tree-shaking removes files if you are not using some of code inside file. This is good from one hand and bad from other. I will think how we can fix it.