// Cropする位置のEnum・・・TypeScriptの列挙型は問題があるためオブジェクトリテラルで代替
export const CropSide = {
    Left: 0,
    Center: 1,
    Right: 2,
} as const;
export type CropSide = typeof CropSide[keyof typeof CropSide];

// scrcpyの引数に渡す設定情報のクラス
export default class ScrcpySettings {

    // 画面の最大サイズ
    public maxSize: number = 1028;
    // FPS
    public fps: number = 60;
    // Crop
    public isCrop: boolean = true;
    // cropする位置
    public cropSide: CropSide = CropSide.Center;
    // 録画するか
    public needCapture: boolean = false;
    // 保存先
    public capturePath: string = "";
    // Windowのタイトル
    public windowTitle: string = "";
    // Windowのボーダーを表示するか
    public needBorder: boolean = true;
    // フルスクリーンで表示するか
    public isFullScreen: boolean = false;
    // wi-fi接続か
    public isWireless: boolean = false;
    // 端末のip
    public deviceIp: string = "";
    // 端末のシリアル番号
    public deviceSerial: string = "";

    // 引数として返す
    public toArgs(): string[] {
        let args = []

        if (this.isWireless) {
            args.push("-s");
            args.push(this.deviceIp);
        } else {
            args.push("-s");
            args.push(this.deviceSerial);
        }

        if (this.maxSize > 0) {
            args.push("-m")
            args.push(this.maxSize.toString());
        }

        if (this.fps > 0) {
            args.push("--max-fps")
            args.push(this.fps.toString());
        }

        if (this.isCrop) {
            switch(this.cropSide){
                case CropSide.Left:
                    // 左
                    args.push("--crop")
                    args.push('1200:1140:155:170');
                    break;
                case CropSide.Center:
                    // 両目っぽく見えるようにクロップ
                    args.push("-b25M --crop")
                    args.push('1600:900:2017:510');
                    break;
                case CropSide.Right:
                    // 右
                    args.push("--crop")
                    args.push('1200:1140:2275:170');
                    break;
                default:
                    break;
            }
        }

        if(this.needCapture) {
            args.push("--record")
            let date = new Date();
            let year = date.getFullYear().toString();
            let month = (date.getMonth() + 1).toString();
            let day = date.getDate().toString();
            let hours = date.getHours().toString();
            let minutes = date.getMinutes().toString();
            let seconds = date.getSeconds().toString();
            let fileName = "capture(" + year + month + day + hours + minutes + seconds + ").mp4"
            let dstPath = this.capturePath + "\\" + fileName
            args.push(dstPath);
        }

        if(this.windowTitle.length > 0) {
            args.push("--window-title")
            args.push(this.windowTitle.toString());
        }

        if (!this.needBorder) {
            args.push("--window-borderless");
        }

        if (this.isFullScreen) {
            args.push("-f")
        }

        return args
    }
}
