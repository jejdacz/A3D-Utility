/**
 * Crop tool.
 * Modifies parameters for drawing image on canvas to simulate crop. 
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
		
		// mouse event listeners setup
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
			
	static create(args) {
		return new Crop(args.canvas, args.imageConf);
	}
		
	onActivate() {		
		this._cpRect.setBoundary(this._canvas.width, this._canvas.height);		
		this._enableMouseDown();
		this._enableMouseUp();
		this._drawable = true;
		this.onChange();		
	}
	
	onDeactivate() {
		this._disableMouseDown();
		this._disableMouseUp();
		this._disableMouseMove();
		this._drawable = false;		
		this.onChange();	
	}
	
	_cpMove(e) {
		this._activeCp.move(e.offsetX, e.offsetY);
	}
	
	_rectMove(e) {
		var x = e.offsetX - this._cursorPrevPos.getX();
		var y = e.offsetY - this._cursorPrevPos.getY();
		this._cpRect.move(x, y);
		this._cursorPrevPos.setX(e.offsetX);
		this._cursorPrevPos.setY(e.offsetY);
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
		this.dispatchEvent({type:"change"});
	}
	
	crop() {		
		if (this._active) {
			this._imageConf.sx += this._cpRect.getPosition().getX() / this._imageConf.zoom.ratio;
			this._imageConf.sy += this._cpRect.getPosition().getY() / this._imageConf.zoom.ratio;
			this._imageConf.sw = this._cpRect.getWidth() / this._imageConf.zoom.ratio;
			this._imageConf.sh = this._cpRect.getHeight() / this._imageConf.zoom.ratio;
			this._imageConf.dw = this._cpRect.getWidth() / this._imageConf.zoom.ratio;
			this._imageConf.dh = this._cpRect.getHeight() / this._imageConf.zoom.ratio;					
			this.dispatchEvent({type:"crop"});
		} else {
			console.warn("Crop tool isn't active!");
		}
	}										
	
	draw() {		
		if (this.drawable) {
			this._cpRect.draw(this._canvas.getContext("2d"));									
		}		
	}	
}

export { Crop };

