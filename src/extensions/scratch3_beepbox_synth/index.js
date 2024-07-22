//Credit to @Flashflare3 for making this song:
//https://www.beepbox.co/#9n51sbk0l0Je00t2-a7g0Jj0vr1i1111111o45422T0v0u00f10w4qU0122d04w3h0E0T0v0u00f0qUw10w4122d04w4h0E1bkT0v0u00f10w4qM012d04w3h0E0T0v0u00f10w4qM012d04w4h0E0T0v0u00f10w4qM012d04w4h0E0T0v0u00f10w4qM012d04w4h0E0T0v0u00f10w4qg01d04w5h0E0T0v1u00f10w4qg01d04w5h0E0T0v0u00f10l0qM012d04w1h0E0T0v0u00f10l0qM012d04w1h0E0T2v1u15f10w4qw02d03w0E0T2v1u15f10w4qw02d03w0E0b000013141312567ab67899999999567ab67899999999c0000000000000000045671213121380004567121312139000000000000312121212121212121212121212121212401212121212131212121212121212121212121212121240001111111112111111121112111211111112111211123000000004125312526789678967891252678967896789a0p2fJkRYg4QsziCm15OakkrelBoBlAV70bmOWuc5Oaie28U2AzkOZqVjnQJpd7pjPgKhiyzpjbgbIkQQkRmLdcGDCNsyDCsOGGCGCKX8-ApOp6CGGiVSTcVCDdOqfakRmRRRRQRkRkVlelAQ-qUGYCKCGGLzrsPyqsT9EYBjlnvv0Mk31gc10kRmWDmQQraypECq9CypECq9CypQQsP862woaCGKCyCPyxsyGDHapuJtYP8QRlinmmVDcQVKjhGppW2Aw0000005cI8jbNaQOczn8VChljppnpj9RkRkRkRkTkSkSQKsObqqXaXIP8GFIIHIxWEmCWCGCGCWCWC1GsNAlQSlRTVChljppnpvlvjlj3QN1agJcdj45ehGpuILOqeCiFGFGjnMIxCsPjCpd7wiCGSKKKCOSCGDaFOICDPn6lARkRkRsppCsjjCpd2ALB5Jqi_JdvXtv1aLmbur289y7jGLnbfeSG00000000Lrby04cdntSZHWXKYKX1HKXOXKTbI49ntTBTtVtXJtTuntSDjRTvlTtRTtO8gfHVBDEb__U000000000kQsyy6CCCCCCny2CCCCCBBAfjjjjjjbh1jjjjjiRGWqqqqqqUa0wbXoe4lcIZ1mI000000000atve5dcBdcBdcBdcBdcBdcBdcBbj8FFAFFAFFAFjNNFQDm8pFD0S6FvcG7oaXxRBeJFxi1lUROxW20000000002BLgrapkHqhg4FE5OsAFE5OsAFE5OsAl8W1sD9aq1sD9aq1sD9aq4iIreOaAt0KjABd0KjAyFoOWiG_dcVCRjCnpBtQOBLgfjNtcE0bO3T7uskAlx8-q5UX9aq1sD9aq1sD9aq1sD95uKMQOFmWiamkQ2VlphjgbBlB5d0KlmkaAt0KlmkkQ2VlphjgbBlB5d29mdGJEl8W1sGIEFE5OGOyCwnaHaaq1sGIEl8W1sGIEFE5OGOxkIpd9lvCCsN6GsOXcHKCkJW0yFvhPQM0000000
var defaultSong = "9n51sbk0l0Je00t2-a7g0Jj0vr1i1111111o45422T0v0u00f10w4qU0122d04w3h0E0T0v0u00f0qUw10w4122d04w4h0E1bkT0v0u00f10w4qM012d04w3h0E0T0v0u00f10w4qM012d04w4h0E0T0v0u00f10w4qM012d04w4h0E0T0v0u00f10w4qM012d04w4h0E0T0v0u00f10w4qg01d04w5h0E0T0v1u00f10w4qg01d04w5h0E0T0v0u00f10l0qM012d04w1h0E0T0v0u00f10l0qM012d04w1h0E0T2v1u15f10w4qw02d03w0E0T2v1u15f10w4qw02d03w0E0b000013141312567ab67899999999567ab67899999999c0000000000000000045671213121380004567121312139000000000000312121212121212121212121212121212401212121212131212121212121212121212121212121240001111111112111111121112111211111112111211123000000004125312526789678967891252678967896789a0p2fJkRYg4QsziCm15OakkrelBoBlAV70bmOWuc5Oaie28U2AzkOZqVjnQJpd7pjPgKhiyzpjbgbIkQQkRmLdcGDCNsyDCsOGGCGCKX8-ApOp6CGGiVSTcVCDdOqfakRmRRRRQRkRkVlelAQ-qUGYCKCGGLzrsPyqsT9EYBjlnvv0Mk31gc10kRmWDmQQraypECq9CypECq9CypQQsP862woaCGKCyCPyxsyGDHapuJtYP8QRlinmmVDcQVKjhGppW2Aw0000005cI8jbNaQOczn8VChljppnpj9RkRkRkRkTkSkSQKsObqqXaXIP8GFIIHIxWEmCWCGCGCWCWC1GsNAlQSlRTVChljppnpvlvjlj3QN1agJcdj45ehGpuILOqeCiFGFGjnMIxCsPjCpd7wiCGSKKKCOSCGDaFOICDPn6lARkRkRsppCsjjCpd2ALB5Jqi_JdvXtv1aLmbur289y7jGLnbfeSG00000000Lrby04cdntSZHWXKYKX1HKXOXKTbI49ntTBTtVtXJtTuntSDjRTvlTtRTtO8gfHVBDEb__U000000000kQsyy6CCCCCCny2CCCCCBBAfjjjjjjbh1jjjjjiRGWqqqqqqUa0wbXoe4lcIZ1mI000000000atve5dcBdcBdcBdcBdcBdcBdcBbj8FFAFFAFFAFjNNFQDm8pFD0S6FvcG7oaXxRBeJFxi1lUROxW20000000002BLgrapkHqhg4FE5OsAFE5OsAFE5OsAl8W1sD9aq1sD9aq1sD9aq4iIreOaAt0KjABd0KjAyFoOWiG_dcVCRjCnpBtQOBLgfjNtcE0bO3T7uskAlx8-q5UX9aq1sD9aq1sD9aq1sD95uKMQOFmWiamkQ2VlphjgbBlB5d0KlmkaAt0KlmkkQ2VlphjgbBlB5d29mdGJEl8W1sGIEFE5OGOyCwnaHaaq1sGIEl8W1sGIEFE5OGOxkIpd9lvCCsN6GsOXcHKCkJW0yFvhPQM0000000";

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

var beepbox = require("./synth.js");
var blockIconURI = "data:image/png;base64,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";

class beepboxsynth {
    constructor (runtime) {
        this.runtime = runtime;
		
		this.beepbox = beepbox;
		
		this.synth = new beepbox.Synth(defaultSong);
		this.currentSong = defaultSong;
		
		runtime.on("PROJECT_STOP_ALL", () => this.stopMusic());
        runtime.on("PROJECT_START", () => this.stopMusic());
    }
	
	stopMusic (args) {
		try {
			try{
				this.synth.pause();
			}catch(e){}
			this.synth = new beepbox.Synth(defaultSong);
			this.currentSong = defaultSong;
		} catch(e) {
			log.warn("(BeepBox synth extension): Failed to stop music. ",e);
		}
    }
	
	reloadSong () {
		try {
			try{
				this.synth.pause();
			}catch(e){}
			this.synth = new beepbox.Synth(this.currentSong);
		} catch(e) {
			log.warn("(BeepBox synth extension): Failed to reload song. ",e);
		}
	}

    getInfo () {
        return {
            id: 'beepboxsynth',
            name: 'Beepbox',
			color1: "#9000ff",
            color2: "#502ab8",
            color3: "#431f82",
            blocks: [
                {
                    opcode: 'loadsong',
                    blockType: BlockType.COMMAND,
                    text: 'Load song [Data]',
                    arguments: {
                        Data: {
                            type: ArgumentType.STRING,
                            defaultValue: defaultSong
                        }
                    }
                },
				{
                    opcode: 'reloadSong',
                    blockType: BlockType.COMMAND,
                    text: 'Reload song',
                    arguments: {}
                },
                {
                    opcode: 'playsong',
                    blockType: BlockType.COMMAND,
                    text: 'Play song',
                    arguments: {}
                },
                {
                    opcode: 'pausesong',
                    blockType: BlockType.COMMAND,
                    text: 'Pause song',
                    arguments: {}
                },
                {
                    opcode: 'isplaying',
                    blockType: BlockType.BOOLEAN,
                    text: 'Is song playing?',
                    arguments: {}
                },
                {
                    opcode: 'extractcontents',
                    blockType: BlockType.REPORTER,
                    text: 'Split data from BeepBox url: [url]',
                    arguments: {
						url:{
							type: ArgumentType.STRING,
							defaultValue: "https://beepbox.co/#"+defaultSong
						}
                    }
                },
				{
                    opcode: 'setVolume',
                    blockType: BlockType.COMMAND,
                    text: 'Set BeepBox synth volume to [volume]%',
                    arguments: {
						volume:{
							type: ArgumentType.NUMBER,
							defaultValue: 180,
						}
                    }
                },
				{
                    opcode: 'muteChannel',
                    blockType: BlockType.COMMAND,
                    text: 'Mute channel/track [ch]',
                    arguments: {
						ch:{
							type: ArgumentType.NUMBER,
							defaultValue: 1,
						}
                    }
                },
				{
                    opcode: 'unmuteChannel',
                    blockType: BlockType.COMMAND,
                    text: 'Unmute channel/track [ch]',
                    arguments: {
						ch:{
							type: ArgumentType.NUMBER,
							defaultValue: 1,
						}
                    }
                },
				{
                    opcode: 'restartFromBeginning',
                    blockType: BlockType.COMMAND,
                    text: 'Restart song from begining',
                    arguments: {}
                },
				{
                    opcode: 'getSynthProperty',
                    blockType: BlockType.REPORTER,
                    text: 'Get song [type]',
                    arguments: {
						type: {
							type: ArgumentType.STRING,
                            menu: "timers",
						}
					}
                },
				{
                    opcode: 'setSynthProperty',
                    blockType: BlockType.COMMAND,
                    text: 'Set song [type] to [value]',
                    arguments: {
						type: {
							type: ArgumentType.STRING,
                            menu: "timers",
						},
						value: {
							type: ArgumentType.NUMBER
						}
					}
                }
            ],
            menus: {
				timers: this.getTimerMenu()
            }
        };
    }

    loadsong (args) {
		try {
			try{
				this.synth.pause();
			}catch(e){}
			var song = Cast.toString(args.Data);
			this.synth = new beepbox.Synth(song);
			this.currentSong = song;
		} catch(e) {
			log.warn("(BeepBox synth extension): Failed to load song. ",e);
		}
    }
	playsong  () {
		try {
			this.synth.play();
		} catch(e) {
			log.warn("(BeepBox synth extension): Failed to play song. ",e);
		}
	}
	pausesong  () {
		try {
			this.synth.pause();
		} catch(e) {
			log.warn("(BeepBox synth extension): Failed to pause song. ",e);
		}
	}
	isplaying  () {
		try {
			return this.synth.isPlayingSong;
		} catch(e) {
			return false;
		}
	}
	extractcontents (args) {
		try {
			return Cast.toString(args.url).split("#").pop();
		} catch(e) {
			log.warn("(BeepBox synth extension): Failed to extract song data. ",e);
			return false;
		}
	}
	setVolume (args) {
		try {
			var volumeToSet = Number(args.volume);
			if (isNaN(volumeToSet)) {
				volumeToSet = 0;
			}
			if (volumeToSet < 0) {
				volumeToSet = 0;
			}
			if (volumeToSet > 1000) {
				volumeToSet = 1000;
			}
			this.synth.volume = volumeToSet/100;
		} catch(e) {
			log.warn("(BeepBox synth extension): Failed to set volume. ",e);
		}
	}
	
	getChannel (index) {
		var synth = this.synth;
		var song = synth.song;
		var channels = song.channels;
		
		var lastChannelIndex = channels.length-1;
		var zeroIndex = Math.round(index)-1;
		
		if (isNaN(index)) {
			zeroIndex = 0;
		}
		
		if (zeroIndex < 0) {
			zeroIndex = 0;
		}
		if (zeroIndex > lastChannelIndex) {
			zeroIndex = lastChannelIndex;
		}
		
		var channel = channels[zeroIndex];
		
		return channel;
	}
	
	muteChannel (args) {
		try{
			var ch = Number(args.ch);
			var channel = this.getChannel(ch);
			
			channel.muted = true;
		} catch(e) {
			log.warn("(BeepBox synth extension): Failed to mute channel. ",e);
		}
	}
	
	unmuteChannel (args) {
		try{
			var ch = Number(args.ch);
			var channel = this.getChannel(ch);
			
			channel.muted = false;
		} catch(e) {
			log.warn("(BeepBox synth extension): Failed to unmute channel. ",e);
		}
	}
	
	restartFromBeginning () {
		try {
			var synth = this.synth;
			synth.bar = 0;
			synth.part = 0;
			synth.beat = 0;
		} catch(e) {
			log.warn("(BeepBox synth extension): Failed to restart from the beginning. ",e);
		}
	}
	
	getTimerMenu() {
        return {
            acceptReporters: true,
            items: [
				///////////////////////////
				//If your editing this, its highly recommended to use a completley lowercase string value. (Text string does not matter)
				///////////////////////////
				{
                    text: "Current Bar",
                    value: "bar",
                },
				{
                    text: "Current Part",
                    value: "part",
                },
				{
                    text: "Current Beat",
                    value: "beat",
                },
				///////////////////////////
				{
                    text: "Volume",
                    value: "volume",
                },
				///////////////////////////
				{
                    text: "Song length (In bars)",
                    value: "bars",
                },
				{
                    text: "Beats per bar",
                    value: "beats-per-bar",
                },
				///////////////////////////
				{
                    text: "Loop start (In bars)",
                    value: "loop-start",
                },
				{
                    text: "Loop length (In bars)",
                    value: "loop-length",
                },
				///////////////////////////
				{
                    text: "Key (As number)",
                    value: "key",
                },
				///////////////////////////
				{
					text: "Tempo",
					value: "tempo"
				},
				{
					text: "Rhythm",
					value: "rhythm"
				},
				{
					text: "Scale",
					value: "scale"
				},
				///////////////////////////
				{
					text: "JSON file",
					value: "json"
				}
			]
        };
    }
	
	getSynthProperty (args) {
		try {
			///////////////////////////
			var thing = args.type.toLowerCase(); //This is so we can type values into the block, if thats even possible.
			var synth = this.synth;
			///////////////////////////
			if (thing == "bar") {
				return synth.bar;
			}
			if (thing == "part") {
				return synth.part;
			}
			if (thing == "beat") {
				return synth.beat;
			}
			///////////////////////////
			if (thing == "volume") {
				return synth.volume*100;
			}
			///////////////////////////
			if (thing == "bars") {
				return synth.song.barCount;
			}
			if (thing == "beats-per-bar") {
				return synth.song.beatsPerBar;
			}
			///////////////////////////
			if (thing == "loop-start") {
				return synth.song.loopStart;
			}
			if (thing == "loop-length") {
				return synth.song.loopLength;
			}
			///////////////////////////
			if (thing == "key") {
				return synth.song.key;
			}
			///////////////////////////
			if (thing == "tempo") {
				return synth.song.tempo;
			}
			if (thing == "rhythm") {
				return synth.song.rhythm;
			}
			///////////////////////////
			if (thing == "json") {
				return JSON.stringify(synth.song.toJsonObject());
			}
		} catch(e) {
			log.warn("(BeepBox synth extension): Failed to get synth property. ",e);
		}
	}
	
	setSynthProperty (args) {
		try {
			var thing = args.type.toLowerCase(); //This is so we can type values into the block, if thats even possible.
			var value = Number(args.value);
			if (isNaN(value)) {
				value = 0;
			}
			
			var synth = this.synth;
			///////////////////////////
			if (thing == "bar") {
				synth.bar = value;
			}
			if (thing == "part") {
				synth.part = value;
			}
			if (thing == "beat") {
				synth.beat = value;
			}
			///////////////////////////
			if (thing == "volume") {
				this.setVolume({volume: args.value }); //Just let the previous block function handle it.
			}
			///////////////////////////
			if (thing == "bars") {
				synth.song.barCount = value;
			}
			if (thing == "beats-per-bar") {
				synth.song.beatsPerBar = value;
			}
			///////////////////////////
			if (thing == "loop-start") {
				synth.song.loopStart = value;
			}
			if (thing == "loop-length") {
				synth.song.loopLength = value;
			}
			///////////////////////////
			if (thing == "key") {
				synth.song.key = value;
			}
			///////////////////////////
			if (thing == "tempo") {
				synth.song.tempo = value;
			}
			if (thing == "rhythm") {
				synth.song.rhythm = value;
			}
			///////////////////////////
			if (thing == "json") {
				synth.song.fromJsonObject(JSON.parse(value));
			}
		} catch(e) {
			log.warn("(BeepBox synth extension): Failed to set synth property. ",e);
		}
	}
}
module.exports = beepboxsynth;