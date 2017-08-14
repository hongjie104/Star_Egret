
enum ToDoAfterSettingPanelClosed {
	none, showMainScreen
}

class SettingPanel extends BasePanel {

	private static _instance: SettingPanel;

	private _toDoAfterSettingPanelClosed = ToDoAfterSettingPanelClosed.none;

	public constructor() {
		super();
	}

	show(): void {
		this._toDoAfterSettingPanelClosed = ToDoAfterSettingPanelClosed.none;
		const soundEnabled: boolean = LocalStorage.getItem(LocalStorageKey.soundEnabled);
		const touchType: number = LocalStorage.getItem(LocalStorageKey.touchType);
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n57').asCom.getController('c1').selectedIndex = soundEnabled ? 0 : 1;
		ui.getChild('n58').asCom.getController('c1').selectedIndex = touchType - 1;
		super.show();
	}

	protected _init(): void {
		this._ui = Main.createComponent('设置弹窗', 615, 850);
		this._ui.x = (Main.stageWidth - 615) >> 1;
		this._ui.y = (Main.stageHeight - 850) >> 1;
		this._ui.getController('c1').selectedIndex = 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n34').addClickListener(this._onClose, this);
		ui.getChild('n63').addClickListener(this._onMainScreen, this);
		ui.getChild('n57').addClickListener(this._onSwitchSoundEnable, this);
		ui.getChild('n58').addClickListener(this._onSwitchTouchType, this);
		ui.getChild('n59').addClickListener(this._onShowAbout, this);
		ui.getChild('n60').addClickListener(this._onShowTips, this);
	}

	private _onSwitchSoundEnable(): void {
		const soundEnabled: boolean = LocalStorage.getItem(LocalStorageKey.soundEnabled);
		this._ui.getChild('n0').asCom.getChild('n57').asCom.getController('c1').selectedIndex = soundEnabled ? 1 : 0;
		LocalStorage.setItem(LocalStorageKey.soundEnabled, !soundEnabled);
		LocalStorage.saveToLocal();
	}

	private _onSwitchTouchType(): void {
		const touchType: number = LocalStorage.getItem(LocalStorageKey.touchType);
		this._ui.getChild('n0').asCom.getChild('n58').asCom.getController('c1').selectedIndex = touchType === 1 ? 1 : 0;
		LocalStorage.setItem(LocalStorageKey.touchType, touchType === 1 ? 2 : 1);
		LocalStorage.saveToLocal();
	}

	private _onShowAbout(): void {
		AboutPanel.instance.show();
	}

	private _onShowTips(): void {
		TipsPanel.instance.show();
	}

	/**
	 * 回到主界面
	 */
	private _onMainScreen(): void {
		this._toDoAfterSettingPanelClosed = ToDoAfterSettingPanelClosed.showMainScreen;
		super._onClose();
	}

	protected _closed(): void {
		super._closed();
		if (this._toDoAfterSettingPanelClosed == ToDoAfterSettingPanelClosed.showMainScreen) {
			this.dispatchEvent(new StarEvent(StarEvent.ENTER_MAIN_SCREEN));
		}
	}

	static get instance(): SettingPanel {
		if (!SettingPanel._instance) {
			SettingPanel._instance = new SettingPanel();
		}
		return SettingPanel._instance;
	}
}