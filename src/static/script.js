/**
 * Script handles:
 * - init of variables and html page elements
 * - init of image editor
 * - image file opening
 * - 3d scene setup
 * - 3d file opening
 */
 
//TODO debug log class

$(function(){

   	var imeControls = document.getElementById("imeControls");
   	
   	var canvas2d = document.getElementById("canvas2d");

   	var fileForm = document.getElementById("fileForm");
   	var fileInput = document.getElementById("fileInput");
		
	var reader = new FileReader();
		
	var ime = new ImageEditor(canvas2d);
	
	/*** IME SETUP ***/
		
	var meter = new Meter(ime);
	var meter2 = new Meter(ime);		
	ime.addTool(meter);
	ime.addTool(meter2);
	ime.setImageSource("/static/blank.jpg");
	//??
	createToggleButton(ime, 'id1', meter, 'Meter').appendTo("#controlsForm fieldset div.form-group");
	createToggleButton(ime, 'id2', meter2, 'Meter').appendTo("#controlsForm fieldset div.form-group");
					
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

/*** Factory methods ***/
function createToggleButton(ime, id, tool, name) {
			
	var button = $("<button>", {class: "form-control", type: "button", id: id, text: name});
			
	var tb = new ToggleButton();
	
	ime.addControl(tb);

	tb.onActivate = () => {				
			ime.selectTool(tool);				
			ime.addEventListener("ondeactivatecontrols", tb, () => tb.deactivate());
			button.addClass("active");
		};
		
	tb.onDeactivate = () => {
			ime.removeEventListener("ondeactivatecontrols", tb);
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
