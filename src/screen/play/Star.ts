class Star extends egret.DisplayObjectContainer {

	private _img: fairygui.GImage;

	private _isSelected = false;

	private _border: fairygui.GImage;

	/**
	 * 是否在播放动画
	 */
	private _isPlaying = false;

	public constructor(private _type: number, private _row: number, private _col: number) {
		super();
		this._border = fairygui.UIPackage.createObject("Package1", `star001_03_1`).asImage;
		this._img = fairygui.UIPackage.createObject("Package1", `star001_0${this._type + 1}`).asImage;
		this.addChild(this._img.displayObject);
		this.touchEnabled = true;

		this.anchorOffsetX = 75 >> 1;
		this.anchorOffsetY = 75 >> 1;
	}

	get type(): number {
		return this._type;
	}

	set type(val: number) {
		if (this._type != val) {
			this._type = val;
			this._img.removeFromParent();
			this._img.dispose();
			this._img = fairygui.UIPackage.createObject("Package1", `star001_0${this._type + 1}`).asImage;
			this.addChild(this._img.displayObject);
		}
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

	get isSelected(): boolean {
		return this._isSelected;
	}

	set isSelected(val: boolean) {
		if (this._isSelected !== val) {
			this._isSelected = val;
			if (val) {
				this._border.displayObject.x = -1;
				this._border.displayObject.y = -1;
				this.addChild(this._border.displayObject);
			} else {
				this.removeChild(this._border.displayObject);
			}
		}
	}

	play(isForcs?: boolean): void {
		if (isForcs || !this._isPlaying) {
			this._isPlaying = true;
			egret.Tween.get(this).to({ scaleX: .8, scaleY: .8 }, 500).call(() => {
				egret.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 500).call(() => {
					this.play(true);
				});
			});
		}
	}

	stop(): void {
		if (this._isPlaying) {
			this._isPlaying = false;
			egret.Tween.removeTweens(this);
			this.scaleX = 1;
			this.scaleY = 1;
		}
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