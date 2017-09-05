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

	static getCurLvAndAward(): { lv: number, award: number } {
		const lv = Util.getLv();
		return {
			lv,
			award: Util._expAward[lv - 1]
		};
	}

	static getNextLvAndAward(): { lv: number, award: number } {
		const lv = Util.getLv();
		for (let i = 0; i < Util._expAward.length; i++) {
			if (i + 1 > lv) {
				if (Util._expAward[i] !== 0) {
					return { lv: i + 1, award: Util._expAward[i] };
				}
			}
		}
		return { lv: 0, award: 0 }
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
			return Util._expAward[newLv - 1];
		}
		return -1;
	}

	/**
		* 获取一个区间的随机数
		* @param from 最小值
		* @param end 最大值
		* @returns {number}
		*/
	static getRandom(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	static createWinAward(): [{ type: AWARD_TYPE, count: number }] {
		const r = Math.random();
		// 20里面四个人分
		// 7 6 4 2 1
		if (r <= .8) {
			return [{ type: AWARD_TYPE.dollar, count: 1 }, { type: AWARD_TYPE.dollar, count: 5 }, { type: AWARD_TYPE.dollar, count: 3 }, { type: AWARD_TYPE.diamonds, count: 1 }];
		} else if (r <= .8 + .07) {
			return [{ type: AWARD_TYPE.dollar, count: 2 }, { type: AWARD_TYPE.dollar, count: 1 }, { type: AWARD_TYPE.diamonds, count: 1 }, { type: AWARD_TYPE.dollar, count: 5 }];
		} else if (r <= .8 + .07 + .06) {
			return [{ type: AWARD_TYPE.dollar, count: 3 }, { type: AWARD_TYPE.dollar, count: 4 }, { type: AWARD_TYPE.diamonds, count: 1 }, { type: AWARD_TYPE.dollar, count: 5 }];
		} else if (r <= .8 + .07 + .06 + .04) {
			return [{ type: AWARD_TYPE.dollar, count: 4 }, { type: AWARD_TYPE.diamonds, count: 1 }, { type: AWARD_TYPE.dollar, count: 5 }, { type: AWARD_TYPE.dollar, count: 3 }];
		} else if (r <= .8 + .07 + .06 + .04 + .02) {
			return [{ type: AWARD_TYPE.dollar, count: 5 }, { type: AWARD_TYPE.diamonds, count: 1 }, { type: AWARD_TYPE.dollar, count: 3 }, { type: AWARD_TYPE.dollar, count: 4 }];
		} else {
			return [{ type: AWARD_TYPE.diamonds, count: 1 }, { type: AWARD_TYPE.dollar, count: 5 }, { type: AWARD_TYPE.dollar, count: 2 }, { type: AWARD_TYPE.dollar, count: 4 }];
		}
	}

	/**
	 * 流星模式下
	 * 消除了一些星星，看看奖励多少时间
	 */
	static getAwardSecond(numStar: number): number {
		if (numStar >= 20) return 16;
		if (numStar >= 14) return 10;
		if (numStar >= 11) return 6;
		if (numStar >= 8) return 3;
		if (numStar >= 6) return 1;
		return 0;
	}

	/**
	 * 通关大礼包
	 */
	static getAwardGift(): [{ type: AWARD_TYPE, count: number }] {
		// 第一个道具显示50金币，第二个显示5钻石，第三个显示40金币，第四个显示30金币
		return [
			{ type: AWARD_TYPE.dollar, count: 50 },
			{ type: AWARD_TYPE.diamonds, count: 5 },
			{ type: AWARD_TYPE.dollar, count: 40 },
			{ type: AWARD_TYPE.dollar, count: 30 }
		];
	}

	static getLiuXingRank(score: number): { rank: number, dollar: number } {
		if (score < 10000) return { rank: 0, dollar: 0 };
		if (score < 15000) return { rank: 1, dollar: 1 };
		if (score < 25000) return { rank: 2, dollar: 2 };
		if (score < 35000) return { rank: 3, dollar: 3 };
		if (score < 45000) return { rank: 4, dollar: 4 };
		if (score < 55000) return { rank: 5, dollar: 5 };
		if (score < 65000) return { rank: 6, dollar: 6 };
		if (score < 75000) return { rank: 7, dollar: 7 };
		if (score < 85000) return { rank: 8, dollar: 8 };
		if (score < 95000) return { rank: 9, dollar: 9 };
		if (score < 105000) return { rank: 10, dollar: 10 };
		return { rank: 11, dollar: 11 };
	}

	static getLeftDaysInMonth(nowDate) {
		const now = nowDate.getDate();
		let year = nowDate.getYear();
		if (year < 2000) year += 1900;
		const month = nowDate.getMonth();
		const monarr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
			monarr[1] = 29;
		}
		return monarr[month] - now;
	}

	/**
	* 获取某年的某天是第几周
	*/
	static getWeekIndex(nowDate) {
		let year = nowDate.getFullYear(),
			month = nowDate.getMonth(),
			days = nowDate.getDate();
		//那一天是那一年中的第多少天
		for (let i = 0; i < month; i++) {
			days += Util.getMonthDays(year, i);
		}

		//那一年第一天是星期几
		let yearFirstDay = new Date(year, 0, 1).getDay() || 7;

		let week = null;
		if (yearFirstDay == 1) {
			week = Math.ceil(days / yearFirstDay);
		} else {
			days -= (7 - yearFirstDay + 1);
			week = Math.ceil(days / 7) + 1;
		}

		return week;
	}

	static getMonthDays(year, month) {
		return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (Util.isLeapYear(year) ? 29 : 28);
	}

	static isLeapYear(year) {
		return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
	}

	static playSound(soundName: string, loops: number = 1): void {
		const sound: egret.Sound = RES.getRes(soundName);
		sound.play(0, loops);
	}
}