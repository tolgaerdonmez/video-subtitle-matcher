const fileUtils = require("./file");
const path = require("path");
jest.mock("fs");

describe("renaming files", () => {
	const mockFiles = {
		from: { path: "from/path", files: ["from1.mov", "from2.mov"] },
		to: { path: "to/path", files: ["to1.srt", "to2.srt"] },
	};

	test("backup", async () => {
		const res = await fileUtils.backupFiles(mockFiles.to.path, mockFiles.to.files);

		console.log(res);
		expect(res.backupFolder).toBeDefined();
		expect(res.backupFolder).not.toMatch(/\//g);
	});

	test("rename", async () => {
		const res = await fileUtils.renameFiles(mockFiles.from, mockFiles.to);

		console.log(res);
		for (let index = 0; index < res.newFiles.length; index++) {
			const newFile = res.newFiles[index];
			const fromFile = path.join(mockFiles.from.path, mockFiles.from.files[index]);
			expect(newFile).not.toBe(fromFile);
		}
		expect(res.backup.backupFolder).not.toMatch(/\//g);
	});
});
