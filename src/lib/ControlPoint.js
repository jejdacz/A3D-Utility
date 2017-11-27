/**
 * Control point helper class.
 *
 * @author Marek Mego
 */
 
import { Point } from "./Point.js";
 
class ControlPoint extends Point{

	constructor(x, y){
	
		super(x, y);
				
		this.moveFn;		
		this._active = false;
				
	}	
	
	setActive(val) {
	
		this._active = val;
		
	}
	
	isActive() {
	
		return this._active;
		
	}
	
	move(x, y) {
	
		if (isNaN(x) || isNaN(y)) {
							
			throw new Error("invalid argument, use a number");
									
		}
	
		this.moveFn(x, y);
	}
}

export {ControlPoint};

