/**
 * Simple grid object for HTML5 canvas.
 *
 * @author Marek Mego
 */	

import { EventTarget } from "./EventTarget.js";
	
class Grid extends EventTarget{
	constructor(canvas, rows, cols) {
		super();
		this._canvas = canvas;
		this._rows = rows;
		this._cols = cols;
		this._lineWidth = 2.0;
		this._active = false;				
		this._style = "rgba(0, 0, 0, 0.75)";
	}
	
	static create(canvas, rows, cols) {
		return new Grid(canvas, rows, cols);
	}
	
	get canvas() {
		return this._canvas;
	}
	
	get active() {
		return this._active;
	}
				
	get rows() {return this._rows;}			

	set rows(val) {
		this._rows = val;				
		this.onChange();
		return this;
	}
	
	get cols() {return this._cols;}

	set cols(val) {
		this._cols = val;
		this.onChange();
		return this;
	}
	
	get style() {return this._style;}

	set style(val) {
		this._style = val;
		this.onChange();
		return this;
	}
	
	get lineWidth() {return this._lineWidth;}

	set lineWidth(val) {
		this._lineWidth = val;
		this.onChange();
		return this;
	}

	activate() {
		this._active = true;				
		this.onChange();
		return this;		
	}

	deactivate() {
		this._active = false;
		this.onChange();
		return this;		
	}
	
	onChange() {
		this.dispatchEvent({type:"change"});
	}
	
	/**
	 * Draws grid to canvas.
	 */
	draw() {					
		// if active draw
		if (this.active) {
									
			// read canvas size and compute grid offset
			var offsetX = Math.floor(this.canvas.width / this.cols);
			var offsetY = Math.floor(this.canvas.height / this.rows);
	
			// get canvas context2D
			var ctx = this.canvas.getContext("2d");
			
			// set drawing style
			ctx.lineWidth = this.lineWidth;
			ctx.strokeStyle = this.style;
			
			ctx.beginPath();
	
			// set cols
			for (var i = 1; i < this.cols; i++) {				
				ctx.moveTo(offsetX * i, 0);
				ctx.lineTo(offsetX *i, this.canvas.height);
			}
				
			// set rows
			for (var i = 1; i < this.rows; i++) {				
				ctx.moveTo(0, offsetY * i);
				ctx.lineTo(this.canvas.width, offsetY * i);										
			}
			
			ctx.closePath();
	
			// draw to canvas								
			ctx.stroke();									
		}		
	}
}

export { Grid };
