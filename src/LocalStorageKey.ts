
enum LocalStorageKey {
    curLevel, totalScore
}

class LocalStorage {

    public static localStorageData: Array<any>;

    private static _isInited = false;

    static init() {
        if (!LocalStorage._isInited) {
            const s = egret.localStorage.getItem('star');
            if (!s) {
                LocalStorage.localStorageData = [0, 0];
            } else {
                LocalStorage.localStorageData = JSON.parse(s);
            }
        }
    }

    static getItem(key: LocalStorageKey): any {
        return LocalStorage.localStorageData[key];
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