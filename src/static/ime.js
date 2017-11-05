//import {Point} from 'resource://gre/modules/Geometry.jsm';
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
				
		class Meter {
			constructor(ime) {								
				
				var _ime = ime;
				var _startPoint = new Array(2);
				var _currentPoint = new Array(2);
				var _distance;
				var _enabled = false;
				var _drawable = false;
				var _action = (x, y) => this.start(x, y);
								
				this.reset = function() {
					_startPoint[0] = 0;
					_startPoint[1] = 0;
					_currentPoint[0] = 0;
					_currentPoint[1] = 0;					
					_drawable = false;
					_action = (x, y) => this.start(x, y);
				}
				
				this.getDistance = function(x, y) {
					return Math.round(Math.sqrt(Math.pow(x - _startPoint[0], 2) + Math.pow(y - _startPoint[1], 2)));
				}
				
				this.setStartPoint = function(x, y) {
					_startPoint[0] = x;
					_startPoint[1] = y;
					this.onChange();
				}
				
				this.setCurrentPoint = function(x, y) {
					_currentPoint[0] = x;
					_currentPoint[1] = y;
					this.onChange();				
				}
				
				this.getStartPoint = function() {return _startPoint;}
				this.getCurrentPoint = function() {return _currentPoint;}			
				
				this.enable = function() {
					_enabled = true;
					_ime.addEventListener('mousedown', this, e => this.onMouseDown(e));
				}
				
				this.disable = function() {
					_enabled = false;
					_ime.removeEventListener('mousedown', this, e => this.onMouseDown(e));
					_ime.removeEventListener('mousemove', this, e => this.onMouseMove(e));
				}
				
				this.isEnabled = function() {return	_enabled;}
				this.isDrawable = function() {return _drawable;}
				
				this.onChange = function() {
					console.log('mtr onchange');
					_ime.onChange(this);
				}
				
				this.start = function(x, y) {					
					this.setStartPoint(x, y);
					this.setCurrentPoint(x, y);
					_drawable = true;
					_ime.addEventListener('mousemove', this, e => this.onMouseMove(e));
					_action = (x, y) => this.finish(x, y);					
				}
				
				this.finish = function(x, y) {
					_drawable = false;
					_ime.removeEventListener('mousemove', this, e => this.onMouseMove(e));
					this.onChange();
					_action = (x, y) => this.start(x, y);
				}
				
				this.getAction = function() {return _action;}
				
			}
			
			onMouseDown(e) {
				this.getAction()(e.offsetX, e.offsetY);
			}
			
			onMouseMove(e) {				
				console.log(this.getDistance(e.offsetX, e.offsetY));
				this.setCurrentPoint(e.offsetX, e.offsetY);				
			}
			
			draw(ctx) {
				if (this.isDrawable()) {
					var startPoint = this.getStartPoint();
					var currentPoint = this.getCurrentPoint();
					ctx.beginPath();					
					ctx.moveTo(startPoint[0], startPoint[1]);
					ctx.lineTo(currentPoint[0], currentPoint[1]);
					ctx.closePath();
					ctx.shadowOffsetX = 1;
  					ctx.shadowOffsetY = 1;
  					ctx.shadowBlur = 1;
  					ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
					ctx.lineWidth = 3;
					ctx.strokeStyle = 'rgba(255, 255, 0, 0.6)';					
					ctx.stroke();
					ctx.font = "16px Arial";
					ctx.fillStyle = 'rgba(255, 255, 0, 1.0)';
					ctx.fillText(this.getDistance(currentPoint[0], currentPoint[1]) + ' px', currentPoint[0], currentPoint[1]);
				}
			}
			
		}
		/* test */			
					
		class ImageEditor {
			constructor(canvas) {
				var _this = this;				
				var _canvas = canvas;
				this.canvas = canvas;
				var _ctx = canvas.getContext('2d');
				var _originalImage = new Image();
				var _image = new Image();
				var _helpers = new Map();
				var _controls = new Map();
				var _eventListeners = new Map();
															
				this.getCanvas = function() {return _canvas;}
				this.getCtx = function() {return _ctx;}
				this.getImage = function() {return _image;}
				this.getEventListeners = function(e) {return _eventListeners.get(e);}
				this.getHelpers = function() {return _helpers;}
				
				this.addEventListener = function(name, obj, func) {
					if (this.getEventListeners(name)) {
						this.getEventListeners(name).set(obj, func);
					}
				}
				
				this.removeEventListener = function(name, obj) {					
					if (this.getEventListeners(name)) {
						console.log(this.getEventListeners(name).delete(obj));
					}
				}								
				
				this.setImageSource = function(src) {_image.src = src;}
												
				_image.onload = function() {
					_canvas.height = _image.height;
					_canvas.width = _image.width;
					_this.onChange(this);
				}
								
				_canvas.addEventListener('mousedown', e => this.notifyListeners('mousedown', e));				
				_canvas.addEventListener('mouseup', e => this.notifyListeners('mouseup', e));
				_canvas.addEventListener('mousemove', e => this.notifyListeners('mousemove', e));
				
				_eventListeners.set('mousedown', new Map());
				_eventListeners.set('mouseup', new Map());
				_eventListeners.set('mousemove', new Map());
				
				var m = new Meter(this);
				m.enable();				
				
				this.drm = function() {m.draw(_ctx);}
				
				_helpers.set('meter', m);
								
			}
			
			/**
			 * Draws objects on canvas.
			 */
			draw() {
	  			var ctx = this.canvas.getContext('2d');	  			
	  			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	  			ctx.drawImage(this.getImage(),0,0);
	  			this.getHelpers().forEach(helper => helper.draw(ctx));
			}
			
			
			/**
			 * Returns HTML code for controls.
			 */
			controlsHTML() {
			
			}
			
			/**
			 * Notify listeners about event.
			 */			
			notifyListeners(name, e) {
				var listeners = this.getEventListeners(name);
				if (listeners) {
					listeners.forEach(func => func(e));
				} else {
					console.log('no listeners');					
				}
			}
			
			onChange(o) {
				console.log('ime onchange');
				this.draw();
			}
			
			clear() {
				var c = this.getCanvas();
	  			var ctx = this.getCtx();
	  			ctx.clearRect(0, 0, c.width, c.height);
			}
			
					
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		}
