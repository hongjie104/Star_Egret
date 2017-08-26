declare class TDGA {

    static getDeviceId(): string;

    static onPageLevel(): void;

    /**
     * @param params
     * accountId String 设定帐户唯一标识，用于区分一个玩家。最多64个字符。其他调用依赖于此ID。多台设备中传一样的accountId，分析时为一个玩家；一台设备传多个accountId，数据计算为多个不同的玩家；如果没有玩家账户，或期望以设备为单位标识玩家，则调用时传入TDGA.getDeviceId() 即可。
     * accountType Int 传入帐户的类型，不同数字对应不同的类型： 0，匿名账户；
     * accountName String 在帐户有显性名时，可用于设定帐户名，最多支持64个字符。如：昵称，邮箱名
     * level Int 设定玩家当前的级别，未设定过等级的玩家默认的初始等级为“1”，支持的最大级别为1000。等级发生变化时请尽快调用。每次玩家登录或换区服时，游戏通常会同步玩家资料，同步完成时需调用setLevel，可使等级数据更精准；
     * gender Int 设定玩家性别，不同数字对应不同的性别： 1，男；2，女；
     * age Int 设定玩家年龄，范围为0-120。
     * gameServer String 传入玩家登入的区服，最多16个字符。在玩家选择了区服后进行调用。
     */
    static Account(params: Object): void;

    /**
     * 充值请求
     * @example
     * <pre>
     *   TDGA.onChargeRequest({
     *      orderId: 'account123-0923173248-11'
     *      , iapId: '大号宝箱'
     *      , currencyAmount: '100'
     *      , currencyType: 'CNY'
     *      , virtualCurrencyAmount: 1000
     *      , paymentType: 'AliPay'
     *    });
     * </pre>
     */
    static onChargeRequest(params: Object): void;

    /**
     * 充值成功
     * @example
     * <pre>
     *  TDGA.onChargeSuccess({
     *      orderId: 'account123-0923173248-11'
     *      , iapId: '大号宝箱'
     *      , currencyAmount: '100'
     *     , currencyType: 'CNY'
     *      , virtualCurrencyAmount: 1000
     *       , paymentType: 'AliPay'
     *   });
     * </pre>
     */
    static onChargeSuccess(params: Object): void;

    /**
     * 接受任务
     */
    static onMissionBegin(missionId: string);

    /**
     * 完成任务
     */
    static onMissionCompleted(missionId: string);

    /**
     * 任务失败
     */
    static onMissionFailed(missionId: string, cause: string);

    static onEvent(eventId: string, eventData: Object);

}