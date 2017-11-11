/**
 * Script handles:
 * - init of variables and html page elements
 * - init of image editor
 * - image file opening
 * - 3d scene setup
 * - 3d file opening
 */

//TODO design mediator between controls and IME
//TODO change name of IME events onSelectTool, onDeselectTool, onDeactivateTool
//TODO * builder for controls
//TODO * simple factory for components
//TODO * debug log class

//TODO first try then refactor

class Callback {
	constructor(obj, callback) {
		this.run = function(e){callback.call(obj, e);}	
	}
}

class EventTarget {
	constructor() {
		this.listeners = {};
	}
	
	addEventListener(type, callback) {
		if (!(type in this.listeners)) {
			this.listeners[type] = [];
		}
		console.log('add lis ' + type);
		this.listeners[type].push(callback);
	}
	
	removeEventListener(type, callback) {
		if (!(type in this.listeners)) {
			return;
		}
		
		var stack = this.listeners[type];
  		for (var i = 0, l = stack.length; i < l; i++) {
    		if (stack[i] === callback){
      		stack.splice(i, 1);
      		console.log('rem lis ' + type);
      		return;
    		}
  		}
		
	}
	
	dispatchEvent(event) {
		if (!(event.type in this.listeners)) {
			return this;
		}
		var stack = this.listeners[event.type];
		
		for (var i = 0, l = stack.length; i < l; i++) {
			stack[i].call(this, event);
		}
		
		return this;
	}
}


$(function(){

   	var imeControls = document.getElementById("imeControls");
   	
   	var canvas2d = document.getElementById("canvas2d");

   	var fileForm = document.getElementById("fileForm");
   	var fileInput = document.getElementById("fileInput");
		
	var reader = new FileReader();
			
	var ime = new ImageEditor(canvas2d);
		
	/*** IME SETUP ***/
	
	canvas2d.addEventListener('mousemove', e => ime.dispatchEvent({type:"mousemove",event:e}));
		
	var meter = new Meter(ime);
	meter.addEventListener('change', e => ime.onChange(e));
	
	
	//var meter2 = new Meter(ime);
	//meter2.addEventListener('change', e => ime.onChange(e));
	
	
	ime.addTool(meter);
	//ime.addTool(meter2);
	ime.setImageSource("/static/blank.jpg");
	
	
	//??
	createToggleButton(ime, 'id1', meter, 'Meter').appendTo("#controlsForm fieldset div.form-group");
	//createToggleButton(ime, 'id2', meter2, 'Meter').appendTo("#controlsForm fieldset div.form-group");
					
	fileForm.onsubmit = function(e) {e.preventDefault();}
	
	// on file select				
	fileInput.onchange = function(e) {
			
		// read file
		reader.readAsDataURL(fileInput.files[0]);
	}
	
	// on file load
	reader.onload = function(){
  		var dataURL = reader.result;		
  		
  		// validate file type
  		if (fileInput.files[0].type.substring(0, 5) == 'image') {	  			
  			// pass src to editor
  			ime.setImageSource(dataURL);
  		} else {
  			// pass src to editor, displays warning image
  			ime.setImageSource("/static/invalid.jpg");
  		}
  		
  		// reset form when file is loaded
  		fileForm.reset();
	}
		


/*** Factory methods ***/
function createToggleButton(ime, id, tool, name) {
			
	var button = $("<button>", {class: "form-control", type: "button", id: id, text: name});
			
	var tb = new ToggleButton();
	
	ime.addControl(tb);
	
	tb.addEventListener('selecttool', e => ime.onSelectTool(e));
	tb.addEventListener('deselecttool', e => ime.onDeselectTool(e));

	tb.onActivate = () => {				
			tb.dispatchEvent({type:"selecttool","tool":tool});				
			//ime.addEventListener('deselecttool', () => tb.deactivate());
			button.addClass("active");
		};
		
	tb.onDeactivate = () => {
			//ime.removeEventListener('deselecttool', () => tb.deactivate());
			tb.dispatchEvent({type:"deselecttool","tool":tool});
			button.removeClass("active");			
		};

	tb.onEnable = () => button.prop("disabled", false);
	tb.onDisable = () => button.prop("disabled", true);	
	
	//ime.addEventListener("enablecontrols", () => tb.enable());
	//ime.addEventListener("disablecontrols", () => tb.disable());

	button.click(function () {
		tb.click();
	});
	
	return button;
}

});   
