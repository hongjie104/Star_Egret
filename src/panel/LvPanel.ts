class LvPanel extends BasePanel {

	private static _instance: LvPanel;

	public constructor() {
		super();
	}

	protected _init(): void {
		this._ui = Main.createComponent('等级弹窗', 650, 1000);
		this._ui.x = (Main.stageWidth - 650) >> 1;
		this._ui.y = (Main.stageHeight - 1000) >> 1;
		this._ui.getController('c1').selectedIndex = 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n34').addClickListener(this._onClose, this);
		ui.getChild('n53').addClickListener(this._onClose, this);
	}

	show() {
		super.show();
		const lv = Util.getLv();
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n60').text = lv.toString();
		const nextLvAndAward = Util.getNextLvAndAward();
		ui.getChild('n62').text = nextLvAndAward.lv.toString();
		ui.getChild('n64').text = nextLvAndAward.award.toString();
	}

	static get instance(): LvPanel {
		if (!LvPanel._instance) {
			LvPanel._instance = new LvPanel();
		}
		return LvPanel._instance;
	}
}