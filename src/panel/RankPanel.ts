class RankPanel extends BasePanel {

	private static _instance: RankPanel;

	public constructor() {
		super();
	}

	protected _init(): void {
		this._ui = Main.createComponent('排行弹窗', 615, 900);
		this._ui.x = (Main.stageWidth - 615) >> 1;
		this._ui.y = (Main.stageHeight - 900) >> 1;
		this._ui.getController('c1').selectedIndex = 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n34').addClickListener(this._onClose, this);
	}

	static get instance(): RankPanel {
		if (!RankPanel._instance) {
			RankPanel._instance = new RankPanel();
		}
		return RankPanel._instance;
	}
}