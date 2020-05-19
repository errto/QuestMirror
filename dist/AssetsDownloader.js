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
var extract_zip_1 = __importDefault(require("extract-zip"));
var fs_1 = __importDefault(require("fs"));
var https_1 = __importDefault(require("https"));
// scrcpyのassetsのダウンローダー
var AssetsDownloader = /** @class */ (function () {
    // コンストラクタ
    function AssetsDownloader() {
        this.hasDonwnloaded = false;
    }
    // インスタンスを取得する
    AssetsDownloader.getInstance = function () {
        if (!this.instance) { // インスタンスが存在しないとき
            this.instance = new AssetsDownloader();
        }
        return this.instance;
    };
    // ダウンロード済みか
    AssetsDownloader.prototype.getHasDownloaded = function () {
        var path = __dirname + "\\scrcpy\\scrcpy.exe";
        try {
            fs_1.default.statSync(path);
        }
        catch (e) {
            this.hasDonwnloaded = false;
            return this.hasDonwnloaded;
        }
        this.hasDonwnloaded = true;
        return this.hasDonwnloaded;
    };
    // assetsをダウンロードする
    AssetsDownloader.prototype.downloadAssets = function (callback) {
        var url = "https://github.com/Genymobile/scrcpy/releases/download/v1.13/scrcpy-win64-v1.13.zip";
        var path = __dirname + "\\scrcpy.zip";
        this.requestHttps(url, path, callback);
    };
    // httpsリクエストを投げる
    AssetsDownloader.prototype.requestHttps = function (url, savePath, callback) {
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
    // zipファイルを解凍する
    AssetsDownloader.prototype.unzipFile = function (srcPath, dstPath) {
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
    return AssetsDownloader;
}());
exports.default = AssetsDownloader;
