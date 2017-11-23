/**
 * Tool base class.
 *
 * @author Marek Mego
 */
 
import { EventTarget } from "./EventTarget.js";

class ToolBase extends EventTarget {
	constructor() {				
		super();
		this._active = false;
		this._drawable = false;				
	}		
	
	isActive() {return this._active;}
	isDrawable() {return this._drawable;}	
	drawOn() {this._drawable = true;}
	drawOff() {this._drawable = false;}
	
	activate() {
		if (this.isActive()) {
			console.warn("Activating active tool!");
			return;
		}		
		this.onActivate();
		this._active = true;		
	}
	
	deactivate() {
		if (!this.isActive()) {
			console.warn("Deactivating non-active tool!");
			return;
		}		
		this.onDeactivate();
		this._active = false;		
	}
	
	draw() {
		if (this.isDrawable()) {
			this.onDraw();
		}
	}
}

export { ToolBase };

