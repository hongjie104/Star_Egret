abstract class BasePanel extends egret.EventDispatcher {

	protected _ui: fairygui.GComponent;

	public constructor() {
		super();
		this._init();
	}

	get ui(): fairygui.GComponent {
		return this._ui;
	}

	show(): void {
		fairygui.GRoot.inst.addChild(this._ui);
		this._ui.getTransition('t0').play();
	}

	protected abstract _init(): void;

	protected _onClose(evt?: egret.TouchEvent): void {
		this._ui.getTransition('t2').play(this._closed, this);
	}

	protected _closed(): void {
		this._ui.removeFromParent();
		this.dispatchEvent(new egret.Event(egret.Event.CLOSE));
	}
}