/**
 * A rectangular selection with control point at each corner.
 * A size and position of the selection is adjusted by the control points.
 *
 * @author Marek Mego
 * 
 * cp0 ------ cp1
 *     |    |
 * cp2 ------ cp3
 *
 */
 
import { Point } from "./Point.js";
import { ControlPoint } from "./ControlPoint.js";
  
class CPRectangle {

	constructor() {
			
		this._position = new Point(0,0);
		this._cpArray = [];		
		this._cpSize = 10;		
		this._width = 0;
		this._height = 0;
		this._boundary = new Point(0,0);
		
		// init control points
		this._initCp();
						
	}
		
	/**
	 * Sets the rectangle width, prevents a boundary overflow.
	 */
	setWidth(val) {		
		
		if (isNaN(val)) {
							
			throw new Error("invalid argument, use a number");
									
		}
		
		if (this._validate(this._position.getX(), this._position.getY(), val, this._height)) {
			
			this._cpArray[1].setX(this._position.getX() + val);
			this._cpArray[3].setX(this._position.getX() + val);
			
			this._width = val;
			
		}
		
	}
	
	/** 
	 * Sets the rectangle height, prevents a boundary overflow.
	 */
	setHeight(val) {
	
		if (isNaN(val)) {
							
			throw new Error("invalid argument, use a number");
									
		}
	
		if (this._validate(this._position.getX(), this._position.getY(), this._width, val)) {
			
			this._cpArray[2].setY(this._position.getY() + val);
			this._cpArray[3].setY(this._position.getY() + val);
			
			this._height = val;
			
		}
		
	}
	
	/**
	 * Sets the position within the boundaries.
	 */
	setPosition(x, y) {
		
		if (isNaN(x) || isNaN(y)) {
							
			throw new Error("invalid argument, use a number");
									
		}
		
		// process X axis
		if (this._validate(x, this._position.getY(), this._width, this._height)) {
			
			var moveX = x - this._position.getX();
						
			this._cpArray.forEach(function(element) {
			
				element.setX(element.getX() + moveX);
							
			});
			
			this._position.setX(x);
								
		}
		
		// process Y axis
		if (this._validate(this._position.getX(), y, this._width, this._height)) {
			
			var moveY = y - this._position.getY();
									
			this._cpArray.forEach(function(element) {
							
				element.setY(element.getY() + moveY);
				
			});		
			
			this._position.setY(y);
			
		}
	}
	
	/**
	 * Sets the boundaries and adjusts the rectangle size within the new boundaries.
	 */		
	setBoundary(x, y){		
		
		if (isNaN(x) || isNaN(y)) {
							
			throw new Error("invalid argument, use a number");
									
		}
		
		this._reset();
		this._boundary.setX(x);
		this._boundary.setY(y);
		this.justify();
		
	}
	
	/* Getters */
	
	getWidth() {
	
		return this._width;
		
	}
	
	getHeight() {
	
		return this._height;
		
	}
	
	getPosition() {
	
		return this._position;
		
	}
	
	getCpArray() {
	
		return this._cpArray;
		
	}
	
	getCpSize() {
	
		return this._cpSize;
		
	}
	
	getCenter() {
	
		return new Point(
		
			this._position.getX() + this._width / 2,
			this._position.getY() + this._height / 2,
			
			);
			
	}
	
	/**
	 * Looks up for a control point at given coordinates.
	 * Returns a reference to the first control point at the position.
	 */
	inCpArea(x, y) {
		
		if (isNaN(x) || isNaN(y)) {
							
			throw new Error("invalid argument, use a number");
									
		}
		
		var result = false;
		
		this._cpArray.forEach((element, i) => {
			
			if ((Math.abs(element.getX() - x) < this._cpSize / 2)
			&& (Math.abs(element.getY() - y) < this._cpSize / 2)) {			
				
				result = element;
				
			}
						
		});
		
		return result;
		
	}
	
	/**
	 * Checks if the given coordinates lies within the rectangle.
	 */	
	inRectArea(x, y) {
		
		if (isNaN(x) || isNaN(y)) {
							
			throw new Error("invalid argument, use a number");
									
		}
		
		if ((Math.abs(this.getCenter().getX() - x) < (this._width - this._cpSize) / 2)
		&& (Math.abs(this.getCenter().getY() - y) < (this._height - this._cpSize) / 2)) {
		
			return true;
			
		}
		
		return false;
		
	}
	
	/**
	 * Moves the ractangle by the x, y parameters.
	 */		
	move(x, y) {
	
		if (isNaN(x) || isNaN(y)) {
							
			throw new Error("invalid argument, use a number");
									
		}
			
		this.setPosition(this._position.getX() + x, this._position.getY() + y);
		
	}
	
	/**
	 * Centers the rectangle within the boundaries.
	 */
	centerToBoundary() {
	
		this.setPosition(
		
			(this._boundary.getX() - this.getWidth()) / 2,
			(this._boundary.getY() - this.getHeight()) / 2,
			
		);
		
	}
	
	/**
	 * Aligns the rectangle position and adjusts size within the boundaries.
	 */
	justify() {
					
		this.setWidth(this._boundary.getX() / 2);
		this.setHeight(this._boundary.getY() / 2);
		
		this.centerToBoundary();
		
	}
	
	/**
	 * Verifies valid rectangle position and dimensions within boundaries.
	 */
	_validate(x, y, w, h) {
	
		// negative values
		if (x < 0 || y < 0) return false;
		
		// width oversize
		if (x + w > this._boundary.getX()) return false;
		
		// height oversize
		if (y + h > this._boundary.getY()) return false;
		
		// ok		
		return true;
		
	}
	
	/**
	 * Resets to initial values.
	 */
	_reset() {
	
		this._position.setX(0);
		this._position.setY(0);
		
		this._width = 0;
		this._height = 0;
		
		this._cpArray.forEach((element) => {
		
			element.setX(0);
			element.setY(0);
			
		});
		
	}
	
	/**
	 * Initializes the control points to rectangle's corners and configures move() methods.
	 */	
	_initCp() {		
		
		var cp0 = new ControlPoint(0,0);
		
		this._cpArray.push(cp0);
		
		cp0.moveFn = (x, y) => {
		
			if (x < this._cpArray[1].getX()) {
			
					this.setWidth(this._cpArray[1].getX() - x);					
					this.setPosition(x, this._position.getY());
										
				}
				
				if (y < this._cpArray[2].getY()) {
				
					this.setHeight(this._cpArray[2].getY() - y);					
					this.setPosition(this._position.getX(), y);
					
				}
				
		}
				
		
		var cp1 = new ControlPoint(0,0);
		
		this._cpArray.push(cp1);
				
		cp1.moveFn = (x, y) => {
		
				if (x > this._cpArray[0].getX()) {
				
					this.setWidth(x - this._cpArray[0].getX());
					
				}
				
				if (y < this._cpArray[3].getY()) {
				
					this.setHeight(this._cpArray[3].getY() - y);					
					this.setPosition(this._position.getX(), y);
					
				}
				
		}
				
		
		var cp2 = new ControlPoint(0,0);
		
		this._cpArray.push(cp2);
		
		cp2.moveFn = (x, y) => {
		
				if (x < this._cpArray[3].getX()) {
				
					this.setWidth(this._cpArray[3].getX() - x);					
					this.setPosition(x, this._position.getY());
					
				}
				
				if (y > this._cpArray[0].getY()) {
									
					this.setHeight(y - this._cpArray[0].getY());
					
				}
				
		}
		
		var cp3 = new ControlPoint(0,0);
		
		this._cpArray.push(cp3);
		
		cp3.moveFn = (x, y) => {
		
				if (x > this._cpArray[2].getX()) {
				
					this.setWidth(x - this._cpArray[2].getX());
										
				}
				
				if (y > this._cpArray[0].getY()) {
				
					this.setHeight(y - this._cpArray[0].getY());
										
				}	
							
		}
				
	}
	
	/**
	 * Draws the rectangle and the control points to the canvas.
	 */	
	draw(ctx) {
	
		ctx.shadowOffsetX = 1;
		ctx.shadowOffsetY = 1;
		ctx.shadowBlur = 1;
		ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
		
		ctx.lineWidth = 1;
		ctx.setLineDash([8, 8]);		
		ctx.strokeStyle = "rgba(230, 230, 230, 0.9)";
					
		ctx.strokeRect(
		
			this.getPosition().getX(),
			this.getPosition().getY(),
			this.getWidth(),
			this.getHeight(),
			
		);		
		
		this._cpArray.forEach((element) => {
		
					if (element.isActive()) {
					 
						ctx.fillStyle = "rgba(255, 0, 0, 0.6)";
						
					} else {
					
						ctx.fillStyle = "rgba(200, 200, 200, 0.8)";
						
					}
					
					ctx.fillRect(
					
						element.getX() - this._cpSize / 2,
						element.getY() - this._cpSize / 2,
						
						this._cpSize,
						this._cpSize
					
					);
					
		});
		
		ctx.setLineDash([0, 0]);
		
	}
	
}


export { CPRectangle };

