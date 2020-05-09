// ExecControllerのイベントリスナー
export default interface ExecControllerListener {
    // ミラーリングを停止したとき
    onEndMirroring(): void;
    // デバイスが接続されていなかったとき
    onDeviceDisconected(): void;
}