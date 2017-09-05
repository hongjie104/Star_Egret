abstract class BaseScreen extends egret.DisplayObjectContainer {

	public constructor() {
		super();
	}

	abstract reset(param?: any): void;

	abstract updateDollar(): void;

	show(): void {

	}

	closed(): void {

	}
}