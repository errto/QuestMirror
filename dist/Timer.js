"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 時間を計測するクラス
var Timer = /** @class */ (function () {
    // コンストラクタ
    function Timer() {
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.startTime = null;
        this.listener = null;
    }
    // リスナーを設定する
    Timer.prototype.setEventListener = function (listener) {
        this.listener = listener;
    };
    // 計測を開始する
    Timer.prototype.start = function () {
        var _a;
        this.startTime = new Date();
        (_a = this.listener) === null || _a === void 0 ? void 0 : _a.onStartTimer();
        this.clock();
    };
    // タイマーを進める
    Timer.prototype.clock = function () {
        var _a;
        if (this.startTime) {
            var currentTime = new Date();
            var diff = (currentTime.getTime() - this.startTime.getTime()).toString();
            var time = parseInt(diff) / 1000;
            var intTime = parseInt(time.toString());
            this.hours = parseInt((intTime / 3600).toString());
            var intHours = parseInt((intTime / 60).toString());
            this.minutes = intHours % 60;
            this.seconds = intTime % 60;
            (_a = this.listener) === null || _a === void 0 ? void 0 : _a.onTimerClocked();
            setTimeout(this.clock.bind(this), 1000);
        }
    };
    // タイマー停止する
    Timer.prototype.stop = function () {
        var _a;
        this.startTime = null;
        (_a = this.listener) === null || _a === void 0 ? void 0 : _a.onEndTimer();
    };
    // 時間を文字列で返す
    Timer.prototype.toString = function () {
        var hs = "";
        if (this.hours < 10) {
            hs = "0" + this.hours;
        }
        else {
            hs = this.hours.toString();
        }
        var ms = "";
        if (this.minutes < 10) {
            ms = "0" + this.minutes;
        }
        else {
            ms = this.minutes.toString();
        }
        var ss = "";
        if (this.seconds < 10) {
            ss = "0" + this.seconds;
        }
        else {
            ss = this.seconds.toString();
        }
        return hs + ":" + ms + ":" + ss;
    };
    return Timer;
}());
exports.default = Timer;
