class LevelScene extends egret.DisplayObjectContainer {

	private static _instance: LevelScene;

	private _rootTree: LevelTree;

	private _treeArr: LevelTree[] = [];

	/**
	 * 整棵树的高度
	 */
	private _treeHeight = 0;

	/**
	 * 当前显示的最大关卡数
	 */
	private _curShowMaxLevel = 1;

	private _scrollView: egret.ScrollView;

	private _scrollContentContainer: egret.DisplayObjectContainer;

	public constructor() {
		super();

		this._rootTree = new LevelTree('tree1', 750, 1405, 1, 11);
		this._rootTree.addEventListener(StarEvent.ENTER_LEVEL, this._onEnterLevel, this);
		this._curShowMaxLevel = 1 + 11;
		this._treeArr[0] = this._rootTree;
		for (let i = 1; i < 3; i++) {
			if ((i & 1) === 1) {
				this._treeArr[i] = new LevelTree('tree2', 750, 1404, this._curShowMaxLevel, 13);
				this._curShowMaxLevel += 13;
			} else {
				this._treeArr[i] = new LevelTree('tree3', 750, 846, this._curShowMaxLevel, 9);
				this._curShowMaxLevel += 9;
			}
			this._treeArr[i].addEventListener(StarEvent.ENTER_LEVEL, this._onEnterLevel, this);
		}

		this._scrollContentContainer = new egret.DisplayObjectContainer();
		let displayObject: egret.DisplayObject = null;
		for (let i = this._treeArr.length - 1; i > -1; i--) {
			displayObject = this._treeArr[i].tree.displayObject;
			displayObject.y = this._treeHeight;
			this._treeHeight += displayObject.height;
			this._scrollContentContainer.addChild(displayObject);
		}

		// 创建 ScrollView
		this._scrollView = new egret.ScrollView();
		this._scrollView.horizontalScrollPolicy = 'off';
		this._scrollView.bounces = false;
		// 设置滚动内容
		this._scrollView.setContent(this._scrollContentContainer);
		// 设置滚动区域宽高
		this._scrollView.width = Main.stageWidth;
		this._scrollView.height = Main.stageHeight;
		this.addChild(this._scrollView);
		this._scrollView.addEventListener(egret.Event.CHANGE, this._onScrollViewChanged, this);
		this._scrollView.setScrollTop(this._treeHeight - Main.stageHeight);

		this.updateLevelBtnStatus(LocalStorage.getItem(LocalStorageKey.curLevel));
	}

	updateLevelBtnStatus(curLevel: number): void {
		const treeArr = this._treeArr;
		for (let i = 0; i < treeArr.length; i++) {
			treeArr[i].updateBtnStatus(curLevel);
		}
	}

	private _onEnterLevel(evt: StarEvent): void {
		this.dispatchEvent(evt);
	}

	private _onScrollViewChanged(evt: egret.Event): void {
		if (this._scrollView.scrollTop === 0) {
			// 增加一个Tree
			const numTree = this._treeArr.length;
			let tree: LevelTree = null;
			if ((numTree & 1) === 1) {
				tree = new LevelTree('tree2', 750, 1404, this._curShowMaxLevel, 13);
				this._curShowMaxLevel += 13;
			} else {
				tree = new LevelTree('tree3', 750, 846, this._curShowMaxLevel, 9);
				this._curShowMaxLevel += 9;
			}
			tree.addEventListener(StarEvent.ENTER_LEVEL, this._onEnterLevel, this);
			this._treeArr.push(tree);

			this._scrollContentContainer.addChild(tree.tree.displayObject);
			// 之前的tree的y值都增加
			const vh = tree.tree.displayObject.height;
			for (let i = 0; i < numTree; i++) {
				this._treeArr[i].tree.displayObject.y += vh;
			}
			this._treeHeight += vh;
			this._scrollView.setContent(this._scrollContentContainer);
			this._scrollView.setScrollTop(vh);
		}
	}

	static get instance(): LevelScene {
		if (!LevelScene._instance) {
			LevelScene._instance = new LevelScene();
		}
		return LevelScene._instance;
	}
}