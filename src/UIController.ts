import { ipcRenderer } from 'electron'
import ExecController from "./ExecController";
import ExecControllerListener from './ExecControllerListener';
import Spinner from './Spiner';
import Timer from './Timer';
import TimerEventListener from './TimerEventListener';

// UIを管理するControllerクラス
export default class UIContoller implements ExecControllerListener, TimerEventListener {

    // ミラーリングを開始ボタン
    private startMirroringButton: HTMLButtonElement;
    // ミラーリングを停止する
    private endMirroringButton: HTMLButtonElement;
    // スクリーン最大サイズスライダー
    private maxScreenSizeSlider: HTMLInputElement;
    // FPSスライダー
    private fpsSlider: HTMLInputElement;
    // ウィンドウのボーダー表示チェックボックス
    private windowBorderCheckbox: HTMLInputElement
    // ウィンドウ名テキストエリア
    private windowTitleTextInput: HTMLInputElement;
    // キャプチャチェックボックス
    private captureCheckbox: HTMLInputElement;
    // 保存先選択ボタン
    private directorySelectButton: HTMLButtonElement;
    // フルスクリーン選択チェックボックス
    private fullscreenCheckbox: HTMLInputElement;
    // crop選択チェックボックス
    private cropCheckbox: HTMLInputElement;
    // crop右選択チェックボックス
    private cropRightCheckbox: HTMLInputElement;
    // crop左選択チェックボックス
    private cropLeftCheckbox: HTMLInputElement;
    // ウェイトインディケーター
    private indicator: Spinner;
    // ミラーリング時間を表示する要素
    private mirroringTimeLabel: HTMLElement;
    // タイマー
    private timer: Timer | null;
    // デバイスステータス
    private deviceStatusLabel: HTMLElement;
    // ステータスアイコン
    private deviceStatusIcon: HTMLElement;
    // Wi-Fi接続チェックボックス
    private wifiCheckBox: HTMLInputElement;
    // USB接続チェックボックス
    private usbCheckBox: HTMLInputElement;

    // コンストラクタ
    constructor() {
        this.startMirroringButton = <HTMLButtonElement>document.getElementById("mirroring_start_button");
        this.endMirroringButton = <HTMLButtonElement>document.getElementById("mirroring_end_button");
        this.maxScreenSizeSlider = <HTMLInputElement>document.getElementById("max_screen_size_slider");
        this.fpsSlider = <HTMLInputElement>document.getElementById("fps_slider");
        this.windowBorderCheckbox = <HTMLInputElement>document.getElementById("window_border_checkbox")
        this.windowTitleTextInput = <HTMLInputElement>document.getElementById("window_name_input");
        this.captureCheckbox = <HTMLInputElement>document.getElementById("capture_checkbox");
        this.directorySelectButton = <HTMLButtonElement>document.getElementById("directory_select_button");
        this.fullscreenCheckbox = <HTMLInputElement>document.getElementById("fullscreen_checkbox");
        this.cropCheckbox = <HTMLInputElement>document.getElementById("crop_checkbox");
        this.cropRightCheckbox = <HTMLInputElement>document.getElementById("crop_right_checkbox");
        this.cropLeftCheckbox = <HTMLInputElement>document.getElementById("crop_left_checkbox");
        this.mirroringTimeLabel = <HTMLElement>document.getElementById("mirroring_time");
        this.deviceStatusLabel = <HTMLElement>document.getElementById("device_status");
        this.wifiCheckBox = <HTMLInputElement>document.getElementById("wifi_checkbox");
        this.usbCheckBox = <HTMLInputElement>document.getElementById("usb_checkbox");
        this.deviceStatusIcon = <HTMLElement>document.getElementById("device_status_icon");
        this.timer = null;
        this.indicator = new Spinner();
        this.indicator.hide();
    }

    // 設定を行う
    public setup(): void {
        this.setEventListener();
        ExecController.getInstance().setEventListener(this);
    }

    // イベントリスナーを設定する
    private setEventListener(): void {
        this.startMirroringButton?.addEventListener("click", () => {
            let instance = ExecController.getInstance();
            if (!instance.getIsMirroring()) { // 再生していないとき
                if (this.isCaptureEnable()) {
                    if (this.isCaptureDirectroySelected()) {
                        this.startMirroring();
                    } else {
                        ipcRenderer.send('no_capture_directory_is_selected');
                    }
                } else {
                    this.startMirroring();
                }
            }
        })

        this.endMirroringButton.addEventListener("click", () => {
            this.sropMirroring();
        })

        this.endMirroringButton.addEventListener("mouseover", () => {
            let instance = ExecController.getInstance();
            if (instance.getIsMirroring()) { // ミラーリングしているとき
                let img = <HTMLImageElement>document.getElementById("mirroring_stop_image");
                img.src = "./resources/icon/ico_stop_active.png"
            }
        })

        this.endMirroringButton.addEventListener("mouseleave", () => {
            let instance = ExecController.getInstance();
            if (instance.getIsMirroring()) { // ミラーリングしているとき
                let img = <HTMLImageElement>document.getElementById("mirroring_stop_image");
                img.src = "./resources/icon/ico_stop.png"
            }
        })

        this.maxScreenSizeSlider.addEventListener("change", () => {
            let instance = ExecController.getInstance();
            let val = this.maxScreenSizeSlider.value;
            instance.setMaxSize(Number(val))
        })

        this.fpsSlider.addEventListener("change", () => {
            let instance = ExecController.getInstance();
            let val = this.maxScreenSizeSlider.value;
            instance.setMaxSize(Number(val))
        })

        this.windowBorderCheckbox.addEventListener("change", () => {
            let instance = ExecController.getInstance();
            let val = this.windowTitleTextInput.checked
            instance.setNeedBorder(val)
        })

        this.windowTitleTextInput.addEventListener("change", () => {
            let instance = ExecController.getInstance();
            let val = this.windowTitleTextInput.value
            instance.setWindowTitle(val)
        })

        this.captureCheckbox.addEventListener("change", () => {
            let instance = ExecController.getInstance();
            let val = this.captureCheckbox.checked;
            instance.setNeedCapture(val);
            if (val) { // キャプチャするとき
                this.directorySelectButton.disabled = false;
            } else { // キャプチャしないとき
                this.directorySelectButton.disabled = true;
            }
        })

        this.directorySelectButton.addEventListener("click", () => {
            // メインプロセスに通信する
            ipcRenderer.send('directory_select_button_clicked');

            // メインプロセスからの通信を取得する
            ipcRenderer.on("directory_selected", (event, args) => {
                if (args) {
                    let instance = ExecController.getInstance();
                    instance.setCapturePath(args);
                    this.directorySelectButton.innerText = args
                }
            })
        })

        this.fullscreenCheckbox.addEventListener("change", () => {
            let instance = ExecController.getInstance();
            let val = this.fullscreenCheckbox.checked
            instance.setIsFullScreen(val)
        })

        this.cropCheckbox.addEventListener("change", () => {
            let val = this.cropCheckbox.checked
            let instance = ExecController.getInstance();
            instance.setIsCrop(val)
            if (!val) { // チェックが外れたとき
                this.cropLeftCheckbox.disabled = true;
                this.cropRightCheckbox.disabled = true;
            } else { // チェックが入ったとき
                this.cropLeftCheckbox.disabled = false;
                this.cropRightCheckbox.disabled = false;                
            }
        })

        this.cropLeftCheckbox.addEventListener("change", () => {
            let val = this.cropLeftCheckbox.checked
            let instance = ExecController.getInstance();
            instance.setIsLeftCrop(val)
            if (val) { // 左をcropするとき
                this.cropRightCheckbox.checked = false;
            }
        })

        this.cropRightCheckbox.addEventListener("change", () => {
            let val = this.cropRightCheckbox.checked
            let instance = ExecController.getInstance();
            instance.setIsLeftCrop(!val)
            if (val) {
                this.cropLeftCheckbox.checked = false;
            }
        })

        this.wifiCheckBox.addEventListener("change", () => {
            let val = this.wifiCheckBox.checked

            if (val) { // Wi-Fi接続にチェックがはいったとき
                this.sropMirroring();
                this.disenable();
                ExecController.getInstance().setIsWirealess(true);
                this.deviceStatusLabel.innerText = "Connecting..."
                this.deviceStatusIcon.hidden = true;
                ExecController.getInstance().connectWireless(
                    () => { // Wi-FI接続に成功したとき
                        this.enable();
                        this.usbCheckBox.checked = false;
                        this.deviceStatusLabel.innerText = "Device Ready"
                        this.deviceStatusIcon.setAttribute("style", "background-color: greenyellow")
                        this.deviceStatusIcon.hidden = false;
                        ipcRenderer.send("device_wireless_connected")
                    },
                    () => { // Wi-Fi接続に失敗したとき
                        ExecController.getInstance().setIsWirealess(false);
                        this.wifiCheckBox.checked = false;
                        this.deviceStatusLabel.innerText = "Device Not Ready"
                        this.deviceStatusIcon.hidden = false;
                        this.deviceStatusIcon.setAttribute("style", "background-color: red");
                    }
                );
            }
        })

        this.usbCheckBox.addEventListener("change", () => {
            let val0 = this.usbCheckBox.checked
            if (val0) { // USB接続にチェックが入ったとき
                this.sropMirroring();  
                ExecController.getInstance().setIsWirealess(false);
                this.deviceStatusLabel.innerText = "Connecting..."
                this.deviceStatusIcon.hidden = true;
                this.wifiCheckBox.checked = false
                ExecController.getInstance().isDeviceConnected(
                    () => {
                        this.enable();
                        this.deviceStatusLabel.innerText = "Device Ready"
                        this.deviceStatusIcon.hidden = false;
                        this.deviceStatusIcon.setAttribute("style", "background-color: greenyellow")
                    },
                    () => {
                        this.disenable();
                        this.deviceStatusLabel.innerText = "Device Not Ready"
                        this.deviceStatusIcon.hidden = false;
                        this.deviceStatusIcon.setAttribute("style", "background-color: red");
                        ipcRenderer.send('device_disconected');
                    }
                )
            }
        })

        // ダウンロードを開始したとき
        ipcRenderer.on("download_start", (event, args) => {
            this.disenable();
            this.indicator.show();
            this.deviceStatusIcon.hidden = true;
        })

        // ダウンロードを終了したとき
        ipcRenderer.on("download_end", (event, args) => {
            this.indicator.hide();

            // デバイスの接続を確認する
            let execController = ExecController.getInstance();
            execController.isDeviceConnected(
                () => {
                    this.enable();
                    this.deviceStatusLabel.innerText = "Device Ready"
                    this.deviceStatusIcon.setAttribute("style", "background-color: greenyellow")
                    this.usbCheckBox.checked = true;
                    this.deviceStatusIcon.hidden = false;
                },
                () => { 
                    this.disenable();
                    this.deviceStatusLabel.innerText = "Device Not Ready"
                    this.deviceStatusIcon.setAttribute("style", "background-color: red");
                    this.deviceStatusIcon.hidden = false;
                    ipcRenderer.send('device_disconected');
                 }
            );
        })

        // デバイスの接続を確認できたとき
        ipcRenderer.on("device_conected", (event, args) => {
            this.enable();
            this.deviceStatusLabel.innerText = "Device Ready"
            this.deviceStatusIcon.setAttribute("style", "background-color: greenyellow")
            this.usbCheckBox.checked = true;
        })

        // デバイスの接続を確認できなかったとき
        ipcRenderer.on("device_disconected", (event, args) => {
            this.disenable();
            this.deviceStatusLabel.innerText = "Device Not Ready"
            this.deviceStatusIcon.setAttribute("style", "background-color: red");
            ipcRenderer.send('device_disconected');
        })

        ipcRenderer.send('UIController_is_ready');
    }

    private enable(): void {
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
    }

    private disenable(): void {
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
    }

    
    // ミラーリングが停止したとき
    // scrcpyが直接停止した時に呼び出される
    onEndMirroring(): void {
        let imgStart = <HTMLImageElement>document.getElementById("mirroring_start_image");
        imgStart.src = "./resources/icon/ico_play.png"
        let imgStop = <HTMLImageElement>document.getElementById("mirroring_stop_image");
        imgStop.src = "./resources/icon/ico_stop.png" 
        if (this.timer) {
            this.timer.stop();
        }
    }

    // デバイスが接続されていなかったとき
    onDeviceDisconected(): void {
        this.disenable();
        let imgStart = <HTMLImageElement>document.getElementById("mirroring_start_image");
        imgStart.src = "./resources/icon/ico_play.png"
        this.deviceStatusLabel.innerText = "Device Not Ready"
        this.deviceStatusIcon.hidden = false;
        this.deviceStatusIcon.setAttribute("style", "background-color: red");
        this.wifiCheckBox.checked = false
        this.timer?.stop();
        ipcRenderer.send('device_disconected');
    }

    // タイマーが開始したとき
    onStartTimer(): void {
        if (this.timer) {
            let time = this.timer?.toString();
            this.mirroringTimeLabel.innerText = time
        }
    }

    // タイマーが進んだとき
    onTimerClocked(): void {
        if (this.timer) {
            let time = this.timer?.toString();
            this.mirroringTimeLabel.innerText = time
        }
    }

    // タイマーが停止したとき
    onEndTimer(): void {
        if (this.timer) {
            let time = this.timer?.toString();
            this.mirroringTimeLabel.innerText = time
            this.timer = null;
        }
    }

    // キャプチャが有効か
    private isCaptureEnable(): boolean {
        return this.captureCheckbox.checked
    }

    // ディレクトリが選択されているか
    private isCaptureDirectroySelected(): boolean {
        return this.directorySelectButton.innerText　!= "No Directory Selected"
    }

    // ミラーリングを開始する
    private startMirroring(): void {
        let instance = ExecController.getInstance();
        instance.startMirroring();
        let img = <HTMLImageElement>document.getElementById("mirroring_start_image");
        img.src = "./resources/icon/ico_play_active.png";
        this.timer = new Timer();
        this.timer.setEventListener(this);
        this.timer.start();
    }

    // ミラーリングを停止する
    private sropMirroring(): void {
        let instance = ExecController.getInstance();
        instance.stopMirroring();
        this.timer?.stop();
    }
}