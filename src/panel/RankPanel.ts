class RankPanel extends BasePanel {

	private static _instance: RankPanel;

	public constructor() {
		super();
	}

	protected _init(): void {
		this._ui = Main.createComponent('排行弹窗', 650, 1000);
		this._ui.x = (Main.stageWidth - 650) >> 1;
		this._ui.y = (Main.stageHeight - 1000) >> 1;
		this._ui.getController('c1').selectedIndex = 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n34').addClickListener(this._onClose, this);

		ui.getChild('n43').addClickListener(this._onShowMonthRank, this);
		ui.getChild('n44').addClickListener(this._onShowWeekRank, this);
	}

	/**
	 * 显示周排行
	 */
	private _onShowWeekRank(): void {
		const ui = this._ui.getChild('n0').asCom;
		ui.getController('c1').selectedIndex = 0;
	}

	/**
	 * 显示月排行
	 */
	private _onShowMonthRank(): void {
		const ui = this._ui.getChild('n0').asCom;
		ui.getController('c1').selectedIndex = 1;
	}

	static get instance(): RankPanel {
		if (!RankPanel._instance) {
			RankPanel._instance = new RankPanel();
		}
		return RankPanel._instance;
	}
}