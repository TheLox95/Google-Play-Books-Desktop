import * as $ from 'jquery';
const remote = require('electron').remote;

const readerWindow = remote.getCurrentWindow()
readerWindow.webContents.on('will-navigate', () =>{
    console.log('will navigate');
    readerWindow.close();
})