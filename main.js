// ------------------------ electron stuff -------------------------------------------
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const url = require('url')
let mainWindow

// Funtion to check the current OS. As of now there is no proper method to add auto-updates to linux platform.
function isWindowsOrmacOS() {
    return process.platform === 'darwin' || process.platform === 'win32';
}

function createWindow() {
    var electronScreen = electron.screen;
    var displays = electronScreen.getAllDisplays();
    var externalDisplay = null;

    for (var i in displays) {
        if (displays[i].bounds.x != 0 || displays[i].bounds.y != 0) {
            externalDisplay = displays[i];
            break;
        }
    }

    if (externalDisplay) {
        mainWindow = new BrowserWindow({
            x: externalDisplay.bounds.x + 50,
            y: externalDisplay.bounds.y + 50
        });
        mainWindow.maximize()
    } else {
        mainWindow = new BrowserWindow()
        mainWindow.maximize()
    }


    mainWindow.loadURL(`file://${__dirname}/dist-angular/index.html`)
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
    const page = mainWindow.webContents;

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    // Create the Application's main menu
    var template = [{
        label: "Camaleon",
        submenu: [
            { label: "About Camaleon", selector: "orderFrontStandardAboutPanel:" },
            { label: "Check for Updates...", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function () { app.quit(); } }
        ]
    }, {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]
    }
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));

}

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})

var http = require('http'),
    path = require('path'),
    express = require('express'),
    router = express(),
    server = http.createServer(router)

router.get('/macaddress', function (req, res) {
    require('getmac').getMac(function (err, macAddress) {
        if (err) {
            res.status(400).send({ data: null, errors: Array.of("There was an error getting the macaddress") })
        }
        res.status(200).send({ data: { macaddress: macAddress } })
    })
})

// open port configuration
server.listen(4578, process.env.IP || "0.0.0.0", function () {
    var addr = server.address();
});