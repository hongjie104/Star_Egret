class LevelTree extends egret.EventDispatcher {

	protected _tree: fairygui.GComponent;

	public constructor(protected _treeName: string, width: number, height: number, numBtn: number, starLevel: number) {
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

	updateBtnStatus(curLevel: number): void {
		const tree = this._tree;
		let levelBtn: fairygui.GButton;
		let levelBtnLevel: number = 0;
		for (let i = 0; i < tree.numChildren; i++) {
			levelBtn = tree.getChildAt(i) as fairygui.GButton;
			if (levelBtn) {
				levelBtnLevel = levelBtn.data;
				if (levelBtnLevel > 0) {
					if (levelBtnLevel <= curLevel) {
						levelBtn.getController('c1').selectedIndex = 1;
					} else if (levelBtnLevel === curLevel + 1) {
						levelBtn.getController('c1').selectedIndex = 2;
					} else {
						levelBtn.getController('c1').selectedIndex = 0;
					}
				}
			}
		}
	}

	private _onLevelBtnClicked(evt: egret.TouchEvent): void {
		const btn = evt.currentTarget as fairygui.GButton;
		const level: number = btn.data;
		if (level <= LocalStorage.getItem(LocalStorageKey.maxLevel) + 1) {
			this.dispatchEvent(new StarEvent(StarEvent.ENTER_LEVEL, level));
		}
	}
}