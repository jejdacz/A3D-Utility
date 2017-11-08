//import {Test} from 'test.js';
/*** GRID  ***/
		// on grid label click
			// roll out grid settings panel
			// on "show" enabled draw grid to canvas due to settings
			// save settings
	
	
			// settings:
				// rows
				// cols
				// thickness
				// show
		
		/**
		 * Simple grid shape rendered to HTML5 canvas.
		 */		
		class ImageGrid {
			constructor(rows, cols) {
				this.rows = rows;
				this.cols = cols;
				this.lineWidth = 2.0;
				this.enabled = true;
				this.style = 'rgba(0, 0, 0, 0.75)';
			}
	
			setRows(val) {
				this.rows = val;
				return this;
			}
	
			setCols(val) {
				this.cols = val;
				return this;
			}
	
			setStyle(val) {
				this.style = val;
				return this;
			}
	
			enable() {
				this.enabled = true;
				return this;		
			}
	
			disable() {
				this.enabled = false;
				return this;		
			}
			
			/**
			 * Renders grid to canvas.
			 */
			render(canvas) {					
				// if enabled render
				if (this.enabled) {
						
					// read canvas size and compute grid offset
					var offsetX = Math.floor(c.width / this.cols);
					var offsetY = Math.floor(c.height / this.rows);
			
					// get canvas context2D
					var ctx = canvas.getContext("2d");
			
					// set cols
					for (var i = 1; i < this.cols; i++) {				
						ctx.moveTo(offsetX * i, 0);
						ctx.lineTo(offsetX *i, canvas.height);
					}
						
					// set rows
					for (var i = 1; i < this.rows; i++) {				
						ctx.moveTo(0, offsetY * i);
						ctx.lineTo(canvas.width, offsetY * i);										
					}
			
					// draw to canvas
					ctx.lineWidth = this.lineWidth;
					ctx.strokeStyle = this.style;			
					ctx.stroke();									
				}		
			}
		}
		

		var g = new ImageGrid(4, 4);




		/*** CROP ***/

		// enable listen for canvas click event
			// on click		
				// on drag draw rectangle
				// on release
					// create crop object with regions (selection only within canvas)
					// disable crop rectangle
					// display info panel with button ok and cancel
		class ImageCrop {
			constructor(canvas) {
				this.canvas = canvas;				
				this.enabled = false;
				this.x1 = 0;
				this.y1 = 0;
				this.x2 = 0;
				this.y2 = 0;
			}
			
			enable() {				
				this.canvas.addEventListener('mousedown', this.onMouseDown);
				this.enable = true;
			}
			
			disable() {
				this.canvas.removeEventListener('mousedown', this.onMouseDown);				
				this.canvas.removeEventListener('mouseup', this.onMouseUp);
				this.canvas.removeEventListener('mousemove', this.onMouseMove);
				this.enable = false;
			}
			
			onMouseDown(e) {
				this.canvas.addEventListener('mousemove', this.onMouseMove);
				this.canvas.addEventListener('mouseup', this.onMouseUp);
				this.x1 = e.offsetX;
				this.x2 = e.offsetX;
				this.y1 = e.offsetY;
				this.y2 = e.offsetY;
			}
			
			onMouseMove(e) {				
				this.x2 = e.offsetX;
				this.y2 = e.offsetY;
				console.log("x1:"+this.x1+"y1:"+this.y1+"x2:"+this.x2+"y2:"+this.y2);
			}
			
			onMouseUp(e) {				
				this.canvas.removeEventListener('mousemove', this.onMouseMove);
				this.x2 = e.offsetX;
				this.y2 = e.offsetY;
			}
			
			render() {
				if (this.enabled) {
					// get canvas context2D
					var ctx = this.canvas.getContext("2d");
					
					// set rectangle
					ctx.setLineDash([4, 2]);
					
					// draw rectangle
					ctx.strokeRect(10, 10, 100, 100);					
				}
				
			}
			
		}
		/*
		this.onMouseMove = function(e) {
					console.log("X: " + e.offsetX);
					console.log("Y: " + e.offsetY);
				};				
				
				this.canvas = canvas;
				this.image = image;				
				var crop = new ImageCrop(canvas);
				// var grid ......
				crop.enable();
				
				// add event listener to canvas
				this.canvas.addEventListener('mousedown', this.onMouseDown);
				this.canvas.addEventListener('mouseup', this.onMouseUp);
				
				
				
				this.canvas.addEventListener('mousemove', function(e) {
					console.log("X: " + e.offsetX);
					console.log("Y: " + e.offsetY);
				});*/
/**
 * Point helper class.
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

class ToolBase {
	constructor() {				
		this._active = false;
		this._drawable = false;		
	}		
	
	get active() {return this._active;}
	get drawable() {return this._drawable;}
			
	// *** order of code is critical
	activate() {
		if (this._active == true) {
			console.warn('Activating active tool!');
		}		
		this.onActivate();
		this._active = true;		
	}
	
	deactivate() {
		if (this._active == false) {
			console.warn('Deactivating non-active tool!');
		}		
		this.onDeactivate();
		this._active = false;		
	}
	
	draw() {}
}

/**
 * Empty tool.
 */
class NullTool extends ToolBase {
	constructor() {
		super();
	}
	
	onActivate(){}
	onDeactivate(){}
}		
				
/**
 * Distance meter tool.
 */				
class Meter extends ToolBase {
	constructor(ime) {
		super();
		this._ime = ime;
		this._startPos = new Point(0, 0);
		this._currentPos = new Point(0, 0);
		this._onMouseDownAction = (x, y) => this._start(x, y);		
	}
	
	_start(x, y) {					
		console.log('mtr start');		
		this._startPos.x = x;
		this._startPos.y = y;
		this._currentPos.x = x;
		this._currentPos.y = y;		
		this._drawable = true;
		this._ime.addEventListener('mousemove', this, e => this.onMouseMove(e));
		this._onMouseDownAction = (x, y) => this._finish(x, y);
		this.onChange();
	}
	
	_finish(x, y) {
		console.log('mtr finish');		
		this._drawable = false;				
		this._onMouseDownAction = (x, y) => this._start(x, y);	
		this._ime.removeEventListener('mousemove', this, e => this.onMouseMove(e));
		this.onChange();
	}
	
	onActivate() {
		console.log('meter activate');				
		this._ime.addEventListener('mousedown', this, e => this.onMouseDown(e));
		this.onChange();		
	}
	
	onDeactivate() {
		console.log('meter deactivate');
		this._drawable = false;			
		this._ime.removeEventListener('mousedown', this, e => this.onMouseDown(e));
		this._ime.removeEventListener('mousemove', this, e => this.onMouseMove(e));
		this._onMouseDownAction = (x, y) => this._start(x, y);
		this.onChange();
	}
	
	onMouseDown(e) {
		this._onMouseDownAction(e.offsetX, e.offsetY);
		this.onChange();
	}
	
	onMouseMove(e) {			
		this._currentPos.x = e.offsetX;
		this._currentPos.y = e.offsetY;
		console.log(this._startPos.distance(this._currentPos));
		this.onChange();
	}
	
	onChange() {
		console.log('mtr onchange');		
		this._ime.onChange(this);
	}
	
	draw() {
		if (this.drawable) {		
			this._ime.ctx.beginPath();
			this._ime.ctx.moveTo(this._startPos.x, this._startPos.y);
			this._ime.ctx.lineTo(this._currentPos.x, this._currentPos.y);
			this._ime.ctx.closePath();
			this._ime.ctx.shadowOffsetX = 1;
			this._ime.ctx.shadowOffsetY = 1;
			this._ime.ctx.shadowBlur = 1;
			this._ime.ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
			this._ime.ctx.lineWidth = 3;
			this._ime.ctx.strokeStyle = 'rgba(255, 255, 0, 0.6)';					
			this._ime.ctx.stroke();
			this._ime.ctx.font = "16px Arial";
			this._ime.ctx.fillStyle = 'rgba(255, 255, 0, 1.0)';
			this._ime.ctx.fillText(Math.round(this._startPos.distance(this._currentPos)) + ' px', this._currentPos.x, this._currentPos.y);
			console.log('meter drawing');
		}
	}
	
}
/**
 * Toggle button.
 */
class ToggleButton {
	constructor(){		
		this._activated = false;
		this._enabled = true;
		this._onEnableCallback = function(){};
		this._onDisableCallback = function(){};
		this._onActivateCallback = function(){};
		this._onDeactivateCallback = function(){};
	}
	
	set onEnable(c) {this._onEnableCallback = c;}	
	set onDisable(c) {this._onDisableCallback = c;}	
	set onActivate(c) {this._onActivateCallback = c;}	
	set onDeactivate(c) {this._onDeactivateCallback = c;}
	
	click() {
		console.log('tb clicked');
		if (this._enabled) {
			if (this._activated) {
				this.deactivate();
			} else {
				this.activate();
			}
		}
	}
	
	enable() {
		console.log('tb enabled');
		this._enabled = true;
		this._onEnableCallback();
	}
	
	disable() {
		console.log('tb disabled');
		this._enabled = false;
		this._onDisableCallback();
	}
	
	activate() {
		console.log('tb activated');
		this._activated = true;
		this._onActivateCallback();		
	}
	
	deactivate() {
		console.log('tb deactivated');
		this._activated = false;
		this._onDeactivateCallback();
	}	
}
		
/**
 * Image Editor.
 */			
			
class ImageEditor {
	constructor(canvas) {				
		this._canvas = canvas;
		this._ctx = canvas.getContext('2d');
		this._originalImage = new Image(); // backup for undo
		this._image = new Image(); // image to edit
		this._helpers = new Map(); // multiple helpers can be active at once
		this._tools = new Map(); // only one tool can be active at the moment
		this._activeTool = null;
		this._eventListeners = new Map();
		this._controls = new Map();
										
		this._image.onload = () => this.onImageLoad();
						
		this._canvas.addEventListener('mousedown', e => this._notifyListeners('mousedown', e));				
		this._canvas.addEventListener('mouseup', e => this._notifyListeners('mouseup', e));
		this._canvas.addEventListener('mousemove', e => this._notifyListeners('mousemove', e));
	}
	
	get canvas() { return this._canvas;}
	get ctx() { return this._ctx;}	
	
	
	setImageSource(src) {
		this._image.src = src;		
	}
	
	addControl(ctrl) {
		this._controls.set(ctrl, ctrl);
	}
	
	addTool(tool) {
		this._tools.set(tool, tool);
	}
		
	selectTool(tool) {
		console.log('selecting tool ' + tool);
		
		// deactivate active controls and tools
		this.deactivateControls(this);
		
		// ensure tool exists, necessary when tool is selected by string
		if (this._tools.get(tool) == false) {
			throw 'Tool does not exist!';
		}
				
		// disable currently active tool if any		
		if (this._activeTool != null) this.deselectTool();
				
		// activate selected tool
		this._activeTool = this._tools.get(tool);
		this._activeTool.activate();
		
	}
	
	deselectTool() {
		console.log('deselecting active tool');
		if (this._activeTool == null) {
			console.warn('No tool to deselect!');
		} else {			
			this._activeTool.deactivate();
			this._activeTool = null;
		}
	}
	
	deactivateTool() {
		console.log('deactivating active tool');
		if (this.activeTool != null) {
			this._activeTool.deactivate();  /// how to notify controls??
		} else {
			console.warn('No tool to deactivate!');
		}
	}
	
	/**
	 * Event listeners handling.
	 */	
	addEventListener(name, obj, func) {
		if (this._eventListeners.get(name)) {
			console.log('adding ' + name +' listener');
			this._eventListeners.get(name).set(obj, func);
		} else {
			console.log('creating ' + name +' listener group');
			console.log('adding ' + name +' listener');
			this._eventListeners.set(name, new Map());
			this._eventListeners.get(name).set(obj, func);
		}
	}
		
	removeEventListener(name, obj) {				
		if (this._eventListeners.get(name)) {
			console.log('removing ' + name +' listener');
			this._eventListeners.get(name).delete(obj);
		}
	}	
				
	_notifyListeners(name, e) {				
		if (this._eventListeners.get(name)) {
			console.log('notifying ' + name +' listeners');
			this._eventListeners.get(name).forEach(func => func(e));
		} else {
			console.log('no listeners');					
		}
	}	
	
	/**
	 * Events handling.
	 */	 	
	onImageLoad() {
		this._canvas.height = this._image.height;
		this._canvas.width = this._image.width;		
		this.deactivateControls(this);			
		this.onChange(this);
	}
	
	onChange(e) {
		console.log('ime onchange');
		this.draw();
	}
	
	/**
	 * Draws objects on canvas.
	 */
	draw() {	  				  			
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		this._ctx.drawImage(this._image,0,0);
		this._helpers.forEach(helper => helper.draw());
		if (this._activeTool != null) this._activeTool.draw();
	}
	
	/**
	 * Controls events.
	 */	 
	_triggerEvent(name, e) {
		if (this._eventListeners.get(name)) {		
			this._notifyListeners(name, e);
		}
	} 
	 
	enableControls(e) {
		this._triggerEvent('onenablecontrols', e);		
	}
	
	disableControls(e) {
		this._triggerEvent('ondisablecontrols', e);
	}
	
	deactivateControls(e) {		
		this._triggerEvent('ondeactivatecontrols', e);
	}	
	
	
	
	
	
	
			
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
