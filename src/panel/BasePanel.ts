abstract class BasePanel extends egret.EventDispatcher {

	protected _ui: fairygui.GComponent;

	protected _isShowing = false;

	public constructor() {
		super();
		this._init();
	}

	get ui(): fairygui.GComponent {
		return this._ui;
	}

	show(param?: any): void {
		if (!this._isShowing) {
			this._isShowing = true;
			fairygui.GRoot.inst.addChild(this._ui);
			this._ui.getTransition('t0').play();
		}
	}

	close(): void {
		this._onClose();
	}

	protected abstract _init(): void;

	protected _onClose(evt?: egret.TouchEvent): void {
		if (this._isShowing) {
			this._ui.getTransition('t2').play(this._closed, this);
		}
	}

	protected _closed(): void {
		if (this._isShowing) {
			this._isShowing = false;
			this._ui.removeFromParent();
			this.dispatchEvent(new egret.Event(egret.Event.CLOSE));
		}
	}
}