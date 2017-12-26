var pars = [];
var button1;
var button2;
var membrane;
var channels = [];
var whiteBox;
var cellSpace;
var blueLeakageIcon;
var greenLeakageIcon;


function setup() {

	createCanvas (800, 600);
	button1 = new Pipet (50, 100, 50, 50, 'blue');
	button2 = new Pipet (50, 200, 50, 50, 'green');
	button3 = new Pipet (50, 300, 50, 50, 'blue');
	button4 = new Pipet (50, 400, 50, 50, 'green');
	cellSpace = new CellSpace (150, 50, 500, 400);
	membrane = new Membrane (cellSpace.x, cellSpace.y + cellSpace.h/2 - cellSpace.h/30, cellSpace.w, cellSpace.h/15);
	whiteBox = new WhiteBox (cellSpace.x - cellSpace.w/25, cellSpace.y + cellSpace.h + cellSpace.h/20, cellSpace.w + cellSpace.w/12.5, cellSpace.h/4, 'white');
	blueLeakageIcon = new GateIcon (whiteBox.pos.x + whiteBox.w/15, whiteBox.pos.y + whiteBox.h/8, whiteBox.w/20, membrane.h, 'blue');
	greenLeakageIcon = new GateIcon (blueLeakageIcon.pos.x + 3 * blueLeakageIcon.w, blueLeakageIcon.pos.y, blueLeakageIcon.w, blueLeakageIcon.h, 'green');
}

function draw() {

	background (0);
	cellSpace.show();
	button1.show();
	button2.show();
	button3.show();
	button4.show();
	membrane.show();
	whiteBox.show();
	blueLeakageIcon.show();
	greenLeakageIcon.show();

	for (var i = 0; i < channels.length; i++) {
		channels[i].show();
		channels[i].moveParticle();
	}

	for (var i = 0; i < pars.length; i++ ) {
		pars[i].show();
		pars[i].move();
	}

}

function CellSpace (x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.show = function () {
		fill (199, 216, 232);
		rect (this.x, this.y, this.w, this.h);
	}

}

function mousePressed () {

	for (var i = 0; i < channels.length; i++) {
		if (channels[i].mouseOnChannel()) {
			channels[i].selected = true;
		}
	}

}

/*
function mouseClicked () {

	if (newChannelButton.pressed()) {
		append (channels, new Channel (300, 550, 15, membrane.h, 'blue'));
	}

}
*/

function mouseReleased () {

	button1.releaseParticle();
	button2.releaseParticle();
	button3.releaseParticle();
	button4.releaseParticle();

	for (var i = 0; i < channels.length; i++) {
		if (channels[i].selected) {
			channels[i].selected = false;
		}
	}

}

function GateIcon (x, y, w, h, c) {


	this.pos = createVector (x, y);
	this.w = w;
	this.h = h;
	this.c = c;

	this.show = function () {

		fill (c);
		rect (this.pos.x, this.pos.y, this.w, this.h);

	}

	this.pressed = function () {
		if (mouseX > this.pos.x && mouseX < this.pos.x + this.w) {
			if (mouseY > this.pos.y && mouseY < this.pos.y + this.h) {
				return true;
			}
			else {
				return false;
			}
		}
	}
}

function WhiteBox (x, y, w, h, c) {

	this.pos = createVector (x, y);
	this.w = w;
	this.h = h;
	this.c = c;

	this.show = function () {

		fill (c);
		rect (this.pos.x, this.pos.y, this.w, this.h);

		fill (0);
		rect (this.pos.x + this.w/2 - this.w/6, this.pos.y, this.w/3, this.h);

		textSize (20);
		text ("Leakage Channels", this.pos.x + this.w * .015 , this.pos.y + this.h * .75)

	}



}

function Pipet (x, y, w, h, c) {

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.c = c;

	//displays button
	this.show = function () {
		fill (c);
		ellipse (this.x, this.y, this.w, this.h);
		fill (255);
		rect (this.x + this.w/2 - this.w/10, this.y - this.h/8, this.w * 1.5, this.h/4, 60);
	}

	//tells whether mouse is over button
	this.releaseParticle = function () {
		if (dist (mouseX, mouseY, this.x, this.y) < this.w * .5) {
			var part = new Particle (this.x + this.r * .5, this.y, this.c);
			append (pars, part);
		}
	}

}

function Membrane (x, y, w, h) {

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	//displays membrane
	this.show = function () {
		fill ('yellow');
		rect (this.x, this.y, this.w, this.h);
	}

}

function Channel (x, y, w, h, c) {

	this.w = w;
	this.h = h;

	this.pos = createVector (x, y);

	this.c = c;

	this.selected = true;

	//displays Channel
	this.show = function () {
		fill (this.c);
		rect (this.pos.x, this.pos.y, w, h);
	}

	this.mouseOnChannel = function () {
		if (mouseX > this.pos.x && mouseX < this.pos.x + this.w) {
			if (mouseY > this.pos.y && mouseY < this.pos.y + this.h) {
				this.selected = true;
			}
		}
	}

	this.moveParticle = function () {
		for (var i = 0; i < pars.length; i++) {
			if (pars[i].c == this.c) {
				if (pars[i].pos.x  > this.pos.x && pars[i].pos.x < this.pos.x + this.w) {
					if (pars[i].pos.y > this.pos.y && pars[i].pos.y < this.pos.y + this.h) {
						pars[i].inChannel = true;
					} else {
						pars[i].inChannel = false;
					}
				} 
			}
		}
	}

	this.drag = function () {
		var mousePos = createVector (mouseX, mouseY);

		this.pos = mousePos;

		if (this.pos.y > membrane.y && this.pos.y < membrane.y + membrane.h) {
			this.pos.y = membrane.y;
		}
	}

}

function mouseDragged () {

	if (blueLeakageIcon.pressed()) {
		append (channels, new Channel (mouseX, mouseY, 20, membrane.h, 'blue'));
	}

	if (greenLeakageIcon.pressed()) {
		append (channels, new Channel (mouseX, mouseY, 20, membrane.h, 'green'));
	}

	for (var i = 0; i < channels.length; i++) {
		if (channels[i].selected) {
			channels[i].drag();
		}
	}
}

function Particle (x, y, c) {

	this.c = c;
	this.pos = createVector (x, y);

	//intiial x velocity of particle
	this.velocity = createVector (3, 0);

	this.inChannel = false;

	//displays particle
	this.show = function () {
		fill (this.c);
		ellipse (this.pos.x, this.pos.y, 10, 10 );
	}

	//moves particles
	this.move = function () {

		//creates random number
		var chanceChangeDirection = random (1);
		var chanceToChangeDirection = .03;

		//changes direction of particle 
		if (chanceChangeDirection < chanceToChangeDirection && !this.inChannel) {
			this.velocity = createVector (random (-1,1), random (-1,1));
		} 

		if (this.inChannel == true) {
			this.velocity.x = 0;
		}

		if (this.inChannel == false && this.velocity.x == 0) {
			this.velocity.x = random (-1, 1);
		}

		//keeps particles within bounds of screen
		if (this.pos.x < cellSpace.x) {
			this.pos.x = cellSpace.x;
			this.velocity.mult (-1);
		}

		if (this.pos.x > cellSpace.x + cellSpace.w) {
			this.pos.x = cellSpace.x + cellSpace.w;
			this.velocity.mult (-1);
		}

		if (this.pos.y > cellSpace.y + cellSpace.h) {
			this.pos.y = cellSpace.y + cellSpace.h;
			this.velocity.mult (-1);
		}

		if (this.pos.y < cellSpace.y) {
			this.pos.y = cellSpace.y;
			this.velocity.mult (-1);
		}

		//keeps particles from crossing the membrane unless if they are not in a channel
		if (!this.inChannel) {

			if (this.pos.y > membrane.y && this.pos.y < membrane.y + 1) {
				this.pos.y = membrane.y - 2;
				this.velocity.mult (-1);
			}

			if (this.pos.y < membrane.y + membrane.h && this.pos.y > membrane.y + membrane.h -1) {
				this.pos.y = membrane.y + membrane.h + 2;
				this.velocity.mult (-1);
			}
		}
		
		this.pos.add (this.velocity);

	}
}