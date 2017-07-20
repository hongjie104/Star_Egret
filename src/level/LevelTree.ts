class LevelTree extends egret.EventDispatcher {

	protected _tree: fairygui.GComponent;

	public constructor(protected _treeName: string, width: number, height: number, starLevel: number, numBtn: number) {
		super();
		this._tree = Main.createComponent(this._treeName);
		this._tree.viewWidth = Main.stageWidth;
		this._tree.viewHeight = Main.stageWidth / width * height;

		let levelBtn: fairygui.GButton = null;
		for (let i = 1; i < numBtn + 1; i++) {
			levelBtn = this._tree.getChild(`n${i}`).asButton;
			levelBtn.data = i - 1 + starLevel;
			levelBtn.getChild('n3').text = (levelBtn.data).toString();
			levelBtn.addClickListener(this._onLevelBtnClicked, this);
		}
	}

	get tree(): fairygui.GComponent {
		return this._tree;
	}

	private _onLevelBtnClicked(evt: egret.TouchEvent): void {
		const btn = evt.currentTarget as fairygui.GButton;
		const level: number = btn.data;
		this.dispatchEvent(new StarEvent(StarEvent.ENTER_LEVEL, level));
	}
}