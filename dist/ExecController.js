"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child = __importStar(require("child_process"));
var ScrcpySettings_1 = __importDefault(require("./ScrcpySettings"));
// 外部アプリを管理するContorllerクラス
var ExecController = /** @class */ (function () {
    // コンストラクタ
    function ExecController() {
        this.settings = new ScrcpySettings_1.default();
        this.childProcess = null;
        this.isMirroring = false;
        this.listener = null;
    }
    // イベントリスナーを設定する
    ExecController.prototype.setEventListener = function (listener) {
        this.listener = listener;
    };
    // インスタンスを取得する
    ExecController.getInstance = function () {
        if (!this.instance) { // インスタンスが存在しないとき
            this.instance = new ExecController();
        }
        return this.instance;
    };
    // ミラーリングを開始する
    ExecController.prototype.startMirroring = function () {
        var args = this.settings.toArgs();
        this.executeScrcpy(args);
    };
    // ミラーリングを停止する
    ExecController.prototype.stopMirroring = function () {
        if (this.childProcess) { // 子プロセスがあるとき
            var args = ["/im", "scrcpy.exe"];
            child.spawn("taskkill", args);
        }
    };
    // 最大サイズを設定する
    ExecController.prototype.setMaxSize = function (maxSize) {
        this.settings.maxSize = maxSize;
    };
    // Fpsを設定する
    ExecController.prototype.setFps = function (fps) {
        this.settings.fps = fps;
    };
    // ウィンドウもボーダーが必要かどうかを設定する
    ExecController.prototype.setNeedBorder = function (b) {
        this.settings.needBorder = b;
    };
    // ウィンドウのタイトルを設定する
    ExecController.prototype.setWindowTitle = function (title) {
        this.settings.windowTitle = title;
    };
    // キャプチャが必要かどうかを設定する
    ExecController.prototype.setNeedCapture = function (b) {
        this.settings.needCapture = b;
    };
    // 保存先のフォルダを選択する
    ExecController.prototype.setCapturePath = function (path) {
        this.settings.capturePath = path;
    };
    // フルスクリーンか設定する
    ExecController.prototype.setIsFullScreen = function (b) {
        this.settings.isFullScreen = b;
    };
    // cropするか設定する
    ExecController.prototype.setIsCrop = function (b) {
        this.settings.isCrop = b;
    };
    // 左をcropするか設定する
    ExecController.prototype.setIsLeftCrop = function (b) {
        this.settings.isLeftCrop = b;
    };
    // ミラーリング中か
    ExecController.prototype.getIsMirroring = function () {
        return this.isMirroring;
    };
    // デバイスが接続されているか
    ExecController.prototype.isDeviceConnected = function (successCallback, failerCallback) {
        var path = __dirname;
        var cmd = '/scrcpy/adb.exe';
        var cp = child.spawn(path + cmd, ["devices", "-l"]);
        cp.stdout.setEncoding('utf-8');
        cp.stdout.on('data', function (data) {
            var consoleOut = String(data);
            if (consoleOut.indexOf("Quest") < 0) { // 接続されていなかったとき
                failerCallback();
                var args = ["/im", "adb.exe"];
                child.spawn("taskkill", args);
            }
            else {
                successCallback();
            }
        });
    };
    // scrcpyを実行する
    ExecController.prototype.executeScrcpy = function (args) {
        if (this.listener) { // リスナーが設定されているとき
            this.isDeviceConnected(this.startScrcpy.bind(this, args), this.listener.onDeviceDisconected);
        }
        else { // 異常系
            console.error("[ExecController] listener is null.");
        }
    };
    // scrcpyを起動する
    ExecController.prototype.startScrcpy = function (args) {
        var _this = this;
        var path = __dirname;
        var cmd = '/scrcpy/scrcpy.exe';
        this.childProcess = child.spawn(path + cmd, args);
        this.isMirroring = true;
        // closeしたとき
        this.childProcess.on('close', function (code) {
            var _a;
            if (_this.isMirroring) { //  scrcpyを直接閉じたとき
                _this.isMirroring = false;
                (_a = _this.listener) === null || _a === void 0 ? void 0 : _a.onEndMirroring();
            }
        });
    };
    return ExecController;
}());
exports.default = ExecController;
