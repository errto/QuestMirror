import ExecControllerListener from "./ExecControllerListener";
import OAL from "./OAL";
import ScrcpySettings from './ScrcpySettings';
import { CropSide } from './ScrcpySettings';

// 外部アプリを管理するContorllerクラス
export default class ExecController {

    // インスタンス
    private static instance: ExecController;
    // 設定
    private settings: ScrcpySettings;
    // ミラーリング中か
    private isMirroring: boolean;
    // イベントリスナー
    private listener: ExecControllerListener | null;

    // コンストラクタ
     private constructor() {
        this.settings = new ScrcpySettings();
        this.isMirroring = false;
        this.listener = null;
    }

    // イベントリスナーを設定する
    public setEventListener(listener: ExecControllerListener): void {
        this.listener = listener
    }

    // インスタンスを取得する
    public static getInstance(): ExecController {
        if (!this.instance) { // インスタンスが存在しないとき
            this.instance = new ExecController();
        }
        return this.instance
    }

    // ミラーリングを開始する
    public startMirroring(): void {

        if (this.settings.isWireless) {
            let args = this.settings.toArgs()
            this.executeScrcpy(args);
        } else {
            this.isDeviceConnected(
                () => {
                    let args = this.settings.toArgs()
                    this.executeScrcpy(args);
                },
                () => {
                    if(this.listener) {
                        this.listener.onDeviceDisconected()
                    }
                })
        }
    }

    // ミラーリングを停止する
    public stopMirroring(): void {
        OAL.getInstance().exitSrccpy();
    }

    // 最大サイズを設定する
    public setMaxSize(maxSize: number): void {
        this.settings.maxSize = maxSize
    }

    // Fpsを設定する
    public setFps(fps: number): void {
        this.settings.fps = fps
    }

    // ウィンドウもボーダーが必要かどうかを設定する
    public setNeedBorder(b: boolean): void {
        this.settings.needBorder = b
    }

    // ウィンドウのタイトルを設定する
    public setWindowTitle(title: string): void {
        this.settings.windowTitle = title
    }

    // キャプチャが必要かどうかを設定する
    public setNeedCapture(b: boolean): void {
        this.settings.needCapture = b;
    }

    // 保存先のフォルダを選択する
    public setCapturePath(path: string): void {
        this.settings.capturePath = path
    }

    // フルスクリーンか設定する
    public setIsFullScreen(b: boolean): void {
        this.settings.isFullScreen = b;
    }

    // cropするか設定する
    public setIsCrop(b: boolean): void {
        this.settings.isCrop = b;
    }

    // cropする位置を設定する
    public setCropSide(cs: CropSide): void {
        this.settings.cropSide = cs;
    }

    // ミラーリング中か
    public getIsMirroring(): boolean {
        return this.isMirroring;
    }

    // ワイアレス接続か
    public setIsWirealess(b: boolean): void {
        this.settings.isWireless = b;
    }

    // デバイスが接続されているか
    public async isDeviceConnected(successCallback: Function,
         failedCallback: Function): Promise<void> {
        let result = await OAL.getInstance().isDeviceConnected()
        if (result) {
            this.settings.deviceSerial = result
            successCallback();
        } else {
            failedCallback();
        }
    }

    // ipアドレスを取得する
    private async getIP(successCallback: Function,
        failedCallback: Function): Promise<void> {
        let ip = await OAL.getInstance().getIP(this.settings.deviceSerial);
        if (ip) {
            this.settings.deviceIp = ip;
            successCallback();
        } else {
            failedCallback();
        }
    }

    // TCP/IPで接続する
    private connectTCPIP(successCallback: Function,
        failedCallback: Function): void {
        OAL.getInstance().connectTCPIP(this.settings.deviceSerial, this.settings.deviceIp,
            successCallback, failedCallback);
    }

    // デバイスとの接続を切る
    public disconnect(): void {
        OAL.getInstance().discconct();
    }

    // ワイアレス接続する 
    public connectWireless(successCallback: Function,
        failerCallback: Function): void {

        this.isDeviceConnected(
            () => {
                this.getIP(
                    () => { 
                        this.connectTCPIP(successCallback, failerCallback);
                    },
                    () => {
                        failerCallback()
                    }
                );
            },
            () => {
                if(this.listener) {
                    this.listener.onDeviceDisconected()
                }
            }
        )
    }

    // ワイアレス接続を解除する
    public disconnectWireless(): void {
        this.settings.deviceIp = ""
    }

    // scrcpyを実行する
    private executeScrcpy(args :string[]): void {
        this.isMirroring = true;
        OAL.getInstance().launchSrccpy(args, () => {
            if (this.isMirroring) { //  scrcpyを直接閉じたとき
                this.isMirroring = false;
                this.listener?.onEndMirroring();
            }
        })
    }
}