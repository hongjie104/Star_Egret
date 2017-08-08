
/**
 * 兑换礼品的面板
 */
class FetchGiftPanel extends BasePanel {

	private static _instance: FetchGiftPanel;

	public constructor() {
		super();
	}

	protected _init(): void {
		this._ui = Main.createComponent('兑换礼品弹窗', 650, 1000);
		this._ui.x = (Main.stageWidth - 650) >> 1;
		this._ui.y = (Main.stageHeight - 1000) >> 1;
		this._ui.getController('c1').selectedIndex = 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n34').addClickListener(this._onClose, this);
	}

	show() {
		super.show();
		const ui = this._ui.getChild('n0').asCom;
		console.log(LocalStorage.getItem(LocalStorageKey.diamonds).toString());
		
		ui.getChild('n48').text = LocalStorage.getItem(LocalStorageKey.diamonds).toString();
	}

	static get instance(): FetchGiftPanel {
		if (!FetchGiftPanel._instance) {
			FetchGiftPanel._instance = new FetchGiftPanel();
		}
		return FetchGiftPanel._instance;
	}
}