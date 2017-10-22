require('dotenv').load();
const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, globalShortcut} = electron;
// const {Menu} = electron;

let mainWindow;

app.on('ready',function(){
    mainWindow = new BrowserWindow({
        width: 300,
        height: 200
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'index.html'),
        protocol: 'file',
        slashes: true
    }));
    mainWindow.webContents.openDevTools();
    globalShortcut.register('CommandOrControl+Q',()=>{
        // shutdown
        app.quit();
    })
    // not working
    //const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Menu.setApplicationMenu(mainMenu);
});
app.on('window-all-closed',function(){
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Menu
const mainMenuTemplate = [
    {
        label: 'File'
    }
];
