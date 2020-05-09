"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// scrcpyの引数に渡す設定情報のクラス
var ScrcpySettings = /** @class */ (function () {
    function ScrcpySettings() {
        // 画面の最大サイズ
        this.maxSize = 1028;
        // FPS
        this.fps = 60;
        // Crop
        this.isCrop = true;
        // 左をcropするか
        this.isLeftCrop = true;
        // 録画するか
        this.needCapture = false;
        // 保存先
        this.capturePath = "";
        // Windowのタイトル
        this.windowTitle = "";
        // Windowのボーダーを表示するか
        this.needBorder = true;
        // フルスクリーンで表示するか
        this.isFullScreen = false;
    }
    // 引数として返す
    ScrcpySettings.prototype.toArgs = function () {
        var args = [];
        if (this.maxSize > 0) {
            args.push("-m");
            args.push(this.maxSize.toString());
        }
        if (this.fps > 0) {
            args.push("--max-fps");
            args.push(this.fps.toString());
        }
        if (this.isCrop) {
            if (this.isLeftCrop) { // 左をcropするとき
                args.push("-c");
                args.push('1200:1140:1520:170');
            }
            else { // 右をcropするとき
                args.push("-c");
                args.push('1200:1140:155:170');
            }
        }
        if (this.needCapture) {
            args.push("--record");
            var date = new Date();
            var year = date.getFullYear().toString();
            var month = (date.getMonth() + 1).toString();
            var day = date.getDate().toString();
            var hours = date.getHours().toString();
            var minutes = date.getMinutes().toString();
            var seconds = date.getSeconds().toString();
            var fileName = "capture(" + year + month + day + hours + minutes + seconds + ").mp4";
            var dstPath = this.capturePath + "\\" + fileName;
            args.push(dstPath);
        }
        if (this.windowTitle.length > 0) {
            args.push("--window-title");
            args.push(this.windowTitle.toString());
        }
        if (!this.needBorder) {
            args.push("--window-borderless");
        }
        if (this.isFullScreen) {
            args.push("-f");
        }
        return args;
    };
    return ScrcpySettings;
}());
exports.default = ScrcpySettings;
