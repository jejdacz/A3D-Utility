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
