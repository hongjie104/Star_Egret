class ChangeTypePanel extends BasePanel {

	private static _instance: ChangeTypePanel;

	private _arrow: fairygui.GComponent;

	private _star: Star;

	public constructor() {
		super();
	}

	show(): void {
		fairygui.GRoot.inst.addChild(this._ui);
		fairygui.GRoot.inst.addChild(this._arrow);
		this._arrow.touchable = false;

		this._arrow.getTransition('t0').play();
	}

	set star(val: Star) {
		if (this._star) {
			this._star.stop();
		}
		this._star = val;
		this._star.play();
		let x = val.x - 250;
		if (x < 0) x = 0;
		else if (x + 500 > Main.stageWidth) x = Main.stageWidth - 500;
		let y = val.y - 200 - 50;
		this._ui.x = x;
		this._ui.y = y;
		this._arrow.x = val.x - 200;
		this._arrow.y = val.y - 250;
	}

	get star(): Star {
		return this._star;
	}

	protected _init(): void {
		this._ui = Main.createComponent('改变颜色1', 500, 200);
		this._ui.getChild('n9').addClickListener(this._onClose, this);
		this._ui.getChild('n0').addClickListener(this._onChangeType, this);
		this._ui.getChild('n1').addClickListener(this._onChangeType, this);
		this._ui.getChild('n2').addClickListener(this._onChangeType, this);
		this._ui.getChild('n3').addClickListener(this._onChangeType, this);
		this._ui.getChild('n4').addClickListener(this._onChangeType, this);

		this._arrow = Main.createComponent('改变颜色2', 400, 400);
	}

	private _onChangeType(evt: egret.TouchEvent): void {
		const btn = evt.currentTarget as fairygui.GButton;
		for (let i = 0; i < 5; i++) {
			if (btn.name == `n${i}`) {
				if (this.star.type == i) {
					return;
				}
				this.star.type = i;
				break;
			}
		}
		this.star.stop();
		this.dispatchEvent(new StarEvent(StarEvent.STAR_TYPE_CHANGED));
		this._onClose();
	}

	protected _onClose(evt?: egret.TouchEvent): void {
		this._closed();
	}

	protected _closed(): void {
		if (this._star) {
			this._star.stop();
			this._star = null;
		}
		this._ui.removeFromParent();
		this._arrow.removeFromParent();
		this.dispatchEvent(new egret.Event(egret.Event.CLOSE));
	}

	static get instance(): ChangeTypePanel {
		if (!ChangeTypePanel._instance) {
			ChangeTypePanel._instance = new ChangeTypePanel();
		}

		return ChangeTypePanel._instance;
	}
}