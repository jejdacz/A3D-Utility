//TODO imageDC setter
//TODO remove ime dependency
/**
 * Crop image tool.
 *
 * @author Marek Mego
 */
 
import { ToolBase } from "./ToolBase.js";
import { CPRectangle } from "./CPRectangle.js";
import { Point } from "./Point.js";

class Crop extends ToolBase {
	constructor(canvas, imageDC) {
		super();
		this._imageDC = imageDC;
		this._canvas = canvas;		
		this._activeCp;
		this._cpRect = new CPRectangle();
		this._cursorPrevPos = new Point(0,0);
		this._onMouseMoveAction;
		
		// mouse listeners setup
		var md = (e) => this.onMouseDown(e);
		this._disableMouseDown = function() {this._canvas.removeEventListener("mousedown", md)};
		this._enableMouseDown = function() {this._canvas.addEventListener("mousedown", md)};
				
		var mu = (e) => this.onMouseUp(e);
		this._disableMouseUp = function() {this._canvas.removeEventListener("mouseup", mu)};
		this._enableMouseUp = function() {this._canvas.addEventListener("mouseup", mu)};
				
		var mm = (e) => this.onMouseMove(e);
		this._disableMouseMove = function() {this._canvas.removeEventListener("mousemove", mm)};
		this._enableMouseMove = function() {this._canvas.addEventListener("mousemove", mm)};
	}
			
	static create(canvas, imageDC) {
		return new Crop(canvas, imageDC);
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
			this._imageDC.sx += this._cpRect.getPosition().getX();
			this._imageDC.sy += this._cpRect.getPosition().getY();
			this._imageDC.sw = this._cpRect.getWidth();
			this._imageDC.sh = this._cpRect.getHeight();
			this._imageDC.dw = this._cpRect.getWidth();
			this._imageDC.dh = this._cpRect.getHeight();
			// v2 pass imageDC ref by ctor; //ime dont know about change
			// v4 pass function setIMDC() by ctor and call it with dcsettings
			// v1 direct call ime.setImageConfig({obj});
			// v3 distribute config object in event args
			// v5 use setter for delivery of apply config function PROPERTY INJECTION		
			this._canvas.width = this._cpRect.getWidth();
			this._canvas.height = this._cpRect.getHeight();
			this._cpRect.setBoundary(this._canvas.width, this._canvas.height);
			//this.dispatchEvent({type:"crop"});	 // ime.resize	
			this.dispatchEvent({type:"imagechange"});
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

