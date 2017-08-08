class ShopPanel extends BasePanel {

	private static _instance: ShopPanel;

	public constructor() {
		super();
	}

	protected _init(): void {
		this._ui = Main.createComponent('商店弹窗', 650, 1000);
		this._ui.x = (Main.stageWidth - 650) >> 1;
		this._ui.y = (Main.stageHeight - 1000) >> 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n34').addClickListener(this._onClose, this);
		ui.getChild('n48').text = LocalStorage.getItem(LocalStorageKey.dollar).toString();
		this._ui.getController('c1').selectedIndex = 1;
	}

	private _onBuy(): void {
		// LocalStorage.setItem(LocalStorageKey.dollar, LocalStorage.getItem(LocalStorageKey.dollar) + 150 + 78);
		// LocalStorage.saveToLocal();
		// this.dispatchEvent(new StarEvent(StarEvent.PAY_SUCCESS));
		// this._onClose();
	}

	static get instance(): ShopPanel {
		if (!ShopPanel._instance) {
			ShopPanel._instance = new ShopPanel();
		}
		return ShopPanel._instance;
	}
}