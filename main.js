const electron = require("electron");
const path = require("path");
const MainWindow = require("./windows/mainWindow");

const { app } = electron;

//production
process.env.NODE_ENV = "production";

let mainWindow;

function createMainWindow() {
	const width = 800;
	const height = 800;
	mainWindow = new MainWindow({
		width: width,
		height: height,
		minWidth: width,
		minHeight: height,
		maxWidth: width,
		webPreferences: { nodeIntegration: true },
		icon: path.join(__dirname, "assets/icons/png/icon.png"),
	});

	mainWindow.on("close", () => {
		mainWindow = null;
	});
}

app.on("ready", createMainWindow);
