class LevelScene extends egret.DisplayObjectContainer {

	private static _instance: LevelScene;

	/**
	 * 三个树的数据
	 * 第一棵树做为根，永远只有一个
	 * 第二第三棵树循环交替地往上增加
	 * treeHeight是树的高度
	 * btnHeight是树上的关卡按钮的高度
	 */
	private _treeLevelHeight: Array<{ treeHeight: number, btnHeight: number[] }> = [
		{
			treeHeight: 1405,
			btnHeight: [993, 941, 810, 632, 552, 393, 247, 276, 309, 46, 5]
		},
		{
			treeHeight: 1404,
			btnHeight: [1221, 1176, 892, 809, 743, 674, 448, 371, 326, 245, 126, 58, 18]
		},
		{
			treeHeight: 846,
			btnHeight: [651, 602, 502, 452, 325, 276, 252, 65, 11]
		}
	];

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

	private _topBar: fairygui.GComponent;

	public constructor() {
		super();

		const numRootTreeLevelBtn = this._treeLevelHeight[0].btnHeight.length;
		const numTree1LevelBtn = this._treeLevelHeight[1].btnHeight.length;
		const numTree2LevelBtn = this._treeLevelHeight[2].btnHeight.length;

		this._rootTree = new LevelTree('tree1', 750, this._treeLevelHeight[0].treeHeight, numRootTreeLevelBtn, 1);
		this._rootTree.addEventListener(StarEvent.ENTER_LEVEL, this._onEnterLevel, this);
		this._curShowMaxLevel = 1 + numRootTreeLevelBtn;
		this._treeArr[0] = this._rootTree;
		// 根据当前关卡算出一开始应该初始化多少棵树
		let numInitTree = 2;
		const curLevel = LocalStorage.getItem(LocalStorageKey.curLevel);
		if (curLevel > numRootTreeLevelBtn) {
			numInitTree = 1 + 2 * Math.ceil((curLevel - numRootTreeLevelBtn) / (numTree1LevelBtn + numTree2LevelBtn));
		}
		// console.log('初始化树的数量:' + numInitTree);

		for (let i = 1; i < numInitTree + 2; i++) {
			if ((i & 1) === 1) {
				this._treeArr[i] = new LevelTree('tree2', 750, this._treeLevelHeight[1].treeHeight, numTree1LevelBtn, this._curShowMaxLevel);
				this._curShowMaxLevel += numTree1LevelBtn;
			} else {
				this._treeArr[i] = new LevelTree('tree3', 750, this._treeLevelHeight[2].treeHeight, numTree2LevelBtn, this._curShowMaxLevel);
				this._curShowMaxLevel += numTree2LevelBtn;
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
		// 根据当前关卡算数树应该滚动到什么位置
		let scrollTop = 0;
		if (curLevel < numRootTreeLevelBtn) {
			if (curLevel < 1) scrollTop = 0;
			else scrollTop = this._treeLevelHeight[0].treeHeight - this._treeLevelHeight[0].btnHeight[curLevel - 1];
		} else {
			let tempLevel = curLevel - numRootTreeLevelBtn;
			let tempScrollTop = 0;
			let curTree = 1;
			while (true) {
				curTree = 1;
				if (tempLevel >= numTree1LevelBtn) {
					tempLevel -= numTree1LevelBtn;
					tempScrollTop += this._treeLevelHeight[curTree].treeHeight;
				} else {
					break;
				}
				curTree = 2;
				if (tempLevel >= numTree2LevelBtn) {
					tempLevel -= numTree2LevelBtn;
					tempScrollTop += this._treeLevelHeight[curTree].treeHeight;
				} else {
					break;
				}
			}
			tempScrollTop += this._treeLevelHeight[curTree].treeHeight - this._treeLevelHeight[curTree].btnHeight[tempLevel];
			scrollTop = this._treeLevelHeight[0].treeHeight + tempScrollTop;
		}
		// (Main.stageHeight >> 1) 是屏幕高度的一半，让目标关卡在屏幕上垂直居中
		// 85 >> 1 是按钮高度的一半
		this._scrollView.setScrollTop(this._treeHeight - Main.stageHeight - scrollTop + (Main.stageHeight >> 1) + (85 >> 1));
		this.updateLevelBtnStatus(curLevel);

		this.reset();
	}

	reset(): void {
		// 初始化顶部
		this._topBar = Main.createComponent('选关顶挂', 750, 100);
		fairygui.GRoot.inst.removeChildren();
		fairygui.GRoot.inst.addChild(this._topBar);

		this._topBar.getChild('n7').addClickListener(() => {
			PayPanel.instance.show()
		}, this);
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
				tree = new LevelTree('tree2', 750, this._treeLevelHeight[1].treeHeight, this._treeLevelHeight[1].btnHeight.length, this._curShowMaxLevel);
				this._curShowMaxLevel += this._treeLevelHeight[1].btnHeight.length;
			} else {
				tree = new LevelTree('tree3', 750, this._treeLevelHeight[2].treeHeight, this._treeLevelHeight[2].btnHeight.length, this._curShowMaxLevel);
				this._curShowMaxLevel += this._treeLevelHeight[2].btnHeight.length;
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