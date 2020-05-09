import { IncomingMessage } from "electron";
import extract from "extract-zip";
import fs from "fs";
import https from "https";

// scrcpyのassetsのダウンローダー
export default class AssetsDownloader {

    // インスタンス
    private static instance: AssetsDownloader;
    // assetesがダウンロード済みか
    private hasDonwnloaded: boolean;

    // コンストラクタ
    private constructor() {
        this.hasDonwnloaded = false
    }

    // インスタンスを取得する
    public static getInstance(): AssetsDownloader {
        if (!this.instance) { // インスタンスが存在しないとき
            this.instance = new AssetsDownloader();
        }
        return this.instance
    }

    // ダウンロード済みか
    public getHasDownloaded(): boolean {
        const path: string = __dirname + "\\scrcpy\\scrcpy.exe";
        try {
            fs.statSync(path)
        } catch (e) {
            this.hasDonwnloaded = false
            return this.hasDonwnloaded;
        }
        this.hasDonwnloaded = true
        return this.hasDonwnloaded
    }

    // assetsをダウンロードする
    public downloadAssets(callback: Function): void {
        let url = "https://github.com/Genymobile/scrcpy/releases/download/v1.13/scrcpy-win64-v1.13.zip"
        const path: string = __dirname + "\\scrcpy.zip";
        this.requestHttps(url, path, callback)
    }

    // httpsリクエストを投げる
    private requestHttps(url: string, savePath: string, callback: Function | null = null): void {
        let request = https.get(url, (res) => {
            let resMessage = <IncomingMessage>res
            if (resMessage.statusCode == 200) { // ダウンロードするとき
                var file = fs.createWriteStream(savePath);
                res.on('data', function(chunk){
                    file.write(chunk);
                }).on('end', function(){
                    file.end();
                    if (callback) {
                        callback();
                    }
                });
            } else if (resMessage.statusCode == 302) { // リダイレクトするとき
                let redirectUrl = <string>res.headers.location
                this.requestHttps(redirectUrl, savePath, callback);
            }
        })  
    }

    // zipファイルを解凍する
    public async unzipFile(srcPath: string, dstPath: string): Promise<void> {
        try {
            await extract(srcPath, { dir: dstPath })
          } catch (err) {
            console.error('Extraction failed.')
          }
    }
}