class Util {

	private static _expSet: number[] = [];

	private static _expAward: number[] = [];

	public constructor() {
	}

	static init(): void {
		// 初始化升级所需要的经验
		for (let i = 0; i < 999; i++) {
			Util._expSet[i] = 100 * (1 + i) * i / 2;
			Util._expAward[i] = ((i + 1) % 3) === 0 ? (i + 1) / 3 + 1 : 0;
		}
	}

	static getScore(numStar: number): number {
		return numStar < 1 ? 0 : numStar * numStar * 5;
	}

	static getTargetScore(level: number): number {
		return 1000 * (1 + level) * level / 2;
	}

	static getAwardSocre(numLeft: number): number {
		if (numLeft > 9) return 0;
		if (numLeft === 9) return 380;
		if (numLeft === 8) return 720;
		if (numLeft === 7) return 1020;
		if (numLeft === 6) return 1280;
		if (numLeft === 5) return 1500;
		if (numLeft === 4) return 1680;
		if (numLeft === 3) return 1820;
		if (numLeft === 2) return 1920;
		if (numLeft === 1) return 1980;
		if (numLeft === 0) return 2000;
	}

	static getAwardExp(numStar): number {
		if (numStar > 10) return Math.min(50, numStar << 1);
		return numStar + 2;
	}

	static getLv(exp?: number): number {
		exp = exp || LocalStorage.getItem(LocalStorageKey.exp);
		for (let i = 1; i < Util._expSet.length; i++) {
			if (exp < Util._expSet[i]) return i;
		}
		return 1;
	}

	static getExpProgress(): { max: number, val: number } {
		const exp: number = LocalStorage.getItem(LocalStorageKey.exp);
		for (let i = 1; i < Util._expSet.length; i++) {
			if (exp < Util._expSet[i]) return { max: Util._expSet[i] - Util._expSet[i - 1], val: exp - Util._expSet[i - 1] };
		}
		return null;
	}

	static checkAward(addExp: number): number {
		const exp: number = LocalStorage.getItem(LocalStorageKey.exp);
		LocalStorage.setItem(LocalStorageKey.exp, exp + addExp);
		LocalStorage.saveToLocal();

		const curLv = Util.getLv(exp);
		const newLv = Util.getLv(exp + addExp);
		if (curLv != newLv) {
			return Util._expAward[newLv];
		}
		return 0;
	}

	/**
		* 获取一个区间的随机数
		* @param from 最小值
		* @param end 最大值
		* @returns {number}
		*/
	public static getRandom(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}