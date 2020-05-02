const { ipcRenderer } = require("electron");
const videoDialogBtn = document.getElementById("select-videos");
const subtitleDialogBtn = document.getElementById("select-subtitles");
const renameBtn = document.getElementById("rename");

const fileList = document.getElementsByClassName("file-list-buttons")[0];
const videoList = document.getElementById("video-list");
const subtitleList = document.getElementById("subtitle-list");

videoDialogBtn.addEventListener("click", () => {
	ipcRenderer.send("dialog:videos", "");
});

subtitleDialogBtn.addEventListener("click", () => {
	ipcRenderer.send("dialog:subtitles", "");
});

renameBtn.addEventListener("click", () => {
	ipcRenderer.send("rename-files", "");
});

function createItem(text) {
	const listElement = document.createElement("li");
	listElement.className = "list-group-item d-flex justify-content-between align-items-center";
	const textNode = document.createTextNode(text);

	listElement.appendChild(textNode);
	return listElement;
}

function enableRenameButton() {
	if (videoList.children.length && subtitleList.children.length) {
		renameBtn.classList.toggle("disabled");
		renameBtn.disabled = false;
	}
}

ipcRenderer.on("load:videos", (e, videos) => {
	if (videos.length) {
		videoList.innerHTML = "";
		videos.forEach((video) => {
			videoList.appendChild(createItem(video));
		});
		enableRenameButton();
		videoDialogBtn.classList.toggle("hide");
		fileList.children[0].classList.add("h-auto", "align-items-start");
	}
});

ipcRenderer.on("load:subtitles", (e, subtitles) => {
	if (subtitles.length) {
		subtitleList.innerHTML = "";
		subtitles.forEach((subtitle) => {
			subtitleList.appendChild(createItem(subtitle));
		});
		enableRenameButton();
		subtitleDialogBtn.classList.toggle("hide");
		fileList.children[1].classList.add("h-auto", "align-items-start");
	}
});
