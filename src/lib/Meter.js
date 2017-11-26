/**
 * Distance meter tool.
 *
 * @author Marek Mego
 */		

import { ToolBase } from "./ToolBase.js";
import { Point } from "./Point.js";
		
class Meter extends ToolBase {
	constructor(canvas) {
		super();		
		this._canvas = canvas;
		this._ctx = canvas.getContext("2d");
		this._startPos = new Point(0, 0);
		this._currentPos = new Point(0, 0);
		this._onMouseDownAction = (x, y) => this._start(x, y);
		this._inProcess = false;
		
		// set mouse event listeners methods
		var md = (e) => this.onMouseDown(e);  // must be the same instance for add and remove
		this._disableMouseDown = function() {canvas.removeEventListener("mousedown", md)};
		this._enableMouseDown = function() {canvas.addEventListener("mousedown", md)};
				
		var mm = (e) => this.onMouseMove(e);
		this._disableMouseMove = function() {canvas.removeEventListener("mousemove", mm)};
		this._enableMouseMove = function() {canvas.addEventListener("mousemove", mm)};	
	}
	
	 /**
	  * Factory method.
	  */
	static create(args) {
		if (!args.canvas) throw "undefined parameter";
		return new Meter(args.canvas);
	}
	
	
	/* Measuring process handling */
	
	// start measure at x, y
	_start(x, y) {
		this._inProcess = true;		
		this._startPos.setX(x);
		this._startPos.setY(y);
		this._currentPos.setX(x);
		this._currentPos.setY(y);		
		this.drawOn();		
		this._enableMouseMove();		
		this._onMouseDownAction = (x, y) => this._finish(x, y);		
	}
	
	// stop measure at x, y
	_finish(x, y) {		
		this.drawOff();				
		this._onMouseDownAction = (x, y) => this._start(x, y);
		this._disableMouseMove();		
		this._inProcess = false;		
	}
	
	
	/* Events */
	
	onActivate() {						
		this._enableMouseDown();
		this.onChange();		
	}
		
	onDeactivate() {
		
		// handle tool deactivation while still in process
		if (this._inProcess) {
			this._finish(this._currentPos.getX(), this._currentPos.getY());
		}		
		this._disableMouseDown();		
		this._onMouseDownAction = (x, y) => this._start(x, y);
		this.drawOff();
		this.onChange();
	}
	
	onMouseDown(e) {
		this._onMouseDownAction(e.offsetX, e.offsetY);		
		this.onChange();
	}
	
	onMouseMove(e) {			
		this._currentPos.setX(e.offsetX);
		this._currentPos.setY(e.offsetY);		
		this.onChange();
	}
	
	onChange() {				
		this.dispatchEvent(new Event("change"));		
	}
		
	onDraw() {		
		this._ctx.beginPath();
		this._ctx.moveTo(this._startPos.getX(), this._startPos.getY());
		this._ctx.lineTo(this._currentPos.getX(), this._currentPos.getY());
		this._ctx.closePath();
		this._ctx.shadowOffsetX = 1;
		this._ctx.shadowOffsetY = 1;
		this._ctx.shadowBlur = 1;
		this._ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
		this._ctx.lineWidth = 3;
		this._ctx.strokeStyle = "rgba(255, 255, 0, 0.6)";					
		this._ctx.stroke();
		this._ctx.font = "16px Arial";
		this._ctx.fillStyle = "rgba(255, 255, 0, 1.0)";
		this._ctx.fillText(Math.round(this._startPos.distance(this._currentPos)) + " px", this._currentPos.getX(), this._currentPos.getY());		
	}	
}

export { Meter };

