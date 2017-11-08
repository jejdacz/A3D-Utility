/**
 * Script handles:
 * - init of variables and html page elements
 * - init of image editor
 * - image file opening
 * - 3d scene setup
 * - 3d file opening
 */

$(function(){

   	var imeControls = document.getElementById("imeControls");
   	
   	var canvas2d = document.getElementById("canvas2d");

   	var fileForm = document.getElementById("fileForm");
   	var fileInput = document.getElementById("fileInput");
		
	var reader = new FileReader();
	
	/*** IME CONTROLS INIT ***/
		
	var ime = new ImageEditor(canvas2d);
	
	/* move to factory method later? */
	/*
	var m = new Meter(ime);	
	ime._tools.set("meter", m);	
	var tb = new ToggleButton();
	
	tb.onActivate = () => {ime.selectTool("meter"); $("#meter").addClass("active");};
	tb.onDeactivate = () => {$("#meter").removeClass("active");};
	
	tb.onEnable = () => $("#meter").prop("disabled", false);
	tb.onDisable = () => $("#meter").prop("disabled", true);
	
	ime.addEventListener("ondeactivatecontrols", tb, () => tb.deactivate());
	ime.addEventListener("onenablecontrols", tb, () => tb.enable());
	ime.addEventListener("ondisablecontrols", tb, () => tb.disable());
	
	$("#meter").click(function () {
		tb.click();
	});*/
	
	createToggleButtonControl("id1", ime, "Meter").appendTo("#controlsForm fieldset div.form-group");
	createToggleButtonControl("id2", ime, "Meter").appendTo("#controlsForm fieldset div.form-group");
	
	/*** IME INIT ***/
	
	ime.disableControls();  // ime.init()
		
	// TODO factory helper class for buttons and controls
	// build (configure) tools helpers and controls outside IME
	// editorInitFunction
	
	function createToggleButtonControl(id, ime, tool) {
		switch (tool) {
			case ("Meter"):
				var t = new Meter(ime);				
				break;
		}
		
		ime._tools.set(t, t);
				
		var button = $("<button>", {class: "form-control", type: "button", id: id, text: tool});
				
		let tb = new ToggleButton();
		
		ime._controls.set(tb, tb);
	
		tb.onActivate = () => {
				ime.deactivateControls(t);
				ime.selectTool(t);				
				ime.addEventListener("ondeactivatecontrols", tb, () => tb.deactivate());
				button.addClass("active");
			};
		
		tb.onDeactivate = () => {
				ime.removeEventListener("ondeactivatecontrols", tb, () => tb.deactivate());
				ime.deselectTool();
				button.removeClass("active");				
			};
	
		tb.onEnable = () => button.prop("disabled", false);
		tb.onDisable = () => button.prop("disabled", true);	
		
		ime.addEventListener("onenablecontrols", tb, () => tb.enable());
		ime.addEventListener("ondisablecontrols", tb, () => tb.disable());
	
		button.click(function () {
			tb.click();
		});
		
		return button;
	}
		
				
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
		
});   
