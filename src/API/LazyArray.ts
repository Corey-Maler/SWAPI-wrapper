const handler = {
	get(target: any, name: string) {
		console.log('get in proxy', name)
		return name in target ?
			target[name] :
			37;
	}
};

class LazyArray {
	public somePublicField = 3;
	constructor(data: any) {
		console.log('lazy array constructor');
	}
}

export const getLazyArray = (data: any) => {
	return new Proxy(new LazyArray(data), handler);
}