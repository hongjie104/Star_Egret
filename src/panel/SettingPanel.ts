class SettingPanel extends BasePanel {

	private static _instance: SettingPanel;

	public constructor() {
		super();
	}

	protected _init(): void {
		this._ui = Main.createComponent('设置弹窗', 615, 850);
		this._ui.x = (Main.stageWidth - 615) >> 1;
		this._ui.y = (Main.stageHeight - 850) >> 1;
		this._ui.getController('c1').selectedIndex = 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n34').addClickListener(this._onClose, this);
	}

	static get instance(): SettingPanel {
		if (!SettingPanel._instance) {
			SettingPanel._instance = new SettingPanel();
		}
		return SettingPanel._instance;
	}
}