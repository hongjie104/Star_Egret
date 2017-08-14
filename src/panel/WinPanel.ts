class WinPanel extends BasePanel {

	private static _instance: WinPanel;

	public constructor() {
		super();
	}

	protected _init(): void {
		this._ui = Main.createComponent('胜利弹窗1', 670, 500);
		this._ui.x = (Main.stageWidth - this._ui.initWidth) >> 1;
		this._ui.y = (Main.stageHeight - this._ui.initHeight) >> 1;
		this._ui.getController('c1').selectedIndex = 1;

		const ui = this._ui.getChild('n0').asCom;
		ui.addClickListener(this._onClose, this);
		ui.getChild('n17').addClickListener(this._onFetchAward, this);
		ui.getChild('n18').addClickListener(this._onFetchAward, this);
		ui.getChild('n19').addClickListener(this._onFetchAward, this);
		ui.getChild('n20').addClickListener(this._onFetchAward, this);
	}

	private _onFetchAward(evt: egret.TouchEvent): void {
		const awardArr = Util.createWinAward();
		const btn = evt.currentTarget as fairygui.GButton;
		if (awardArr[0].type == AWARD_TYPE.dollar) {
			btn.getController('c1').selectedIndex = 1;
			LocalStorage.setItem(LocalStorageKey.dollar, LocalStorage.getItem(LocalStorageKey.dollar) + awardArr[0].count);
		} else {
			btn.getController('c1').selectedIndex = 2;
			LocalStorage.setItem(LocalStorageKey.diamonds, LocalStorage.getItem(LocalStorageKey.diamonds) + awardArr[0].count);
		}
		LocalStorage.saveToLocal();
		btn.getChild('n3').text = awardArr[0].count.toString();

		const ui = this._ui.getChild('n0').asCom;
		ui.getController('c2').selectedIndex = 1;
		// const btnArr = [
		// 	ui.getChild('n17').asCom,
		// 	ui.getChild('n18').asCom,
		// 	ui.getChild('n19').asCom,
		// 	ui.getChild('n20').asCom
		// ];
		// let awardIndex = 1;
		// for (let i = 0; i < btnArr.length; i++) {
		// 	if (btnArr[i] !== btn) {
		// 		if (awardArr[awardIndex].type == 'dollar') {
		// 			btnArr[i].getController('c1').selectedIndex = 3;
		// 		} else {
		// 			btnArr[i].getController('c1').selectedIndex = 4;
		// 		}
		// 		btnArr[i].getChild('n3').text = awardArr[awardIndex++].count.toString();
		// 	}
		// }
		evt.stopImmediatePropagation();

		AwardPanel.instance.show(awardArr[0]);
	}

	protected _onClose(evt?: egret.TouchEvent): void {
		const ui = this._ui.getChild('n0').asCom;
		if (ui.getController('c2').selectedIndex === 1) {
			super._onClose(evt);
		}
	}

	protected _closed(): void {
		super._closed();
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n17').asCom.getController('c1').selectedIndex = 0;
		ui.getChild('n18').asCom.getController('c1').selectedIndex = 0;
		ui.getChild('n19').asCom.getController('c1').selectedIndex = 0;
		ui.getChild('n20').asCom.getController('c1').selectedIndex = 0;
	}

	static get instance(): WinPanel {
		if (!WinPanel._instance) {
			WinPanel._instance = new WinPanel();
		}
		return WinPanel._instance;
	}
}