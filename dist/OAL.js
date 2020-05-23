"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var child = __importStar(require("child_process"));
var extract_zip_1 = __importDefault(require("extract-zip"));
var fs_1 = __importDefault(require("fs"));
var https_1 = __importDefault(require("https"));
var util_1 = require("util");
var Package_1 = __importDefault(require("./Package"));
var StringUtil_1 = __importDefault(require("./StringUtil"));
var execFile = util_1.promisify(child.execFile);
// OS抽象化レイヤー
var OAL = /** @class */ (function () {
    // コンストラクタ
    function OAL() {
    }
    // インスタンスを取得する
    OAL.getInstance = function () {
        if (!this.instance) { // インスタンスが存在しないとき
            this.instance = new OAL();
        }
        return this.instance;
    };
    // Macか
    OAL.prototype.isMac = function () {
        console.log("OAL.isMac() process.platform:" + process.platform);
        return process.platform == "darwin";
    };
    // パッケージをチェックする
    OAL.prototype.checkPackages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var packages, res0, res1, res2, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        packages = [];
                        if (!this.isMac()) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.checkHomebrew()];
                    case 1:
                        res0 = _a.sent();
                        if (res0) {
                            packages.push(res0);
                        }
                        return [4 /*yield*/, this.checkScrcpy()];
                    case 2:
                        res1 = _a.sent();
                        if (res1) {
                            packages.push(res1);
                        }
                        return [4 /*yield*/, this.checkAdb()];
                    case 3:
                        res2 = _a.sent();
                        if (res2) {
                            packages.push(res2);
                        }
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.checkScrcpy()];
                    case 5:
                        res = _a.sent();
                        if (res) {
                            packages.push(res);
                        }
                        _a.label = 6;
                    case 6: return [2 /*return*/, packages];
                }
            });
        });
    };
    // パッケージをダウンロードする
    OAL.prototype.downloadPackages = function (packages, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var i, p, url, path;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isMac()) return [3 /*break*/, 11];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < packages.length)) return [3 /*break*/, 10];
                        p = packages[i];
                        if (!(p.getName() == "homebrew")) return [3 /*break*/, 3];
                        return [4 /*yield*/, execFile("curl", ["-fsSL", "https://raw.githubusercontent.com/Homebrew/install/master/install.sh"])];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!(p.getName() == "adb")) return [3 /*break*/, 7];
                        return [4 /*yield*/, execFile("brew", ["cask", "install", "android-platform-tools"])];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, execFile("export", ["PATH=$PATH:/usr/local/share/android-sdk/platform-tools"])];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, execFile("source", [".bash_profile"])];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        if (!(p.getName() == "scrcpy")) return [3 /*break*/, 9];
                        return [4 /*yield*/, execFile("brew", ["install", "scrcpy"])];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        i++;
                        return [3 /*break*/, 1];
                    case 10:
                        callback();
                        return [3 /*break*/, 12];
                    case 11:
                        url = "https://github.com/Genymobile/scrcpy/releases/download/v1.13/scrcpy-win64-v1.13.zip";
                        path = __dirname + "\\scrcpy.zip";
                        this.requestHttps(url, path, function () {
                            var dstpath = __dirname + "\\scrcpy";
                            var srcpath = __dirname + "\\scrcpy.zip";
                            _this.unzipFile(srcpath, dstpath);
                            callback();
                        });
                        _a.label = 12;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    // デバイスの接続を確認する
    OAL.prototype.isDeviceConnected = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, cmd, result, serail, args;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!OAL.getInstance().isMac()) return [3 /*break*/, 2];
                        return [4 /*yield*/, execFile("adb", ["devices", "-l"])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.getDeviceSerial(result.stdout)];
                    case 2:
                        cmd = __dirname + '/scrcpy/adb.exe';
                        return [4 /*yield*/, execFile(cmd, ["devices", "-l"])];
                    case 3:
                        result = _a.sent();
                        serail = this.getDeviceSerial(result.stdout);
                        if (!!serail) return [3 /*break*/, 5];
                        args = ["/im", "adb.exe"];
                        return [4 /*yield*/, execFile("taskkill", args)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, serail];
                    case 5: return [2 /*return*/, serail];
                }
            });
        });
    };
    // scrcpyを起動する
    OAL.prototype.launchSrccpy = function (args, closeCallback) {
        var cmd = "";
        if (this.isMac()) {
            cmd = "scrcpy";
        }
        else {
            cmd = __dirname + '/scrcpy/scrcpy.exe';
        }
        var cp = child.spawn(cmd, args);
        cp.on('close', function () { return closeCallback(); });
    };
    // scrcpyを終了する
    OAL.prototype.exitSrccpy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pid, args;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isMac()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getPID()];
                    case 1:
                        pid = _a.sent();
                        if (pid) {
                            execFile("kill", [pid]);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        args = ["/im", "scrcpy.exe"];
                        execFile("taskkill", args);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // デバイスのIPを取得する
    OAL.prototype.getIP = function (deviceSerial) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, result, strLines, i, ip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "";
                        if (this.isMac()) {
                            cmd = "adb";
                        }
                        else {
                            cmd = __dirname + '/scrcpy/adb.exe';
                        }
                        return [4 /*yield*/, execFile(cmd, ["-s", deviceSerial, "shell", "dumpsys", "wifi"])];
                    case 1:
                        result = _a.sent();
                        strLines = StringUtil_1.default.getLines(result.stdout);
                        console.log(strLines);
                        for (i = 0; i < strLines.length; i++) {
                            if (strLines[i].indexOf("ip_address") >= 0) {
                                ip = strLines[i].slice(11);
                                console.log(ip);
                                return [2 /*return*/, ip];
                            }
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    // TCPIPで接続する
    OAL.prototype.connectTCPIP = function (deviceSerial, ip, successCallback, failedCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var cmd, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = "";
                        if (this.isMac()) {
                            cmd = "adb";
                        }
                        else {
                            cmd = __dirname + '/scrcpy/adb.exe';
                        }
                        return [4 /*yield*/, execFile(cmd, ["-s", deviceSerial, "tcpip", "5555"])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, execFile(cmd, ["connect", ip + ":5555"]).catch(function () {
                                failedCallback();
                                return null;
                            })];
                    case 2:
                        result = _a.sent();
                        if (result) {
                            successCallback();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // デバイスの接続を切る
    OAL.prototype.discconct = function () {
        var cmd = "";
        if (this.isMac()) {
            cmd = "adb";
        }
        else {
            cmd = __dirname + '/scrcpy/adb.exe';
        }
        execFile(cmd, ["disconnect"]);
    };
    // httpsリクエストを投げる
    OAL.prototype.requestHttps = function (url, savePath, callback) {
        var _this = this;
        var request = https_1.default.get(url, function (res) {
            var resMessage = res;
            if (resMessage.statusCode == 200) { // ダウンロードするとき
                var file = fs_1.default.createWriteStream(savePath);
                res.on('data', function (chunk) {
                    file.write(chunk);
                }).on('end', function () {
                    file.end();
                    if (callback) {
                        callback();
                    }
                });
            }
            else if (resMessage.statusCode == 302) { // リダイレクトするとき
                var redirectUrl = res.headers.location;
                _this.requestHttps(redirectUrl, savePath, callback);
            }
        });
    };
    // homebrewが起動するか
    OAL.prototype.checkHomebrew = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execFile("brew", ["-v"])];
                    case 1:
                        result = _a.sent();
                        if (result.stderr) { // エラーが発生したととき
                            return [2 /*return*/, new Package_1.default("homebrew", "https://brew.sh/")];
                        }
                        if (result.stdout.indexOf("command not found") >= 0) {
                            return [2 /*return*/, new Package_1.default("homebrew", "https://brew.sh/")];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // scrcpyが起動するか
    OAL.prototype.checkScrcpy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, path;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isMac()) return [3 /*break*/, 2];
                        console.log("OAL.checkSrccpy() mac");
                        return [4 /*yield*/, execFile("scrcpy", ["-v"]).catch(function (error) {
                                return new Package_1.default("scrcpy", "https://github.com/Genymobile/scrcpy");
                            })];
                    case 1:
                        result = _a.sent();
                        if (result instanceof Package_1.default) {
                            return [2 /*return*/, result];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        console.log("OAL.checkSrccpy() win");
                        path = __dirname + "\\scrcpy\\scrcpy.exe";
                        try {
                            fs_1.default.statSync(path);
                        }
                        catch (e) {
                            return [2 /*return*/, new Package_1.default("scrcpy", "https://github.com/Genymobile/scrcpy")];
                        }
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // adbが起動するか
    OAL.prototype.checkAdb = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("OAL.checkAdb() mac");
                        return [4 /*yield*/, execFile("adb", ["--version"]).catch(function (error) {
                                return new Package_1.default("adb", "https://developer.android.com/studio/command-line/adb?hl=en");
                            })];
                    case 1:
                        result = _a.sent();
                        if (result instanceof Package_1.default) {
                            return [2 /*return*/, result];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // zipファイルを解凍する
    OAL.prototype.unzipFile = function (srcPath, dstPath) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, extract_zip_1.default(srcPath, { dir: dstPath })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.error('Extraction failed.');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // デバイス番号を取得する
    OAL.prototype.getDeviceSerial = function (stdout) {
        var strLines = StringUtil_1.default.getLines(stdout);
        for (var i = 1; i < strLines.length; i++) {
            if (strLines[i].indexOf("Quest") > 0 && strLines[i].indexOf("192.168") < 0) {
                var st = 0;
                var ed = strLines[i].indexOf(" ");
                var deviceSerial = strLines[i].slice(st, ed);
                console.log(deviceSerial);
                return deviceSerial;
            }
        }
        return null;
    };
    // プロセスIDを取得する
    OAL.prototype.getPID = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, strLines, i, st, ed, pid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execFile("ps", ["aux"])];
                    case 1:
                        result = _a.sent();
                        strLines = StringUtil_1.default.getLines(result.stdout);
                        for (i = 0; i < strLines.length; i++) {
                            console.log(strLines[i]);
                            if (strLines[i].indexOf("scrcpy -s") > 0) {
                                st = strLines[i].indexOf(" ");
                                console.log("OAL.getPID() st:" + st);
                                ed = strLines[i].indexOf(" ", st + 2);
                                console.log("OAL.getPID() ed:" + ed);
                                pid = strLines[i].slice(st, ed);
                                console.log("OAL.getPID() pid:" + pid);
                                return [2 /*return*/, pid];
                            }
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    return OAL;
}());
exports.default = OAL;
