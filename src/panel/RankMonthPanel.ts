class RankMonthPanel extends BasePanel {

	private static _instance: RankMonthPanel;

	public constructor() {
		super();
	}

	protected _init(): void {
		this._ui = Main.createComponent('每月奖励规则弹窗', 670, 500);
		this._ui.x = (Main.stageWidth - 670) >> 1;
		this._ui.y = (Main.stageHeight - 500) >> 1;
		this._ui.getController('c1').selectedIndex = 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n28').addClickListener(this._onClose, this);
	}

	static get instance(): RankMonthPanel {
		if (!RankMonthPanel._instance) {
			RankMonthPanel._instance = new RankMonthPanel();
		}
		return RankMonthPanel._instance;
	}
}