const electron = require("electron");
const MainWindow = require("./windows/mainWindow");

const { app } = electron;

let mainWindow;

function createMainWindow() {
	const width = 800;
	const height = 500;
	mainWindow = new MainWindow({
		width: width,
		height: height,
		minWidth: width,
		minHeight: height,
		webPreferences: { nodeIntegration: true },
	});

	mainWindow.on("close", () => {
		mainWindow = null;
	});
}

app.on("ready", createMainWindow);
