/**
 * Point helper class.
 *
 * @author Marek Mego
 */
 
class Point {
	constructor(x, y) {
		this._x = x;
		this._y = y;
	}
	
	setX(val) {
		this._x = val;
		return this;
	}
	
	setY(val) {
		this._y = val;
		return this;
	}
	
	getX() {
		return this._x;
	}
	
	getY() {
		return this._y;
	}
	
	distance() {		
		if (arguments.length == 1 && (arguments[0] instanceof Point)) {
			return this._distance(arguments[0].getX(), arguments[0].getY());
			
		} else if (arguments.length == 2) {
			return this._distance(arguments[0], arguments[1]);
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

