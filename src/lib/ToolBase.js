/**
 * Tool base class.
 *
 * @author Marek Mego
 */
 
import { EventTarget } from './EventTarget.js';

class ToolBase extends EventTarget {
	constructor() {				
		super();
		this._active = false;
		this._drawable = false;				
	}		
	
	get active() {return this._active;}
	get drawable() {return this._drawable;}
	
	activate() {
		if (this._active == true) {
			console.warn('Activating active tool!');
			return;
		}		
		this.onActivate();
		this._active = true;		
	}
	
	deactivate() {
		if (this._active == false) {
			console.warn('Deactivating non-active tool!');
			return;
		}		
		this.onDeactivate();
		this._active = false;		
	}
	
	draw() {}
}

export { ToolBase };

