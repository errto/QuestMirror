import * as child from "child_process"
import extract from "extract-zip";
import fs, { Stats } from "fs";
import path from "path";
import https from "https";
import { IncomingMessage } from "http";
import { promisify } from "util";

import Package from "./Package";
import StringUtil from "./StringUtil";
import { ipcMain, BrowserWindow } from "electron";

const execFile = promisify(child.execFile)
const scrcpyDir = 'scrcpy/scrcpy-win64-v2.0'

function spawn(cmd: string, args: string[]) : Promise<void> {
    return new Promise((resolve)=>{
        let p = child.spawn(cmd,args);
        p.on('exit', (code)=>{
            resolve();
        });
        p.stdout.setEncoding('utf-8');
        p.stdout.on('data', (data)=>{
            console.log(data);
        });
        p.stderr.on('data', (data)=>{
            console.log(data);
        });
    })
}

// OS抽象化レイヤー
export default class OAL {

    // インスタンス
    private static instance: OAL;

    // コンストラクタ
    private constructor() {
    }

    // インスタンスを取得する
    public static getInstance(): OAL {
        if (!this.instance) { // インスタンスが存在しないとき
            this.instance = new OAL();
        }
        return this.instance
    }

    // Macか
    public isMac(): boolean {
        return process.platform == "darwin"
    }

    // パッケージをチェックする
    public async checkPackages(): Promise<Package[]> {
        let packages = []
        if (this.isMac()) { // Macのとき
            let res0 = await this.checkHomebrew();
            if (res0) {
                packages.push(res0)
            }

            let res1 = await this.checkScrcpy();
            if (res1) {
                packages.push(res1)
            }

            let res2 = await this.checkAdb();
            if (res2) {
                packages.push(res2)
            }
        } else { // Windowsのとき
            let res = await this.checkScrcpy();
            if (res) {
                packages.push(res);
            }
        }
        return packages;
    }

    // パッケージをダウンロードする
    public async downloadPackages(packages: Package[], callback: Function): Promise<void> {
        if (this.isMac()) { // Macのとき
            for (let i = 0; i < packages.length; i++) {
                let p = packages[i];
                console.log("Download Package: " + p.getName())
                if (p.getName() == "adb") {
                    await execFile("brew", ["cask", "install", "android-platform-tools"]);
                }

                if (p.getName() == "scrcpy") {
                    await execFile("brew", ["install", "scrcpy"]);
                }
            }
            callback()
        } else { // Windowsのとき
            let url = "https://github.com/Genymobile/scrcpy/releases/download/v2.0/scrcpy-win64-v2.0.zip"
            const scrPath: string =  path.join(__dirname, "scrcpy.zip");
            this.requestHttps(url, scrPath, () => {
                const dstpath: string = path.join(__dirname, "scrcpy");
                const srcpath: string = path.join(__dirname, "scrcpy.zip");
                this.unzipFile(srcpath, dstpath);
                callback();
            })
        }
    }

    // デバイスの接続を確認する
    public async isDeviceConnected(): Promise<string | null> {
        if (OAL.getInstance().isMac()) { // Macのとき
            let result = await execFile("adb", ["devices","-l"]);
            return this.getDeviceSerial(result.stdout);
        } else { // Windowsのとき
            let cmd = path.join(__dirname, scrcpyDir , 'adb.exe');
            let result = await execFile(cmd, ["devices","-l"]);
            let serail = this.getDeviceSerial(result.stdout);
            return serail
        }
    }

    // scrcpyを起動する
    public launchSrccpy(args :string[], closeCallback: Function): void {
        let cmd = ""
        if (this.isMac()) {
            cmd = "scrcpy";
        } else {
            cmd = path.join(__dirname, scrcpyDir, 'scrcpy.exe');
        }
        let cp = child.spawn(cmd, args, { 'shell': true });
        cp.on('close', () => closeCallback());
    }

    // scrcpyを終了する
    public async exitSrccpy(): Promise<void> {
        if (this.isMac()) {
            let pid = await this.getPID();
            if (pid) {
                execFile("kill", [pid])
            }
        } else {
            let args = ["/im", "scrcpy.exe"]
            execFile("taskkill", args)
        }
    }

    // デバイスのIPを取得する
    public async getIP(deviceSerial: string): Promise<string | null> {
        let cmd = ""
        if (this.isMac()) {
            cmd = "adb";
        } else {
            cmd = path.join(__dirname, scrcpyDir, 'adb.exe');
        }
        let result = await execFile(cmd, ["-s", deviceSerial, "shell", "ip", "addr", "show", "wlan0"]);

        let strLines = StringUtil.getLines(result.stdout)
        for (let i = 0; i < strLines.length; i++) {
            // IPv4アドレスを取得
            if (strLines[i].indexOf("inet ") >= 0) {
                const regex = /inet (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/;
                const match = strLines[i].match(regex);

                if (match && match[1]) {
                    return match[1];
                }
            }
        }
        return null;
    }

    // TCPIPで接続する
    public async connectTCPIP(deviceSerial: string, ip: string,
        successCallback: Function, failedCallback: Function): Promise<void> {
        let cmd = ""
        if (this.isMac()) {
            cmd = "adb";
        } else {
            cmd = path.join(__dirname, scrcpyDir, 'adb.exe');
        }
        await execFile(cmd, ["-s", deviceSerial, "tcpip","5555"]);
        let result = await execFile(cmd, ["connect", ip+ ":5555"]).catch(() => {
            failedCallback();
            return null
        })

        if (result) {
            successCallback();
        }
    }

    // デバイスの接続を切る
    public discconct(): void {
        let cmd = ""
        if (this.isMac()) {
            cmd = "adb";
        } else {
            cmd = path.join(__dirname, scrcpyDir, 'adb.exe');
        }
        execFile(cmd, ["disconnect"]);
    }

    // httpsリクエストを投げる
    private requestHttps(url: string, savePath: string, callback: Function): void {
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

    // homebrewが起動するか
    private async checkHomebrew(): Promise<Package | null> {
        let result = await execFile("brew", ["-v"]).catch((error) => {
            return new Package("homebrew", "https://brew.sh/");
        })

        if (result instanceof Package) {
            return result
        } else {
            return null;
        }
    }

    // scrcpyが起動するか
    private async checkScrcpy(): Promise<Package | null> {
        if (this.isMac()) { // Macのとき
            let result = await execFile("scrcpy", ["-v"]).catch((error) => {
                return new Package("scrcpy", "https://github.com/Genymobile/scrcpy");
            })

            if (result instanceof Package) {
                return result
            } else {
                return null;
            }
        } else { // Windowsのとき
            const scrPath: string = path.join(__dirname, scrcpyDir, "scrcpy.exe");
            try {
                fs.statSync(scrPath)
            } catch (e) {
                return new Package("scrcpy", "https://github.com/Genymobile/scrcpy");
            }
            return null
        }
    }

    // adbが起動するか
    private async checkAdb(): Promise<Package | null> {
        let result = await execFile("adb", ["--version"]).catch((error) => {
            return new Package("adb", "https://developer.android.com/studio/command-line/adb?hl=en");
        })

        if (result instanceof Package) {
            return result
        } else {
            return null;
        }
    }

    // zipファイルを解凍する
    private async unzipFile(srcPath: string, dstPath: string): Promise<void> {
        try {
            await extract(srcPath, { dir: dstPath })
        } catch (err) {
            console.error('Extraction failed.')
        }
    }

    // デバイス番号を取得する
    private getDeviceSerial(stdout: string): string | null {
        let strLines = StringUtil.getLines(stdout);
        for (let i = 1; i < strLines.length; i++) {
            if (strLines[i].indexOf("Quest") > 0 && strLines[i].indexOf("192.168") < 0) {
                let st = 0;
                let ed = strLines[i].indexOf(" ");
                let deviceSerial = strLines[i].slice(st, ed);
                return deviceSerial
            }
        }
        return null;
    }

    // プロセスIDを取得する
    private async getPID(): Promise<string | null> {
        let result = await execFile("ps", ["aux"]);
        let strLines = StringUtil.getLines(result.stdout);
        for (let i = 0; i < strLines.length; i++) {
            if (strLines[i].indexOf("scrcpy -s") > 0) {
                let st = strLines[i].indexOf(" ");
                let ed = strLines[i].indexOf(" ", st + 2);
                let pid = strLines[i].slice(st, ed);
                return pid
            }
        }
        return null
    }
}