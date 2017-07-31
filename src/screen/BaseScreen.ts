abstract class BaseScreen extends egret.DisplayObjectContainer {

	public constructor() {
		super();
	}

	abstract reset(): void;
}