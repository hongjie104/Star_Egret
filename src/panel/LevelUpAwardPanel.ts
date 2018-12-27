class LevelUpAwardPanel extends BasePanel {

	private static _instance: LevelUpAwardPanel;

	public constructor() {
		super();
	}

	show(): void {
		const ui = this._ui.getChild('n0').asCom;
		const lvAndAward = Util.getCurLvAndAward();
		ui.getChild('n17').text = lvAndAward.lv.toString();
		ui.getChild('n19').text = lvAndAward.award.toString();
		const nextLvAndAward = Util.getNextLvAndAward();
		ui.getChild('n18').text = nextLvAndAward.lv.toString();
		ui.getChild('n20').text = nextLvAndAward.award.toString();
		super.show();
	}

	protected _init(): void {
		this._ui = Main.createComponent('等级奖励弹窗', 670, 500);
		this._ui.x = (Main.stageWidth - 670) >> 1;
		this._ui.y = (Main.stageHeight - 500) >> 1;
		this._ui.getController('c1').selectedIndex = 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n22').addClickListener(this._onFetchAward, this);
	}

	private _onFetchAward(): void {
		const lvAndAward = Util.getCurLvAndAward();
		if (lvAndAward.award > 0) {
			LocalStorage.setItem(LocalStorageKey.dollar, LocalStorage.getItem(LocalStorageKey.dollar) + lvAndAward.award);
			LocalStorage.saveToLocal();
			// Net.instance.getData(API.dollarChanged('levelUpAward', lvAndAward.award));
			Util.playSound('pop_mp3');
		}
		this._onClose();
	}

	static get instance(): LevelUpAwardPanel {
		if (!LevelUpAwardPanel._instance) {
			LevelUpAwardPanel._instance = new LevelUpAwardPanel();
		}
		return LevelUpAwardPanel._instance;
	}
}