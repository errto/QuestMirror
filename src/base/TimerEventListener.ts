// Timerのイベントリスナー
export default interface TimerEventListener {
    // タイマーが開始したとき
    onStartTimer(): void;
    // タイマーが進んだとき
    onTimerClocked(): void;
    // タイマーが終了したとき
    onEndTimer(): void;
}