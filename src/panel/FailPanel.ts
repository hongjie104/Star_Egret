enum ToDoAfterFailPanelClosed {
	none, showMainScreen
}

class FailPanel extends BasePanel {

	private static _instance: FailPanel;

	private _toDoAfterFailPanelClosed = ToDoAfterFailPanelClosed.none;

	public constructor() {
		super();
	}

	show(param?: any): void {
		this._toDoAfterFailPanelClosed = ToDoAfterFailPanelClosed.showMainScreen;
		super.show();
		const startTimer = param.startTimer;
		const endTimer = new Date().getTime();
		const startDollar = param.startDollar;
		const startNumItem = param.startNumItem;
		const endNumItem = [
			LocalStorage.getItem(LocalStorageKey.item1),
			LocalStorage.getItem(LocalStorageKey.item2),
			LocalStorage.getItem(LocalStorageKey.item3),
			LocalStorage.getItem(LocalStorageKey.item4)
		];
		const endDollar = LocalStorage.getItem(LocalStorageKey.dollar);
		const endDiamonds = LocalStorage.getItem(LocalStorageKey.diamonds);
		// Net.instance.getData(API.levelFail(LocalStorage.getItem(LocalStorageKey.lastLevel) + 1, startTimer, endTimer, startNumItem[0], startNumItem[1], startNumItem[2], startNumItem[3], endNumItem[0], endNumItem[1], endNumItem[2], endNumItem[3], startDollar, endDollar, endDiamonds));
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
		// 消耗6个金币继续
		const dollar = LocalStorage.getItem(LocalStorageKey.dollar);
		if (dollar > 5) {
			LocalStorage.setItem(LocalStorageKey.dollar, dollar - 6);
			LocalStorage.saveToLocal();
			// Net.instance.getData(API.dollarChanged('levelAgain', -6, (LocalStorage.getItem(LocalStorageKey.lastLevel) + 1).toString()));
			this._toDoAfterFailPanelClosed = ToDoAfterFailPanelClosed.none;
			this._onClose();
		} else {
			// 金币不够
			PayPanel.instance.show();
		}
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