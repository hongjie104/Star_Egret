
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
		super.show();
	}

	protected _init(): void {
		this._ui = Main.createComponent('设置弹窗', 615, 850);
		this._ui.x = (Main.stageWidth - 615) >> 1;
		this._ui.y = (Main.stageHeight - 850) >> 1;
		this._ui.getController('c1').selectedIndex = 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n34').addClickListener(this._onClose, this);
		ui.getChild('n62').addClickListener(this._onMainScreen, this);
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