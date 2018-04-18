// Basic init
const electron = require('electron')
const { app, BrowserWindow } = electron

// Let electron reloads by itself when webpack watches changes in ./app/
require('electron-reload')(__dirname)

// To avoid being garbage collected
let mainWindow

app.setAppUserModelId('electron-windows-notifications')

app.on('ready', () => {
    let mainWindow = new BrowserWindow({ width: 800, height: 600, icon: 'app/electron.png' })
    mainWindow.loadURL(`file://${__dirname}/app/index.html`)
    const ipcMain = require('electron').ipcMain
    ipcMain.on('new-debt-added', function(event, arg) {
        console.log(arg)
        mainWindow.webContents.send('new-debt-added', arg)
    })
})

