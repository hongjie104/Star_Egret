class Util {
	public constructor() {
	}

	static getScore(numStar: number): number {
		if (numStar == 2) return 20;
		if (numStar == 3) return 45;
		let r = 0;
		for (let i = 2; i < numStar + 1; i++) {
			r += Util.getScoreGain(i);
		}
		return r - 10;
	}

	private static getScoreGain(numStar: number): number {
		if (numStar == 2) return 20;
		if (numStar == 3) return 25;
		if (numStar == 4) return 45;
		return (numStar - 1) * 10 + 5;
	}

	static getTargetScore(level: number): number {
		if (level == 1) return 1000;
		if (level == 2) return 3500;
		if (level == 3) return 6000;
		if (level == 4) return 10000;
		if (level == 5) return 12000;
		if (level == 6) return 15000;
		if (level == 7) return 30000;
		if (level == 8) return 36000;
		let r = 36000;
		for (let i = 9; i < level + 1; i++) {
			r += Util.getTargetScoreGain(i);
		}
		return r;
	}

	private static getTargetScoreGain(level: number): number {
		if (level < 9) return 0;
		return (level - 8) * 1000 + 8000;
	}
}