const electron = require("electron");
const isDev = require("electron-is-dev");
if (isDev) require("electron-reload")(__dirname);
const path = require("path");
const MainWindow = require("./windows/MainWindow");
const { app } = electron;

let mainWindow;

function createMainWindow() {
	const width = 800;
	const height = 800;
	mainWindow = new MainWindow({
		width: width,
		height: height,
		minWidth: width,
		minHeight: height - 300,
		maxWidth: width,
		webPreferences: { preload: path.join(__dirname, "preload.js") },
		icon: path.join(__dirname, "assets/icons/png/1204x1024.png"),
	});

	mainWindow.on("close", () => {
		mainWindow = null;
	});
}

app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createMainWindow();
	}
});
