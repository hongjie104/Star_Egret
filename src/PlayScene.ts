class PlayScene extends egret.DisplayObjectContainer {

	private static _instance: PlayScene = null;

	private _playPanel: fairygui.GComponent = null;

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

	private _starArr: fairygui.GComponent[] = [];

	public constructor() {
		super();

		this._playPanel = Main.createPanel('Game');
		fairygui.GRoot.inst.addChild(this._playPanel);

		// 初始化星星
		let random = 0, actionDelay = 0;
		for (let col = 0; col < 10; col++) {
			actionDelay = 10 * col;
			for (let row = 9; row > -1; row--) {
				actionDelay += 20

				random = Math.floor(Math.random() * 5);
				this._starDataArr[row][col] = random;
				let star: fairygui.GComponent = Main.createComponent(`star${random + 1}`);
				star.addClickListener(this._onStarClicked, this);
				star.data = { row, col };
				this._starArr.push(star);
				let p: egret.Point = this.getStarPoint(row, col);
				star.x = p.x;
				star.y = p.y - Main.stageHeight;
				this._playPanel.addChild(star);
				egret.Tween.get(star).wait(actionDelay).to({ y: p.y }, 200);
			}
		}
	}

	private _onStarClicked(evt: egret.TouchEvent): void {
		if (!this._isActionRunning) {
			// this._isActionRunning = true;

			const col = Math.floor(evt.stageX / 75);
			const row = Math.floor((evt.stageY - (Main.stageHeight - 75 * 10)) / 75);
			const result = this._findSameStarIndex(row, col);
			if (result.length > 1) {
				const starDataArr = this._starDataArr;
				let rowAndCol: { row: number, col: number };
				let removedStar: fairygui.GComponent = null;
				for (let i = 0; i < result.length; i++) {
					rowAndCol = result[i];
					let starIndex = this._getStarIndex(rowAndCol.row, rowAndCol.col);
					// this._starArr.splice(starIndex, 1)[0].destroy();
					removedStar = this._starArr.splice(starIndex, 1)[0];
					removedStar.removeFromParent();
					removedStar.dispose();
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
						const p: egret.Point = this.getStarPoint(moveData.toRow, moveData.toCol);
						egret.Tween.get(star).to({ y: p.y, x: p.x }, 200).call(() => {
							star.data = {
								// attr({ row: moveData.toRow, col: moveData.toCol });
								row: moveData.toRow,
								col: moveData.toCol
							};
							if (--actionCount == 0) {
								this._isActionRunning = false;
							}
						});
					}
				} else {
					this._isActionRunning = false;
				}
			} else {
				this._isActionRunning = false;
			}
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
		let star: fairygui.GComponent = null;
		for (let i = 0; i < this._starArr.length; i++) {
			star = this._starArr[i];
			if (star.data['row'] == row && star.data['col'] == col) {
				return i;
			}
		}
		return -1;
	}

	getStarPoint(row: number, col: number): egret.Point {
		// 一个star的宽度和高度都是75
		const w = 75;
		const h = 75;
		const zeroX = 0;
		const zeroY = Main.stageHeight - 10 * h;
		let x = zeroX + col * w;
		let y = zeroY + row * h;
		return new egret.Point(x, y);
	}

	static get instance(): PlayScene {
		if (!PlayScene._instance) {
			PlayScene._instance = new PlayScene();
		}
		return PlayScene._instance;
	}
}