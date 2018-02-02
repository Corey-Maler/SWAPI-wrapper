const isNumber = (x: any): x is number => !isNaN(+x);

const handler = {
	get(target: any, id: string) {
		console.log('get in proxy', id, typeof id)
		if (id in target) {
			return target[name];
		}

		if (isNumber(id) && id < target.urls.length - 1) {
			return target.factory(target.urls[id]);
		}

		return undefined;
	}
};

class LazyArray {
	public factory: any;
	public urls: any[];
	constructor(urls: any[], factory: any) {
		console.log('lazy array constructor');
		this.factory = factory;
		this.urls = urls;
	}
}

export const getLazyArray = (urls: any[], factory: any) => {
	return new Proxy(new LazyArray(urls, factory), handler);
};
