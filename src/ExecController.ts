import * as child from "child_process"
import ExecControllerListener from "./ExecControllerListener";
import ScrcpySettings from './ScrcpySettings';

// 外部アプリを管理するContorllerクラス
export default class ExecController {

    // インスタンス
    private static instance: ExecController;
    // 起動しているプロセスのid
    private childProcess: child.ChildProcess | null;
    // 設定
    private settings: ScrcpySettings;
    // ミラーリング中か
    private isMirroring: boolean;
    // イベントリスナー
    private listener: ExecControllerListener | null;

    // コンストラクタ
     private constructor() {
        this.settings = new ScrcpySettings();
        this.childProcess = null;
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
        let args = this.settings.toArgs()
        this.executeScrcpy(args);
    }

    // ミラーリングを停止する
    public stopMirroring(): void {
        if (this.childProcess) { // 子プロセスがあるとき
            let args = ["/im", "scrcpy.exe"]
            child.spawn("taskkill", args)
        }
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

    // 左をcropするか設定する
    public setIsLeftCrop(b: boolean): void {
        this.settings.isLeftCrop = b;
    }

    // ミラーリング中か
    public getIsMirroring(): boolean {
        return this.isMirroring;
    }

    // デバイスが接続されているか
    private isDeviceConnected(successCallback: Function,
         failerCallback: Function): void {
        const path: string = __dirname;
        let cmd = '/scrcpy/adb.exe';
        let cp = child.spawn(path + cmd, ["devices","-l"]);
        
        cp.stdout.setEncoding('utf-8');
        cp.stdout.on('data', function (data) {
            let consoleOut = String(data);
            if(consoleOut.indexOf("Quest") < 0) { // 接続されていなかったとき
                failerCallback();
                let args = ["/im", "adb.exe"]
                child.spawn("taskkill", args)
            } else {
                successCallback();
            }
        });
    }

    // scrcpyを実行する
    private executeScrcpy(args :string[]): void {
        if (this.listener) { // リスナーが設定されているとき
            this.isDeviceConnected(
                this.startScrcpy.bind(this, args),
                this.listener.onDeviceDisconected
            );
        } else { // 異常系
            console.error("[ExecController] listener is null.")
        }
    }

    // scrcpyを起動する
    private startScrcpy(args: string[]) {
        const path: string = __dirname;
        let cmd = '/scrcpy/scrcpy.exe';
        this.childProcess = child.spawn(path + cmd, args);
        this.isMirroring = true

        // closeしたとき
        this.childProcess.on('close', (code) => {
            if (this.isMirroring) { //  scrcpyを直接閉じたとき
                this.isMirroring = false;
                this.listener?.onEndMirroring();
            }
        });
    }
}