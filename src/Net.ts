class Net {

	private static _instance: Net;

	public constructor() {

	}

	getData(url: string, onSuccess?: Function, onFail?: Function): void {
		const request = new egret.HttpRequest();
		request.responseType = egret.HttpResponseType.TEXT;
		request.setRequestHeader("Content-Type", "application/json");
		request.addEventListener(egret.Event.COMPLETE, () => {
			if (onSuccess != null) {
				onSuccess.call(this, request.response)
			}
		}, this);
		request.addEventListener(egret.IOErrorEvent.IO_ERROR, () => {
			if (onFail != null) {
				onFail.call(this);
			}
		}, this);
		request.open(url, egret.HttpMethod.GET);
		request.send();
	}

	static get instance(): Net {
		if (!Net._instance) {
			Net._instance = new Net();
		}
		return Net._instance;
	}
}