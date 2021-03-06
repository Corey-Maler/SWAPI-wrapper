export type CURL = string;
export type ID = string | number;

const likeCURLRexexp = /\/\w+\/\d+\/$/g;

export function isCurl(x: any): x is CURL {
	console.log('>> ', x);
	return typeof x === 'string' && likeCURLRexexp.test(x);
}

export function isID(x: any): x is ID {
	return !isCurl(x); // Okay, this is definitely wrong. Actually I don't know possible schematics
	// in this particular task this is enought.
}

export function getCurl(data: any): string {
	return 'CURL ' + this.data.url;
}
