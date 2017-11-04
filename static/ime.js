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
					
					
		class ImageEditor {
			constructor(canvas) {
							
				/* private properties defined in closure of constructor
				var _canvas = canvas;
				this.getCanvas = function() {return _canvas;}
				this.setCanvas = function(c) {_canvas = c;}
				*/
				
				var _this = this;
				var _canvas = canvas;
				var _ctx = canvas.getContext('2d');
				var _originalImage = new Image();
				var _image = new Image();
											
				this.getCanvas = function() {return _canvas;}
				this.getCtx = function() {return _ctx;}
				this.getImage = function() {return _image;}
												
				this.setImageSource = function(src) {_image.src = src;}
												
				_image.onload = function() {
					_canvas.height = _image.height;
					_canvas.width = _image.width;
					_this.draw();
				}
				
			}
			
			/**
			 * Draws objects on canvas.
			 */
			draw() {	  			
	  			this.getCtx().drawImage(this.getImage(),0,0);
			}
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		}
