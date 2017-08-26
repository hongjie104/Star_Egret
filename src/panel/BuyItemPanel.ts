class BuyItemPanel extends BasePanel {

	private static _instance: BuyItemPanel;

	public constructor() {
		super();
	}

	show(param?: any): void {
		const ui = this._ui.getChild('n0').asCom;
		if (param == PLAY_TYPE.liuXing) {
			ui.getController('c3').selectedIndex = 1;
		} else {
			ui.getController('c3').selectedIndex = 0;
		}
		super.show(param);
	}

	protected _init(): void {
		this._ui = Main.createComponent('购买道具弹窗', 670, 650);
		this._ui.x = (Main.stageWidth - 670) >> 1;
		this._ui.y = (Main.stageHeight - 650) >> 1;
		this._ui.getController('c1').selectedIndex = 1;

		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n55').addClickListener(this._onClose, this);

		ui.getChild('n48').asCom.getChild('n4').addClickListener(this._onBuyItem1, this);
		ui.getChild('n49').asCom.getChild('n4').addClickListener(this._onBuyItem2, this);
		ui.getChild('n50').asCom.getChild('n4').addClickListener(this._onBuyItem3, this);
		ui.getChild('n57').asCom.getChild('n4').addClickListener(this._onBuyItem4, this);
	}

	private _onBuyItem1(): void {
		LocalStorage.setItem(LocalStorageKey.item1, LocalStorage.getItem(LocalStorageKey.item1) + 1);
		LocalStorage.saveToLocal();
		this.dispatchEvent(new StarEvent(StarEvent.BUY_ITEM_SUCCESS));
	}

	private _onBuyItem2(): void {
		LocalStorage.setItem(LocalStorageKey.item2, LocalStorage.getItem(LocalStorageKey.item2) + 1);
		LocalStorage.saveToLocal();
		this.dispatchEvent(new StarEvent(StarEvent.BUY_ITEM_SUCCESS));
	}

	private _onBuyItem3(): void {
		LocalStorage.setItem(LocalStorageKey.item3, LocalStorage.getItem(LocalStorageKey.item3) + 1);
		LocalStorage.saveToLocal();
		this.dispatchEvent(new StarEvent(StarEvent.BUY_ITEM_SUCCESS));
	}

	private _onBuyItem4(): void {
		LocalStorage.setItem(LocalStorageKey.item4, LocalStorage.getItem(LocalStorageKey.item4) + 1);
		LocalStorage.saveToLocal();
		this.dispatchEvent(new StarEvent(StarEvent.BUY_ITEM_SUCCESS));
	}

	static get instance(): BuyItemPanel {
		if (!BuyItemPanel._instance) {
			BuyItemPanel._instance = new BuyItemPanel();
		}
		return BuyItemPanel._instance;
	}
}