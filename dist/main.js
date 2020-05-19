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
var electron_1 = require("electron");
var AssetsDownloader_1 = __importDefault(require("./AssetsDownloader"));
var ExecController_1 = __importDefault(require("./ExecController"));
// メインウィンドウ
var mainWindow = null;
// アプリが起動するとき
electron_1.app.on('ready', function () {
    // メインウィンドウを生成
    mainWindow = new electron_1.BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
        },
        width: 300,
        height: 300,
    });
    mainWindow.removeMenu();
    // ウィンドウが閉じたとき
    mainWindow.on('closed', function () {
        ExecController_1.default.getInstance().disconnect();
        mainWindow = null;
    });
    // htmlをロード
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    // scrcpyをダウンロードする
    var downloader = AssetsDownloader_1.default.getInstance();
    if (!downloader.getHasDownloaded()) { // scrcpyがダウンロードされていないとき
        var options = {
            title: 'Download',
            type: 'info',
            buttons: ['OK'],
            message: 'scrcpy is required',
            detail: "This App need scrcpy(https://github.com/Genymobile/scrcpy). Press button to download it."
        };
        var result = electron_1.dialog.showMessageBox(mainWindow, options);
        result.then(function (res) {
            var mrv = res;
            mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("download_start");
            downloader.downloadAssets(function () { return __awaiter(void 0, void 0, void 0, function () {
                var dstpath, srcpath;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dstpath = __dirname + "\\scrcpy";
                            srcpath = __dirname + "\\scrcpy.zip";
                            return [4 /*yield*/, downloader.unzipFile(srcpath, dstpath)];
                        case 1:
                            _a.sent();
                            setTimeout(function () {
                                mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("download_end");
                            }, 1000);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    }
    // デバイスが接続されてないとき
    electron_1.ipcMain.on("device_disconected", function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, execController;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!mainWindow) return [3 /*break*/, 2];
                    options = {
                        title: 'No device is connected',
                        type: 'info',
                        buttons: ['OK'],
                        message: 'No device is connected.',
                        detail: "Please connect your Oculus Quest device via USB cable."
                    };
                    return [4 /*yield*/, electron_1.dialog.showMessageBox(mainWindow, options)];
                case 1:
                    _a.sent();
                    execController = ExecController_1.default.getInstance();
                    execController.isDeviceConnected(function () { mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("device_conected"); }, function () { mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("device_disconected"); });
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
    // デバイスがワイアレス接続されたとき
    electron_1.ipcMain.on("device_wireless_connected", function () {
        if (mainWindow) {
            var options = {
                title: 'Device is connected',
                type: 'info',
                buttons: ['OK'],
                message: 'Device is connected wirelessly!',
                detail: "Please unplug USB cable."
            };
            electron_1.dialog.showMessageBox(mainWindow, options);
        }
    });
    // UIControllerの設定が完了したとき
    electron_1.ipcMain.on("UIController_is_ready", function () {
        if (downloader.getHasDownloaded()) {
            var execController = ExecController_1.default.getInstance();
            execController.isDeviceConnected(function () { mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("device_conected"); }, function () { mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("device_disconected"); });
        }
    });
    electron_1.ipcMain.on("directory_select_button_clicked", function (event, args) { return __awaiter(void 0, void 0, void 0, function () {
        var result, path;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!mainWindow) return [3 /*break*/, 2];
                    return [4 /*yield*/, electron_1.dialog.showOpenDialog(mainWindow, {
                            properties: ['openDirectory', "createDirectory"]
                        })];
                case 1:
                    result = _a.sent();
                    path = result.filePaths[0];
                    mainWindow.webContents.send("directory_selected", path);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
    // ディレクトリ選択ボタンが押されたとき
    electron_1.ipcMain.on("directory_select_button_clicked", function (event, args) { return __awaiter(void 0, void 0, void 0, function () {
        var result, path;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!mainWindow) return [3 /*break*/, 2];
                    return [4 /*yield*/, electron_1.dialog.showOpenDialog(mainWindow, {
                            properties: ['openDirectory', "createDirectory"]
                        })];
                case 1:
                    result = _a.sent();
                    path = result.filePaths[0];
                    mainWindow.webContents.send("directory_selected", path);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
    // キャプチャディレクトリが選択されていないとき
    electron_1.ipcMain.on("no_capture_directory_is_selected", function () {
        if (mainWindow) {
            var options = {
                title: 'No capture directory is selected',
                type: 'info',
                buttons: ['OK'],
                message: 'No Capture Directory is Selected.',
                detail: "Please select a Directory to Save Capture Video."
            };
            electron_1.dialog.showMessageBox(mainWindow, options);
        }
    });
});
