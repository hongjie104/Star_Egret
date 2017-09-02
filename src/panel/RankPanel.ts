enum RANK_TYPE {
	week, month
}

class RankPanel extends BasePanel {

	private static _instance: RankPanel;

	private _curType = RANK_TYPE.week;

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

		ui.getChild('n44').asCom.getController('button').selectedIndex = 3;
		ui.getChild('n43').asCom.getController('button').selectedIndex = 0;

		ui.getChild('n32').addClickListener(this._onFetchWeekAward, this);
		ui.getChild('n42').addClickListener(this._onFetchMonthAward, this);

		const now = new Date();
		// 周排行剩余天数
		const nowday = now.getDay();
		let leftDay = 1;
		if (nowday > 0) {
			leftDay = 8 - nowday;
		}
		ui.getChild('n46').text = leftDay.toString();
		// 月排行剩余天数
		ui.getChild('n48').text = Util.getLeftDaysInMonth(now).toString();
	}

	/**
	 * 显示周排行
	 */
	private _onShowWeekRank(): void {
		this._changeType(RANK_TYPE.week);
	}

	/**
	 * 显示月排行
	 */
	private _onShowMonthRank(): void {
		this._changeType(RANK_TYPE.month);
	}

	private _onFetchWeekAward(): void {
		RankWeekPanel.instance.show();
	}

	private _onFetchMonthAward(): void {
		RankMonthPanel.instance.show();
	}

	private _changeType(type: RANK_TYPE): void {
		const ui = this._ui.getChild('n0').asCom;
		this._curType = type;
		ui.getController('c1').selectedIndex = this._curType
		if (type == RANK_TYPE.week) {
			ui.getChild('n44').asCom.getController('button').selectedIndex = 3;
			ui.getChild('n43').asCom.getController('button').selectedIndex = 0;
		} else if (type == RANK_TYPE.month) {
			ui.getChild('n44').asCom.getController('button').selectedIndex = 0;
			ui.getChild('n43').asCom.getController('button').selectedIndex = 3;
		}
	}

	static get instance(): RankPanel {
		if (!RankPanel._instance) {
			RankPanel._instance = new RankPanel();
		}
		return RankPanel._instance;
	}
}