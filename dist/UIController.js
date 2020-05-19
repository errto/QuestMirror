"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var ExecController_1 = __importDefault(require("./ExecController"));
var Spiner_1 = __importDefault(require("./Spiner"));
var Timer_1 = __importDefault(require("./Timer"));
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
        this.deviceStatusLabel = document.getElementById("device_status");
        this.wifiCheckBox = document.getElementById("wifi_checkbox");
        this.usbCheckBox = document.getElementById("usb_checkbox");
        this.deviceStatusIcon = document.getElementById("device_status_icon");
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
                        _this.startMirroring();
                    }
                    else {
                        electron_1.ipcRenderer.send('no_capture_directory_is_selected');
                    }
                }
                else {
                    _this.startMirroring();
                }
            }
        });
        this.endMirroringButton.addEventListener("click", function () {
            _this.sropMirroring();
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
        this.wifiCheckBox.addEventListener("change", function () {
            var val = _this.wifiCheckBox.checked;
            if (val) { // Wi-Fi接続にチェックがはいったとき
                _this.sropMirroring();
                _this.disenable();
                ExecController_1.default.getInstance().setIsWirealess(true);
                _this.deviceStatusLabel.innerText = "Connecting...";
                _this.deviceStatusIcon.hidden = true;
                ExecController_1.default.getInstance().connectWireless(function () {
                    _this.enable();
                    _this.usbCheckBox.checked = false;
                    _this.deviceStatusLabel.innerText = "Device Ready";
                    _this.deviceStatusIcon.setAttribute("style", "background-color: greenyellow");
                    _this.deviceStatusIcon.hidden = false;
                    electron_1.ipcRenderer.send("device_wireless_connected");
                }, function () {
                    ExecController_1.default.getInstance().setIsWirealess(false);
                    _this.wifiCheckBox.checked = false;
                    _this.deviceStatusLabel.innerText = "Device Not Ready";
                    _this.deviceStatusIcon.hidden = false;
                    _this.deviceStatusIcon.setAttribute("style", "background-color: red");
                });
            }
        });
        this.usbCheckBox.addEventListener("change", function () {
            var val0 = _this.usbCheckBox.checked;
            if (val0) { // USB接続にチェックが入ったとき
                _this.sropMirroring();
                ExecController_1.default.getInstance().setIsWirealess(false);
                _this.deviceStatusLabel.innerText = "Connecting...";
                _this.deviceStatusIcon.hidden = true;
                _this.wifiCheckBox.checked = false;
                ExecController_1.default.getInstance().isDeviceConnected(function () {
                    _this.enable();
                    _this.deviceStatusLabel.innerText = "Device Ready";
                    _this.deviceStatusIcon.hidden = false;
                    _this.deviceStatusIcon.setAttribute("style", "background-color: greenyellow");
                }, function () {
                    _this.disenable();
                    _this.deviceStatusLabel.innerText = "Device Not Ready";
                    _this.deviceStatusIcon.hidden = false;
                    _this.deviceStatusIcon.setAttribute("style", "background-color: red");
                    electron_1.ipcRenderer.send('device_disconected');
                });
            }
        });
        // ダウンロードを開始したとき
        electron_1.ipcRenderer.on("download_start", function (event, args) {
            _this.disenable();
            _this.indicator.show();
            _this.deviceStatusIcon.hidden = true;
        });
        // ダウンロードを終了したとき
        electron_1.ipcRenderer.on("download_end", function (event, args) {
            _this.indicator.hide();
            // デバイスの接続を確認する
            var execController = ExecController_1.default.getInstance();
            execController.isDeviceConnected(function () {
                _this.enable();
                _this.deviceStatusLabel.innerText = "Device Ready";
                _this.deviceStatusIcon.setAttribute("style", "background-color: greenyellow");
                _this.usbCheckBox.checked = true;
                _this.deviceStatusIcon.hidden = false;
            }, function () {
                _this.disenable();
                _this.deviceStatusLabel.innerText = "Device Not Ready";
                _this.deviceStatusIcon.setAttribute("style", "background-color: red");
                _this.deviceStatusIcon.hidden = false;
                electron_1.ipcRenderer.send('device_disconected');
            });
        });
        // デバイスの接続を確認できたとき
        electron_1.ipcRenderer.on("device_conected", function (event, args) {
            _this.enable();
            _this.deviceStatusLabel.innerText = "Device Ready";
            _this.deviceStatusIcon.setAttribute("style", "background-color: greenyellow");
            _this.usbCheckBox.checked = true;
        });
        // デバイスの接続を確認できなかったとき
        electron_1.ipcRenderer.on("device_disconected", function (event, args) {
            _this.disenable();
            _this.deviceStatusLabel.innerText = "Device Not Ready";
            _this.deviceStatusIcon.setAttribute("style", "background-color: red");
            electron_1.ipcRenderer.send('device_disconected');
        });
        electron_1.ipcRenderer.send('UIController_is_ready');
    };
    UIContoller.prototype.enable = function () {
        this.startMirroringButton.disabled = false;
        this.endMirroringButton.disabled = false;
        this.maxScreenSizeSlider.disabled = false;
        this.fpsSlider.disabled = false;
        this.windowBorderCheckbox.disabled = false;
        this.windowTitleTextInput.disabled = false;
        this.captureCheckbox.disabled = false;
        this.fullscreenCheckbox.disabled = false;
        this.cropCheckbox.disabled = false;
        this.cropRightCheckbox.disabled = false;
        this.cropLeftCheckbox.disabled = false;
    };
    UIContoller.prototype.disenable = function () {
        this.startMirroringButton.disabled = true;
        this.endMirroringButton.disabled = true;
        this.maxScreenSizeSlider.disabled = true;
        this.fpsSlider.disabled = true;
        this.windowBorderCheckbox.disabled = true;
        this.windowTitleTextInput.disabled = true;
        this.captureCheckbox.disabled = true;
        this.fullscreenCheckbox.disabled = true;
        this.cropCheckbox.disabled = true;
        this.cropRightCheckbox.disabled = true;
        this.cropLeftCheckbox.disabled = true;
    };
    // ミラーリングが停止したとき
    // scrcpyが直接停止した時に呼び出される
    UIContoller.prototype.onEndMirroring = function () {
        var imgStart = document.getElementById("mirroring_start_image");
        imgStart.src = "./resources/icon/ico_play.png";
        var imgStop = document.getElementById("mirroring_stop_image");
        imgStop.src = "./resources/icon/ico_stop.png";
        if (this.timer) {
            this.timer.stop();
        }
    };
    // デバイスが接続されていなかったとき
    UIContoller.prototype.onDeviceDisconected = function () {
        var _a;
        this.disenable();
        var imgStart = document.getElementById("mirroring_start_image");
        imgStart.src = "./resources/icon/ico_play.png";
        this.deviceStatusLabel.innerText = "Device Not Ready";
        this.deviceStatusIcon.hidden = false;
        this.deviceStatusIcon.setAttribute("style", "background-color: red");
        this.wifiCheckBox.checked = false;
        (_a = this.timer) === null || _a === void 0 ? void 0 : _a.stop();
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
            this.timer = null;
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
    // ミラーリングを開始する
    UIContoller.prototype.startMirroring = function () {
        var instance = ExecController_1.default.getInstance();
        instance.startMirroring();
        var img = document.getElementById("mirroring_start_image");
        img.src = "./resources/icon/ico_play_active.png";
        this.timer = new Timer_1.default();
        this.timer.setEventListener(this);
        this.timer.start();
    };
    // ミラーリングを停止する
    UIContoller.prototype.sropMirroring = function () {
        var _a;
        var instance = ExecController_1.default.getInstance();
        instance.stopMirroring();
        (_a = this.timer) === null || _a === void 0 ? void 0 : _a.stop();
    };
    return UIContoller;
}());
exports.default = UIContoller;
