class PayPanel {

	private static _instance: PayPanel;

	private _payPanel: fairygui.GComponent;

	public constructor() {
		this._payPanel = Main.createComponent('充值弹窗', 615, 700);
		this._payPanel.x = (Main.stageWidth - 615) >> 1;
		this._payPanel.y = (Main.stageHeight - 700) >> 1;
		const ui = this._payPanel.getChild('n0').asCom;
		ui.getChild('n34').addClickListener(this._onClose, this);
		ui.getChild('n51').addClickListener(this._onClose, this);
		this._payPanel.getController('c1').selectedIndex = 1;
	}

	show(): void {
		fairygui.GRoot.inst.addChild(this._payPanel);
		this._payPanel.getTransition('t0').play();
	}

	private _onClose(evt: egret.TouchEvent): void {
		this._payPanel.getTransition('t2').play(() => {
			this._payPanel.removeFromParent();
		});
	}

	static get instance(): PayPanel {
		if (!PayPanel._instance) {
			PayPanel._instance = new PayPanel();
		}
		return PayPanel._instance;
	}
}