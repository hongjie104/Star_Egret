class ActivityPanel extends BasePanel {

	private static _instance: ActivityPanel;

	private _list: fairygui.GList;

	public constructor() {
		super();
	}

	show(param?: any): void {
		if (!this._isShowing) {
			super.show(param);
			// Net.instance.getData(API.getActivityNotice(), result => {
			// 	if (result.status === 1) {
			// 		console.log(result.data);
			// 		for (let i = 0; i < result.data.length; i++) {
			// 			this._addNotive(result.data[i].content);
			// 		}
			// 	}
			// });
		}
	}

	protected _init(): void {
		this._ui = Main.createComponent('活动弹窗', 615, 1000);
		this._ui.x = (Main.stageWidth - 615) >> 1;
		this._ui.y = (Main.stageHeight - 1000) >> 1;
		this._ui.getController('c1').selectedIndex = 1;
		const ui = this._ui.getChild('n0').asCom;
		ui.getChild('n34').addClickListener(this._onClose, this);
		ui.getChild('n53').addClickListener(this._onClose, this);

		this._list = ui.getChild('n58').asList;
		this._list.removeChildrenToPool();
	}

	private _addNotive(notice: string) {
		let t = this._list.addItemFromPool('ui://yejc893varxrcae').asCom;
		t.getChild('n0').asTextField.text = notice;
		t.height = t.getChild('n0').height;
	}

	static get instance(): ActivityPanel {
		if (!ActivityPanel._instance) {
			ActivityPanel._instance = new ActivityPanel();
		}

		return ActivityPanel._instance;
	}
}