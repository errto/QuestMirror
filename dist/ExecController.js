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
var StringUtil_1 = __importDefault(require("./StringUtil"));
// 外部アプリを管理するContorllerクラス
var ExecController = /** @class */ (function () {
    // コンストラクタ
    function ExecController() {
        this.settings = new ScrcpySettings_1.default();
        this.childProcess = null;
        this.isMirroring = false;
        this.listener = null;
        this.ip = "";
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
        var _this = this;
        if (this.settings.isWireless) {
            var args = this.settings.toArgs();
            this.executeScrcpy(args);
        }
        else {
            this.isDeviceConnected(function () {
                var args = _this.settings.toArgs();
                _this.executeScrcpy(args);
            }, function () {
                if (_this.listener) {
                    _this.listener.onDeviceDisconected();
                }
            });
        }
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
    // ワイアレス接続か
    ExecController.prototype.setIsWirealess = function (b) {
        this.settings.isWireless = b;
    };
    // デバイスが接続されているか
    ExecController.prototype.isDeviceConnected = function (successCallback, failerCallback) {
        var _this = this;
        var path = __dirname;
        var cmd = '/scrcpy/adb.exe';
        var cp = child.spawn(path + cmd, ["devices", "-l"]);
        var outStr = "";
        cp.stdout.setEncoding('utf-8');
        cp.stdout.on('data', function (data) {
            outStr = String(data);
        });
        cp.on("close", function () {
            var strLines = StringUtil_1.default.getLines(outStr);
            for (var i = 1; i < strLines.length; i++) {
                if (strLines[i].indexOf("Quest") > 0 && strLines[i].indexOf("192.168") < 0) {
                    var st = 0;
                    var ed = strLines[i].indexOf(" ");
                    _this.settings.deviceSerial = strLines[i].slice(st, ed);
                    console.log(_this.settings.deviceSerial);
                    successCallback();
                    return;
                }
            }
            var args = ["/im", "adb.exe"];
            child.spawn("taskkill", args);
            failerCallback();
        });
    };
    // ipアドレスを取得する
    ExecController.prototype.getIP = function (successCallback, failerCallback) {
        var _this = this;
        var path = __dirname;
        var cmd = '/scrcpy/adb.exe';
        var cp = child.spawn(path + cmd, ["-s", this.settings.deviceSerial, "shell",
            "dumpsys", "wifi"]);
        var outStr = "";
        cp.stdout.setEncoding('utf-8');
        cp.stdout.on('data', function (data) {
            outStr += String(data);
        });
        cp.on("close", function () {
            var strLines = StringUtil_1.default.getLines(outStr);
            for (var i = 0; i < strLines.length; i++) {
                if (strLines[i].indexOf("ip_address") >= 0) {
                    _this.ip = strLines[i].slice(11);
                    _this.settings.deviceIp = _this.ip;
                    successCallback();
                    return;
                }
            }
            failerCallback(); // 見つからなかったとき
        });
    };
    // TCP/IPで接続する
    ExecController.prototype.connectTCPIP = function (successCallback, failerCallback) {
        var _this = this;
        var path = __dirname;
        var cmd = '/scrcpy/adb.exe';
        var cp0 = child.spawn(path + cmd, ["-s", this.settings.deviceSerial, "tcpip", "5555"]);
        cp0.stdout.setEncoding('utf-8');
        cp0.on("close", function () {
            var cp1 = child.spawn(path + cmd, ["connect", _this.ip + ":5555"]);
            cp1.on("close", function () {
                successCallback();
            });
            cp1.on("error", function () {
                failerCallback();
            });
        });
    };
    // デバイスとの接続を切る
    ExecController.prototype.disconnect = function () {
        var path = __dirname;
        var cmd = '/scrcpy/adb.exe';
        child.spawn(path + cmd, ["disconnect"]);
    };
    // ワイアレス接続する 
    ExecController.prototype.connectWireless = function (successCallback, failerCallback) {
        var _this = this;
        this.isDeviceConnected(function () {
            _this.getIP(function () {
                _this.connectTCPIP(successCallback, failerCallback);
            }, function () {
                failerCallback();
            });
        }, function () {
            if (_this.listener) {
                _this.listener.onDeviceDisconected();
            }
        });
    };
    // ワイアレス接続を解除する
    ExecController.prototype.disconnectWireless = function () {
        this.settings.deviceIp = "";
    };
    // scrcpyを実行する
    ExecController.prototype.executeScrcpy = function (args) {
        this.startScrcpy(args);
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
