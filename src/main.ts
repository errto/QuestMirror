import {app, BrowserWindow, dialog, ipcMain} from 'electron'
import AssetsDownloader from './AssetsDownloader'
import ExecController from './ExecController'

// メインウィンドウ
let mainWindow: Electron.BrowserWindow | null = null

// アプリが起動するとき
app.on('ready', () => {
    
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

    // scrcpyをダウンロードする
    let downloader = AssetsDownloader.getInstance();
    if (!downloader.getHasDownloaded()) { // scrcpyがダウンロードされていないとき
        var options = {
            title: 'Download',
            type: 'info',
            buttons: ['OK'],
            message: 'scrcpy is required',
            detail: "This App need scrcpy(https://github.com/Genymobile/scrcpy). Press button to download it."
        };
        let result = dialog.showMessageBox(mainWindow, options);

        result.then((res) => {
            let mrv = <Electron.MessageBoxReturnValue>res
            mainWindow?.webContents.send("download_start");
            downloader.downloadAssets(() => {
                const dstpath: string = __dirname +  "\\scrcpy";
                const srcpath: string = __dirname + "\\scrcpy.zip";
                downloader.unzipFile(srcpath, dstpath);
                mainWindow?.webContents.send("download_end")
            });
        });
    }

    // デバイスが接続されてないとき
    ipcMain.on("device_disconected", async () => {
        if (mainWindow) {
            var options = {
                title: 'No device is connected',
                type: 'info',
                buttons: ['OK'],
                message: 'No device is connected.',
                detail: "Please connect your Oculus Quest device via USB cable."
            };
            await dialog.showMessageBox(mainWindow, options);
            let execController = ExecController.getInstance();
            execController.isDeviceConnected(
                () => { mainWindow?.webContents.send("device_conected") },
                () => { mainWindow?.webContents.send("device_disconected") }
            );
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
    ipcMain.on("UIController_is_ready", () => {
        if (downloader.getHasDownloaded()) {
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
})