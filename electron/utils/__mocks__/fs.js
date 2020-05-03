const fs = jest.genMockFromModule("fs");

function mkdirSync(path) {
	return path;
}

function copyFileSync(path, dest) {
	return dest;
}

function copyFile(path, dest) {
	return dest;
}

function renameSync(oldPath, newPath) {
	return newPath;
}

fs.mkdirSync = mkdirSync;
fs.copyFileSync = copyFileSync;
fs.copyFile = copyFile;
module.exports = fs;
