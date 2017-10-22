require('dotenv').load();

const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, globalShortcut, ipcMain} = electron;
// const {Menu} = electron;

const Twitter = require('twitter');
var client = new Twitter({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token_key: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

let mainWindow;
let responseWindow;

app.on('ready',function(){
    mainWindow = new BrowserWindow({
        width: 400,
        height: 250,
        resizable: false,
        title: 'Tweeper - Quickly tweet out!!',
        icon: path.join(__dirname,'icons/icon.png')
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'index.html'),
        protocol: 'file',
        slashes: true
    }));
    //mainWindow.webContents.openDevTools();
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

function createSuccessResponseWindow() {
    responseWindow = new BrowserWindow({
        width: 150,
        height: 75,
        resizable: false,
        
    });
    responseWindow.loadURL(url.format({
        pathname: path.join(__dirname,'success.html'),
        protocol: 'file',
        slashes: true
    }));
}
function createFailureResponseWindow() {
    responseWindow = new BrowserWindow({
        width: 150,
        height: 75,
        resizable: false,
        
    });
    responseWindow.loadURL(url.format({
        pathname: path.join(__dirname,'fail.html'),
        protocol: 'file',
        slashes: true
    }));
}
// catch message:tweet
ipcMain.on('message:tweet',function(e,message){
    // console.log(message);
    var payload = {status: message};
    client.post('statuses/update',payload, function(error, tweet) {
        var resp;
        if (!error) {
            resp = 'Tweeted Successfully';
            console.log(tweet.text);
            createSuccessResponseWindow();
            
        }
        else {
            resp = 'Unsuccessful';
            console.log(error);
            createFailureResponseWindow();
        }
    });
})

