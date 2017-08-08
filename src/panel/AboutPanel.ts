class AboutPanel extends BasePanel {

	private static _instance: AboutPanel;

	public constructor() {
		super();
	}

	protected _init(): void {
		this._ui = Main.createComponent('关于弹窗', 650, 1000);
		this._ui.x = (Main.stageWidth - 650) >> 1;
		this._ui.y = (Main.stageHeight - 1000) >> 1;
		this._ui.getController('c1').selectedIndex = 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n34').addClickListener(this._onClose, this);
		ui.getChild('n53').addClickListener(this._onClose, this);
	}

	static get instance(): AboutPanel {
		if (!AboutPanel._instance) {
			AboutPanel._instance = new AboutPanel();
		}
		return AboutPanel._instance;
	}
}