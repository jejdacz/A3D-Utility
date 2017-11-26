/**
 * Image editor controller.
 *
 * @author Marek Mego
 */

import { EventTarget } from "./EventTarget.js";
			
class ImageEditorController extends EventTarget{
	constructor(canvas) {
		super();
		this._canvas = canvas;
		this._ctx = canvas.getContext("2d");		
		this._image = new Image();		
		
		// image rendering configuration
		this._imageConf = {
			src:this._image,
			sx:0, sy:0,
			sw:this._image.width,
			sh:this._image.height,
			dx:0, dy:0,
			dw:this._image.width,
			dh:this._image.height,
			zoom:{
				ratio:1.0,
				increment:1.25,
				}
		};
		
		this._helpers = []; // multiple helpers can be active at once
		this._tools = []; // only one tool can be active at once
		this._activeTool = null;
		
		this._image.onload = (e) => {
			this.dispatchEvent(new Event("imageload"));
			this.imageLoaded(e);
		};																	
	}
	
	/**
	 * Factory method.
	 */
	static create(args) {
		if (!args.canvas) throw "undefined parameter";
		return new ImageEditorController(args.canvas);
	}
	
	
	/* Getters and Setters */
	
	
	getCanvas() {
		return this._canvas;
	}
	
	getCtx() {
		return this._ctx;
	}
	
	getimageConf() {
		return this._imageConf;
	}	
	
	setImageSource(src) {
		this._image.src = src;
	}
	
	
	/* Zoom handling */
	
	
	setZoom(val) {
		this._imageConf.zoom.ratio = val;
		this._canvas.width = this._imageConf.dw * this._imageConf.zoom.ratio;
		this._canvas.height = this._imageConf.dh * this._imageConf.zoom.ratio;	
		this.resetTool();
		this.draw();
	}
	
	zoomIn() {
		this.setZoom(this._imageConf.zoom.ratio * this._imageConf.zoom.increment);		
	}
	
	zoomOut() {
		this.setZoom(this._imageConf.zoom.ratio / this._imageConf.zoom.increment);		
	}
	
	
	/* Tools handling */
	
	
	addTool(tool) {
		this._tools.push(tool);
	}
			
	activateTool(tool) {
		
		// notify about tool override		
		if (this._activeTool != null) {
			this.dispatchEvent(new Event("overridetool"));
		}
				
		// disable currently active tool if any		
		if (this._activeTool != null) this.deactivateTool(this._activeTool);
				
		// activate selected tool		
		this._activeTool = tool;
		this._activeTool.activate();		
	}
	
	deactivateTool(tool) {				
		if (this._activeTool == null) {
			console.warn("No tool to deactivate!");
		} else {
			this._activeTool.deactivate();
			this._activeTool = null;						
		}
	}
	
	
	/* Helpers handling */
	
	addHelper(helper) {
		this._helpers.push(helper);
	}
	
	activateHelper(helper) {
		helper.activate();
	}
	
	deactivateHelper(helper) {
		helper.deactivate();
	}
	
	
	/**
	 * Resets the rendering configuration of the image.
	 * Resets the tool and redraws the editor screen.
	 */		
	restore() {
		this.resetImage();
		this.resetTool();
		this.draw();
	}
	
	/**
	 * Deactivates and activates again the currently active tool.
	 */	
	resetTool() {
		if (this._activeTool) {
			this._activeTool.deactivate();
			this._activeTool.activate();			
		}
	}
	
	/**
	 * Resets the rendering configuration of the image. 
	 */		
	resetImage() {
		this._imageConf.zoom.ratio = 1.0;
		this._imageConf.sx = 0;
		this._imageConf.sy = 0;				
		this._imageConf.sw = this._image.width;
		this._imageConf.sh = this._image.height;
		this._imageConf.dx = 0;
		this._imageConf.dy = 0;
		this._imageConf.dw = this._image.width;
		this._imageConf.dh = this._image.height;
		this._canvas.width = this._image.width;
		this._canvas.height = this._image.height;
	}
		
	/**
	 * Draws objects on canvas.
	 */
	draw() {	  				  			
		// clear canvas
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		
		// draw image
		this._ctx.drawImage(this._imageConf.src,
												this._imageConf.sx,
												this._imageConf.sy,
												this._imageConf.sw,
												this._imageConf.sh,
												this._imageConf.dx,
												this._imageConf.dy,
												this._imageConf.dw * this._imageConf.zoom.ratio,
												this._imageConf.dh * this._imageConf.zoom.ratio,
												);
												
		// draw helpers
		for (var i = 0, l = this._helpers.length; i < l; i++) {
			this._ctx.save();
			this._helpers[i].draw();
			this._ctx.restore();
		}
		
		// draw active tool
		if (this._activeTool != null) {
			this._ctx.save();
			this._activeTool.draw();
			this._ctx.restore();
		}
	}
	
	/* Events handling */
		 	
	imageLoaded(e) {
		this.resetImage();
		this.resetTool();		
		this.draw();
	}
	
	imageResized() {
		this.resetTool();
		this.draw();
	}
	
	imageConfigModified() {
		
		// readjust the editor screen (canvas)
		this._canvas.width = this._imageConf.dw * this._imageConf.zoom.ratio;
		this._canvas.height = this._imageConf.dh * this._imageConf.zoom.ratio;
		
		this.resetTool();
		this.draw();
	}
	
	// note
	// event handling method = method executed by event handler when event was fired
	// in C# objname_eventname(sender, evargs)	implements eventhandler interface
	// context changed imectx_Changed(e) / contextChanged(e)	
	
}

export { ImageEditorController };

