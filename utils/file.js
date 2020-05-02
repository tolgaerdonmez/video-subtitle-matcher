const path = require("path");
const fs = require("fs");
const videoExtensions = require("./videoExtensions.json");
const subtitleExtensions = require("./subtitleExtensions.json");

module.exports.getExt = (fileName) => {
	let ext = path.extname(fileName);
	ext = ext.slice(1, ext.length);
	return ext;
};

module.exports.getName = (fileName) => {
	let name = path.basename(fileName);
	const ext = this.getExt(name);
	name = name.replace(ext, "");
	return name;
};

module.exports.isVideo = (fileName) => {
	const ext = this.getExt(fileName);
	return videoExtensions.some((x) => x == ext);
};

module.exports.isSub = (fileName) => {
	const ext = this.getExt(fileName);
	return subtitleExtensions.some((x) => x == ext);
};

module.exports.readDir = async (path, filter = null) => {
	let files = fs.readdirSync(path);
	if (filter !== null) {
		const check = (fileName) =>
			filter == "video" ? this.isVideo(fileName) : filter == "subtitle" ? this.isSub(fileName) : null;
		if (check === null) return [];
		files = files.filter((x) => check(x));
	}
	return files;
};

module.exports.backupFiles = (backupPath, files) => {
	try {
		if (!files || !backupPath) throw new Error("Cannot do backup, no files && path given!");
		const backupFolder = "backup-" + new Date().toLocaleString().replace(/\/|\s|,/g, "-");

		// backing up files in to backup folder
		fs.mkdirSync(path.join(backupPath, backupFolder));
		files.forEach((file) => {
			fs.copyFileSync(
				path.join(backupPath, file),
				path.join(backupPath, backupFolder, file),
				fs.constants.COPYFILE_EXCL,
			);
		});

		return { backupPath, backupFolder, files };
	} catch (error) {
		return null;
	}
};

module.exports.renameFiles = (fromThese, toThese) => {
	try {
		if (!fromThese.files || !toThese.files) throw new Error("Cannot rename, empty no files given!");
		if (toThese.files.length !== fromThese.files.length)
			throw new Error("Cannot rename, count of both sides don't match");

		const backup = this.backupFiles(toThese.path, toThese.files);
		if (backup === null) throw new Error("Cannot rename, backup failed");
		// renaming files
		let newFiles = [];
		for (let index = 0; index < toThese.files.length; index++) {
			const oldFile = toThese.files[index];
			const newName = this.getName(fromThese.files[index]);
			const ext = this.getExt(oldFile);
			const newFile = newName + ext;

			const oldPath = path.join(toThese.path, oldFile);
			const newPath = path.join(toThese.path, newFile);
			fs.renameSync(oldPath, newPath);
			newFiles.push(newPath);
		}

		return { newFiles, backup };
	} catch (error) {
		return error;
	}
};
