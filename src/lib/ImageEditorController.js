//TODO remove ime dependency
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
		this._originalImage = new Image(); // backup for undo
		this._image = new Image(); // image to edit		
		this._imageDC = {
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
		//this._zoom = { ratio:1.0, increment:1.25 };
		this._helpers = []; // multiple helpers can be active at once
		this._tools = []; // only one tool can be active at the moment
		this._activeTool = null;	
		this._image.onload = (e) => {
			this.dispatchEvent({type:"imageload"});
			this.imageLoaded(e);
		};																	
	}
	
	static create(args) {
		return new ImageEditorController(args.canvas);
	}
			
	get canvas() { return this._canvas;}
	get ctx() { return this._ctx;}
	
	getCanvas() {
		return this._canvas;
	}
	
	getCtx() {
		return this._ctx;
	}
	
	getImageDC() {
		return this._imageDC;
	}
	/*
	getZoom() {
		return this._zoom;
	}*/
	
	setZoom(val) {
		this._imageDC.zoom.ratio = val;
		this._canvas.width = Math.round(this._imageDC.dw * this._imageDC.zoom.ratio);
		this._canvas.height = Math.round(this._imageDC.dh * this._imageDC.zoom.ratio);	
		this.resetTool();
		this.draw();
	}
	
	zoomIn() {
		this.setZoom(this._imageDC.zoom.ratio * this._imageDC.zoom.increment);		
	}
	
	zoomOut() {
		this.setZoom(this._imageDC.zoom.ratio / this._imageDC.zoom.increment);		
	}
	
	setImageSource(src) {
		this._image.src = src;
	}
	
	addTool(tool) {
		this._tools.push(tool);
	}
			
	activateTool(tool) {
		
		// notify about tool override		
		if (this._activeTool != null) {
			this.dispatchEvent({type:"overridetool"});
		}
				
		// disable currently active tool if any		
		if (this._activeTool != null) this.deactivateTool(this._activeTool);
				
		// activate selected tool
		console.log("activating tool " + tool);
		this._activeTool = tool;
		this._activeTool.activate();		
	}
	
	deactivateTool(tool) {
		console.log("deactivating tool" + tool);		
		if (this._activeTool == null) {
			console.warn("No tool to deactivate!");
		} else {
			this._activeTool.deactivate();
			this._activeTool = null;						
		}
	}
	
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
	 * Event handlers.
	 */	 	
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
		this._canvas.width = Math.round(this._imageDC.dw * this._imageDC.zoom.ratio);
		this._canvas.height = Math.round(this._imageDC.dh * this._imageDC.zoom.ratio);
		this.resetTool();
		this.draw();
	}
	
	// event handling method = method executed by event handler when event was fired
	// in C# objname_eventname(sender, evargs)	implements eventhandler interface
	// context changed imectx_Changed(e) / contextChanged()
		
	restore() {
		this.resetImage();
		this.resetTool();
		this.draw();  // fire event restore  // catch event restore set callback ctxChanged
	}
	
	resetTool() {
		if (this._activeTool) {
			this._activeTool.deactivate();
			this._activeTool.activate();			
		}
	}
		
	resetImage() {
		this._imageDC.zoom.ratio = 1.0;
		this._imageDC.sx = 0;
		this._imageDC.sy = 0;				
		this._imageDC.sw = this._image.width;
		this._imageDC.sh = this._image.height;
		this._imageDC.dx = 0;
		this._imageDC.dy = 0;
		this._imageDC.dw = this._image.width;
		this._imageDC.dh = this._image.height;
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
		this._ctx.drawImage(this._imageDC.src,
												this._imageDC.sx,
												this._imageDC.sy,
												this._imageDC.sw,
												this._imageDC.sh,
												this._imageDC.dx,
												this._imageDC.dy,
												Math.round(this._imageDC.dw * this._imageDC.zoom.ratio),
												Math.round(this._imageDC.dh * this._imageDC.zoom.ratio),
												);
												
		// draw helpers
		for (var i = 0, l = this._helpers.length; i < l; i++) {
			this._helpers[i].draw();
		}
		
		// draw active tool
		if (this._activeTool != null) this._activeTool.draw();
	}

	
	
}

export { ImageEditorController };

