"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var ExecController_1 = __importDefault(require("./ExecController"));
var Spiner_1 = __importDefault(require("./Spiner"));
var Timer_1 = __importDefault(require("./base/Timer"));
// UIを管理するControllerクラス
var UIContoller = /** @class */ (function () {
    // コンストラクタ
    function UIContoller() {
        this.startMirroringButton = document.getElementById("mirroring_start_button");
        this.endMirroringButton = document.getElementById("mirroring_end_button");
        this.maxScreenSizeSlider = document.getElementById("max_screen_size_slider");
        this.fpsSlider = document.getElementById("fps_slider");
        this.windowBorderCheckbox = document.getElementById("window_border_checkbox");
        this.windowTitleTextInput = document.getElementById("window_name_input");
        this.captureCheckbox = document.getElementById("capture_checkbox");
        this.directorySelectButton = document.getElementById("directory_select_button");
        this.fullscreenCheckbox = document.getElementById("fullscreen_checkbox");
        this.cropCheckbox = document.getElementById("crop_checkbox");
        this.cropRightCheckbox = document.getElementById("crop_right_checkbox");
        this.cropLeftCheckbox = document.getElementById("crop_left_checkbox");
        this.mirroringTimeLabel = document.getElementById("mirroring_time");
        this.timer = null;
        this.indicator = new Spiner_1.default();
        this.indicator.hide();
    }
    // 設定を行う
    UIContoller.prototype.setup = function () {
        this.setEventListener();
        ExecController_1.default.getInstance().setEventListener(this);
    };
    // イベントリスナーを設定する
    UIContoller.prototype.setEventListener = function () {
        var _this = this;
        var _a;
        (_a = this.startMirroringButton) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
            var instance = ExecController_1.default.getInstance();
            if (!instance.getIsMirroring()) { // 再生していないとき
                if (_this.isCaptureEnable()) {
                    if (_this.isCaptureDirectroySelected()) {
                        instance.startMirroring();
                        var img = document.getElementById("mirroring_start_image");
                        img.src = "./resources/icon/ico_play_active.png";
                    }
                    else {
                        electron_1.ipcRenderer.send('no_capture_directory_is_selected');
                    }
                }
                else {
                    instance.startMirroring();
                    var img = document.getElementById("mirroring_start_image");
                    img.src = "./resources/icon/ico_play_active.png";
                    _this.timer = new Timer_1.default();
                    _this.timer.setEventListener(_this);
                    _this.timer.start();
                }
            }
        });
        this.endMirroringButton.addEventListener("click", function () {
            var _a;
            var instance = ExecController_1.default.getInstance();
            instance.stopMirroring();
            (_a = _this.timer) === null || _a === void 0 ? void 0 : _a.stop();
        });
        this.endMirroringButton.addEventListener("mouseover", function () {
            var instance = ExecController_1.default.getInstance();
            if (instance.getIsMirroring()) { // ミラーリングしているとき
                var img = document.getElementById("mirroring_stop_image");
                img.src = "./resources/icon/ico_stop_active.png";
            }
        });
        this.endMirroringButton.addEventListener("mouseleave", function () {
            var instance = ExecController_1.default.getInstance();
            if (instance.getIsMirroring()) { // ミラーリングしているとき
                var img = document.getElementById("mirroring_stop_image");
                img.src = "./resources/icon/ico_stop.png";
            }
        });
        this.maxScreenSizeSlider.addEventListener("change", function () {
            var instance = ExecController_1.default.getInstance();
            var val = _this.maxScreenSizeSlider.value;
            instance.setMaxSize(Number(val));
        });
        this.fpsSlider.addEventListener("change", function () {
            var instance = ExecController_1.default.getInstance();
            var val = _this.maxScreenSizeSlider.value;
            instance.setMaxSize(Number(val));
        });
        this.windowBorderCheckbox.addEventListener("change", function () {
            var instance = ExecController_1.default.getInstance();
            var val = _this.windowTitleTextInput.checked;
            instance.setNeedBorder(val);
        });
        this.windowTitleTextInput.addEventListener("change", function () {
            var instance = ExecController_1.default.getInstance();
            var val = _this.windowTitleTextInput.value;
            instance.setWindowTitle(val);
        });
        this.captureCheckbox.addEventListener("change", function () {
            var instance = ExecController_1.default.getInstance();
            var val = _this.captureCheckbox.checked;
            instance.setNeedCapture(val);
            if (val) { // キャプチャするとき
                _this.directorySelectButton.disabled = false;
            }
            else { // キャプチャしないとき
                _this.directorySelectButton.disabled = true;
            }
        });
        this.directorySelectButton.addEventListener("click", function () {
            // メインプロセスに通信する
            electron_1.ipcRenderer.send('directory_select_button_clicked');
            // メインプロセスからの通信を取得する
            electron_1.ipcRenderer.on("directory_selected", function (event, args) {
                if (args) {
                    var instance = ExecController_1.default.getInstance();
                    instance.setCapturePath(args);
                    _this.directorySelectButton.innerText = args;
                }
            });
        });
        this.fullscreenCheckbox.addEventListener("change", function () {
            var instance = ExecController_1.default.getInstance();
            var val = _this.fullscreenCheckbox.checked;
            instance.setIsFullScreen(val);
        });
        this.cropCheckbox.addEventListener("change", function () {
            var val = _this.cropCheckbox.checked;
            var instance = ExecController_1.default.getInstance();
            instance.setIsCrop(val);
            if (!val) { // チェックが外れたとき
                _this.cropLeftCheckbox.disabled = true;
                _this.cropRightCheckbox.disabled = true;
            }
            else { // チェックが入ったとき
                _this.cropLeftCheckbox.disabled = false;
                _this.cropRightCheckbox.disabled = false;
            }
        });
        this.cropLeftCheckbox.addEventListener("change", function () {
            var val = _this.cropLeftCheckbox.checked;
            var instance = ExecController_1.default.getInstance();
            instance.setIsLeftCrop(val);
            if (val) { // 左をcropするとき
                _this.cropRightCheckbox.checked = false;
            }
        });
        this.cropRightCheckbox.addEventListener("change", function () {
            var val = _this.cropRightCheckbox.checked;
            var instance = ExecController_1.default.getInstance();
            instance.setIsLeftCrop(!val);
            if (val) {
                _this.cropLeftCheckbox.checked = false;
            }
        });
        // ダウンロードを開始したとき
        electron_1.ipcRenderer.on("download_start", function (event, args) {
            _this.startMirroringButton.disabled = true;
            _this.endMirroringButton.disabled = true;
            _this.maxScreenSizeSlider.disabled = true;
            ;
            _this.fpsSlider.disabled = true;
            _this.windowBorderCheckbox.disabled = true;
            _this.windowTitleTextInput.disabled = true;
            _this.captureCheckbox.disabled = true;
            _this.fullscreenCheckbox.disabled = true;
            _this.cropCheckbox.disabled = true;
            _this.cropRightCheckbox.disabled = true;
            ;
            _this.cropLeftCheckbox.disabled = true;
            _this.indicator.show();
        });
        // ダウンロードを終了したとき
        electron_1.ipcRenderer.on("download_end", function (event, args) {
            _this.startMirroringButton.disabled = false;
            _this.endMirroringButton.disabled = false;
            _this.maxScreenSizeSlider.disabled = false;
            _this.fpsSlider.disabled = false;
            _this.windowBorderCheckbox.disabled = false;
            _this.windowTitleTextInput.disabled = false;
            _this.captureCheckbox.disabled = false;
            _this.fullscreenCheckbox.disabled = false;
            _this.cropCheckbox.disabled = false;
            _this.cropRightCheckbox.disabled = false;
            _this.cropLeftCheckbox.disabled = false;
            _this.indicator.hide();
        });
    };
    // ミラーリングが停止したとき
    // scrcpyが直接停止した時に呼び出される
    UIContoller.prototype.onEndMirroring = function () {
        var imgStart = document.getElementById("mirroring_start_image");
        imgStart.src = "./resources/icon/ico_play.png";
        var imgStop = document.getElementById("mirroring_stop_image");
        imgStop.src = "./resources/icon/ico_stop.png";
    };
    // デバイスが接続されていなかったとき
    UIContoller.prototype.onDeviceDisconected = function () {
        // startボタンを元に戻す
        var imgStart = document.getElementById("mirroring_start_image");
        imgStart.src = "./resources/icon/ico_play.png";
        // ダイアログを表示するよう通知する
        electron_1.ipcRenderer.send('device_disconected');
    };
    // タイマーが開始したとき
    UIContoller.prototype.onStartTimer = function () {
        var _a;
        if (this.timer) {
            var time = (_a = this.timer) === null || _a === void 0 ? void 0 : _a.toString();
            this.mirroringTimeLabel.innerText = time;
        }
    };
    // タイマーが進んだとき
    UIContoller.prototype.onTimerClocked = function () {
        var _a;
        if (this.timer) {
            var time = (_a = this.timer) === null || _a === void 0 ? void 0 : _a.toString();
            this.mirroringTimeLabel.innerText = time;
        }
    };
    // タイマーが停止したとき
    UIContoller.prototype.onEndTimer = function () {
        var _a;
        if (this.timer) {
            var time = (_a = this.timer) === null || _a === void 0 ? void 0 : _a.toString();
            this.mirroringTimeLabel.innerText = time;
        }
    };
    // キャプチャが有効か
    UIContoller.prototype.isCaptureEnable = function () {
        return this.captureCheckbox.checked;
    };
    // ディレクトリが選択されているか
    UIContoller.prototype.isCaptureDirectroySelected = function () {
        console.log(this.directorySelectButton.innerText);
        return this.directorySelectButton.innerText != "No Directory Selected";
    };
    return UIContoller;
}());
exports.default = UIContoller;
