class WinPanel extends BasePanel {

	private static _instance: WinPanel;

	private _isShowing = false;

	public constructor() {
		super();
	}

	get isShowing(): boolean {
		return this._isShowing;
	}

	show(): void {
		super.show();
		this._isShowing = true;
	}

	protected _init(): void {
		this._ui = Main.createComponent('胜利弹窗1', 670, 500);
		this._ui.x = (Main.stageWidth - this._ui.initWidth) >> 1;
		this._ui.y = (Main.stageHeight - this._ui.initHeight) >> 1;
		this._ui.getController('c1').selectedIndex = 1;

		const ui = this._ui.getChild('n0').asCom;
		ui.addClickListener(this._onClose, this);
		ui.getChild('n17').once(egret.TouchEvent.TOUCH_TAP, this._onFetchAward, this);
		ui.getChild('n18').once(egret.TouchEvent.TOUCH_TAP, this._onFetchAward, this);
		ui.getChild('n19').once(egret.TouchEvent.TOUCH_TAP, this._onFetchAward, this);
		ui.getChild('n20').once(egret.TouchEvent.TOUCH_TAP, this._onFetchAward, this);
	}

	private _onFetchAward(evt: egret.TouchEvent): void {
		const btn = evt.currentTarget as fairygui.GButton;
		const ui = this._ui.getChild('n0').asCom;
		ui.getController('c2').selectedIndex = 1;
		const btn1 = ui.getChild('n17').asCom;
		btn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._onFetchAward, this);
		const btn2 = ui.getChild('n18').asCom;
		btn2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._onFetchAward, this);
		const btn3 = ui.getChild('n19').asCom;
		btn3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._onFetchAward, this);
		const btn4 = ui.getChild('n20').asCom;
		btn4.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._onFetchAward, this);
		btn1.getController('c1').selectedIndex = btn1 === btn ? 1 : 2;
		btn2.getController('c1').selectedIndex = btn2 === btn ? 1 : 2;
		btn3.getController('c1').selectedIndex = btn3 === btn ? 1 : 2;
		btn4.getController('c1').selectedIndex = btn4 === btn ? 1 : 2;
		evt.stopImmediatePropagation();
	}

	protected _onClose(evt?: egret.TouchEvent): void {
		const ui = this._ui.getChild('n0').asCom;
		if (ui.getController('c2').selectedIndex === 1) {
			super._onClose(evt);
		}
	}

	protected _closed(): void {
		super._closed();
		this._isShowing = false;
	}

	static get instance(): WinPanel {
		if (!WinPanel._instance) {
			WinPanel._instance = new WinPanel();
		}
		return WinPanel._instance;
	}
}