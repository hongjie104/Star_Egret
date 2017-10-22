class WinPanel extends BasePanel {

	private static _instance: WinPanel;

	private _isFetched = false;

	private _startNumItem: number[];

	private _endNumItem: number[];

	private _startDollar: number;

	private _endDollar: number;

	private _endDiamonds: number;

	private _startTimer: number;

	private _endTimer: number;

	public constructor() {
		super();
	}

	show(param?: any): void {
		this._isFetched = false;
		const ui = this._ui.getChild('n0').asCom;
		ui.getController('c2').selectedIndex = 0;
		let btn: fairygui.GComponent = null;
		for (let i = 17; i < 21; i++) {
			btn = ui.getChild(`n${i}`).asCom;
			btn.getController('c1').selectedIndex = 0;
			btn.getTransition('t1').play();
		}

		// 本关得分
		ui.getChild('n9').text = param.score.toString();
		this._startTimer = param.startTimer;
		this._endTimer = new Date().getTime();
		this._startDollar = param.startDollar;
		this._startNumItem = param.startNumItem;
		this._endNumItem = [
			LocalStorage.getItem(LocalStorageKey.item1),
			LocalStorage.getItem(LocalStorageKey.item2),
			LocalStorage.getItem(LocalStorageKey.item3),
			LocalStorage.getItem(LocalStorageKey.item4)
		];
		super.show(param);
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
		ui.getChild('n27').addClickListener(this._onFetchAll, this);
	}

	private _onFetchAward(evt: egret.TouchEvent): void {
		if (!this._isFetched) {
			this._isFetched = true;

			const awardArr = Util.createWinAward();
			const btn = evt.currentTarget as fairygui.GButton;
			if (awardArr[0].type == AWARD_TYPE.dollar) {
				btn.getController('c1').selectedIndex = 1;
				LocalStorage.setItem(LocalStorageKey.dollar, LocalStorage.getItem(LocalStorageKey.dollar) + awardArr[0].count);
				Util.playSound('pop_mp3');
			} else {
				btn.getController('c1').selectedIndex = 2;
				LocalStorage.setItem(LocalStorageKey.diamonds, LocalStorage.getItem(LocalStorageKey.diamonds) + awardArr[0].count);
			}
			LocalStorage.saveToLocal();
			// 给服务器发消息，记录一下
			this._endDollar = LocalStorage.getItem(LocalStorageKey.dollar);
			this._endDiamonds = LocalStorage.getItem(LocalStorageKey.diamonds);
			Net.instance.getData(API.levelWin(LocalStorage.getItem(LocalStorageKey.lastLevel) + 1, this._startTimer, this._endTimer, this._startNumItem[0], this._startNumItem[1], this._startNumItem[2], this._startNumItem[3], this._endNumItem[0], this._endNumItem[1], this._endNumItem[2], this._endNumItem[3], this._startDollar, this._endDollar, this._endDiamonds));

			btn.getChild('n3').text = awardArr[0].count.toString();
			btn.getTransition('t0').play(() => {
				egret.Tween.get(btn).wait(200).call(() => {
					AwardPanel.instance.show(awardArr[0]);
					const ui = this._ui.getChild('n0').asCom;
					// 1是显示“点击关闭”
					// 2是显示“购买全部”
					// ui.getController('c2').selectedIndex = 1;
					ui.getController('c2').selectedIndex = 2;
					// 购买所有奖励需要的金币
					// ui.getChild('n26').text = '150';
					const btnArr = [
						ui.getChild('n17').asCom,
						ui.getChild('n20').asCom,
						ui.getChild('n19').asCom,
						ui.getChild('n18').asCom
					];
					// let awardIndex = 1;
					const awardGift = Util.getAwardGift();
					for (let i = 0; i < btnArr.length; i++) {
						if (awardGift[i].type == AWARD_TYPE.dollar) {
							btnArr[i].getController('c1').selectedIndex = 3;
						} else {
							btnArr[i].getController('c1').selectedIndex = 4;
						}
						btnArr[i].getChild('n3').text = awardGift[i].count.toString();
						btnArr[i].getTransition('t0').play();
						// if (btnArr[i] !== btn) {
						// 	if (awardArr[awardIndex].type == AWARD_TYPE.dollar) {
						// 		btnArr[i].getController('c1').selectedIndex = 3;
						// 	} else {
						// 		btnArr[i].getController('c1').selectedIndex = 4;
						// 	}
						// 	btnArr[i].getChild('n3').text = awardArr[awardIndex++].count.toString();
						// 	btnArr[i].getTransition('t0').play();
						// }
					}
				});
			});
			evt.stopImmediatePropagation();
		}
	}

	private _onFetchAll(): void {
		this._onClose();
	}

	protected _onClose(evt?: egret.TouchEvent): void {
		const ui = this._ui.getChild('n0').asCom;
		if (ui.getController('c2').selectedIndex != 0) {
			super._onClose(evt);
		}
	}

	static get instance(): WinPanel {
		if (!WinPanel._instance) {
			WinPanel._instance = new WinPanel();
		}
		return WinPanel._instance;
	}
}