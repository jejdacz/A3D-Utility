

		// enable listen for canvas click event
			// on click		
				// on drag draw rectangle
				// on release
					// create crop object with regions (selection only within canvas)
					// disable crop rectangle
					// display info panel with button ok and cancel			

/**
 * Crop image tool.
 *
 * @author Marek Mego
 */
 
import { ToolBase } from "./ToolBase.js";
import { CPRectangle } from "./CPRectangle.js";
import { Point } from "./Point.js";

class Crop extends ToolBase {
	constructor(ime) {
		super();
		this._ime = ime;		
		this._activeCp;
		this._cpRect = new CPRectangle();
		this._cursorPrevPos = new Point(0,0);
		this._onMouseMoveAction;
		
		// mousedown listener add/remove methods
		var md = (e) => this.onMouseDown(e);
		this._disableMouseDown = function() {ime.canvas.removeEventListener("mousedown", md)};
		this._enableMouseDown = function() {ime.canvas.addEventListener("mousedown", md)};
		
		// mouseup listener add/remove methods
		var mu = (e) => this.onMouseUp(e);
		this._disableMouseUp = function() {ime.canvas.removeEventListener("mouseup", mu)};
		this._enableMouseUp = function() {ime.canvas.addEventListener("mouseup", mu)};
		
		// mousemove listener add/remove methods
		var mm = (e) => this.onMouseMove(e);
		this._disableMouseMove = function() {ime.canvas.removeEventListener("mousemove", mm)};
		this._enableMouseMove = function() {ime.canvas.addEventListener("mousemove", mm)};
	}
			
	static create(ime) {
		return new Crop(ime);
	}
		
	onActivate() {		
		console.log('crop activated');
		this._cpRect.setBoundary(this._ime.canvas.width, this._ime.canvas.height);		
		this._enableMouseDown();
		this._enableMouseUp();
		this._drawable = true;
		this.onChange();		
	}
	
	onDeactivate() {
		this._disableMouseDown();
		this._disableMouseUp();
		this._disableMouseMove();
		this._drawable = false;
		//if (typeof(this._activeCp) != "undefined") this._activeCp.setActive(false);
		this.onChange();	
	}
	
	_cpMove(e) {
		this._activeCp.move(e.offsetX, e.offsetY);
	}
	
	_rectMove(e) {
		var x = e.offsetX - this._cursorPrevPos.getX();
		var y = e.offsetY - this._cursorPrevPos.getY();
		this._cpRect.move(x, y);
		this._cursorPrevPos.setX(e.offsetX);
		this._cursorPrevPos.setY(e.offsetY);
	}
	
	onMouseDown(e) {
		console.log('crop mouse down');
		var cp = this._cpRect.inCpArea(e.offsetX, e.offsetY);
		console.log(cp.toString());	
		if (cp) {
			console.log('crop cp hit');			
			//cp.setActive(true);
			this._activeCp = cp;			
			this._onMouseMoveAction = (e) => this._cpMove(e);
			this._enableMouseMove();			
		} else {
			if (this._cpRect.inRectArea(e.offsetX, e.offsetY)) {
				this._cursorPrevPos.setX(e.offsetX).setY(e.offsetY);
				this._onMouseMoveAction = (e) => this._rectMove(e);
				this._enableMouseMove();
			}
		}	
		this.onChange();	 
	}
	
	onMouseUp(e) {
		console.log('crop mouseup');
		//this._activeCp.setActive(false);	
		this._disableMouseMove();
		this.onChange();						 
	}
		
	onMouseMove(e) {
		this._onMouseMoveAction(e);
		this.onChange();			 
	}
			
	onChange() {
		this.dispatchEvent({type:"change"});
	}
	
	crop() {
		this._ime.imageDC.sx += this._cpRect.getPosition().getX();
		this._ime.imageDC.sy += this._cpRect.getPosition().getY();
		this._ime.imageDC.sw = this._cpRect.getWidth();
		this._ime.imageDC.sh = this._cpRect.getHeight();
		this._ime.imageDC.dw = this._cpRect.getWidth();
		this._ime.imageDC.dh = this._cpRect.getHeight();
		this._ime.canvas.width = this._cpRect.getWidth();
		this._ime.canvas.height = this._cpRect.getHeight();
		this._cpRect.setBoundary(this._ime.canvas.width, this._ime.canvas.height);
		this.onChange();
	}										
	
	draw() {		
		if (this.drawable) {
			console.log('draw crop');		
		
			this._cpRect.draw(this._ime.ctx);
									
		}		
	}	
}

export { Crop };

