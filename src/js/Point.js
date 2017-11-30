/**
 * Point helper class.
 *
 * @author Marek Mego
 */
 
class Point {
	
	constructor(x, y) {
		
		if (isNaN(x) || isNaN(y)) {
							
			throw new Error("invalid argument, use a number");
									
		}				
			
		this._x = x;
		this._y = y;
				
	}
	
	setX(val) {
		
		if (isNaN(val)) {
							
			throw new Error("invalid argument, use a number");
									
		}
				
		this._x = val;
		
		return this;
				
	}
	
	setY(val) {	
		
		if (isNaN(val)) {
							
			throw new Error("invalid argument, use a number");
									
		}
		
		this._y = val;
		
		return this;
				
	}
	
	getX() {
	
		return this._x;
				
	}
	
	getY() {
	
		return this._y;
				
	}
	
	/**
	 * Computes a distance between two points.
	 * It is a variadic function. Accepts (Point) or (Number, Number).
	 */	
	distance() {
			
		if (arguments.length == 1 && (arguments[0] instanceof Point)) {
			
			return this._distance(arguments[0].getX(), arguments[0].getY());
			
		} else if ((arguments.length == 2) && !isNaN(arguments[0]) && !isNaN(arguments[1])) {
		
			return this._distance(arguments[0], arguments[1]);
			
		} else {
		
			throw new Error("invalid arguments");
			
		}
	}
	
	_distance(x, y) {
	
		return Math.sqrt(Math.pow(x - this._x, 2) + Math.pow(y - this._y, 2));
		
	}
	
	toString() {
	
		return `[Object Point: x:${this._x}, y:${this._y}]`;
		
	}	
	
}

export { Point };

