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
		ui.getChild('n17').addClickListener(this._onFetchAward, this);
		ui.getChild('n18').addClickListener(this._onFetchAward, this);
		ui.getChild('n19').addClickListener(this._onFetchAward, this);
		ui.getChild('n20').addClickListener(this._onFetchAward, this);
	}

	private _onFetchAward(evt: egret.TouchEvent): void {
		// const btn = evt.currentTarget as fairygui.GButton;
		const winPanel = this._ui;
		winPanel.getTransition('t2').play(() => {
			winPanel.removeFromParent();
			this._isShowing = false;
		});
	}

	static get instance(): WinPanel {
		if (!WinPanel._instance) {
			WinPanel._instance = new WinPanel();
		}
		return WinPanel._instance;
	}
}