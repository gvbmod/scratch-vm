var fs = require("fs");
var path = require("path");
var http = require("http");
var https = require("https");
var URL = require("url");
var headers = {
	"User-Agent":"Node.js"
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

(async function () {
	console.log("Downloading BeepBox synth build file...");
	var data = await getRequest("https://www.beepbox.co/beepbox_synth.js");
	///////////////////////////
	console.log("Patching script to use \"module.exports\"...");
	///////////////////////////
	var script = data.toString();
	script += "\n";
	script += "////////////////////////////";
	script += "\n";
	script += "/* UPDATE.JS PATCH */";
	script += "\n";
	script += "module.exports = beepbox;";
	script += "\n";
	script += "////////////////////////////";
	///////////////////////////
	console.log("Writing file...");
	fs.writeFileSync("./synth.js",script);
	///////////////////////////
	console.log("Done.");
})();