import OAL from "./OAL";
import Package from "./Package";

// scrcpyのassetsのダウンローダー
export default class PackageDownloader {

    // インスタンス
    private static instance: PackageDownloader;
    // ダウンロードが必要なパッケージ
    private requirePackages: Package[];

    // コンストラクタ
    private constructor() {
        this.requirePackages = []
    }

    // インスタンスを取得する
    public static getInstance(): PackageDownloader {
        if (!this.instance) { // インスタンスが存在しないとき
            this.instance = new PackageDownloader();
        }
        return this.instance
    }

    // ダウンロードが必要なパッケージを返す
    public getRequirePackages(): Package[] {
        return this.requirePackages;
    }

    // ダウンロード済みか
    public async getHasDownloaded(): Promise<boolean> {
        console.log("PackageDownloader.getHasDownloaded()");
        let packages = await OAL.getInstance().checkPackages();
        if (packages.length == 0) {
            return true;
        }
        this.requirePackages = packages;
        for (let i = 0; i < this.requirePackages.length; i++) {
            console.log("PackageDownloader.getHasDownloaded() required package: " + packages[i].toString());
        }
        return false
    }

    // assetsをダウンロードする
    public downloadPackages(callback: Function): void {
        OAL.getInstance().downloadPackages(this.requirePackages, callback);
    }
}