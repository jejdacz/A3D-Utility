/**
 * Simple grid object for HTML5 canvas.
 *
 * @author Marek Mego
 */	

import { ToolBase } from "./ToolBase.js";
	
class Grid extends ToolBase{

	constructor(canvas, rows = 3, cols = 3) {
	
		super();
		
		if (isNaN(rows) || isNaN(cols)) {
							
			throw new Error("invalid argument, use a number");
									
		}
		
		this._canvas = canvas;
		this._rows = rows;
		this._cols = cols;
		this._lineWidth = 2.0;						
		this._style = "rgba(0, 0, 0, 0.75)";
		
	}
	
	/**
	 * Factory method.
	 */
	static create(args) {
	
		if (args.canvas === undefined || args.rows === undefined || args.cols === undefined) {
			
			throw new Error("missing argument");
			
		}
		
		return new Grid(args.canvas, args.rows, args.cols);
		
	}
	
	/* Getters and Setters */
					
	getRows() {
	
		return this._rows;
		
	}			

	setRows(val) {
	
		this._rows = val;
						
		this.onChange();
		
		return this;
		
	}
	
	getCols() {
	
		return this._cols;
		
	}

	setCols(val) {
	
		this._cols = val;
		
		this.onChange();
		
		return this;
		
	}
	
	getStyle() {
	
		return this._style;
		
	}

	setStyle(val) {
	
		this._style = val;
		
		this.onChange();
		
		return this;
		
	}
	
	getLineWidth() {
	
		return this._lineWidth;
		
	}

	setLineWidth(val) {
	
		this._lineWidth = val;
		
		this.onChange();
		
		return this;
		
	}
	
		
	/* Events */

	onActivate() {	
						
		this.drawOn();		
		this.onChange();
						
	}

	onDeactivate() {
			
		this.drawOff();		
		this.onChange();
						
	}
	
	onChange() {
	
		if (this.isActive()) {
			this.dispatchEvent(new Event("change"));
		}
		
	}
		
	onDraw() {
									
		// read canvas size and compute grid offset
		var offsetX = Math.floor(this._canvas.width / this._cols);
		var offsetY = Math.floor(this._canvas.height / this._rows);

		// get canvas context2D
		var ctx = this._canvas.getContext("2d");
		
		// set drawing style
		ctx.lineWidth = this._lineWidth;
		ctx.strokeStyle = this._style;
		
		ctx.beginPath();

		// set cols
		for (var i = 1; i < this._cols; i++) {
						
			ctx.moveTo(offsetX * i, 0);
			ctx.lineTo(offsetX *i, this._canvas.height);
			
		}
			
		// set rows
		for (var i = 1; i < this._rows; i++) {
						
			ctx.moveTo(0, offsetY * i);
			ctx.lineTo(this._canvas.width, offsetY * i);
													
		}
		
		ctx.closePath();

		// draw to canvas								
		ctx.stroke();
		
	}
	
}

export { Grid };

