var fs = require("fs");
console.log(__dirname, __filename);
if (process.argv.length <= 3) {
	console.log("Usage: " + __filename + ' "path/to/video directory"' + ' "path/to/subtitles directory"');
	process.exit(-1);
}

const video_path = process.argv[2];
const subtitle_path = process.argv[3];

const videos = fs.readdirSync(video_path);
const subtitles = fs.readdirSync(subtitle_path);

console.log(videos);
console.log(subtitles);

// var path = process.argv[2];

// fs.readdir(path, function (err, items) {
// 	console.log(items);

// 	for (var i = 0; i < items.length; i++) {
// 		console.log(items[i]);
// 	}
// });

// fs.rename("./deneme1.txt", "./deneme2.txt", err => {
// 	if (err) console.log(err);
// 	else console.log("successfully renamed");
// });
