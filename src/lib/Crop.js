/**
 * Crop tool.
 * Crops the image to rectangular selection.
 * Modifies rendering parameters to simulate cropping.
 *
 * @author Marek Mego
 */
 
import { ToolBase } from "./ToolBase.js";
import { CPRectangle } from "./CPRectangle.js";
import { Point } from "./Point.js";

class Crop extends ToolBase {

	constructor(canvas, imageConf) {
	
		super();
		
		this._imageConf = imageConf;
		this._canvas = canvas;
		this._activeCp = undefined; // active control point
		this._cpRect = new CPRectangle();
		this._cursorPrevPos = new Point(0,0);
		this._onMouseMoveAction;
		
		/* Set mouse event listeners */
		
		var md = (e) => this.onMouseDown(e);
		
		this._disableMouseDown = function() {canvas.removeEventListener("mousedown", md)};
		this._enableMouseDown = function() {canvas.addEventListener("mousedown", md)};
				
		var mu = (e) => this.onMouseUp(e);
		
		this._disableMouseUp = function() {canvas.removeEventListener("mouseup", mu)};
		this._enableMouseUp = function() {canvas.addEventListener("mouseup", mu)};
				
		var mm = (e) => this.onMouseMove(e);
		
		this._disableMouseMove = function() {canvas.removeEventListener("mousemove", mm)};
		this._enableMouseMove = function() {canvas.addEventListener("mousemove", mm)};
		
	}
	
	/**
	 * Factory method.
	 */			
	static create(args) {
	
		if (args.canvas === undefined || args.imageConf === undefined) {
		
			throw new Error("missing argument");
			
		}
		
		return new Crop(args.canvas, args.imageConf);
		
	}
	
	/**
	 * Returns the width of selection.
	 */
	getWidth() {
	
		return this._cpRect.getWidth();	
			
	}
	
	/**
	 * Returns the height of selection.
	 */
	getHeight() {
	
		return this._cpRect.getHeight();
				
	}
	
	/**
	 * Moves the control point.
	 */
	_cpMove(e) {
	
		this._activeCp.move(e.offsetX, e.offsetY);
		
	}
	
	/**
	 * Moves the selection.
	 */
	_rectMove(e) {
	
		var x = e.offsetX - this._cursorPrevPos.getX();
		var y = e.offsetY - this._cursorPrevPos.getY();
		
		this._cpRect.move(x, y);
		
		this._cursorPrevPos.setX(e.offsetX);
		this._cursorPrevPos.setY(e.offsetY);
		
	}
	
	
	/**
	 * Crops to selection. 
	 */
	crop() {
			
		if (this.isActive()) {
		
			this._imageConf.sx += this._cpRect.getPosition().getX() / this._imageConf.zoom.ratio;
			this._imageConf.sy += this._cpRect.getPosition().getY() / this._imageConf.zoom.ratio;
			this._imageConf.sw = this._cpRect.getWidth() / this._imageConf.zoom.ratio;
			this._imageConf.sh = this._cpRect.getHeight() / this._imageConf.zoom.ratio;
			this._imageConf.dw = this._cpRect.getWidth() / this._imageConf.zoom.ratio;
			this._imageConf.dh = this._cpRect.getHeight() / this._imageConf.zoom.ratio;
								
			this.dispatchEvent(new Event("crop"));
			
		} else {
		
			console.warn("Crop tool isn't active!");
			
		}
	}
		
	/* Events	*/
	
	onActivate() {
			
		this._cpRect.setBoundary(this._canvas.width, this._canvas.height);
				
		this._enableMouseDown();
		this._enableMouseUp();
		
		this.drawOn();
		this.onChange();
				
	}
	
	onDeactivate() {
	
		this._disableMouseDown();
		this._disableMouseUp();
		this._disableMouseMove();
		
		this.drawOff();		
		this.onChange();
			
	}
	
	onMouseDown(e) {
			
		var cp = this._cpRect.inCpArea(e.offsetX, e.offsetY);
					
		if (cp) {
		
			this._activeCp = cp;			
			this._onMouseMoveAction = (e) => this._cpMove(e);
			this._enableMouseMove();	
					
		} else {
		
			if (this._cpRect.inRectArea(e.offsetX, e.offsetY)) {
			
				this._cursorPrevPos.setX(e.offsetX).setY(e.offsetY);
				this._onMouseMoveAction = (e) => this._rectMove(e);
				this._enableMouseMove();
				
			}
			
		}	
		
		this.onChange();
			 
	}
	
	onMouseUp(e) {
				
		this._disableMouseMove();
		this._activeCp = undefined;
		
		this.onChange();	
							 
	}
		
	onMouseMove(e) {
	
		this._onMouseMoveAction(e);
				
		this.onChange();
					 
	}
			
	onChange() {
			
		this.dispatchEvent(new Event("change"));
		
	}
		
	onDraw() {
	
			this._cpRect.draw(this._canvas.getContext("2d"));
			
	}
	
}

export { Crop };

