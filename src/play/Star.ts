class Star extends egret.DisplayObjectContainer {

	private _img: fairygui.GImage;

	public constructor(private _type: number, private _row: number, private _col: number) {
		super();

		this._img = fairygui.UIPackage.createObject("Package1", `star001_0${this._type + 1}`).asImage;
		this.addChild(this._img.displayObject);
		this.touchEnabled = true;
	}

	get type(): number {
		return this._type;
	}

	get row(): number {
		return this._row;
	}

	set row(val: number) {
		this._row = val;
	}

	get col(): number {
		return this._col;
	}

	set col(val: number) {
		this._col = val;
	}

	removeFromParent(): void {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}

	dispose(): void {
		if (this._img) {
			this._img.dispose();
		}
	}
}