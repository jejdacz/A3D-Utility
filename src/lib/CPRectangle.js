/**
 * Rectangle with control points.
 *
 * @author Marek Mego
 * 
 * cp0 ------ cp1
 *     |    |
 * cp2 ------ cp3
 *
 */

import { Point } from "./Point.js";

class ControlPoint extends Point{
	constructor(){
		super();		
	}
	
	onChange() {
		// callback set width left align
	}
	
	draw() {
	
	}
}


class CPRectangle {
	constructor() {
		this._position = new Point(0,0);
		this._cpArray = [new Point(0,0), new Point(100,0), new Point(0,100), new Point(100,100)];
		this._cpSize = 10;		
		this._width = 100;
		this._height = 100;
		this._boundary = new Point(0,0);				
	}
		
	setWidth(val) {
		this._cpArray[1].setX(this._position.getX() + val);
		this._cpArray[3].setX(this._position.getX() + val);
		this._width = val;
	}
	
	setHeight(val) {
		this._cpArray[2].setY(this._position.getY() + val);
		this._cpArray[3].setY(this._position.getY() + val);
		this._height = val;
	}
	
	setPosition(x, y) {
		if (!this._validatePos(x, y)) return;
		
		var moveX = x - this._position.getX();
		var moveY = y - this._position.getY();
		
		// move rectangle
		this._cpArray.forEach(function(element) {
			element.setX(element.getX() + moveX);
			element.setY(element.getY() + moveY);
		});
		
		console.log('pos x: ' + x);
		console.log('pos y: ' + y);
		
		this._position.setX(x);
		this._position.setY(y);
	}
	
	_validatePos(x, y) {
		if (x - this._position.getX())
	}
	
	setBoundary(x, y){
		this._boundary.setX(x);
		this._boundary.setY(y);
		this.justify();
	}
	
	getWidth() {
		return this._width;
	}
	
	getHeight() {
		return this._height;
	}
	
	getPosition() {
		return this._position;
	}
	
	getCpArray() {
		return this._cpArray;
	}
	
	getCpSize() {
		return this._cpSize;
	}
	
	getCenter() {
		return new Point(
			this._position.getX() + this._width / 2,
			this._position.getY() + this._height / 2,
			);
	}
	
	inCpArea(x, y) {
		var result = false;
		console.log('x: ' + x + ' y: ' + y);
		this._cpArray.forEach((element, i) => {
			if ((Math.abs(element.getX() - x) < this._cpSize / 2)
			&& (Math.abs(element.getY() - y) < this._cpSize / 2)) {
				console.log('cp hit');
				result = {index:i};
			}			
		});
		
		return result;
	}
	
	inRectArea(x, y) {
		if ((Math.abs(this.getCenter().getX() - x) < (this._width - this._cpSize) / 2)
		&& (Math.abs(this.getCenter().getY() - y) < (this._height - this._cpSize) / 2)) {
			return true;
		}
		
		return false;
	}
	
	moveCp(i, x, y) {
		console.log('movecp i:' + i + ' x:' + x + ' y: ' + y);
		switch (i) {
			case 0:				
				if (x < this._cpArray[1].getX()) {
					this.setWidth(this._cpArray[1].getX() - x);
					//this._cpArray[i].setX(x);
					this.setPosition(x, this._position.getY());					
				}
				if (y < this._cpArray[2].getY()) {
					this.setHeight(this._cpArray[2].getY() - y);
					//this._cpArray[i].setY(y);
					this.setPosition(this._position.getX(), y);
				}
				break;
			case 1:
				if (x > this._cpArray[0].getX()) {
					this.setWidth(x - this._cpArray[0].getX());
					//this._cpArray[i].setX(x);
				}
				if (y < this._cpArray[3].getY()) {
					this.setHeight(this._cpArray[3].getY() - y);
					//this._cpArray[i].setY(y);
					this.setPosition(this._position.getX(), y);
				}
				break;
			case 2:
				if (x < this._cpArray[3].getX()) {
					this.setWidth(this._cpArray[3].getX() - x);
					//this._cpArray[i].setX(x);
					this.setPosition(x, this._position.getY());
				}
				if (y > this._cpArray[0].getY()) {					
					this.setHeight(y - this._cpArray[0].getY());
					//this._cpArray[i].setY(y);					
				}
				break;
			case 3:
				if (x > this._cpArray[2].getX()) {
					this.setWidth(x - this._cpArray[2].getX());
					//this._cpArray[i].setX(x);
				}
				if (y > this._cpArray[0].getY()) {
					this.setHeight(y - this._cpArray[0].getY());
					//this._cpArray[i].setY(y);
				}
				break;
		}
	}
	
	move(x, y) {
		this.setPosition(this._position.getX() + x, this._position.getY() + y);
	}
	
	centerToBoundary() {
		this.setPosition(
			(this._boundary.getX() - this.getWidth()) / 2,
			(this._boundary.getY() - this.getHeight()) / 2,
		);
	}
	
	justify() {
		this.setWidth(this._boundary.getX() / 2);
		this.setHeight(this._boundary.getY() / 2);
		this.centerToBoundary();
	}
	/*
	draw(ctx) {
		ctx.setLineDash([4, 2]);		
		ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
			
			// cprect.draw()
		ctx.strokeRect(
			this.getPosition().getX(),
			this.getPosition().getY(),
			this.getWidth(),
			this.getHeight(),
		);
	}	*/
}

export { CPRectangle };

