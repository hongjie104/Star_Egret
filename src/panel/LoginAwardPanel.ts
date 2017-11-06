class LoginAwardPanel extends BasePanel {

	private static AWARD = [2, 3, 5, 6, 8, 9, 12];

	private static _instance: LoginAwardPanel;

	public constructor() {
		super();
	}

	protected _init(): void {
		this._ui = Main.createComponent('每日登录奖励弹窗', 650, 1000);
		this._ui.x = (Main.stageWidth - 650) >> 1;
		this._ui.y = (Main.stageHeight - 1000) >> 1;
		this._ui.getController('c1').selectedIndex = 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n34').addClickListener(this._onClose, this);
		ui.getChild('n64').addClickListener(this._onFetchAward, this);
	}

	show(): void {
		this._updateAwardStatus();
		super.show();
	}

	private _updateAwardStatus(): void {
		const ui = this._ui.getChild('n0').asCom;
		const fetchLoginAwardCount = LocalStorage.getItem(LocalStorageKey.fetchLoginAwardCount);
		for (let i = 0; i < 7; i++) {
			// 0是未领取，1是可领取，2是已领取
			ui.getChild(`n${56 + i}`).asCom.getController('c1').selectedIndex = i < fetchLoginAwardCount ? 2 : (i === fetchLoginAwardCount ? 1 : 0);
		}
	}

	private _onFetchAward(): void {
		const fetchLoginAwardCount = LocalStorage.getItem(LocalStorageKey.fetchLoginAwardCount);
		const award = LoginAwardPanel.AWARD[fetchLoginAwardCount];
		LocalStorage.setItem(LocalStorageKey.dollar, LocalStorage.getItem(LocalStorageKey.dollar) + award);
		Net.instance.getData(API.dollarChanged('loginAward', award));
		LocalStorage.setItem(LocalStorageKey.fetchLoginAwardCount, fetchLoginAwardCount + 1);
		LocalStorage.setItem(LocalStorageKey.lastFetchLoginAwardTime, new Date().getTime());
		LocalStorage.saveToLocal();
		Util.playSound('pop_mp3');
		this._updateAwardStatus();
		egret.Tween.get(this).wait(500).call(() => {
			this._onClose();
		});
	}

	static get instance(): LoginAwardPanel {
		if (!LoginAwardPanel._instance) {
			LoginAwardPanel._instance = new LoginAwardPanel();
		}
		return LoginAwardPanel._instance;
	}
}