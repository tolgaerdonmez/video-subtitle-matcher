const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const url = require("url");
const isDev = require("electron-is-dev");
const path = require("path");
const fileUtils = require("../utils/file");

class MainWindow extends BrowserWindow {
	constructor(options) {
		super(options);
		this.init();
		this.video_path = null;
		this.videos = [];
		this.subtitle_path = null;
		this.subtitles = [];
	}

	init = () => {
		this.loadURL(
			isDev
				? "http://localhost:3000"
				: url.format({
						pathname: path.join(__dirname, "../../index.html"),
						protocol: "file:",
						slashes: true,
				  }),
		);
		this.createMainMenu();

		this.ipcInit();
	};

	createMainMenu = () => {
		const mainMenuTemplate = [
			{
				label: "File",
				submenu: [
					{ role: "reload" },
					{
						label: "Quit",
						role: "quit",
					},
				],
			},
		];

		if (process.platform === "darwin") {
			mainMenuTemplate.unshift({
				label: app.name,
			});
		}

		if (isDev) {
			mainMenuTemplate.push({
				label: "Developer Tools",
				submenu: [
					{
						label: "Toggle DevTools",
						click(item, focusedWindow) {
							focusedWindow.toggleDevTools();
						},
						accelerator: process.platform === "darwin" ? "Command+I" : "Ctrl+I",
					},
					{ role: "reload" },
				],
			});
		}

		const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
		Menu.setApplicationMenu(mainMenu);
	};

	ipcInit = () => {
		ipcMain.on("dialog:videos", async () => {
			try {
				const d = await dialog.showOpenDialog({ properties: ["openDirectory"] });
				if (d.canceled) throw new Error("Select Directory Canceled!");

				this.video_path = d.filePaths[0];

				this.videos = await fileUtils.readDir(this.video_path, "video");
				this.webContents.send("load:videos", this.videos);
			} catch (error) {
				console.log(error.message);
			}
		});

		ipcMain.on("dialog:subtitles", async () => {
			try {
				const d = await dialog.showOpenDialog({ properties: ["openDirectory"] });
				if (d.canceled) throw new Error("Select Directory Canceled!");

				this.subtitle_path = d.filePaths[0];

				this.subtitles = await fileUtils.readDir(this.subtitle_path, "subtitle");
				this.webContents.send("load:subtitles", this.subtitles);
			} catch (error) {
				console.log(error.message);
			}
		});

		ipcMain.on("rename-files", () => {
			try {
				const res = fileUtils.renameFiles(
					{ path: this.video_path, files: this.videos },
					{ path: this.subtitle_path, files: this.subtitles },
				);
				dialog.showMessageBox({
					title: "Complete",
					message: `Successfully renamed\nSubtitle Backup Location: ${path.join(
						res.backup.backupPath,
						res.backup.backupFolder,
					)}`,
					type: "info",
				});
				this.reload();
			} catch (error) {
				dialog.showErrorBox("Error while renaming!", error.message);
			}
		});

		ipcMain.on("reload", () => {
			this.reload();
		});
	};
}

module.exports = MainWindow;
