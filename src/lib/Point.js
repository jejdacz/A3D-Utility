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
	
	distance() {		
		if (arguments.length == 1 && (arguments[0] instanceof Point)) {
			return this._distance(arguments[0].x, arguments[0].y);
			
		} else if (arguments.length == 2) {
			return this._distance(arguments[0], arguments[1]);
		}
	}
	
	_distance(x, y) {
		return Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2));
	}	
}

export { Point };

