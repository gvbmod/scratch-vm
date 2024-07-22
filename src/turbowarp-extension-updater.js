var http = require("http");
var https = require("https");
var fs = require("fs");
var path = require("path");
var URL = require("URL");

var extensionMetadataURL = "https://extensions.turbowarp.org/generated-metadata/extensions-v0.json";
var extensionDownloadURL = "https://extensions.turbowarp.org/";
var extensionsPath = "./turbowarp-extensions/";
var guiPath = "../../scratch-gui"; //Assuming that your running this in the src folder.
var guiExtensionsPath = path.join(guiPath,"src/lib/libraries/extensions/");
var guiExtensionsFile = path.join(guiExtensionsPath,"tw-extensions.json");
var guiExtensionsImages = path.join(guiExtensionsPath,"/tw-extensions/");

console.log(path.resolve(guiExtensionsPath));

var ignoredExtensions = [ //Ignore to download these extensions.
	"stretch", //Was modified due to gm2-player support and should be manually updated.
	"Gamepad", //Interfeers with gvbvdxx mod 2 gamepad extension.
];

var ignoredMetadata = [ //Ignore to list these extensions in the gui menu.
	"Gamepad", //Interfeers with gvbvdxx mod 2 gamepad extension.
];

var extensionIdFixes = { //Changes a extension id to another one, made because lmsListTools should be lmsData instead.
	"lmsListTools": "lmsData"
};

var headers = {
	"User-Agent":"Gvbvdxx Mod 2 Automated TurboWarp Extension Downloader"
};

function getRequest(url) {
	var parsedURL = URL.parse(url);
	var requestModule = null;
	if (parsedURL.protocol == "http:") {
		requestModule = http;
	}
	if (parsedURL.protocol == "https:") {
		requestModule = https;
	}
	if (!requestModule) {
		throw new Error("Unrecognized protocol for GET request "+parsedURL.protocol);
	}
	return new Promise((resolve, reject) => {
		
		var request = requestModule.request({
			method:"GET",
			headers: headers,
			...parsedURL
		},(res) => {
			var data = [];
			res.on("data", (chunk) => {
				data.push(chunk);
			});
			res.on("end", async () => {
				if (res.statusCode == 302) {
					resolve(await getRequest(res.headers.location));
				} else {
					if (res.statusCode !== 200) {
						reject("Response not OK. "+http.STATUS_CODES[res.statusCode.toString()]);
					} else {
						resolve(Buffer.concat(data));
					}
				}
			});
		});
		request.end();
	});
}

function createTrailPath(p) {
	var dirs = p.replaceAll("\\","/").split("/");
	var dirTrail = [];
	for (var dir of dirs) {
		dirTrail.push(dir);
		if (!fs.existsSync(dirTrail.join("/"))) {
			fs.mkdirSync(dirTrail.join("/"))
		}
	}
}

function timeoutAsync (delay) {
	return new Promise((accept) => {
		setTimeout(accept,delay);
	});
}

(async function () {
	console.log("Getting extension metadata...");
	var meta = JSON.parse((await getRequest(extensionMetadataURL)).toString());
	console.log("Downloading each extension...");
	var returnedMeta = {extensions:[]};
	var extensionsPending = 0;
	meta.extensions.forEach(async function (ext) {
		extensionsPending += 1;
		var extension = JSON.parse(JSON.stringify(ext));
		if (extensionIdFixes[extension.id]) {
			extension.id = extensionIdFixes[extension.id];
		}
		if (ignoredMetadata.indexOf(extension.id) == -1) {
			returnedMeta.extensions.push(extension);
			if (ignoredExtensions.indexOf(extension.id) == -1) {
				var doneDownloadingThis = false;
				while (!doneDownloadingThis) {
					try{
						var js = await getRequest(extensionDownloadURL+extension.slug+".js");
						createTrailPath(path.join(extensionsPath,path.join(extension.slug,"../")));
						fs.writeFileSync(path.join(extensionsPath,extension.slug+".js"),js);
						console.log(`Downloaded "${extension.id}" to path "${path.join(extensionsPath,extension.slug+".js")}".`);
						if (extension.image) {
							var img = await getRequest(extensionDownloadURL+"/"+extension.image);
							createTrailPath(path.join(guiExtensionsImages,path.dirname(extension.image)));
							fs.writeFileSync(path.join(guiExtensionsImages,extension.image),img);
							console.log(`Downloaded image "${extension.id}" to path "${path.resolve(guiExtensionsImages,extension.image)}"`);
						}
						doneDownloadingThis = true;
					}catch(e){
						doneDownloadingThis = false;
						console.log(`Retrying attempt to download ${extension.id}.`);
					}
				}
			}
		}
		extensionsPending -= 1;
	});
	while (extensionsPending > 0) {
		await timeoutAsync(1000/60);
	}
	fs.writeFileSync(guiExtensionsFile,JSON.stringify(returnedMeta,null,"\t"));
	fs.writeFileSync(path.join(extensionsPath,"extensions-tw.json"),JSON.stringify(returnedMeta,null,"\t"));
	console.log(`Created extension meta.`);
})();