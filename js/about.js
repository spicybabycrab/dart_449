var circle = {
	x:387.5,
	y:478,
  diameter:45
};
var r = 255;
var g = 175;
var b =   0;

var cnv;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup() {
  cnv = createCanvas(600, 600);
  centerCanvas();
  background(255, 0, 200);
}

function windowResized() {
  centerCanvas();
}

function draw() {
  //background(255, 195, 0);
  background(r,g,b);
  b = map(mouseY, 0, 600, 600, 600);
  r = map(mouseY, 0, 600, 600, 0);

   b = map(mouseX, 0, 600, 0, 600);
   //g= map(mouseX, 0, 400, 400, 0);

  //H
  fill(0);
  rect(80, 280, 200, 45, 50);
  rect(80, 125, 45, 375, 50);
  rect(250, 125, 45, 375, 50);

  //i
  noFill();
  ellipse(circle.x, mouseY, 45, 45);
  fill(0);
  rect(365, 190, 45, 310, 50);

  //!
  fill(0);
  strokeWeight(4);
  rect(475, 125, 45, 310, 50);
  noFill(0);
  ellipse(mouseX, circle.y,
          circle.diameter,
          circle.diameter);
  //circle.x = circle.x +1;

  fill(230,30,23);

  ellipse(mouseX, mouseY, 10, 10);
}
