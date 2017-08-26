/**
 * 流星模式下的结算界面
 */
class LiuXingResultPanel extends BasePanel {

	private static _instance: LiuXingResultPanel;

	public constructor() {
		super();
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