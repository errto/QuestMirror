import { ipcRenderer } from 'electron'
import ExecController from "./ExecController";
import ExecControllerListener from './ExecControllerListener';
import Spinner from './Spiner';

// UIを管理するControllerクラス
export default class UIContoller implements ExecControllerListener {

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
                        instance.startMirroring();
                        let img = <HTMLImageElement>document.getElementById("mirroring_start_image");
                        img.src = "./resources/icon/ico_play_active.png";   
                    } else {
                        ipcRenderer.send('no_capture_directory_is_selected');
                    }
                } else {
                    instance.startMirroring();
                    let img = <HTMLImageElement>document.getElementById("mirroring_start_image");
                    img.src = "./resources/icon/ico_play_active.png";
                }
            }
        })

        this.endMirroringButton.addEventListener("click", () => {
            let instance = ExecController.getInstance();
            instance.stopMirroring();
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

        // ダウンロードを開始したとき
        ipcRenderer.on("download_start", (event, args) => {
            this.startMirroringButton.disabled = true;
            this.endMirroringButton.disabled = true;
            this.maxScreenSizeSlider.disabled = true;;
            this.fpsSlider.disabled = true;
            this.windowBorderCheckbox.disabled = true;
            this.windowTitleTextInput.disabled = true;
            this.captureCheckbox.disabled = true;
            this.fullscreenCheckbox.disabled = true;
            this.cropCheckbox.disabled = true;
            this.cropRightCheckbox.disabled = true;;
            this.cropLeftCheckbox.disabled = true;
            this.indicator.show();
        })

        // ダウンロードを終了したとき
        ipcRenderer.on("download_end", (event, args) => {
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
            this.indicator.hide();
        })
    }

    
    // ミラーリングが停止したとき
    // scrcpyが直接停止した時に呼び出される
    onEndMirroring(): void {
        let imgStart = <HTMLImageElement>document.getElementById("mirroring_start_image");
        imgStart.src = "./resources/icon/ico_play.png"
        let imgStop = <HTMLImageElement>document.getElementById("mirroring_stop_image");
        imgStop.src = "./resources/icon/ico_stop.png" 
    }

    // デバイスが接続されていなかったとき
    onDeviceDisconected(): void {
        // startボタンを元に戻す
        let imgStart = <HTMLImageElement>document.getElementById("mirroring_start_image");
        imgStart.src = "./resources/icon/ico_play.png"
        // ダイアログを表示するよう通知する
        ipcRenderer.send('device_disconected');
    }

    // キャプチャが有効か
    private isCaptureEnable(): boolean {
        return this.captureCheckbox.checked
    }

    // ディレクトリが選択されているか
    private isCaptureDirectroySelected(): boolean {
        console.log(this.directorySelectButton.innerText);
        return this.directorySelectButton.innerText　!= "No Directory Selected"
    }
}