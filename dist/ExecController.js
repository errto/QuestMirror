"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var OAL_1 = __importDefault(require("./OAL"));
var ScrcpySettings_1 = __importDefault(require("./ScrcpySettings"));
// 外部アプリを管理するContorllerクラス
var ExecController = /** @class */ (function () {
    // コンストラクタ
    function ExecController() {
        this.settings = new ScrcpySettings_1.default();
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
        OAL_1.default.getInstance().exitSrccpy();
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
    ExecController.prototype.isDeviceConnected = function (successCallback, failedCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, OAL_1.default.getInstance().isDeviceConnected()];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            this.settings.deviceSerial = result;
                            successCallback();
                        }
                        else {
                            failedCallback();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // ipアドレスを取得する
    ExecController.prototype.getIP = function (successCallback, failedCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var ip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, OAL_1.default.getInstance().getIP(this.settings.deviceSerial)];
                    case 1:
                        ip = _a.sent();
                        if (ip) {
                            this.settings.deviceIp = ip;
                            successCallback();
                        }
                        else {
                            failedCallback();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // TCP/IPで接続する
    ExecController.prototype.connectTCPIP = function (successCallback, failedCallback) {
        OAL_1.default.getInstance().connectTCPIP(this.settings.deviceSerial, this.settings.deviceIp, successCallback, failedCallback);
    };
    // デバイスとの接続を切る
    ExecController.prototype.disconnect = function () {
        OAL_1.default.getInstance().discconct();
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
        var _this = this;
        this.isMirroring = true;
        OAL_1.default.getInstance().launchSrccpy(args, function () {
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
