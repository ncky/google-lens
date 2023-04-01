const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
	"api", {
		screenshot: () => { return ipcRenderer.invoke('screenshot') },
	}
);