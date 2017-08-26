enum AWARD_TYPE {
	dollar, diamonds
}

class AwardPanel extends BasePanel {

	private static _instance: AwardPanel;

	public constructor() {
		super();
	}

	show(award: { type: AWARD_TYPE, count: number }): void {
		const ui = this._ui.getChild('n0').asCom;
		ui.getController('c1').selectedIndex = award.type == AWARD_TYPE.dollar ? 0 : 1;
		ui.getChild('n25').text = award.count.toString();
		super.show();
	}

	protected _init(): void {
		this._ui = Main.createComponent('抽卡获得奖励弹窗', 650, 1000);
		this._ui.x = (Main.stageWidth - 650) >> 1;
		this._ui.y = (Main.stageHeight - 1000) >> 1;
		this._ui.getController('c1').selectedIndex = 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n27').addClickListener(this._onClose, this);
	}

	static get instance(): AwardPanel {
		if (!AwardPanel._instance) {
			AwardPanel._instance = new AwardPanel();
		}
		return AwardPanel._instance;
	}
}