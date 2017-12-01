# A3D Utility
CS50 final project
 
This is a utility suitable for artists to make reference images from 3d models.
1. Adjust the camera on the 3d scene.
2. Make a snapshot of the 3d scene.
3. Crop and resize the snapshot.
4. Draw the grid over the image.
5. Save the image by right-mouse-button click on the image editor screen.

##### Copyrights of the parts used in this utility:

##### Base for 3D viewer
WebGL 3D Model Viewer Using three.js (https://github.com/Lorti/webgl-3d-model-viewer-using-three.js)
Copyright (c) 2016 Manuel Wieser
Licensed under MIT (https://github.com/Lorti/webgl-3d-model-viewer-using-three.js/blob/master/LICENSE) 

##### Base for 3D viewer
JavaScript 3D library (https://github.com/mrdoob/three.js)
Copyright © 2010-2016 three.js authors
Licensed under MIT (https://github.com/mrdoob/three.js/blob/master/LICENSE)


##### Base for main page design
Start Bootstrap - Simple Sidebar (https://startbootstrap.com/template-overviews/simple-sidebar)
Copyright 2013-2017 Start Bootstrap
Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap-simple-sidebar/blob/master/LICENSE)
 
 

## Usage:
Run the utility on a local	http server, e.g. Python server. 

	//for python 3.x
 	python -m http.server

### 3dviewer:
* Supported file format of 3d object is .obj.
* Use mouse to control rotation/zoom/pan. Screen is adjusted when the window is resized.
		
Make a snapshot of the scene by the "Snapshot" button.
The image will be displayed in the Image editor screen right below the 3dviewer screen. Scroll down to see it.

### Image editor:
* Use the snapshot or open an image file from local filesystem.
		
#### Cursor tool:
* Does nothing. Suitable when saving the image.

#### Meter tool:
* Measures a distance in pixels on the image editor screen.

#### Crop tool:
* Crops the image to the selection.

#### Grid tool:
* Displays the grid over the image editor screen.

#### Restore:
* Restores the image to the state when it was loaded.

#### Zoom + / - :
* Resizes the image.
