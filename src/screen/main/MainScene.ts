class MainScene extends BaseScreen {

	private static _instance: MainScene;

	private _mainPanel: fairygui.GComponent;

	public constructor() {
		super();

		this._mainPanel = Main.createPanel('登录的页面');

		// 进入关卡的按钮
		this._mainPanel.getChild('n4').addClickListener(this._onEnterLevelScreen, this);
		// 打开兑换码的面板
		this._mainPanel.getChild('n0').addClickListener(this._onRedeemCode, this);
		// 打开活动面板
		this._mainPanel.getChild('n1').addClickListener(this._onActivity, this);
		// 打开设置面板
		this._mainPanel.getChild('n2').addClickListener(this._onSetting, this);
	}

	reset(): void {
		fairygui.GRoot.inst.removeChildren();
		fairygui.GRoot.inst.addChild(this._mainPanel);
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