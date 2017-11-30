/**
 * GUI controller.
 *
 * @author Marek Mego
 */
 
import { EventTarget } from "./EventTarget.js";
 
class GUIController extends EventTarget {	
	
	constructor() {
	
		super();
		
		// controls container
		this.controls = {};
		
	}
	
	/**
	 * Factory method.
	 */
	static create() {
	
		return new GUIController();
		
	}
	
	/* Control methods for later redefinition. */
	
	enableControls(){}
	disableControls(){}
	
}

export { GUIController };

