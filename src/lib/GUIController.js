/**
 * GUI controller.
 *
 * @author Marek Mego
 */
 
import { EventTarget } from "./EventTarget.js";
 
class GUIController extends EventTarget {	
	
	constructor() {
		super();
		this.controls = {};
	}
	
	static create() {
		return new GUIController();
	}
	
	enableControls(){}
	disableControls(){}
}

export { GUIController };	
