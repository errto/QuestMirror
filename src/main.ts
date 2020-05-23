import {app, BrowserWindow, dialog, ipcMain} from 'electron'
import ExecController from './ExecController'
import OAL from './OAL'
import PackageDownloader from './PackageDownloader'

// メインウィンドウ
let mainWindow: Electron.BrowserWindow | null = null

// アプリが起動するとき
app.on('ready', async () => {
    
    // メインウィンドウを生成
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
        },
        width: 300,
        height: 300,
    })

    mainWindow.removeMenu();

    // ウィンドウが閉じたとき
    mainWindow.on('closed', () => {
        ExecController.getInstance().disconnect();
        mainWindow = null
    })
    
    // htmlをロード
    mainWindow.loadURL('file://' + __dirname + '/index.html')

    // デバイスが接続されてないとき
    ipcMain.on("device_disconected", async () => {
        if (mainWindow) {
            var options = {
                title: 'No device is connected',
                type: 'info',
                buttons: ['OK', 'Cancel'],
                message: 'No device is connected.',
                detail: "Please connect your Oculus Quest device via USB cable."
            };
            let result = await dialog.showMessageBox(mainWindow, options);
            if (result.response == 1) { // アプリを閉じるとき
                app.quit()
            } else {
                let execController = ExecController.getInstance();
                execController.isDeviceConnected(
                    () => { mainWindow?.webContents.send("device_conected") },
                    () => { mainWindow?.webContents.send("device_disconected") }
                );
            }
        }
    })

    // デバイスがワイアレス接続されたとき
    ipcMain.on("device_wireless_connected", () => {
        if (mainWindow) {
            var options = {
                title: 'Device is connected',
                type: 'info',
                buttons: ['OK'],
                message: 'Device is connected wirelessly!',
                detail: "Please unplug USB cable."
            };
            dialog.showMessageBox(mainWindow, options);
        }
    })

    // UIControllerの設定が完了したとき
    ipcMain.on("UIController_is_ready", async () => {
        let hasDownloaded = await downloader.getHasDownloaded()
        if (hasDownloaded) {
            let execController = ExecController.getInstance();
            execController.isDeviceConnected(
                () => { mainWindow?.webContents.send("device_conected") },
                () => { mainWindow?.webContents.send("device_disconected") }
            );
        }
    })

    ipcMain.on("directory_select_button_clicked", async (event, args) => {
        if (mainWindow) { // メインウィンドウが存在するとき
            let result = await dialog.showOpenDialog(mainWindow, {
                properties: ['openDirectory', "createDirectory"]
            });
            let path = result.filePaths[0]
            mainWindow.webContents.send("directory_selected", path)
        }
    })

    // ディレクトリ選択ボタンが押されたとき
    ipcMain.on("directory_select_button_clicked", async (event, args) => {
        if (mainWindow) { // メインウィンドウが存在するとき
            let result = await dialog.showOpenDialog(mainWindow, {
                properties: ['openDirectory', "createDirectory"]
            });
            let path = result.filePaths[0]
            mainWindow.webContents.send("directory_selected", path)
        }
    })

    // キャプチャディレクトリが選択されていないとき
    ipcMain.on("no_capture_directory_is_selected", () => {
        if (mainWindow) {
            var options = {
                title: 'No capture directory is selected',
                type: 'info',
                buttons: ['OK'],
                message: 'No Capture Directory is Selected.',
                detail: "Please select a Directory to Save Capture Video."
            };
            dialog.showMessageBox(mainWindow, options);
        }
    })

    // scrcpyをダウンロードする
    let downloader = PackageDownloader.getInstance();
    let hasDownloaded = await downloader.getHasDownloaded(); 
    if (!hasDownloaded) { // 必要なパッケージがダウンロードされていないとき
        // ダウンロードダイアログを表示する
        let requirePackages = downloader.getRequirePackages();
        let detail = ""
        for (let i = 0; i < requirePackages.length; i++) {
            if (OAL.getInstance().isMac()) {
                detail += requirePackages[i].toString() + "\n"
            } else {
                detail += requirePackages[i].toString() + "\r\n"
            }
        }
        detail += "\n" + "Press button to download it."

        var options = {
            title: 'Download',
            type: 'info',
            buttons: ['OK'],
            message: 'This app requires the following packages',
            detail: detail
        };
        let result = dialog.showMessageBox(mainWindow, options);

        // ダウンロードを開始する
        result.then((res) => {
            mainWindow?.webContents.send("download_start");
            downloader.downloadPackages(() => {
                setTimeout(() => { 
                    mainWindow?.webContents.send("download_end")
                }, 2500)
            });
        });
    }
})