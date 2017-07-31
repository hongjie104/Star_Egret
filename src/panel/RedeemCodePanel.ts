class RedeemCodePanel extends BasePanel {

	private static _instance: RedeemCodePanel;

	public constructor() {
		super();
	}

	protected _init(): void {
		this._ui = Main.createComponent('兑换码弹窗', 615, 460);
		this._ui.x = (Main.stageWidth - 615) >> 1;
		this._ui.y = (Main.stageHeight - 460) >> 1;
		this._ui.getController('c1').selectedIndex = 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n34').addClickListener(this._onClose, this);
		ui.getChild('n53').addClickListener(this._onOK, this);
	}

	show(): void {
		super.show();
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n55').text = '';
	}

	private _onOK(): void {
		super._onClose();
	}

	static get instance(): RedeemCodePanel {
		if (!RedeemCodePanel._instance) {
			RedeemCodePanel._instance = new RedeemCodePanel();
		}
		return RedeemCodePanel._instance;
	}
}