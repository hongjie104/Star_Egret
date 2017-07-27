class RankPanel {

	private static _instance: RankPanel;

	private _rankPanel: fairygui.GComponent;

	public constructor() {
		this._rankPanel = Main.createComponent('排行弹窗', 615, 900);
		this._rankPanel.x = (Main.stageWidth - 615) >> 1;
		this._rankPanel.y = (Main.stageHeight - 900) >> 1;
		this._rankPanel.getController('c1').selectedIndex = 1;
		const ui = this._rankPanel.getChild('n0').asCom;
		ui.getChild('n34').addClickListener(this._onClose, this);
	}

	show(): void {
		fairygui.GRoot.inst.addChild(this._rankPanel);
		this._rankPanel.getTransition('t0').play();
	}

	private _onClose(evt: egret.TouchEvent): void {
		this._rankPanel.getTransition('t2').play(() => {
			this._rankPanel.removeFromParent();
		});
	}

	static get instance(): RankPanel {
		if (!RankPanel._instance) {
			RankPanel._instance = new RankPanel();
		}
		return RankPanel._instance;
	}
}