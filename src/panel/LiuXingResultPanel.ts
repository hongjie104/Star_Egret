/**
 * 流星模式下的结算界面
 */
class LiuXingResultPanel extends BasePanel {

	private static _instance: LiuXingResultPanel;

	private _rankAndDollar: { rank: number, dollar: number } = null;

	public constructor() {
		super();
	}

	show(param?: any): void {
		if (Main.curScene == PlayScene.instance) {
			let maxScore: number = LocalStorage.getItem(LocalStorageKey.liuXingMax);
			const curScore: number = param;
			if (maxScore < curScore) {
				maxScore = curScore;
				LocalStorage.setItem(LocalStorageKey.liuXingMax, maxScore);
				LocalStorage.saveToLocal();
			}

			const ui = this._ui.getChild('n0').asCom;
			ui.getChild('n33').text = maxScore.toString();
			this._rankAndDollar = Util.getLiuXingRank(curScore);
			ui.getChild('n34').text = this._rankAndDollar.rank.toString();
			ui.getChild('n35').text = curScore.toString();
			ui.getChild('n39').text = this._rankAndDollar.dollar.toString();
			super.show(param);
		}
	}

	protected _init(): void {
		this._ui = Main.createComponent('流星试炼结算界面', 670, 550);
		this._ui.x = (Main.stageWidth - 670) >> 1;
		this._ui.y = (Main.stageHeight - 550) >> 1;
		this._ui.getController('c1').selectedIndex = 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n30').addClickListener(this._onClose, this);
		ui.getChild('n43').addClickListener(this._onClose, this);
	}

	protected _closed(): void {
		const dollar = this._rankAndDollar.dollar;
		if (dollar > 0) {
			LocalStorage.setItem(LocalStorageKey.dollar, LocalStorage.getItem(LocalStorageKey.dollar) + dollar);
			LocalStorage.saveToLocal();
			Net.instance.getData(API.dollarChanged('liuXingAward', dollar));
			Util.playSound('pop_mp3');
		}
		super._closed();
		this.dispatchEvent(new StarEvent(StarEvent.ENTER_MAIN_SCREEN));
	}

	static get instance(): LiuXingResultPanel {
		if (!LiuXingResultPanel._instance) {
			LiuXingResultPanel._instance = new LiuXingResultPanel();
		}
		return LiuXingResultPanel._instance;
	}
}