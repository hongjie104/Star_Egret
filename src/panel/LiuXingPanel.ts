class LiuXingPanel extends BasePanel {

	private static _instance: LiuXingPanel;

	public constructor() {
		super();
	}

	protected _init(): void {
		this._ui = Main.createComponent('流星试炼弹窗1', 650, 1000);
		this._ui.x = (Main.stageWidth - 650) >> 1;
		this._ui.y = (Main.stageHeight - 1000) >> 1;
		this._ui.getController('c1').selectedIndex = 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n34').addClickListener(this._onClose, this);
		ui.getChild('n53').addClickListener(this._onPlay, this);
	}

	private _onPlay(): void {
		this.dispatchEvent(new StarEvent(StarEvent.PLAY_LIU_XING));
		this._onClose();
	}

	static get instance(): LiuXingPanel {
		if (!LiuXingPanel._instance) {
			LiuXingPanel._instance = new LiuXingPanel();
		}
		return LiuXingPanel._instance;
	}
}