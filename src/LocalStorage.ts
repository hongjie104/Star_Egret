
enum LocalStorageKey {
    lastLevel, totalScore, levelScore, touchType, soundEnabled, dollar, exp, maxTotalScore, item1, item2, item3, lastFetchLoginAwardTime, fetchLoginAwardCount, diamonds, item4, liuXingMax, userName, lastFailedLevel, weekRankRecord, weekRank, weekScore, monthRankRecord, monthRank, monthScore
}

class LocalStorage {

    public static localStorageData: Array<any>;

    private static _isInited = false;

    static init() {
        if (!LocalStorage._isInited) {
            const s = egret.localStorage.getItem('star');
            if (!s) {
                LocalStorage.localStorageData = [0, 0, [], 1, true, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0];
            } else {
                LocalStorage.localStorageData = JSON.parse(s);
            }
        }
    }

    static getItem(key: LocalStorageKey): any {
        return LocalStorage.localStorageData[key] || 0;
    }

    static setItem(key: LocalStorageKey, val: any): void {
        LocalStorage.localStorageData[key] = val;
    }

    static saveToLocal(): void {
        egret.localStorage.setItem('star', JSON.stringify(LocalStorage.localStorageData));
    }

    static clear(): void {
        egret.localStorage.removeItem('star');
    }

}