enum PLAY_STATUS {
	normal, changingStarType, removingStar
}

/**
 * 游戏模式
 */
enum PLAY_TYPE {
	normal, liuXing
}

class PlayScene extends BaseScreen {

	private static _instance: PlayScene = null;

	/**
	 * 四种烟花的帧数
	 */
	private static FIRE_FRAME = [12, 10, 10, 11];

	private _playPanel1: fairygui.GComponent = null;

	private _playPanel2: fairygui.GComponent = null;

	private _topBar1: fairygui.GComponent = null;

	private _topBar2: fairygui.GComponent = null;

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

	private _status = PLAY_STATUS.normal;

	private _playType = PLAY_TYPE.normal;

	/**
	 * 将要被消除的星星
	 */
	private _willBeRemovedStar: Star;

	private _leftSecond = 0;

	private _timer: egret.Timer;

	public constructor() {
		super();
		this._playPanel1 = Main.createPanel('Game');
		this._topBar1 = this._playPanel1.getChild('n1').asCom;
		this._topBar1.getChild('n1').addClickListener(this._showSettingPanel, this);
		this._topBar1.getChild('n10').addClickListener(this._removeOnStar, this);
		this._topBar1.getChild('n11').addClickListener(this._changeStarType, this);
		this._topBar1.getChild('n12').addClickListener(this._transposeStar, this);
		this._topBar1.getChild('n14').addClickListener(() => {
			PayPanel.instance.show();
		}, this);
		this._topBar1.getChild('n16').addClickListener(() => {
			LvPanel.instance.show();
		}, this);

		// 流星模式
		this._playPanel2 = Main.createPanel('Game2');
		this._topBar2 = this._playPanel2.getChild('n1').asCom;
		this._topBar2.getChild('n1').addClickListener(this._showSettingPanel, this);
		this._topBar2.getChild('n10').addClickListener(this._addSecond, this);
		this._topBar2.getChild('n11').addClickListener(this._changeStarType, this);
		this._topBar2.getChild('n12').addClickListener(this._transposeStar, this);
		this._topBar2.getChild('n14').addClickListener(() => {
			PayPanel.instance.show();
		}, this);

		ChangeTypePanel.instance.addEventListener(egret.Event.CLOSE, this._onChangeTypePanelClosed, this);
		ChangeTypePanel.instance.addEventListener(StarEvent.STAR_TYPE_CHANGED, this._onStarTypeChanged, this);

		BuyItemPanel.instance.addEventListener(StarEvent.BUY_ITEM_SUCCESS, this._onUpdateItemCount, this);
	}

	updateDollar(): void {
		this._topBar1.getChild('n2').text = LocalStorage.getItem(LocalStorageKey.dollar).toString();
		this._topBar2.getChild('n2').text = LocalStorage.getItem(LocalStorageKey.dollar).toString();
	}

	reset(playType?: any): void {
		this._playType = playType as PLAY_TYPE;
		for (let i = 0; i < this._starArr.length; i++) {
			this._removeStar(this._starArr[i]);
		}

		this._isRemovingLeftStars = false;
		this._isWinPanelShowed = false;

		fairygui.GRoot.inst.removeChildren();
		if (playType == PLAY_TYPE.normal) {
			fairygui.GRoot.inst.addChild(this._playPanel1);
			// 初始化顶挂上的数值
			this._topBar1.getChild('n2').text = LocalStorage.getItem(LocalStorageKey.dollar).toString();
			const curLevel = LocalStorage.getItem(LocalStorageKey.lastLevel) + 1;
			this._topBar1.getChild('n5').text = `LEVEL ${curLevel}`;
			this._initScore = LocalStorage.getItem(LocalStorageKey.totalScore);
			this._addScore = 0;
			this._topBar1.getChild('n6').text = this._initScore.toString();
			// 三种道具的数量
			this._topBar1.getChild('n10').asCom.getChild('n2').text = LocalStorage.getItem(LocalStorageKey.item1).toString();
			this._topBar1.getChild('n11').asCom.getChild('n2').text = LocalStorage.getItem(LocalStorageKey.item2).toString();
			this._topBar1.getChild('n12').asCom.getChild('n2').text = LocalStorage.getItem(LocalStorageKey.item3).toString();
			// 当前关卡的最高分
			const levelScoreArr = LocalStorage.getItem(LocalStorageKey.levelScore) as Array<number>;
			while (curLevel > levelScoreArr.length) {
				levelScoreArr.push(0);
			}
			this._topBar1.getChild('n7').text = levelScoreArr[curLevel - 1].toString();
			// 过关的分数
			this._targetSocre = Util.getTargetScore(curLevel);
			this._topBar1.getChild('n8').text = this._targetSocre.toString();
			this._topBar1.getChild('n4').text = Util.getLv().toString();
			const progress = Util.getExpProgress();
			const progressBar = this._topBar1.getChild('n9').asProgress;
			progressBar.max = progress.max;
			progressBar.value = progress.val;
		} else if (playType == PLAY_TYPE.liuXing) {
			fairygui.GRoot.inst.addChild(this._playPanel2);
			// 初始化顶挂上的数值
			this._topBar2.getChild('n2').text = LocalStorage.getItem(LocalStorageKey.dollar).toString();
			const curLevel = LocalStorage.getItem(LocalStorageKey.lastLevel) + 1;
			this._initScore = LocalStorage.getItem(LocalStorageKey.totalScore);
			this._addScore = 0;
			this._topBar2.getChild('n6').text = this._initScore.toString();
			// 三种道具的数量
			this._topBar2.getChild('n10').asCom.getChild('n2').text = LocalStorage.getItem(LocalStorageKey.item4).toString();
			this._topBar2.getChild('n11').asCom.getChild('n2').text = LocalStorage.getItem(LocalStorageKey.item2).toString();
			this._topBar2.getChild('n12').asCom.getChild('n2').text = LocalStorage.getItem(LocalStorageKey.item3).toString();
			// 当前关卡的最高分
			const levelScoreArr = LocalStorage.getItem(LocalStorageKey.levelScore) as Array<number>;
			while (curLevel > levelScoreArr.length) {
				levelScoreArr.push(0);
			}
			this._topBar2.getChild('n7').text = levelScoreArr[curLevel - 1].toString();
			// 过关的分数
			this._targetSocre = Util.getTargetScore(curLevel);
			this._topBar2.getChild('n8').text = this._targetSocre.toString();
			// 倒计时时间
			this._leftSecond = 45;
			this._topBar2.getChild('n17').text = this._leftSecond.toString();

			if (!this._timer) {
				this._timer = new egret.Timer(1000, 0);
				this._timer.addEventListener(egret.TimerEvent.TIMER, this._onTimer, this);
			}
			this._timer.start();
		}

		const curPanel = playType == PLAY_TYPE.normal ? this._playPanel1 : this._playPanel2;
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
				star.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onStarTouched, this);
				this._starArr.push(star);
				let p: egret.Point = this._getStarPoint(row, col);
				star.x = p.x;
				star.y = p.y - Main.stageHeight;
				curPanel.displayListContainer.addChild(star);
				egret.Tween.get(star).wait(actionDelay).to({ y: p.y }, 200);
			}
		}
	}

	private _onStarTouched(evt: egret.TouchEvent): void {
		const starTouched = evt.currentTarget as Star;
		if (this._status == PLAY_STATUS.changingStarType) {
			ChangeTypePanel.instance.star = starTouched;
		} else if (this._status == PLAY_STATUS.removingStar) {
			if (this._willBeRemovedStar) {
				this._willBeRemovedStar.isSelected = false;
				this._willBeRemovedStar.stop();
				if (this._willBeRemovedStar == starTouched) {
					this._willBeRemovedStar = null;
					// 第二次选中了，那就消除了
					let costDollar = false;
					const itemCount: number = LocalStorage.getItem(LocalStorageKey.item1);
					if (itemCount < 1) {
						let dollar: number = LocalStorage.getItem(LocalStorageKey.dollar);
						if (dollar >= 6) {
							LocalStorage.setItem(LocalStorageKey.dollar, dollar - 6);
							LocalStorage.saveToLocal();
							this.updateDollar();
							costDollar = true;
						}
					}
					if (!costDollar) {
						LocalStorage.setItem(LocalStorageKey.item1, itemCount - 1);
						LocalStorage.saveToLocal();
						this._topBar1.getChild('n10').asCom.getChild('n2').text = (itemCount - 1).toString();
					}
					// 先播个动画
					const animation = Main.createComponent('火箭弹动画', 640, 640);
					animation.x = starTouched.x - 320;
					animation.y = starTouched.y - 500;
					fairygui.GRoot.inst.addChild(animation);
					animation.getTransition('t3').play(() => {
						animation.removeFromParent();
						animation.dispose();
						// 在播放一个爆炸的效果
						const mc = fairygui.UIPackage.createObject("Package1", '火箭弹动画2').asMovieClip;
						mc.touchable = false;
						mc.x = starTouched.x - 250;
						mc.y = starTouched.y - 250;
						fairygui.GRoot.inst.addChild(mc);
						mc.setPlaySettings(1, 13, 1, 13, () => {
							mc.playing = false;
							mc.removeFromParent();
							mc.dispose();
						});
						this._xiaoChu([{ row: starTouched.row, col: starTouched.col }]);
					});
					this._status = PLAY_STATUS.normal;
					return;
				}
			}
			this._willBeRemovedStar = starTouched;
			this._willBeRemovedStar.isSelected = true;
			this._willBeRemovedStar.play();
		} else {
			if (this._isRemovingLeftStars) return;
			if (!this._isActionRunning) {
				this._isActionRunning = true;
				const result = this._findSameStarIndex(starTouched.row, starTouched.col);
				if (result.length > 1) {
					if (LocalStorage.getItem(LocalStorageKey.touchType) === 2) {
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
	}

	private _xiaoChu(result: { row: number, col: number }[]): void {
		// 算一下这一次消除得了多少分
		const addScore = Util.getScore(result.length);
		this._addScore += addScore;
		this._topBar1.getChild('n6').text = (this._initScore + this._addScore).toString();

		// 算一下这一次消除得了多少经验
		const addExp = Util.getAwardExp(result.length);
		// 获得奖励
		const award = Util.checkAward(addExp);
		if (award > 0) {
			// 升级了，那就弹个窗
			LevelUpAwardPanel.instance.show();
			const newDollar = LocalStorage.getItem(LocalStorageKey.dollar) + award;
			LocalStorage.setItem(LocalStorageKey.dollar, newDollar);
			LocalStorage.saveToLocal();
			this._topBar1.getChild('n2').text = newDollar.toString();
		}
		this._topBar1.getChild('n4').text = Util.getLv().toString();
		const progress = Util.getExpProgress();
		const progressBar = this._topBar1.getChild('n9').asProgress;
		progressBar.max = progress.max;
		progressBar.value = progress.val;

		// 播放个动画
		let animationName: string = null, h = 400, w = 640;
		if (result.length > 11) {
			animationName = 'PERFECT';
		} else if (result.length > 7) {
			animationName = 'cool';
		} else if (result.length > 5) {
			animationName = 'good';
			w = 400;
		}
		if (animationName) {
			const animation = Main.createComponent(animationName, w, h);
			animation.x = (Main.stageWidth - w) >> 1;
			animation.y = (Main.stageHeight - h) >> 1;
			fairygui.GRoot.inst.addChild(animation);
			animation.getTransition('t0').play(() => {
				animation.removeFromParent();
				animation.dispose();
			});

			this._startPlayFire();
		}

		const starDataArr = this._starDataArr;
		let rowAndCol: { row: number, col: number };
		let removedStar: Star = null;
		for (let i = 0; i < result.length; i++) {
			removedStar = null;
			rowAndCol = result[i];
			let starIndex = this._getStarIndex(rowAndCol.row, rowAndCol.col);
			if (starIndex !== -1) {
				removedStar = this._starArr.splice(starIndex, 1)[0];
				this._removeStar(removedStar, false, true);
			}
			starDataArr[rowAndCol.row][rowAndCol.col] = -1;

			if (removedStar) {
				// 播放飞舞的数字
				const num = Main.createComponent('飞舞的数字');
				num.displayObject.anchorOffsetX = 100;
				num.displayObject.anchorOffsetY = 30;
				num.x = removedStar.x;
				num.y = removedStar.y;
				num.getChild('n0').text = (Util.getScore(i + 1) - Util.getScore(i)).toString();

				egret.Tween.get(num).wait(i * 200).call(() => {
					const system = new particle.GravityParticleSystem(RES.getRes('flystar_png'), RES.getRes('flystar_json'));
					system.x = 100;
					system.y = 30;
					num.displayListContainer.addChild(system);
					system.start();
					fairygui.GRoot.inst.addChild(num);
					num.scaleX = 2;
					num.scaleY = 2;
					egret.Tween.get(num).to({ x: Main.stageWidth >> 1, y: 120, alpha: 1, scaleX: 1, scaleY: 1 }, 1000, egret.Ease.quadOut).call(() => {
						system.stop();
						num.removeFromParent();
						num.dispose();
					});
				});
			}
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

	private _startPlayFire(): void {
		// 随机播放几个烟花的动画
		const count = Util.getRandom(3, 8);
		for (let i = 0; i < count; i++) {
			egret.Tween.get(this).wait(1000 + i * 200).call(this._playFire, this);
		}
	}

	private _playFire(): void {
		const index = Util.getRandom(1, PlayScene.FIRE_FRAME.length);
		const mc = fairygui.UIPackage.createObject("Package1", `烟花${index}`).asMovieClip;
		mc.touchable = false;
		mc.x = Util.getRandom(100, Main.stageWidth - 100);
		mc.y = Util.getRandom(100, 600);
		fairygui.GRoot.inst.addChild(mc);
		mc.setPlaySettings(1, PlayScene.FIRE_FRAME[index], 1, PlayScene.FIRE_FRAME[index], () => {
			mc.playing = false;
			mc.removeFromParent();
			mc.dispose();
		});
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
			// 判断一下，是否达到了目标分数
			if (this._initScore + this._addScore >= this._targetSocre) {
				if (!this._isWinPanelShowed) {
					this._isWinPanelShowed = true;
					const winPanel = WinPanel.instance;
					if (!winPanel.hasEventListener(egret.Event.CLOSE)) {
						winPanel.addEventListener(egret.Event.CLOSE, this._onWinPanelClosed, this);
					}
					winPanel.show();
				}
			} else {
				// 失败了
				FailPanel.instance.show();
			}
		}
	}

	private _onWinPanelClosed(): void {
		this.updateDollar();
		const starDataArr = this._starDataArr;
		let starIndex = -1;
		let waitTime = 0;
		// 消除剩下的星星，然后到下一关
		this._isRemovingLeftStars = true;
		for (let c = 9; c > -1; c--) {
			for (let r = 0; r < 10; r++) {
				if (starDataArr[r][c] !== -1) {
					starIndex = this._getStarIndex(r, c);
					let removedStar = this._starArr.splice(starIndex, 1)[0];
					waitTime += 60;
					egret.Tween.get(removedStar).wait(waitTime).call(this._removeStar, this, [removedStar, r === 9 && c === 0, true]);
				}
			}
		}
	}

	private _removeStar(star: Star, goToNextLevel: boolean = false, playParticle: boolean = false): void {
		star.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._onStarTouched, this);
		star.removeFromParent();
		star.dispose();
		if (goToNextLevel) {
			const curLevel = LocalStorage.getItem(LocalStorageKey.lastLevel) + 1;
			LocalStorage.setItem(LocalStorageKey.lastLevel, curLevel);
			LocalStorage.setItem(LocalStorageKey.totalScore, this._initScore + this._addScore);
			const levelScore = LocalStorage.getItem(LocalStorageKey.levelScore) as Array<number>;
			if (levelScore[curLevel - 1] < this._addScore) {
				levelScore[curLevel - 1] = this._addScore;
				// 再算算总分
				let totalScore = 0;
				let maxTotalScore = 0;
				for (let i = 0; i < levelScore.length; i++) {
					if (i < curLevel)
						totalScore += levelScore[i];
					maxTotalScore += levelScore[i];
				}
				LocalStorage.setItem(LocalStorageKey.totalScore, totalScore);
				LocalStorage.setItem(LocalStorageKey.maxTotalScore, maxTotalScore);
			}
			LocalStorage.saveToLocal();
			this.reset(this._playType);
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
			const curPanel = this._playType == PLAY_TYPE.normal ? this._playPanel1 : this._playPanel2;
			curPanel.displayListContainer.addChild(system);
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
		return new egret.Point(x + (w >> 1), y + (h >> 1));
	}

	private _showSettingPanel(): void {
		SettingPanel.instance.ui.getChild('n0').asCom.getController('c1').selectedIndex = 1;
		SettingPanel.instance.show();
	}

	/**
	 * 消除一个星星
	 */
	private _removeOnStar(): void {
		if (this._status == PLAY_STATUS.removingStar) {
			if (this._willBeRemovedStar) {
				this._willBeRemovedStar.isSelected = false;
				this._willBeRemovedStar.stop();
				this._willBeRemovedStar = null;
			}
			this._status = PLAY_STATUS.normal;
			return;
		}
		if (this._status == PLAY_STATUS.changingStarType) {
			ChangeTypePanel.instance.close();
		}
		const itemCount: number = LocalStorage.getItem(LocalStorageKey.item1);
		if (itemCount < 1) {
			let dollar: number = LocalStorage.getItem(LocalStorageKey.dollar);
			if (dollar < 6) {
				// 道具数量不够，钱也不够
				BuyItemPanel.instance.show();
				return;
			}
		}
		this._status = PLAY_STATUS.removingStar;

		this._willBeRemovedStar = this._starArr[0];
		this._willBeRemovedStar.isSelected = true;
		this._willBeRemovedStar.play();
	}

	/**
	 * 改变一个星星的type
	 */
	private _changeStarType(): void {
		if (this._status == PLAY_STATUS.changingStarType) {
			ChangeTypePanel.instance.close();
			this._status = PLAY_STATUS.normal;
			return;
		}
		if (this._status == PLAY_STATUS.removingStar) {
			if (this._willBeRemovedStar) {
				this._willBeRemovedStar.isSelected = false;
				this._willBeRemovedStar.stop();
				this._willBeRemovedStar = null;
			}
		}
		const itemCount: number = LocalStorage.getItem(LocalStorageKey.item2);
		if (itemCount < 1) {
			let dollar: number = LocalStorage.getItem(LocalStorageKey.dollar);
			if (dollar < 6) {
				// 道具数量不够，钱也不够
				BuyItemPanel.instance.show();
				return;
			}
		}
		this._status = PLAY_STATUS.changingStarType;
		// 弹出个选择颜色的面板
		const p = ChangeTypePanel.instance;
		p.star = this._starArr[0];
		p.show();
	}

	private _onStarTypeChanged(): void {
		let costDollar = false;
		const itemCount: number = LocalStorage.getItem(LocalStorageKey.item2);
		if (itemCount < 1) {
			let dollar: number = LocalStorage.getItem(LocalStorageKey.dollar);
			if (dollar >= 6) {
				LocalStorage.setItem(LocalStorageKey.dollar, dollar - 6);
				LocalStorage.saveToLocal();
				this.updateDollar();
				costDollar = true;
			}
		}
		if (!costDollar) {
			LocalStorage.setItem(LocalStorageKey.item2, itemCount - 1);
			LocalStorage.saveToLocal();
			this._topBar1.getChild('n11').asCom.getChild('n2').text = (itemCount - 1).toString();
			this._topBar2.getChild('n11').asCom.getChild('n2').text = (itemCount - 1).toString();
		}
		const star = ChangeTypePanel.instance.star;
		this._starDataArr[star.row][star.col] = star.type;
	}

	private _onChangeTypePanelClosed(): void {
		this._status = PLAY_STATUS.normal;
	}

	private _addSecond(): void {
		if (this._status == PLAY_STATUS.changingStarType) {
			ChangeTypePanel.instance.close();
		}
		this._status = PLAY_STATUS.normal;

		let costDollar = false;
		const itemCount: number = LocalStorage.getItem(LocalStorageKey.item4);
		if (itemCount < 1) {
			let dollar: number = LocalStorage.getItem(LocalStorageKey.dollar);
			if (dollar > 6) {
				LocalStorage.setItem(LocalStorageKey.dollar, dollar - 6);
				LocalStorage.saveToLocal();
				this.updateDollar();
				costDollar = true;
			} else {
				// 道具数量不够，钱也不够
				BuyItemPanel.instance.show();
				return;
			}
		}
		if (!costDollar) {
			LocalStorage.setItem(LocalStorageKey.item4, itemCount - 1);
			LocalStorage.saveToLocal();
			this._topBar2.getChild('n10').asCom.getChild('n2').text = (itemCount - 1).toString();
		}
	}

	private _onUpdateItemCount(): void {
		this._topBar1.getChild('n10').asCom.getChild('n2').text = LocalStorage.getItem(LocalStorageKey.item1).toString();
		this._topBar1.getChild('n11').asCom.getChild('n2').text = LocalStorage.getItem(LocalStorageKey.item2).toString();
		this._topBar1.getChild('n12').asCom.getChild('n2').text = LocalStorage.getItem(LocalStorageKey.item3).toString();
		this._topBar2.getChild('n10').asCom.getChild('n2').text = LocalStorage.getItem(LocalStorageKey.item4).toString();
		this._topBar2.getChild('n11').asCom.getChild('n2').text = LocalStorage.getItem(LocalStorageKey.item2).toString();
		this._topBar2.getChild('n12').asCom.getChild('n2').text = LocalStorage.getItem(LocalStorageKey.item3).toString();
	}

	/**
	 * 所有的星星随机变换下位置
	 */
	private _transposeStar(): void {
		if (this._status == PLAY_STATUS.changingStarType) {
			ChangeTypePanel.instance.close();
		} else if (this._status == PLAY_STATUS.removingStar) {
			if (this._willBeRemovedStar) {
				this._willBeRemovedStar.isSelected = false;
				this._willBeRemovedStar.stop();
				this._willBeRemovedStar = null;
			}
		}
		this._status = PLAY_STATUS.normal;

		let costDollar = false;
		const itemCount: number = LocalStorage.getItem(LocalStorageKey.item3);
		if (itemCount < 1) {
			let dollar: number = LocalStorage.getItem(LocalStorageKey.dollar);
			if (dollar > 6) {
				LocalStorage.setItem(LocalStorageKey.dollar, dollar - 6);
				LocalStorage.saveToLocal();
				this.updateDollar();
				costDollar = true;
			} else {
				// 道具数量不够，钱也不够
				BuyItemPanel.instance.show();
				return;
			}
		}
		if (!costDollar) {
			LocalStorage.setItem(LocalStorageKey.item3, itemCount - 1);
			LocalStorage.saveToLocal();
			this._topBar1.getChild('n12').asCom.getChild('n2').text = (itemCount - 1).toString();
			this._topBar2.getChild('n12').asCom.getChild('n2').text = (itemCount - 1).toString();
		}

		// 播放个动画
		const animation = Main.createComponent('魔法棒动画', 640, 640);
		animation.x = (Main.stageWidth - 640) >> 1;
		animation.y = (Main.stageHeight - 640) >> 1;
		fairygui.GRoot.inst.addChild(animation);
		animation.getTransition('t0').play(() => {
			animation.removeFromParent();
			animation.dispose();
		});

		const starDataArr = this._starDataArr;
		// 需要变换的位置
		const oldPositionArr: { row: number, col: number, val: number }[] = [];
		const tempPositionArr: { row: number, col: number }[] = [];
		let val = 0;
		for (let row = 0; row < 10; row++) {
			for (let col = 0; col < 10; col++) {
				val = starDataArr[row][col];
				if (val > -1) {
					oldPositionArr.push({ row, col, val });
					tempPositionArr.push({ row, col });
				}
			}
		}
		// 从旧的位置中依次取出位置信息，从临时的位置数组中随机取出一个位置，用取出的位置替换掉从旧位置中取出的位置
		const newPositionArr: { row: number, col: number, val: number }[] = [];
		let position: { row: number, col: number, val: number } = null;
		let tempPosition: { row: number, col: number } = null;
		for (let i = 0; i < oldPositionArr.length; i++) {
			position = oldPositionArr[i];
			tempPosition = tempPositionArr.splice(Math.floor(Math.random() * tempPositionArr.length), 1)[0];
			newPositionArr[i] = { row: tempPosition.row, col: tempPosition.col, val: position.val };
			// 替换完成后修改starDataArr的数据
			starDataArr[tempPosition.row][tempPosition.col] = position.val;
		}

		// 再移动星星
		for (let i = 0; i < oldPositionArr.length; i++) {
			position = oldPositionArr[i];
			const newPosition = newPositionArr[i];
			const star = this._starArr[this._getStarIndex(position.row, position.col)];
			const newPoint = this._getStarPoint(newPosition.row, newPosition.col);
			egret.Tween.get(star).wait(500).to({ x: newPoint.x, y: newPoint.y }, 500).call(() => {
				star.row = newPosition.row;
				star.col = newPosition.col;
			});
		}
	}

	private _onTimer(): void {
		if (--this._leftSecond < 0) {
			this._leftSecond = 0;
			// 时间到
			this._timer.stop();
		}
		this._topBar2.getChild('n17').text = this._leftSecond.toString();
	}

	static get instance(): PlayScene {
		if (!PlayScene._instance) {
			PlayScene._instance = new PlayScene();
		}
		return PlayScene._instance;
	}
}