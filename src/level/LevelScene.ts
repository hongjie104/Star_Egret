class LevelScene extends egret.DisplayObjectContainer {

	private static _instance: LevelScene;

	private _rootTree: LevelTree;

	private _treeArr: LevelTree[] = [];

	private _treeHeight = 0;

	public constructor() {
		super();

		this._rootTree = new LevelTree('tree1', 750, 1405, 1, 11);
		this._rootTree.addEventListener(StarEvent.ENTER_LEVEL, this._onEnterLevel, this);
		let curLevel = 1 + 11;
		for (let i = 1; i < 60; i++) {
			if ((i & 1) === 0) {
				this._treeArr[i - 1] = new LevelTree('tree2', 750, 1404, curLevel, 13);
				this._treeArr[i - 1].addEventListener(StarEvent.ENTER_LEVEL, this._onEnterLevel, this);
				curLevel += 13;
			} else {
				this._treeArr[i - 1] = new LevelTree('tree3', 750, 846, curLevel, 9);
				this._treeArr[i - 1].addEventListener(StarEvent.ENTER_LEVEL, this._onEnterLevel, this);
				curLevel += 9;
			}
		}
		let scrollViewContent = new egret.DisplayObjectContainer();
		let h = 0, displayObject: egret.DisplayObject = null;
		for (let i = this._treeArr.length - 1; i > -1; i--) {
			displayObject = this._treeArr[i].tree.displayObject;
			displayObject.y = h;
			h += displayObject.height;
			scrollViewContent.addChild(displayObject);
		}
		// 再加上最底下的树
		displayObject = this._rootTree.tree.displayObject;
		displayObject.y = h;
		scrollViewContent.addChild(displayObject);
		this._treeHeight = h + displayObject.height;

		// 创建 ScrollView
		const scrollView: egret.ScrollView = new egret.ScrollView();
		scrollView.bounces = false;
		// 设置滚动内容
		scrollView.setContent(scrollViewContent);
		// 设置滚动区域宽高
		scrollView.width = Main.stageWidth;
		scrollView.height = Main.stageHeight;
		this.addChild(scrollView);

		scrollView.setScrollTop(this._treeHeight - Main.stageHeight);
	}

	private _onEnterLevel(evt: StarEvent): void {
		this.dispatchEvent(evt);
	}

	static get instance(): LevelScene {
		if (!LevelScene._instance) {
			LevelScene._instance = new LevelScene();
		}
		return LevelScene._instance;
	}
}