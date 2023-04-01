const { app, BrowserWindow, shell, ipcMain } = require('electron')
const fs = require('fs')
const { exec } = require('child_process');
const path = require('path');
const util = require('util');
const axios = require("axios");
const FormData = require('form-data');

const execPromise = util.promisify(exec);

async function takeScreenshot() {
	try {
		await execPromise('ksnip -r --saveto ./screenshot.png');
		const screenshot = path.join(__dirname, 'screenshot.png')
		fs.existsSync(screenshot);
		return screenshot;
	} catch (err) {
		// handle error
		//console.error(err);
		const lens = path.join(__dirname, 'lens.png');
		return lens;
	}
}

async function uploadLensImage(imagePath, lang = 'en') {
	const imageUrl = `https://${generateRandomString(12)}.com/${generateRandomString(12)}`;
	const formData = new FormData();
	formData.append('encoded_image', fs.createReadStream(path.resolve(imagePath)));
	formData.append('image_url', imageUrl);
	formData.append('sbisrc', 'Chromium 98.0.4725.0 Windows');
	try {
		const response = await axios.post(`https://lens.google.com/upload?hl=${lang}&lr=${lang}&ep=ccm&s=&st=${generateRandomString(12)}`, formData, {
			headers: {
				...formData.getHeaders(),
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4725.0 Safari/537.36',
			},
		});
		const matches = response.data.match(/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/);
		if (matches) {
			return matches[0];
		}
	} catch (error) {
		console.error(error);
	}
}

function generateRandomString(n) {
	const s = "abcdefghijklmnopqrstuvwxyz0123456789";
	let str = "";
	for (let i = 0; i < n; i++) {
		str += s[Math.floor(Math.random() * s.length)];
	}
	return str;
}

const createWindow = () => {
	const win = new BrowserWindow({
		width: 600,
		height: 1000,
		icon: './lens.png',
		autoHideMenuBar: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true
		}
	})

	win.loadURL('https://lens.google.com/search?p=&hl=en-US')

	win.webContents.on('did-finish-load', () => {
		// Handle new-window event
		win.webContents.setWindowOpenHandler((details) => {
			shell.openExternal(details['url']);
			return {
				action: 'deny'
			}
		});

		//inject own code to add functionality and remove unwanted elements.
		fs.readFile('./inject.js', 'utf-8', (err, data) => {
			if (err) throw err
			win.webContents.executeJavaScript(data)
		})
		fs.readFile('./style.css', 'utf-8', (err, data) => {
			if (err) throw err
			win.webContents.insertCSS(data)
		})
	})

}

app.whenReady().then(() => {
	createWindow()
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('screenshot', async (event, args) => {
	return new Promise(function(resolve, reject) {
		takeScreenshot().then(result => {
			(async () => {
				try {
					uploadLensImage(result).then((url) => {
						// console.log(url);
						const window = BrowserWindow.getFocusedWindow();
						window.loadURL(url);
						// delete the screenshot
						fs.unlink('./screenshot.png', (err) => {
							if (err) {
								console.error(err);
							}
						});
					});
				} catch (error) {
					console.error(error);
				}
			})();
		});
	});
});