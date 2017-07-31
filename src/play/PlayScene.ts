class PlayScene extends egret.DisplayObjectContainer {

	private static _instance: PlayScene = null;

	private _playPanel: fairygui.GComponent = null;

	private _topBar: fairygui.GComponent = null;

	private _isActionRunning = false;

	private _starDataArr: number[][] = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];

	private _starArr: Star[] = [];

	/**
	 * 这一局开始的时候就有的分数
	 */
	private _initScore = 0;

	/**
	 * 这一局中，因为消除而获得的分数
	 */
	private _addScore = 0;

	/**
	 * 当前关卡的目标分数
	 */
	private _targetSocre = 0;

	private _isWinPanelShowed = false;

	private _isRemovingLeftStars = false;

	private _xiaoChuStar: { row: number, col: number }[];

	public constructor() {
		super();

		this._playPanel = Main.createPanel('Game');
		fairygui.GRoot.inst.removeChildren();
		fairygui.GRoot.inst.addChild(this._playPanel);
		this._topBar = this._playPanel.getChild('n1').asCom;
		this._topBar.getChild('n1').addClickListener(this._showSettingPanel, this);

		this._reset();
	}

	private _reset(): void {
		this._isRemovingLeftStars = false;
		this._isWinPanelShowed = false;
		// 初始化顶挂上的数值
		const curLevel = LocalStorage.getItem(LocalStorageKey.curLevel) + 1;
		this._topBar.getChild('n5').text = `LEVEL ${curLevel}`;
		this._initScore = LocalStorage.getItem(LocalStorageKey.totalScore);
		this._addScore = 0;
		this._topBar.getChild('n6').text = this._initScore.toString();
		// 当前关卡的最高分
		const levelScoreArr = LocalStorage.getItem(LocalStorageKey.levelScore) as Array<number>;
		while (curLevel > levelScoreArr.length) {
			levelScoreArr.push(0);
		}
		this._topBar.getChild('n7').text = levelScoreArr[curLevel - 1].toString();
		// 过关的分数
		this._targetSocre = Util.getTargetScore(curLevel);
		this._topBar.getChild('n8').text = this._targetSocre.toString();

		// 初始化星星
		this._starArr.length = 0;
		let random = 0, actionDelay = 0;
		for (let col = 0; col < 10; col++) {
			actionDelay = 10 * col;
			for (let row = 9; row > -1; row--) {
				actionDelay += 20

				random = Math.floor(Math.random() * 5);
				this._starDataArr[row][col] = random;
				let star = new Star(random, row, col);
				star.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onStarClicked, this);
				this._starArr.push(star);
				let p: egret.Point = this._getStarPoint(row, col);
				star.x = p.x;
				star.y = p.y - Main.stageHeight;
				this._playPanel.displayListContainer.addChild(star);
				egret.Tween.get(star).wait(actionDelay).to({ y: p.y }, 200);
			}
		}
	}

	private _onStarClicked(evt: egret.TouchEvent): void {
		if (this._isRemovingLeftStars) return;
		if (!this._isActionRunning) {
			this._isActionRunning = true;
			const starTouched = evt.currentTarget as Star;
			const result = this._findSameStarIndex(starTouched.row, starTouched.col);
			if (result.length > 1) {
				// if (LocalStorage.getItem(LocalStorageKey.touchType) === 2) {
				if (true) {
					if (!this._xiaoChuStar) {
						this._xiaoChuStar = result;
						let rowAndCol: { row: number, col: number };
						let starIndex = -1;
						for (let i = 0; i < result.length; i++) {
							rowAndCol = result[i];
							starIndex = this._getStarIndex(rowAndCol.row, rowAndCol.col);
							if (starIndex !== -1) {
								this._starArr[starIndex].isSelected = true;
							}
						}
						this._isActionRunning = false;
					} else {
						this._xiaoChu(this._xiaoChuStar);
						this._xiaoChuStar = null;
					}
				} else {
					this._xiaoChu(result);
				}
			} else {
				this._isActionRunning = false;
			}
		}
	}

	private _xiaoChu(result: { row: number, col: number }[]): void {
		// 算一下这一次消除得了多少分
		const addScore = Util.getScore(result.length);
		this._addScore += addScore;
		this._topBar.getChild('n6').text = (this._initScore + this._addScore).toString();
		// 判断一下，是否达到了目标分数
		if (!this._isWinPanelShowed) {
			if (this._initScore + this._addScore >= this._targetSocre) {
				this._isWinPanelShowed = true;
				WinPanel.instance.show();
			}
		}

		const starDataArr = this._starDataArr;
		let rowAndCol: { row: number, col: number };
		for (let i = 0; i < result.length; i++) {
			rowAndCol = result[i];
			let starIndex = this._getStarIndex(rowAndCol.row, rowAndCol.col);
			if (starIndex !== -1) {
				this._removeStar(this._starArr.splice(starIndex, 1)[0], false, true);
			}
			starDataArr[rowAndCol.row][rowAndCol.col] = -1;
		}

		// 先整体往下，再往左
		const starMoveData: { fromRow: number, fromCol: number, toRow: number, toCol: number }[] = [];
		for (let r = 9; r > -1; r--) {
			for (let c = 0; c < 10; c++) {
				if (starDataArr[r][c] == -1) {
					let rowTop = r - 1;
					while (rowTop >= 0 && starDataArr[rowTop][c] == -1) {
						rowTop -= 1;
					}
					if (rowTop >= 0) {
						starDataArr[r][c] = starDataArr[rowTop][c];
						starDataArr[rowTop][c] = -1;
						starMoveData.push({
							fromRow: rowTop,
							fromCol: c,
							toRow: r,
							toCol: c
						});
					}
				}
			}
		}
		let isColEmpty = false;
		let b = false;
		for (let c = 8; c > -1; c--) {
			isColEmpty = true;
			for (let r = 0; r < 10; r++) {
				if (starDataArr[r][c] != -1) {
					isColEmpty = false;
					break;
				}
			}
			if (isColEmpty) {
				for (let newCol = c + 1; newCol < 10; newCol++) {
					for (let r = 0; r < 10; r++) {
						starDataArr[r][newCol - 1] = starDataArr[r][newCol];
						starDataArr[r][newCol] = -1;
						// 不等于-1，才有移动的需求
						if (starDataArr[r][newCol - 1] != -1) {
							b = false;
							for (let i = 0; i < starMoveData.length; i++) {
								if (starMoveData[i].toRow == r && starMoveData[i].toCol == newCol) {
									starMoveData[i].toRow = r;
									starMoveData[i].toCol = newCol - 1;
									b = true;
									break;
								}
							}
							if (!b) {
								starMoveData.push({
									fromRow: r,
									fromCol: newCol,
									toRow: r,
									toCol: newCol - 1
								});
							}
						}
					}
				}
			}
		}
		const starMoveDataLength = starMoveData.length;
		if (starMoveDataLength > 0) {
			let actionCount = 0;
			for (let i = 0; i < starMoveDataLength; i++) {
				let moveData = starMoveData[i];
				actionCount++;
				const star = this._starArr[this._getStarIndex(moveData.fromRow, moveData.fromCol)];
				const p: egret.Point = this._getStarPoint(moveData.toRow, moveData.toCol);
				egret.Tween.get(star).to({ y: p.y, x: p.x }, 200, p.y === star.y ? null : egret.Ease.backIn).call(() => {
					star.row = moveData.toRow;
					star.col = moveData.toCol;
					if (--actionCount == 0) {
						this._isActionRunning = false;
						this._checkCanGoOn();
					}
				});
			}
		} else {
			this._isActionRunning = false;
			this._checkCanGoOn();
		}
	}

	/**
	 * 每一次消除后都要判断一下，是否还能继续消除
	 */
	private _checkCanGoOn(): void {
		let isCanGoOn = false;
		const starDataArr = this._starDataArr;
		let val = -1;
		for (let r = 0; r < 10; r++) {
			for (let c = 0; c < 10; c++) {
				val = starDataArr[r][c];
				if (val !== -1) {
					if (c < 9 && val === starDataArr[r][c + 1]) {
						isCanGoOn = true;
						break;
					}
					if (r < 9 && val === starDataArr[r + 1][c]) {
						isCanGoOn = true;
						break;
					}
				}
			}
			if (isCanGoOn) break;
		}
		if (!isCanGoOn) {
			let starIndex = -1;
			let waitTime = 0;
			// 消除剩下的星星，然后到下一关
			this._isRemovingLeftStars = true;
			for (let c = 9; c > -1; c--) {
				for (let r = 0; r < 10; r++) {
					if (starDataArr[r][c] !== -1) {
						starIndex = this._getStarIndex(r, c);
						let removedStar = this._starArr.splice(starIndex, 1)[0];
						waitTime += 100;
						egret.Tween.get(removedStar).wait(waitTime).call(this._removeStar, this, [removedStar, r === 9 && c === 0]);
					}
				}
			}
		}
	}

	private _removeStar(star: Star, goToNextLevel: boolean = false, playParticle: boolean = false): void {
		star.removeFromParent();
		star.dispose();
		if (goToNextLevel) {
			const curLevel = LocalStorage.getItem(LocalStorageKey.curLevel) + 1;
			LocalStorage.setItem(LocalStorageKey.curLevel, curLevel);
			LocalStorage.setItem(LocalStorageKey.totalScore, this._initScore + this._addScore);
			const levelScore = LocalStorage.getItem(LocalStorageKey.levelScore) as Array<number>;
			levelScore[curLevel - 1] = this._addScore;
			LocalStorage.saveToLocal();
			this._reset();
		}
		if (playParticle) {
			// 播放个粒子动画
			//获取纹理
			const texture = RES.getRes(`star001_0${star.type + 1}_2_png`);
			//获取配置
			const config = RES.getRes(`star001_0${star.type + 1}_2_json`);
			//创建 GravityParticleSystem
			let system = new particle.GravityParticleSystem(texture, config);
			system.x = star.x + 75 / 2;
			system.y = star.y + 75 / 2;
			// system.emissionTime = 200;
			//启动粒子库
			system.start();
			//将例子系统添加到舞台
			this._playPanel.displayListContainer.addChild(system);
			egret.Tween.get(system).wait(200).call(() => {
				system.stop();
			}).wait(400).call(() => {
				system.parent.removeChild(system);
			});
		}
	}

	private _findSameStarIndex(row: number, col: number, checkedRowAndCol?: { row: number, col: number }[], result?: { row: number, col: number }[]): { row: number, col: number }[] {
		if (row < 0 || col < 0 || row > 9 || col > 9) return [];
		const targetValue = this._starDataArr[row][col];
		if (targetValue == -1) return [];
		if (!checkedRowAndCol) checkedRowAndCol = [{ row, col }];
		else {
			for (let i = 0; i < checkedRowAndCol.length; i++) {
				if (checkedRowAndCol[i].row == row && checkedRowAndCol[i].col == col) {
					return [];
				}
			}
			checkedRowAndCol.push({ row, col });
		}
		if (!result) result = [];

		// 先往上面找
		if (row > 0) {
			if (this._starDataArr[row - 1][col] == targetValue) {
				this._putIndexTo(result, row - 1, col);
				this._findSameStarIndex(row - 1, col, checkedRowAndCol, result)
			}
		}
		// 再找右边
		if (col < 9) {
			if (this._starDataArr[row][col + 1] == targetValue) {
				this._putIndexTo(result, row, col + 1);
				this._findSameStarIndex(row, col + 1, checkedRowAndCol, result);
			}
		}
		// 再找下边
		if (row < 9) {
			if (this._starDataArr[row + 1][col] == targetValue) {
				this._putIndexTo(result, row + 1, col);
				this._findSameStarIndex(row + 1, col, checkedRowAndCol, result);
			}
		}
		// 再找左边
		if (col > 0) {
			if (this._starDataArr[row][col - 1] == targetValue) {
				this._putIndexTo(result, row, col - 1);
				this._findSameStarIndex(row, col - 1, checkedRowAndCol, result);
			}
		}
		return result;
	}

	private _putIndexTo(indexArr: { row: number, col: number }[], row: number, col: number): void {
		for (let i = 0; i < indexArr.length; i++) {
			if (indexArr[i].row == row && indexArr[i].col == col) return;
		}
		indexArr.push({ row, col });
	}

	private _getStarIndex(row: number, col: number): number {
		let star: Star = null;
		for (let i = 0; i < this._starArr.length; i++) {
			star = this._starArr[i];
			if (star.row == row && star.col == col) {
				return i;
			}
		}
		return -1;
	}

	private _getStarPoint(row: number, col: number): egret.Point {
		// 一个star的宽度和高度都是75
		const w = 75;
		const h = 75;
		const zeroX = 0;
		const zeroY = Main.stageHeight - 10 * h;
		let x = zeroX + col * w;
		let y = zeroY + row * h;
		return new egret.Point(x, y);
	}

	private _showSettingPanel(): void {
		SettingPanel.instance.ui.getChild('n0').asCom.getController('c1').selectedIndex = 1;
		SettingPanel.instance.show();
	}

	static get instance(): PlayScene {
		if (!PlayScene._instance) {
			PlayScene._instance = new PlayScene();
		}
		return PlayScene._instance;
	}
}