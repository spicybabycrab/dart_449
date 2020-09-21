var fieldDefinition = 0.005;
var ghosts = [];

var mouse = {};
mouse.pos = new p5.Vector();
var pmouse = {};
pmouse.pos = new p5.Vector();

var temp = {};
temp.pos = new p5.Vector();

var center = new p5.Vector();
var bloomingPoints = [];
var margin = 50; 
var xOffset = 0;
var padding = 150;
var bgColor;
var target = new p5.Vector();
var gaze = new p5.Vector();

function setup(){
  createCanvas(windowWidth,windowHeight);
  noStroke();
  cursor(HAND);
  bgColor = color(0,50,235);
  center.set(width/2,height/2);
  temp.pos = center.copy();
  target = temp;
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
  center.set(width/2,height/2);
}

function draw(){
  pmouse.pos.set(pmouseX, pmouseY);
  mouse.pos.set(mouseX, mouseY);
  
  xOffset += 0.001;
  background(bgColor);
  bgFace(center);
  for(var i=ghosts.length-1; i>=0; i--){
    ghosts[i].update();
    if(ghosts[i].isOut() || ghosts[i].life < 0) ghosts.splice(i,1);
  }
  for(var i=ghosts.length-1; i>=0; i--){
    ghosts[i].display();
  }
  
  if(frameCount < (60 * 3) ){
    noStroke();
    
    var alpha;
    if(frameCount<=60*2) alpha = 1;
    else alpha = (60*3-frameCount) / 60;
    fill(255, 255*alpha);
    textAlign(CENTER);
    textSize(20);
    text('Click around the character', width/2, height/2+200);
  }
}

function mouseClicked(){
  var pos = new p5.Vector(mouseX, mouseY);
  spawning(pos);
}

function touchStarted() {
  var pos = new p5.Vector(mouseX, mouseY);
  spawning(pos);
}

function bgFace(pos){
  if(ghosts.length==0){
    if(mouse.pos.dist(pmouse.pos) > 15) target = mouse;
  } 
  else if(target.life<=0){
    target = ghosts[floor(random(ghosts.length))];
    //console.log(target.life);
  } 
  
  var moveEyes = p5.Vector.sub(target.pos,gaze);
  moveEyes.mult(0.2);
  gaze.add(moveEyes);
  
  var dir = p5.Vector.sub(gaze,pos);

  var speed = ghosts.length/10;
  var limit = 5;
  if(speed>limit)speed=limit;
  var mouthSize = speed*3+20;
  var browHeight = speed*1;
 
  var facePos = dir.copy();
  facePos.mult(0.1);
  var partMove = p5.Vector.mult(facePos,0.3);
  facePos.add(pos);
  
  noStroke();
  fill(0,255,255);
  ellipse(facePos.x - 80, facePos.y, 80+speed, 80+speed);
  ellipse(facePos.x + 80, facePos.y, 80+speed, 80+speed);
  fill(bgColor);
  ellipse(facePos.x - 80 + partMove.x, facePos.y + partMove.y, 50+speed*0.3, 50+speed*0.5);
  ellipse(facePos.x + 80 + partMove.x, facePos.y + partMove.y, 50+speed*0.3, 50+speed*0.5);
  
  
  fill(0,255,255);
  ellipse(facePos.x, facePos.y+70+mouthSize*0.3, mouthSize, mouthSize-abs(partMove.y)*0.3 );
  stroke(0,255,255);
  strokeWeight(7);
  noFill();
  line(
    facePos.x-110 - partMove.x*0.5, facePos.y-35 - browHeight, 
    facePos.x-40 + partMove.x*0.5 -speed*0.2, facePos.y-50);
  line(facePos.x+110 - partMove.x*0.5, facePos.y-35 - browHeight, 
       facePos.x+40 + partMove.x*0.5 + speed*0.2, facePos.y-50);
  
  arc(
    facePos.x + partMove.x,
    facePos.y+30 + partMove.y, 
    25, 
    25, 
    Math.PI*0.3, 
    Math.PI*0.7
  );
}

function Ghost(pos,acc){
  this.pos=pos.copy();
  this.pPos = this.pos.copy();
  this.acc=acc.copy();
  this.vel=new p5.Vector();
  this.vel.add(this.acc);
  this.acc.mult(0);
  this.life = random(10, 300);
  this.afterImageFrame = 1;
  this.timing = frameCount%this.afterImageFrame;
}

Ghost.prototype.applyForce = function(force){
  this.acc.add(force);
}

Ghost.prototype.update = function(){
  this.life -=1.5;
  var force = new p5.Vector(0.05,0);
  var theta = noise(this.pos.x*fieldDefinition+xOffset, this.pos.y*fieldDefinition)*(PI*4);
  force.rotate(theta);
  
  this.applyForce(force);
  
  this.vel.add(this.acc);
  if(frameCount%this.afterImageFrame ==this.timing)this.pPos = this.pos.copy();
  this.pos.add(this.vel);
  this.acc.mult(0);
  
  var move = p5.Vector.sub(this.pos,this.pPos);
  this.angle = move.heading();
}

Ghost.prototype.display = function(){
  var speed = this.vel.mag();
  var limit = 5;
  if(speed>limit)speed=limit;
  var mouthSize = speed*2;
  var browHeight = speed*1;
  
  stroke(speed*100,255,255-speed*100);
  strokeWeight(60);
  line(this.pos.x,this.pos.y, this.pPos.x,this.pPos.y);
  noStroke();
  fill(speed*100,255,255-speed*100);
  ellipse(this.pPos.x,this.pPos.y, 60, 60);
  ellipse(this.pos.x,this.pos.y, 60, 60);
  fill(bgColor);
  var facePos = new p5.Vector(10,0);
  facePos.rotate(this.angle);
  var partMove = p5.Vector.mult(facePos,0.1);
  facePos.add(this.pos);
  
  ellipse(facePos.x - 7, facePos.y, 6+speed, 6+speed);
  ellipse(facePos.x + 7, facePos.y, 6+speed, 6+speed);
  fill(255);
  ellipse(facePos.x - 7, facePos.y, 2+speed*0.3, 2+speed*0.5);
  ellipse(facePos.x + 7, facePos.y, 2+speed*0.3, 2+speed*0.5);
  
  
  fill(bgColor);
  ellipse(facePos.x, facePos.y+7+mouthSize*0.3, mouthSize, mouthSize);
  stroke(bgColor);
  strokeWeight(1);
  noFill();
  line(
    facePos.x-10 - partMove.x*0.5, facePos.y-2 - browHeight + partMove.x*0.5, 
    facePos.x-3 + partMove.x*0.5 -speed*0.2, facePos.y-7 + partMove.x*0.5);
  line(facePos.x+10 - partMove.x*0.5, facePos.y-2 - browHeight + partMove.x*0.5, 
       facePos.x+3 + partMove.x*0.5 + speed*0.2, facePos.y-7 + partMove.x*0.5);
  
  arc(
    facePos.x + partMove.x,
    facePos.y + partMove.y, 
    5, 
    5, 
    Math.PI*0.3, 
    Math.PI*0.7
  );
}

Ghost.prototype.isOut = function(){
  if(this.pos.x < -margin || this.pos.x > width+margin 
     || this.pos.y < -margin || this.pos.y > height+margin){
    this.life = 0;
    return true;
  }
  else return false;
}

function SpawningPoint(pos){
  this.pos = pos;
  this.ghostNum = floor(random(3,50));
}

SpawningPoint.prototype.spawning = function(){
  for(var i=0; i<this.ghostNum; i++){
    var acc = new p5.Vector(10,0);
    acc.rotate( (i/this.ghostNum)*PI*2 );
    faces.push(new Ghost(this.pos, acc));
  }
}

function spawning(pos){
  ghostNum = floor(random(3,8));
  for(var i=0; i<ghostNum; i++){
    var acc = new p5.Vector(2,0);
    acc.rotate( (i/ghostNum)*PI*2 );
    ghosts.push(new Ghost(pos, acc));
    target = ghosts[ghosts.length-1];
  }
}