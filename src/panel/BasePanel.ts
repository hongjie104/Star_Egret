abstract class BasePanel {

	protected _ui: fairygui.GComponent;

	public constructor() {
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
		this._ui.getTransition('t2').play(() => {
			this._ui.removeFromParent();
		});
	}
}