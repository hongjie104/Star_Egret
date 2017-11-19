
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/res/res.js",
	"libs/modules/tween/tween.js",
	"libs/fairygui/fairygui.js",
	"libs/particle/particle.js",
	"polyfill/promise.js",
	"libs/rawinflate/rawinflate.min.js",
	"bin-debug/panel/BasePanel.js",
	"bin-debug/screen/BaseScreen.js",
	"bin-debug/panel/NewFishPanel.js",
	"bin-debug/Main.js",
	"bin-debug/Net.js",
	"bin-debug/panel/AboutPanel.js",
	"bin-debug/panel/ActivityPanel.js",
	"bin-debug/panel/AwardPanel.js",
	"bin-debug/API.js",
	"bin-debug/panel/BuyItemPanel.js",
	"bin-debug/panel/ChangeNamePanel.js",
	"bin-debug/panel/ChangeTypePanel.js",
	"bin-debug/panel/FailPanel.js",
	"bin-debug/panel/FetchGiftPanel.js",
	"bin-debug/panel/LevelUpAwardPanel.js",
	"bin-debug/panel/LiuXingPanel.js",
	"bin-debug/panel/LiuXingResultPanel.js",
	"bin-debug/panel/LoginAwardPanel.js",
	"bin-debug/panel/LvPanel.js",
	"bin-debug/Util.js",
	"bin-debug/panel/PayPanel.js",
	"bin-debug/panel/PeckOfGiftsPanel.js",
	"bin-debug/panel/RankMonthPanel.js",
	"bin-debug/panel/RankPanel.js",
	"bin-debug/panel/RankWeekPanel.js",
	"bin-debug/panel/RedeemCodePanel.js",
	"bin-debug/panel/SettingPanel.js",
	"bin-debug/panel/ShopPanel.js",
	"bin-debug/panel/TipsPanel.js",
	"bin-debug/panel/WinPanel.js",
	"bin-debug/LocalStorage.js",
	"bin-debug/screen/level/LevelScene.js",
	"bin-debug/screen/level/LevelTree.js",
	"bin-debug/screen/main/MainScene.js",
	"bin-debug/screen/play/PlayScene.js",
	"bin-debug/screen/play/Star.js",
	"bin-debug/StarEvent.js",
	"bin-debug/LoadingUI.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    if(egret_native.featureEnable) {
        //控制一些优化方案是否开启
        var result = egret_native.featureEnable({
            
        });
    }
    egret_native.requireFiles();
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 30,
		scaleMode: "fixedWidth",
		contentWidth: 750,
		contentHeight: 1334,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel("/system/fonts/DroidSansFallback.ttf", 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};