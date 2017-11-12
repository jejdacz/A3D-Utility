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
	
	var controlsEventHandler = new EventTarget();
			
	var ime = new ImageEditor(canvas2d);
		
	/*** IME SETUP ***/
	
	var meter = new Meter(ime);
	ime.addTool(meter);
	meter.addEventListener('change', e => ime.onChange(e));
	createToggleButton(ime, 'id1', meter, 'Meter').appendTo("#controlsForm fieldset div.form-group");
		
	var meter2 = new Meter(ime);
	ime.addTool(meter2);
	meter2.addEventListener('change', e => ime.onChange(e));
	createToggleButton(ime, 'id2', meter2, 'Meter').appendTo("#controlsForm fieldset div.form-group");
		
	ime.setImageSource("/static/blank.jpg");
						
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
	
	tb.addEventListener('activatetool', e => ime.onActivateTool(e));
	tb.addEventListener('deactivatetool', e => ime.onDeactivateTool(e));
		
	var dt = () => tb.remoteDeactivate();	
	
	tb.onActivate = () => {				
		tb.dispatchEvent({type:"activatetool","tool":tool});				
		ime.addEventListener('deactivatetool', dt);
		button.addClass("active");
			
	};
	
	tb.onDeactivate = () => {
		ime.removeEventListener('deactivatetool', dt);
		tb.dispatchEvent({type:"deactivatetool","tool":tool});
		button.removeClass("active");			
	};
	
	tb.onRemoteDeactivate = () => {
		ime.removeEventListener('deactivatetool', dt);		
		button.removeClass("active");
	};		
	

	tb.onEnable = () => button.prop("disabled", false);
	tb.onDisable = () => button.prop("disabled", true);	
	
	button.click(function () {
		tb.click();
	});
	
	return button;
}

});   
