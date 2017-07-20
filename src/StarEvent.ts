class StarEvent extends egret.Event {

	static ENTER_LEVEL = 'enterLevel';

	public constructor(type: string, private _level?: number) {
		super(type);
	}

	get level(): number {
		return this._level;
	}
}