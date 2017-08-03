enum ToDoAfterFailPanelClosed {
	none, showMainScreen
}

class FailPanel extends BasePanel {

	private static _instance: FailPanel;

	private _toDoAfterFailPanelClosed = ToDoAfterFailPanelClosed.none;

	public constructor() {
		super();
	}

	show(): void {
		this._toDoAfterFailPanelClosed = ToDoAfterFailPanelClosed.showMainScreen;
		super.show();
	}

	protected _init(): void {
		this._ui = Main.createComponent('失败弹窗1', 670, 550);
		this._ui.getController('c1').selectedIndex = 1;
		this._ui.x = (Main.stageWidth - 670) >> 1;
		this._ui.y = (Main.stageHeight - 550) >> 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n30').addClickListener(this._onClose, this);
		// 继续通关需要消耗的金币
		// ui.getChild('n26').text = '0';
		ui.getChild('n31').addClickListener(this._onGoOn, this);
	}

	private _onGoOn(): void {
		this._toDoAfterFailPanelClosed = ToDoAfterFailPanelClosed.none;
		this._onClose();
	}

	protected _closed(): void {
		super._closed();
		if (this._toDoAfterFailPanelClosed == ToDoAfterFailPanelClosed.showMainScreen) {
			this.dispatchEvent(new StarEvent(StarEvent.ENTER_MAIN_SCREEN));
		} else {
			this.dispatchEvent(new StarEvent(StarEvent.RESTAR));
		}
	}

	static get instance(): FailPanel {
		if (!FailPanel._instance) {
			FailPanel._instance = new FailPanel();
		}
		return FailPanel._instance;
	}
}