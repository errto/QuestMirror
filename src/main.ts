import {app, BrowserWindow, dialog, ipcMain} from 'electron'
import AssetsDownloader from './AssetsDownloader'

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
        height: 600,
    })

    mainWindow.removeMenu();

    // ウィンドウが閉じたとき
    mainWindow.on('closed', () => {
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

    // デバイスが接続されていないとき
    ipcMain.on("device_disconected", () => {
        if (mainWindow) {
            var options = {
                title: 'Device Disconected',
                type: 'info',
                buttons: ['OK'],
                message: 'Device Disconected.',
                detail: "Please conect Oculus Deice."
            };
            dialog.showMessageBox(mainWindow, options);
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