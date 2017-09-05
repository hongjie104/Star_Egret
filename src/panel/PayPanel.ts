class PayPanel extends BasePanel {

	private static _instance: PayPanel;

	public constructor() {
		super();
	}

	protected _init(): void {
		this._ui = Main.createComponent('充值弹窗', 615, 700);
		this._ui.x = (Main.stageWidth - 615) >> 1;
		this._ui.y = (Main.stageHeight - 700) >> 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n34').addClickListener(this._onClose, this);
		ui.getChild('n51').addClickListener(this._onBuy, this);
		this._ui.getController('c1').selectedIndex = 1;
	}

	private _onBuy(): void {
		LocalStorage.setItem(LocalStorageKey.dollar, LocalStorage.getItem(LocalStorageKey.dollar) + 150 + 78);
		LocalStorage.saveToLocal();
		Util.playSound('pop_mp3');
		this.dispatchEvent(new StarEvent(StarEvent.PAY_SUCCESS));
		this._onClose();
	}

	static get instance(): PayPanel {
		if (!PayPanel._instance) {
			PayPanel._instance = new PayPanel();
		}
		return PayPanel._instance;
	}
}