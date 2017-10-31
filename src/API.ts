module API {

    const HOST = 'http://103.55.27.4:3000';
    // const HOST = 'http://127.0.0.1:3000';

    /**
     * 显示用户ID（主键），注册时间，最后登录时间，最高分数，最高关卡数，当前金币数量，钻石数量，道具数量，总充值金额
     */
    export function login(): string {
        // const maxTotalScore: number = LocalStorage.getItem(LocalStorageKey.maxTotalScore);
        // const maxLevel: number = LocalStorage.getItem(LocalStorageKey.maxLevel);
        // const dollar: number = LocalStorage.getItem(LocalStorageKey.dollar);
        // const diamonds: number = LocalStorage.getItem(LocalStorageKey.diamonds);
        // const numItem1: number = LocalStorage.getItem(LocalStorageKey.item1);
        // const numItem2: number = LocalStorage.getItem(LocalStorageKey.item2);
        // const numItem3: number = LocalStorage.getItem(LocalStorageKey.item3);
        // const numItem4: number = LocalStorage.getItem(LocalStorageKey.item4);
        return `${HOST}/users/login/${TDGA.getDeviceId()}/${egret.Capabilities.runtimeType}`;
    }

    export function levelWin(level: number, startTimer: number, endTimer: number, startNumItem1: number, startNumItem2: number, startNumItem3: number, startNumItem4: number, endNumItem1: number, endNumItem2: number, endNumItem3: number, endNumItem4: number, startDollar: number, endDollar: number, endDiamonds:number): string {
        // 可查看指定用户的关卡详细记录，包含关卡数，关卡打开时间，打开时的道具数量，金币数量, 关卡通过时间，关卡奖励，通关时道具数量，金币数量
        return `${HOST}/users/levelWin/${TDGA.getDeviceId()}/${level}/${startTimer}/${endTimer}/${startNumItem1}/${startNumItem2}/${startNumItem3}/${startNumItem4}/${endNumItem1}/${endNumItem2}/${endNumItem3}/${endNumItem4}/${startDollar}/${endDollar}/${endDiamonds}`;
    }
}