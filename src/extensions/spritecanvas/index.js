var ArgumentType = require('../../extension-support/argument-type');
var BlockType = require('../../extension-support/block-type');
var Cast = require('../../util/cast');
function radToDeg(rad) {
    return rad * 180 / Math.PI;
}

function getDirectionFromPoints(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    var direction = 90 - radToDeg(Math.atan2(dy, dx));
    return direction;
}

function degToRad(deg) {
    return deg * Math.PI / 180;
}

function velocityInDir(steps, dir) {
    const radians = degToRad(90 - dir);
    const dx = steps * Math.cos(radians);
    const dy = steps * Math.sin(radians);
    return [
        dx,
        dy
    ]
}

function betterLineto(sx, sy, x, y, thickness, ctx) {
    var lx = Math.round(sx);
    var ly = Math.round(sy);
    var m = 0;
    while ((!((Math.round(x) == Math.round(lx)) && (Math.round(y) == Math.round(ly)))) && (m < 3500)) {
        var dir = getDirectionFromPoints(x, y, lx, ly);
        var vel = velocityInDir(1, dir);
        ctx.fillRect(
            Math.round(lx - (thickness / 2)),
            Math.round(ly - (thickness / 2)),
            Math.round(thickness),
            Math.round(thickness));
        lx += vel[0];
        ly += vel[1];
        ctx.fillRect(
            Math.round(lx - (thickness / 2)),
            Math.round(ly - (thickness / 2)),
            Math.round(thickness),
            Math.round(thickness));
        m += 1;
    }
}

class SpriteCanvases {
    constructor(runtime) {
        this.runtime = runtime;
        this.renderer = runtime.renderer;
        var extension = this;
		this.loadedImages = {};
        this.skincanvases = {};

        var BitmapSkin = runtime.renderer.exports.BitmapSkin;
        class CanvasSkin extends BitmapSkin {
            constructor(id, renderer, cid, width, height) {
                super(id, renderer);

                this.videoError = false;

                this.readyPromise = new Promise((resolve) => {
                    resolve();
                });
                var cvs = document.createElement("canvas");
				cvs.width = Math.round(width);
				cvs.height = Math.round(height);
                var ctx = cvs.getContext("2d");
                this.videoElement = cvs;
                this.cvs = cvs;
                this.ctx = ctx;
                this.videoElement.crossOrigin = "anonymous";

                this.videoDirty = true;

                this.reuploadVideo();
                this.emitWasAltered();

                this.updateCanvas = function () {
                    this.markVideoDirty();
                    this.reuploadVideo();
                };
                this.cid = cid;
                extension.skincanvases[cid] = this;
                this.setFill([0, 0, 0]);
                this.setOutline([0, 0, 0]);
				this.setOutlineSize(5);
            }

            reuploadVideo() {
                this.videoDirty = false;
                this.setBitmap(this.videoElement);
            }

            markVideoDirty() {
                this.videoDirty = true;
                this.emitWasAltered();
            }

            get size() {
                if (this.videoDirty) {
                    this.reuploadVideo();
                }
                return super.size;
            }

            getTexture(scale) {
                if (this.videoDirty) {
                    this.reuploadVideo();
                }
                return super.getTexture(scale);
            }

            setFill(color) {
                this.ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]/255})`;
                this.fillColor = color;
            }
			
            setOutline(color) {
                this.ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]/255})`;
                this.outlineColor = color;
            }
			setOutlineSize(size) {
				this.ctx.lineWidth = size;
				this.lineSize = size;
			}
			
			clearSquare(x, y, width, height) {
                var cvs = this.cvs;
                var ctx = this.ctx;
                ctx.clearRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
				this.updateCanvas();
            }
			
			clearEverything() {
                var cvs = this.cvs;
                var ctx = this.ctx;
                ctx.clearRect(0, 0, cvs.width, cvs.height);
				this.updateCanvas();
            }

            drawSquare(x, y, width, height) {
                var cvs = this.cvs;
                var ctx = this.ctx;
                ctx.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
				this.updateCanvas();
            }
			
			drawSquareOutline(x, y, width, height) {
                var cvs = this.cvs;
                var ctx = this.ctx;
                ctx.outlineRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
				this.updateCanvas();
            }
			
			drawLine(x, y, x2, y2, thickness) {
                var cvs = this.cvs;
                var ctx = this.ctx;
                betterLineto(Math.round(x),Math.round(y),Math.round(x2),Math.round(y2),Math.round(thickness), ctx);
				this.updateCanvas();
            }
			
			drawSquareOutline(x, y, width, height) {
                var cvs = this.cvs;
                var ctx = this.ctx;
                ctx.strokeRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
				this.updateCanvas();
            }
			
			drawImage(x, y, width, height, image) {
                var cvs = this.cvs;
                var ctx = this.ctx;
                ctx.drawImage(image,Math.round(x), Math.round(y), Math.round(width), Math.round(height));
				this.updateCanvas();
            }
			
			drawImageChunk(x, y, width, height, chunkX, chunkY, chunkWidth, chunkHeight, image) {
                var cvs = this.cvs;
                var ctx = this.ctx;
                ctx.drawImage(image,chunkX,chunkY,chunkWidth,chunkHeight,Math.round(x), Math.round(y), Math.round(width), Math.round(height));
				this.updateCanvas();
            }
			
			getCanvasWidth() {
				return this.cvs.width;
			}
			
			getCanvasHeight() {
				return this.cvs.height;
			}

            dispose() {
                if (extension.skincanvases[this.cid]) {
                    //First reset the skins of all sprites containing this skin.
                    for (const target of runtime.targets) {
                        const drawable = runtime.renderer._allDrawables[target.drawableID];
                        if (drawable.skin instanceof CanvasSkin) {
                            if (drawable.skin.cid == this.cid) {
                                target.setCostume(target.currentCostume);
                            }
                        }
                    }
                    //Then just set the thing to undefined in skin canvases.
                    extension.skincanvases[this.cid] = undefined;
                }
                super.dispose();
            }
        }
        var skinId = runtime.renderer._nextSkinId++;

        this.canvasSkin = CanvasSkin;

        runtime.on("PROJECT_STOP_ALL", () => this.resetEverything());
        runtime.on("PROJECT_START", () => this.resetEverything());

        runtime.on("BEFORE_EXECUTE", () => {
            for (const skin of renderer._allSkins) {
                if (skin instanceof CanvasSkin) {
                    skin.markVideoDirty();
                }
            }
        });
    }

    resetEverything() {
        for (const target of this.runtime.targets) {
            const drawable = this.runtime.renderer._allDrawables[target.drawableID];
            if (drawable.skin instanceof this.canvasSkin) {
                target.setCostume(target.currentCostume);
            }
        }
    }

    _getTargetFromMenu(targetName, util) {
        if (targetName === "_myself_")
            return util.target;
        if (targetName === "_stage_")
            return this.runtime.getTargetForStage();
        return this.runtime.getSpriteTargetByName(targetName);
    }
	
	_colorObjectToArray (color) {
		if (typeof color.a == "number") {
			return [color.r,color.g,color.b,color.a];
		} else {
			return [color.r,color.g,color.b,255];
		}
	}

    _getTargets() {
        let spriteNames = [{
                text: "myself",
                value: "_myself_"
            }, {
                text: "Stage",
                value: "_stage_"
            },
        ];
        const targets = this.runtime.targets
            .filter((target) => target.isOriginal && !target.isStage)
            .map((target) => target.getName());
        spriteNames = spriteNames.concat(targets);
        return spriteNames;
    }

    _getNumberOrDefault(value, defaultValue) {
        var number = Number(value);
        if (isNaN(number)) {
            number = defaultValue;
        }
        return number;
    }

    getInfo() {
        return {
            id: "spritecanvas",
            name: "Sprite Canvases",
            color1: "#bfff6b",
            color2: "#c0ff54",
            color3: "#88e02f",
            blocks: [{
                    opcode: "showSkin",
                    text: "Set skin on sprite [TARGET] to canvas called [NAME]",
                    blockType: BlockType.COMMAND,
                    arguments: {
						TARGET: {
                            type: ArgumentType.STRING,
                            menu: "targets",
                        },
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Canvas"
                        },
                    }
                },
                "---", {
                    opcode: "resetSkinsForAllSprites",
                    text: "Reset canvas skins for all sprites",
                    blockType: BlockType.COMMAND,
                    arguments: {}
                }, {
                    opcode: "resetSkinFor",
                    text: "Reset skin for [TARGET]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TARGET: {
                            type: ArgumentType.STRING,
                            menu: "targets",
                        }
                    }
                },
                "---", {
                    opcode: "destroySkin",
                    text: "Delete canvas skin called [NAME]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Canvas"
                        },
                    }
                }, {
                    opcode: "makeSkin",
                    text: "Make new canvas skin called [NAME] with size [WIDTH]x[HEIGHT]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Canvas"
                        },
                        WIDTH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                        HEIGHT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
				"---", {
					opcode: "setFillColor",
                    text: "On [NAME] set fill color to [COLOR]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Canvas"
                        },
						COLOR: {
                            type: ArgumentType.COLOR
						}
                    }
				}, {
					opcode: "setOutlineColor",
                    text: "On [NAME] set outline color to [COLOR]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Canvas"
                        },
						COLOR: {
                            type: ArgumentType.COLOR
						}
                    }
				}, {
					opcode: "setOutlineSize",
                    text: "On [NAME] set outline size to [SIZE]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Canvas"
                        },
						SIZE: {
                            type: ArgumentType.NUMBER,
							defaultValue: 5
						}
                    }
				},
				"---", {
					opcode: "clearCanvas",
                    text: "On [NAME] clear everything.",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Canvas"
                        }
                    }
				},  {
					opcode: "clearSquare",
                    text: "On [NAME] erase pixel chunk x:[X] y:[Y] with width:[WIDTH] and height:[HEIGHT]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Canvas"
                        },
						X: {
                            type: ArgumentType.NUMBER,
							defaultValue: 5,
						},
						Y: {
                            type: ArgumentType.NUMBER,
							defaultValue: 5,
						},
						WIDTH: {
                            type: ArgumentType.NUMBER,
							defaultValue: 32,
						},
						HEIGHT: {
                            type: ArgumentType.NUMBER,
							defaultValue: 32,
						}
                    }
				},
				"---", {
					opcode: "drawCanvas",
                    text: "On [NAME] draw other canvas called [NAME2] at x:[X] y:[Y] with width:[WIDTH] and height:[HEIGHT]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Canvas"
                        },
						NAME2: {
                            type: ArgumentType.STRING,
                            defaultValue: "My 2nd Canvas"
                        },
						X: {
                            type: ArgumentType.NUMBER,
							defaultValue: 5,
						},
						Y: {
                            type: ArgumentType.NUMBER,
							defaultValue: 5,
						},
						WIDTH: {
                            type: ArgumentType.NUMBER,
							defaultValue: 32,
						},
						HEIGHT: {
                            type: ArgumentType.NUMBER,
							defaultValue: 32,
						}
                    }
				}, {
					opcode: "drawCanvasChunk",
                    text: "On [NAME] draw chunk of [NAME2] using chunk x:[X2] chunk y:[Y2] with chunk width:[WIDTH2] chunk height:[HEIGHT2] at x:[X] y:[Y] with width:[WIDTH] and height:[HEIGHT]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Canvas"
                        },
						NAME2: {
                            type: ArgumentType.STRING,
                            defaultValue: "My 2nd Canvas"
                        },
						X: {
                            type: ArgumentType.NUMBER,
							defaultValue: 5,
						},
						Y: {
                            type: ArgumentType.NUMBER,
							defaultValue: 5,
						},
						WIDTH: {
                            type: ArgumentType.NUMBER,
							defaultValue: 32,
						},
						HEIGHT: {
                            type: ArgumentType.NUMBER,
							defaultValue: 32,
						},
						X2: {
                            type: ArgumentType.NUMBER,
							defaultValue: 5,
						},
						Y2: {
                            type: ArgumentType.NUMBER,
							defaultValue: 5,
						},
						WIDTH2: {
                            type: ArgumentType.NUMBER,
							defaultValue: 32,
						},
						HEIGHT2: {
                            type: ArgumentType.NUMBER,
							defaultValue: 32,
						}
                    }
				},
				"---", {
					opcode: "drawSquare",
                    text: "On [NAME] draw rectangle at x:[X] y:[Y] with width:[WIDTH] and height:[HEIGHT]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Canvas"
                        },
						X: {
                            type: ArgumentType.NUMBER,
							defaultValue: 5,
						},
						Y: {
                            type: ArgumentType.NUMBER,
							defaultValue: 5,
						},
						WIDTH: {
                            type: ArgumentType.NUMBER,
							defaultValue: 32,
						},
						HEIGHT: {
                            type: ArgumentType.NUMBER,
							defaultValue: 32,
						}
                    }
				}, {
					opcode: "drawSquareOutline",
                    text: "On [NAME] draw rectangle outline at x:[X] y:[Y] with width:[WIDTH] and height:[HEIGHT]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Canvas"
                        },
						X: {
                            type: ArgumentType.NUMBER,
							defaultValue: 5,
						},
						Y: {
                            type: ArgumentType.NUMBER,
							defaultValue: 5,
						},
						WIDTH: {
                            type: ArgumentType.NUMBER,
							defaultValue: 32,
						},
						HEIGHT: {
                            type: ArgumentType.NUMBER,
							defaultValue: 32,
						}
                    }
				},
				"---", {
					opcode: "drawLineTo",
                    text: "On [NAME] draw line starting at x:[X] y:[Y] and ends at x:[X2] y:[Y2] with size:[SIZE]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Canvas"
                        },
						X: {
                            type: ArgumentType.NUMBER,
							defaultValue: 0,
						},
						Y: {
                            type: ArgumentType.NUMBER,
							defaultValue: 0,
						},
						X2: {
                            type: ArgumentType.NUMBER,
							defaultValue: 20,
						},
						Y2: {
                            type: ArgumentType.NUMBER,
							defaultValue: 20,
						},
						SIZE: {
                            type: ArgumentType.NUMBER,
							defaultValue: 5,
						}
                    }
				},
				"---", {
					opcode: "loadImage",
                    text: "Load image with name [NAME] and URL [URL]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Image"
                        },
						URL: {
                            type: ArgumentType.STRING,
                            defaultValue: "https://gvbvdxx.github.io/ggm2/static/favicon.png"
                        },
                    }
				}, {
					opcode: "unloadImage",
                    text: "Unload image with name [NAME]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Image"
                        }
                    }
				}, {
					opcode: "drawImage",
                    text: "On [NAME] draw image [NAME2] at x:[X] y:[Y] with width:[WIDTH] and height:[HEIGHT]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Canvas"
                        },
						NAME2: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Image"
                        },
						X: {
                            type: ArgumentType.NUMBER,
							defaultValue: 5,
						},
						Y: {
                            type: ArgumentType.NUMBER,
							defaultValue: 5,
						},
						WIDTH: {
                            type: ArgumentType.NUMBER,
							defaultValue: 32,
						},
						HEIGHT: {
                            type: ArgumentType.NUMBER,
							defaultValue: 32,
						}
                    }
				},
				"---",
				{
					opcode: "canvasIsExisting",
                    text: "Does canvas [NAME] exist?",
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Canvas"
                        }
                    }
				},
				{
					opcode: "canvasWidth",
                    text: "Canvas [NAME] width",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Canvas"
                        }
                    }
				},
				{
					opcode: "canvasHeight",
                    text: "Canvas [NAME] height",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Canvas"
                        }
                    }
				},
				{
					opcode: "canvasToURL",
                    text: "Canvas [NAME] to Data: URL",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Canvas"
                        }
                    }
				},
				"---",
				{
					opcode: "imageExists",
                    text: "Image [NAME] exists?",
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Image"
                        }
                    }
				},
				{
					opcode: "imageWidth",
                    text: "Image [NAME] width",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Image"
                        }
                    }
				},
				{
					opcode: "imageHeight",
                    text: "Image [NAME] height",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "My Image"
                        }
                    }
				},
            ],
            menus: {
                targets: {
                    acceptReporters: true,
                    items: "_getTargets",
                },
            }
        };
    }

    resetSkinsForAllSprites() {
        this.resetEverything();
    }

    resetSkinFor(args, util) {
        var target = this._getTargetFromMenu(args.TARGET, util);
        if (target) {
            const drawable = this.runtime.renderer._allDrawables[target.drawableID];
            if (drawable.skin instanceof this.canvasSkin) {
                target.setCostume(target.currentCostume);
            }
        }
    }

    destroySkin(args) {
        var name = args.NAME.toString();

        if (this.skincanvases[name]) {
            this.skincanvases[name].dispose();
        }
    }

    makeSkin(args) {
        var name = args.NAME.toString();
        var width = this._getNumberOrDefault(args.WIDTH, 100);
        var height = this._getNumberOrDefault(args.HEIGHT, 100);

        if (!this.skincanvases[name]) {
            var skinId = this.runtime.renderer._nextSkinId++;
            var skin = new this.canvasSkin(skinId, this.renderer, name, width, height);
			this.renderer._allSkins[skinId] = skin;
        }
    }

    showSkin(args, util) {
        var target = this._getTargetFromMenu(args.TARGET, util);
        if (target) {
            var name = args.NAME.toString();
            if (this.skincanvases[name]) {
                vm.renderer.updateDrawableSkinId(target.drawableID, this.skincanvases[name]._id);
            }
        }
    }
	
	setFillColor(args, util) {
        var name = args.NAME.toString();
		var color = Cast.toRgbColorObject(args.COLOR);
		console.log(color);
        if (this.skincanvases[name]) {
            var skin = this.skincanvases[name];
			skin.setFill(this._colorObjectToArray(color));
        }
    }
	setOutlineColor(args, util) {
        var name = args.NAME.toString();
		var color = Cast.toRgbColorObject(args.COLOR);
        if (this.skincanvases[name]) {
            var skin = this.skincanvases[name];
			skin.setOutline(this._colorObjectToArray(color));
        }
    }
	
	setOutlineSize(args, util) {
        var name = args.NAME.toString();
		var size = this._getNumberOrDefault(args.SIZE, 5);
        if (this.skincanvases[name]) {
            var skin = this.skincanvases[name];
			skin.setOutlineSize(size);
        }
    }
	
	clearSquare(args, util) {
        var name = args.NAME.toString();
		var x = this._getNumberOrDefault(args.X, 5);
        var y = this._getNumberOrDefault(args.Y, 5);
		var width = this._getNumberOrDefault(args.WIDTH, 32);
        var height = this._getNumberOrDefault(args.HEIGHT, 32);
        if (this.skincanvases[name]) {
            var skin = this.skincanvases[name];
			skin.clearSquare(x,y,width,height);
        }
    }
	clearCanvas(args, util) {
        var name = args.NAME.toString();
        if (this.skincanvases[name]) {
            var skin = this.skincanvases[name];
			skin.clearEverything();
        }
    }
	
	drawSquare(args, util) {
        var name = args.NAME.toString();
		var x = this._getNumberOrDefault(args.X, 5);
        var y = this._getNumberOrDefault(args.Y, 5);
		var width = this._getNumberOrDefault(args.WIDTH, 32);
        var height = this._getNumberOrDefault(args.HEIGHT, 32);
        if (this.skincanvases[name]) {
            var skin = this.skincanvases[name];
			skin.drawSquare(x,y,width,height);
        }
    }
	drawSquareOutline(args, util) {
        var name = args.NAME.toString();
		var x = this._getNumberOrDefault(args.X, 5);
        var y = this._getNumberOrDefault(args.Y, 5);
		var width = this._getNumberOrDefault(args.WIDTH, 32);
        var height = this._getNumberOrDefault(args.HEIGHT, 32);
        if (this.skincanvases[name]) {
            var skin = this.skincanvases[name];
			skin.drawSquareOutline(x,y,width,height);
        }
    }
	
	drawCanvas(args, util) {
        var name = args.NAME.toString();
		var name2 = args.NAME2.toString();
		var x = this._getNumberOrDefault(args.X, 5);
        var y = this._getNumberOrDefault(args.Y, 5);
		var width = this._getNumberOrDefault(args.WIDTH, 32);
        var height = this._getNumberOrDefault(args.HEIGHT, 32);
        if (this.skincanvases[name] && this.skincanvases[name2]) {
            var skin = this.skincanvases[name];
			var skin2 = this.skincanvases[name2];
			skin.drawImage(x,y,width,height,skin2.cvs);
        }
    }
	
	drawCanvasChunk(args, util) {
        var name = args.NAME.toString();
		var x = this._getNumberOrDefault(args.X, 5);
        var y = this._getNumberOrDefault(args.Y, 5);
		var width = this._getNumberOrDefault(args.WIDTH, 32);
        var height = this._getNumberOrDefault(args.HEIGHT, 32);
		
		var name2 = args.NAME2.toString();
		var x2 = this._getNumberOrDefault(args.X2, 5);
        var y2 = this._getNumberOrDefault(args.Y2, 5);
		var width2 = this._getNumberOrDefault(args.WIDTH2, 32);
        var height2 = this._getNumberOrDefault(args.HEIGHT2, 32);
        if (this.skincanvases[name] && this.skincanvases[name2]) {
            var skin = this.skincanvases[name];
			var skin2 = this.skincanvases[name2];
			skin.drawImageChunk(x,y,width,height,x2,y2,width2,height2,skin2.cvs);
        }
    }
	
	drawLineTo(args, util) {
        var name = args.NAME.toString();
		var x = this._getNumberOrDefault(args.X, 0);
        var y = this._getNumberOrDefault(args.Y, 0);
		var x2 = this._getNumberOrDefault(args.X2, 20);
        var y2 = this._getNumberOrDefault(args.Y2, 20);
		var thickness = this._getNumberOrDefault(args.SIZE, 5);
        if (this.skincanvases[name]) {
            var skin = this.skincanvases[name];
			skin.drawLine(x,y,x2,y2,thickness);
        }
    }
	
	_blobToDataURI (blob) {
		return new Promise((accept,reject) => {
			try{
				var read = new FileReader();
				read.onload = function () {
					accept(read.result);
				};
				read.onerror = function () {
					reject();
				};
				read.readAsDataURL(blob);
			}catch(e){
				reject(e);
			}
		})
	}
	
	_URIToImage(uri) {
		return new Promise((accept,reject) => {
			var image = document.createElement("img");
			image.onload = function () {
				accept(image);
			};
			image.onerror = function () {
				reject();
			};
			image.src = uri;
		})
	}
	
	async loadImage (args, util) {
		var name = args.NAME.toString();
		var url = args.URL.toString();
		try {
			//Doing it through fetching it first then converting it to data URL
			//is the best way (I can think of) to avoid errors when trying to render the image onto a canvas.
			var request = await fetch(url,{method:"GET"});
			var blob = await request.blob();
			var url = await this._blobToDataURI(blob);
			
			var image = await this._URIToImage(url);
			
			this.loadedImages[name] = image;
		} catch(e) {
			//Just in case the process fails, it won't cause the system to crash.
			//I really don't know what to do here exept to just do nothing.
		}
	}
	
	unloadImage (args, util) {
		var name = args.NAME.toString();
		this.loadedImages[name] = undefined; //Set it to basically nothing.
	}
	
	drawImage (args, util) {
		var name = args.NAME.toString();
		var name2 = args.NAME2.toString();
		var x = this._getNumberOrDefault(args.X, 5);
        var y = this._getNumberOrDefault(args.Y, 5);
		var width = this._getNumberOrDefault(args.WIDTH, 32);
        var height = this._getNumberOrDefault(args.HEIGHT, 32);
        if (this.skincanvases[name] && this.loadedImages[name2]) {
            var skin = this.skincanvases[name];
			var image = this.loadedImages[name2];
			skin.drawImage(x,y,width,height,image);
        }
	}
	
	canvasIsExisting (args, util) {
		var name = args.NAME.toString();
		if (this.skincanvases[name]) {
			return true;
		}
		return false;
	}
	
	imageExists (args, util) {
		var name = args.NAME.toString();
		if (this.loadedImages[name]) {
			return true;
		}
		return false;
	}
	
	canvasToURL (args, util) {
		var name = args.NAME.toString();
		if (this.skincanvases[name]) {
			var skin = this.skincanvases[name];
			return skin.cvs.toDataURL("image/png");
		}
		return "";
	}
	
	canvasWidth (args, util) {
		var name = args.NAME.toString();
		if (this.skincanvases[name]) {
			var skin = this.skincanvases[name];
			return skin.getCanvasWidth();
		}
		return "";
	}
	canvasHeight (args, util) {
		var name = args.NAME.toString();
		if (this.skincanvases[name]) {
			var skin = this.skincanvases[name];
			return skin.getCanvasHeight();
		}
		return "";
	}
	
	imageWidth (args, util) {
		var name = args.NAME.toString();
		if (this.loadedImages[name]) {
			var image = this.loadedImages[name];
			return image.width;
		}
		return "";
	}
	imageHeight (args, util) {
		var name = args.NAME.toString();
		if (this.loadedImages[name]) {
			var image = this.loadedImages[name];
			return image.height;
		}
		return "";
	}
}

module.exports = SpriteCanvases;
