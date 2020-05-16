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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var child = __importStar(require("child_process"));
var util_1 = require("util");
var StringUtil_1 = __importDefault(require("./StringUtil"));
var exec = util_1.promisify(child.exec);
var writeFile = util_1.promisify(fs_1.default.writeFile);
// 端末とのネットワークを管理するクラス 
var NetworkManager = /** @class */ (function () {
    // コンストラクタ
    function NetworkManager() {
    }
    // インスタンスを取得する
    NetworkManager.getInstance = function () {
        if (!this.instance) { // インスタンスが存在しないとき
            this.instance = new NetworkManager();
        }
        return this.instance;
    };
    // デフォルトゲートウェイを取得する
    NetworkManager.prototype.getDefaultGateway = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, strlines, i, next;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exec("chcp 65001>nul && ipconfig")];
                    case 1:
                        result = _a.sent();
                        strlines = StringUtil_1.default.getLines(String(result.stdout));
                        for (i = 0; i < strlines.length; i++) {
                            next = i + 1;
                            if (next >= strlines.length) {
                                break;
                            }
                            if (strlines[i].indexOf("Default Gateway") > 0 && strlines[next].length > 0) {
                                return [2 /*return*/, strlines[i + 1].trim()];
                            }
                        }
                        return [2 /*return*/, ""];
                }
            });
        });
    };
    //プライベートネットワークに接続している端末を探す
    NetworkManager.prototype.findDevicesIP = function () {
        return __awaiter(this, void 0, void 0, function () {
            var defaultGateway;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("[NetworkManager.findDevicesIP()]");
                        return [4 /*yield*/, this.getDefaultGateway()];
                    case 1:
                        defaultGateway = _a.sent();
                        console.log("Default Gateway: " + defaultGateway);
                        return [2 /*return*/];
                }
            });
        });
    };
    return NetworkManager;
}());
exports.default = NetworkManager;
