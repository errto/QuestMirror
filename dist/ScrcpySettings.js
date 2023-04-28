"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CropSide = void 0;
// Cropする位置のEnum・・・TypeScriptの列挙型は問題があるためオブジェクトリテラルで代替
exports.CropSide = {
    Left: 0,
    Center: 1,
    Right: 2,
};
// scrcpyの引数に渡す設定情報のクラス
var ScrcpySettings = /** @class */ (function () {
    function ScrcpySettings() {
        // 画面の最大サイズ
        this.maxSize = 1028;
        // FPS
        this.fps = 60;
        // Crop
        this.isCrop = true;
        // cropする位置
        this.cropSide = exports.CropSide.Center;
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
        // wi-fi接続か
        this.isWireless = false;
        // 端末のip
        this.deviceIp = "";
        // 端末のシリアル番号
        this.deviceSerial = "";
    }
    // 引数として返す
    ScrcpySettings.prototype.toArgs = function () {
        var args = [];
        if (this.isWireless) {
            args.push("-s");
            args.push(this.deviceIp);
        }
        else {
            args.push("-s");
            args.push(this.deviceSerial);
        }
        if (this.maxSize > 0) {
            args.push("-m");
            args.push(this.maxSize.toString());
        }
        if (this.fps > 0) {
            args.push("--max-fps");
            args.push(this.fps.toString());
        }
        if (this.isCrop) {
            switch (this.cropSide) {
                case exports.CropSide.Left:
                    // 左
                    args.push("--crop");
                    args.push('1200:1140:155:170');
                    break;
                case exports.CropSide.Center:
                    // 両目っぽく見えるようにクロップ
                    args.push("-b25M --crop");
                    args.push('1600:900:2017:510');
                    break;
                case exports.CropSide.Right:
                    // 右
                    args.push("--crop");
                    args.push('1200:1140:2275:170');
                    break;
                default:
                    break;
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
