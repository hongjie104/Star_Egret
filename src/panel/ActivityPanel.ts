class ActivityPanel extends BasePanel {

	private static _instance: ActivityPanel;

	public constructor() {
		super();
	}

	protected _init(): void {
		this._ui = Main.createComponent('活动弹窗', 615, 1000);
		this._ui.x = (Main.stageWidth - 615) >> 1;
		this._ui.y = (Main.stageHeight - 1000) >> 1;
		this._ui.getController('c1').selectedIndex = 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n34').addClickListener(this._onClose, this);
	}

	static get instance(): ActivityPanel {
		if (!ActivityPanel._instance) {
			ActivityPanel._instance = new ActivityPanel();
		}

		return ActivityPanel._instance;
	}
}