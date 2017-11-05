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
		
	var ime = new ImageEditor(canvas2d);
	
	var f1 = function() {console.log('On');}
	var f2 = function() {console.log('Off');}
	
	var tb = new ToggleButton(f1,f2);
	
	// TODO factory helper class for buttons and controls
	// build tools helpers and controls outside IME
	/*
		var m = new Meter(ime);
		
		VER1:
		var mtb = new ToggleButton(m.enable, m.disable);
		
		$("#button").click(function () {
		var r = mtb.click();
		if (r) add style-class on else off				
		});
		
		********************
		
		VER2:
		var mtb = new ToggleButton(m.enable, m.disable); //configure element inside
		$("#controlsForm fieldset div.form-group").append(mtb.toHTML());
		// user can specify additional CSS ... like bootstrap classes
		// <button class=\"on\" type=\"button\">meter</button>
		
		*****************
				
		ime.addTool('meter', m);
		ime.addControl('meter', mtb);
	*/
		
	$("#test").click(function () {tb.click();});
	
	var b = $().add('<button class=\"form-control\" type=\"button\">meter</button>').click(ime._tools.get('meter').disable);
	
	$("#controlsForm fieldset div.form-group").append(b);	
				
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
