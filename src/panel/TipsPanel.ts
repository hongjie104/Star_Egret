class TipsPanel extends BasePanel {

	private static _instance: TipsPanel;

	public constructor() {
		super();
	}

	protected _init(): void {
		this._ui = Main.createComponent('小提示弹窗', 650, 1000);
		this._ui.x = (Main.stageWidth - 650) >> 1;
		this._ui.y = (Main.stageHeight - 1000) >> 1;
		this._ui.getController('c1').selectedIndex = 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n34').addClickListener(this._onClose, this);
		ui.getChild('n53').addClickListener(this._onClose, this);
	}

	static get instance(): TipsPanel {
		if (!TipsPanel._instance) {
			TipsPanel._instance = new TipsPanel();
		}
		return TipsPanel._instance;
	}
}