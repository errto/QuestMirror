import fs from "fs"
import * as child from "child_process"
import { promisify } from "util";
import StringUtil from "./StringUtil";
const exec = promisify(child.exec);
const writeFile = promisify(fs.writeFile);

// 端末とのネットワークを管理するクラス 
export default class NetworkManager {

    // インスタンス
    private static instance: NetworkManager;

    // コンストラクタ
    private constructor() {
    }

    // インスタンスを取得する
    public static getInstance(): NetworkManager {
        if (!this.instance) { // インスタンスが存在しないとき
            this.instance = new NetworkManager();
        }
        return this.instance
    }

    // デフォルトゲートウェイを取得する
    public async getDefaultGateway(): Promise<string> {
        let result = await exec("chcp 65001>nul && ipconfig");
        let strlines = StringUtil.getLines(String(result.stdout));
        for (let i = 0; i < strlines.length; i++) {
            let next = i + 1;
            if (next >= strlines.length) {
                break
            }
            if (strlines[i].indexOf("Default Gateway") > 0 && strlines[next].length > 0) {
                return strlines[i + 1].trim()
            }
        }
        return "";
    }

    //プライベートネットワークに接続している端末を探す
    public async findDevicesIP() {
        console.log("[NetworkManager.findDevicesIP()]")
        let defaultGateway = await this.getDefaultGateway();
        console.log("Default Gateway: " + defaultGateway);
    }


}