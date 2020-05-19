import * as child from "child_process"
import ExecControllerListener from "./ExecControllerListener";
import ScrcpySettings from './ScrcpySettings';
import StringUtil from "./StringUtil";

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
    // QuestのIPアドレス
    private ip: string

    // コンストラクタ
     private constructor() {
        this.settings = new ScrcpySettings();
        this.childProcess = null;
        this.isMirroring = false;
        this.listener = null;
        this.ip = "";
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

    // ワイアレス接続か
    public setIsWirealess(b: boolean): void {
        this.settings.isWireless = b;
    }

    // デバイスが接続されているか
    public isDeviceConnected(successCallback: Function,
         failerCallback: Function): void {
        const path: string = __dirname;
        let cmd = '/scrcpy/adb.exe';
        let cp = child.spawn(path + cmd, ["devices","-l"]);
        
        let outStr = "";
        cp.stdout.setEncoding('utf-8');
        cp.stdout.on('data', function (data) {
            outStr = String(data);
        });

        cp.on("close", () => {
            let strLines = StringUtil.getLines(outStr);
            for (let i = 1; i < strLines.length; i++) {
                if (strLines[i].indexOf("Quest") > 0 && strLines[i].indexOf("192.168") < 0) {
                    let st = 0;
                    let ed = strLines[i].indexOf(" ");
                    this.settings.deviceSerial = strLines[i].slice(st, ed);
                    console.log(this.settings.deviceSerial)
                    successCallback();
                    return
                }
            }
            let args = ["/im", "adb.exe"]
            child.spawn("taskkill", args)
            failerCallback();
        })
    }

    // ipアドレスを取得する
    private getIP(successCallback: Function,
        failerCallback: Function): void {
        const path: string = __dirname;
        let cmd = '/scrcpy/adb.exe';
        let cp = child.spawn(path + cmd, ["-s", this.settings.deviceSerial, "shell", 
        "dumpsys", "wifi"]);
        
        let outStr = ""
        cp.stdout.setEncoding('utf-8');
        cp.stdout.on('data', function (data) {
            outStr += String(data);
        });

        cp.on("close", () => {
            let strLines = StringUtil.getLines(outStr)
            for (let i = 0; i < strLines.length; i++) {
                if (strLines[i].indexOf("ip_address") >= 0) {
                    this.ip = strLines[i].slice(11);
                    this.settings.deviceIp = this.ip;
                    successCallback();
                    return
                }
            }
            failerCallback() // 見つからなかったとき
        })
    }

    // TCP/IPで接続する
    private connectTCPIP(successCallback: Function,
        failerCallback: Function): void {
        const path: string = __dirname;
        let cmd = '/scrcpy/adb.exe';
        let cp0 = child.spawn(path + cmd, ["-s", this.settings.deviceSerial, "tcpip","5555"]);
        cp0.stdout.setEncoding('utf-8');
        cp0.on("close", () => {
            let cp1 = child.spawn(path + cmd, ["connect", this.ip+ ":5555"]);
            cp1.on("close", () => {
                successCallback();
            })
            cp1.on("error", () => {
                failerCallback();
            })
        })
    }

    // デバイスとの接続を切る
    public disconnect(): void {
        const path: string = __dirname;
        let cmd = '/scrcpy/adb.exe';
        child.spawn(path + cmd, ["disconnect"]);
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
        this.startScrcpy(args)
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