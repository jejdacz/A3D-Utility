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
   	
   	

   	var fileForm = document.getElementById("fileForm");
   	var fileInput = document.getElementById("fileInput");
		
	var reader = new FileReader();
		
	var ime = new ImageEditor(canvas2d);	
				
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
