class ChangeNamePanel extends BasePanel {

	private static _instance: ChangeNamePanel;

	public constructor() {
		super();
	}

	protected _init(): void {
		this._ui = Main.createComponent('改名弹窗', 650, 1000);
		this._ui.x = (Main.stageWidth - 650) >> 1;
		this._ui.y = (Main.stageHeight - 1000) >> 1;
		this._ui.getController('c1').selectedIndex = 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n34').addClickListener(this._onClose, this);
		ui.getChild('n53').addClickListener(this._onChangeName, this);
	}

	private _onChangeName(): void {
		const ui = this._ui.getChild('n0').asCom;
		const newName = ui.getChild('n58').text;
		this.dispatchEvent(new StarEvent(StarEvent.CHANGE_NAME, null, newName));
		this._onClose();
	}

	static get instance(): ChangeNamePanel {
		if (!ChangeNamePanel._instance) {
			ChangeNamePanel._instance = new ChangeNamePanel();
		}
		return ChangeNamePanel._instance;
	}
}