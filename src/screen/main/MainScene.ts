class MainScene extends BaseScreen {

	private static _instance: MainScene;

	private _mainPanel: fairygui.GComponent;

	// private _topBar: fairygui.GComponent;

	public constructor() {
		super();

		this._mainPanel = Main.createPanel('登录的页面');
		// this._topBar = this._mainPanel.getChild('n13').asCom;
		// this._topBar.getChild('n14').addClickListener(() => {
		// 	PayPanel.instance.show();
		// }, this);

		// 进入关卡的按钮
		this._mainPanel.getChild('n4').addClickListener(this._onEnterLevelScreen, this);
		// 打开兑换码的面板
		this._mainPanel.getChild('n0').addClickListener(this._onRedeemCode, this);
		// 打开活动面板
		this._mainPanel.getChild('n1').addClickListener(this._onActivity, this);
		// 打开设置面板
		this._mainPanel.getChild('n2').addClickListener(this._onSetting, this);
	}

	updateDollar(): void {
		// this._topBar.getChild('n2').text = LocalStorage.getItem(LocalStorageKey.dollar).toString();
	}

	reset(): void {
		fairygui.GRoot.inst.removeChildren();
		fairygui.GRoot.inst.addChild(this._mainPanel);

		// this._topBar.getChild('n2').text = LocalStorage.getItem(LocalStorageKey.dollar).toString();
		// this._topBar.getChild('n4').text = Util.getLv().toString();
		// this._topBar.getChild('n7').text = LocalStorage.getItem(LocalStorageKey.maxTotalScore).toString();
		// const expBar = this._topBar.getChild('n9').asProgress;
		// const progress = Util.getExpProgress();
		// expBar.max = progress.max;
		// expBar.value = progress.val;
	}

	private _onEnterLevelScreen(): void {
		this.dispatchEvent(new StarEvent(StarEvent.ENTER_LEVEL_SCREEN));
	}

	/**
	 * 打开兑换码界面的事件
	 */
	private _onRedeemCode(): void {
		this.dispatchEvent(new StarEvent(StarEvent.SHOW_REDEEM_CODE));
	}

	private _onActivity(): void {
		this.dispatchEvent(new StarEvent(StarEvent.SHOW_ACTIVITY));
	}

	private _onSetting(): void {
		this.dispatchEvent(new StarEvent(StarEvent.SHOW_SETTING));
	}

	static get instance(): MainScene {
		if (!MainScene._instance) {
			MainScene._instance = new MainScene();
		}
		return MainScene._instance;
	}
}