/**
 * Distance meter tool.
 *
 * @author Marek Mego
 */		

import { ToolBase } from "./ToolBase.js";
import { Point } from "./Point.js";
		
class Meter extends ToolBase {
	constructor(ime) {
		super();
		this._ime = ime;
		this._startPos = new Point(0, 0);
		this._currentPos = new Point(0, 0);
		this._onMouseDownAction = (x, y) => this._start(x, y);
		this._inProcess = false;
		
		// mousedown listener add/remove methods
		var md = (e) => this.onMouseDown(e);  // must be the same instance for add and remove
		this._disableMouseDown = function() {ime.canvas.removeEventListener("mousedown", md)};
		this._enableMouseDown = function() {ime.canvas.addEventListener("mousedown", md)};
		
		// mousemove listener add/remove methods
		var mm = (e) => this.onMouseMove(e);
		this._disableMouseMove = function() {ime.canvas.removeEventListener("mousemove", mm)};
		this._enableMouseMove = function() {ime.canvas.addEventListener("mousemove", mm)};	
	}
	
	static create(ime) {
		return new Meter(ime);
	}	
	
	_start(x, y) {					
		console.log("mtr start");
		this._inProcess = true;		
		this._startPos.x = x;
		this._startPos.y = y;
		this._currentPos.x = x;
		this._currentPos.y = y;		
		this._drawable = true;		
		this._enableMouseMove();		
		this._onMouseDownAction = (x, y) => this._finish(x, y);
		this.onChange();
	}
	
	_finish(x, y) {
		console.log("mtr finish");
		this._drawable = false;				
		this._onMouseDownAction = (x, y) => this._start(x, y);
		this._disableMouseMove();
		this.onChange();
		this._inProcess = false;
	}
	
	onActivate() {
		console.log("meter activate");				
		this._enableMouseDown();
		this.onChange();		
	}
	
	onDeactivate() {
		console.log("meter deactivate");
		// handle tool deactivation while still in process
		if (this._inProcess) {
			this._finish(this._currentPos.x, this._currentPos.y);
		}
		this._drawable = false;		
		this._disableMouseDown();		
		this._onMouseDownAction = (x, y) => this._start(x, y);
		this.onChange();
	}
	
	onMouseDown(e) {
		this._onMouseDownAction(e.offsetX, e.offsetY);		
		this.onChange();
	}
	
	onMouseMove(e) {			
		this._currentPos.x = e.offsetX;
		this._currentPos.y = e.offsetY;
		console.log(this._startPos.distance(this._currentPos));
		this.onChange();
	}
	
	onChange() {
		console.log("mtr onchange");		
		this.dispatchEvent({type:"change"});		
	}
		
	draw() {
		//TODO global drawing configuration
		if (this.drawable) {		
			this._ime.ctx.beginPath();
			this._ime.ctx.moveTo(this._startPos.x, this._startPos.y);
			this._ime.ctx.lineTo(this._currentPos.x, this._currentPos.y);
			this._ime.ctx.closePath();
			this._ime.ctx.shadowOffsetX = 1;
			this._ime.ctx.shadowOffsetY = 1;
			this._ime.ctx.shadowBlur = 1;
			this._ime.ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
			this._ime.ctx.lineWidth = 3;
			this._ime.ctx.strokeStyle = "rgba(255, 255, 0, 0.6)";					
			this._ime.ctx.stroke();
			this._ime.ctx.font = "16px Arial";
			this._ime.ctx.fillStyle = "rgba(255, 255, 0, 1.0)";
			this._ime.ctx.fillText(Math.round(this._startPos.distance(this._currentPos)) + " px", this._currentPos.x, this._currentPos.y);
			console.log("meter drawing");
		}
	}
	
}

export { Meter };
