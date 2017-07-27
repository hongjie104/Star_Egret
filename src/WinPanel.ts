class WinPanel {

	private static _instance: WinPanel;

	private _winPanel: fairygui.GComponent;

	public constructor() {
		this._winPanel = Main.createComponent('胜利弹窗1', 670, 500);
		this._winPanel.x = (Main.stageWidth - this._winPanel.initWidth) >> 1;
		this._winPanel.y = (Main.stageHeight - this._winPanel.initHeight) >> 1;
		this._winPanel.getController('c1').selectedIndex = 1;

		const ui = this._winPanel.getChild('n0').asCom;
		ui.getChild('n17').addClickListener(this._onFetchAward, this);
		ui.getChild('n18').addClickListener(this._onFetchAward, this);
		ui.getChild('n19').addClickListener(this._onFetchAward, this);
		ui.getChild('n20').addClickListener(this._onFetchAward, this);
	}

	show(): void {
		fairygui.GRoot.inst.addChild(this._winPanel);
		this._winPanel.getTransition('t0').play();
	}

	private _onFetchAward(evt: egret.TouchEvent): void {
		// const btn = evt.currentTarget as fairygui.GButton;
		const winPanel = this._winPanel;
		winPanel.getTransition('t2').play(() => {
			winPanel.removeFromParent();
		});
	}

	static get instance(): WinPanel {
		if (!WinPanel._instance) {
			WinPanel._instance = new WinPanel();
		}
		return WinPanel._instance;
	}
}