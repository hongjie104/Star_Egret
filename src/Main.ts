class Main extends egret.DisplayObjectContainer {

    static stageWidth = 0;

    static stageHeight = 0;

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        LocalStorage.init();

        fairygui.UIPackage.addPackage("Package1");
        this.stage.addChild(fairygui.GRoot.inst.displayObject);
        Main.stageWidth = this.stage.stageWidth;
        Main.stageHeight = this.stage.stageHeight;

        const mainScene = MainScene.instance;
        mainScene.addEventListener(StarEvent.ENTER_LEVEL_SCREEN, this._onEnterLevelScreen, this);
        mainScene.addEventListener(StarEvent.SHOW_REDEEM_CODE, this._onShowRedeemCode, this);
        mainScene.addEventListener(StarEvent.SHOW_ACTIVITY, this._onShowActivity, this);
        mainScene.addEventListener(StarEvent.SHOW_SETTING, this._onShowSetting, this);
        this.addChild(mainScene);
    }

    private _onEnterLevelScreen(evt: StarEvent): void {
        const mainScene = MainScene.instance;
        if (mainScene.parent == this) {
            this.removeChild(mainScene);
        }
        const levelScene = LevelScene.instance;
        this.addChild(levelScene);
        levelScene.addEventListener(StarEvent.ENTER_LEVEL, this._onEnterLevel, this);
    }

    private _onShowRedeemCode(): void {
        RedeemCodePanel.instance.show();
    }

    private _onShowActivity(): void {
        ActivityPanel.instance.show();
    }

    private _onShowSetting(): void {
        SettingPanel.instance.ui.getChild('n0').asCom.getController('c1').selectedIndex = 0;
        SettingPanel.instance.show();
    }

    private _onEnterLevel(evt: StarEvent): void {
        const levelSelector = Main.createPanel('选关弹窗1');
        levelSelector.x = (Main.stageWidth - levelSelector.initWidth) >> 1;
        levelSelector.y = (Main.stageHeight - levelSelector.initHeight) >> 1;
        const uiPanel = levelSelector.getChild('n0').asCom;
        // 本关的最高分
        const levelScore = LocalStorage.getItem(LocalStorageKey.levelScore) as Array<number>;
        uiPanel.getChild('n9').text = evt.level > levelScore.length ? '0' : levelScore[evt.level - 1].toString();
        uiPanel.getChild('n12').text = evt.level.toString();
        uiPanel.getChild('n4').addClickListener(this._onLevelSelectorCancel, this);
        uiPanel.getChild('n5').addClickListener(this._onLevelSelectorOK, this);

        levelSelector.getController('c1').selectedIndex = 1;
        levelSelector.getTransition('t0').play();
        fairygui.GRoot.inst.addChild(levelSelector);
    }

    private _onLevelSelectorCancel(evt: egret.TouchEvent, cb?: Function): void {
        const levelSelector = (evt.currentTarget as fairygui.GButton).parent.parent;
        const uiPanel = levelSelector.getChild('n0').asCom;
        uiPanel.getChild('n4').removeClickListener(this._onLevelSelectorCancel, this);
        uiPanel.getChild('n5').removeClickListener(this._onLevelSelectorOK, this);
        levelSelector.getTransition('t2').play(() => {
            levelSelector.removeFromParent();
            levelSelector.dispose();
            if (cb) cb.call(this);
        }, this);
    }

    private _onLevelSelectorOK(evt: egret.TouchEvent): void {
        this._onLevelSelectorCancel(evt, () => {
            const levelScene = LevelScene.instance;
            if (levelScene.parent) {
                levelScene.parent.removeChild(levelScene);
            }
            const playScene = PlayScene.instance;
            this.addChild(playScene);
        });
    }

    static createPanel(panelName: string): fairygui.GComponent {
        const p: fairygui.GComponent = fairygui.UIPackage.createObject("Package1", panelName).asCom;
        const stage = egret.Stage;
        p.viewWidth = Main.stageWidth;
        p.viewHeight = Main.stageHeight;
        return p;
    }

    static createComponent(name: string, w?: number, h?: number): fairygui.GComponent {
        const p = fairygui.UIPackage.createObject("Package1", name).asCom;
        if (w) {
            p.viewWidth = w;
        }
        if (h) {
            p.viewHeight = h;
        }
        return p;
    }

    static createComponentFromURL(url: string): fairygui.GComponent {
        return fairygui.UIPackage.createObjectFromURL(url).asCom;
    }
}