import TimerEventListener from "./TimerEventListener";

// 時間を計測するクラス
export default class Timer {

    // 時間
    private hours: number;
    // 分
    private minutes: number;
    // 秒
    private seconds: number;
    // 開始時刻
    private startTime: Date | null;
    // イベントリスナー
    private listener: TimerEventListener | null;

    // コンストラクタ
    constructor() {
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.startTime = null;
        this.listener = null;
    }

    // リスナーを設定する
    public setEventListener(listener: TimerEventListener): void {
        this.listener = listener;
    }

    // 計測を開始する
    public start(): void {
        this.startTime = new Date();
        this.listener?.onStartTimer();
        this.clock();
    }

    // タイマーを進める
    private clock(): void {
        if (this.startTime) {
            let currentTime = new Date();
            let diff = (currentTime.getTime() - this.startTime.getTime()).toString();
            let time = parseInt(diff) / 1000;
            let intTime = parseInt(time.toString())

            this.hours = parseInt((intTime / 3600).toString());

            let intHours = parseInt((intTime / 60).toString());
            this.minutes = intHours % 60;

            this.seconds = intTime % 60;

            this.listener?.onTimerClocked();

            setTimeout(this.clock.bind(this), 1000);
        }
    }

    // タイマー停止する
    public stop(): void {
        this.startTime = null;
        this.listener?.onEndTimer();
    }

    // 時間を文字列で返す
    public toString(): string {
        let hs = "";
        if (this.hours < 10) {
            hs = "0" + this.hours;
        } else {
            hs = this.hours.toString();
        }

        let ms = ""
        if (this.minutes < 10) {
            ms = "0" + this.minutes;
        } else {
            ms = this.minutes.toString();
        }

        let ss = ""
        if (this.seconds < 10) {
            ss = "0" + this.seconds;
        } else {
            ss = this.seconds.toString();
        }
        return hs + ":" + ms + ":" + ss;
    }
}