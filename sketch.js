let particles = [];
var fade; //for the fade effect
var fadeAmount = 1;
let posX = 0;
let posY = 0;
let noseX, noseY;
let x=0;
let y=0;
let p5lm;

let poseNet;
let poses = []


function setup() {
  createCanvas(windowWidth, windowHeight);
  fade = 0;
  for (var i = 0; i < width; i += 20) {
    for (var o = 0; o < height; o += 5) {
      particles.push({
        x: i,
        y: o,
        clr: color(0, 0, 0, 255)
      });
    }
  }

  video = createCapture(VIDEO);
  // video.size(width, height);
  video.hide();

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);

  p5lm = new p5LiveMedia(this, "DATA", null, "w83C-S6DU");
  p5lm.on('data', gotData);
  p5lm.on('disconnect', gotDisconnect);

 
  
}

function modelReady() {
  console.log('Model Loaded');
}

function gotPoses(poses) {
  if (poses.length > 0) {
    let pose = poses[0].pose;
   let nosesX = pose.nose.x;
    let nosesY = pose.nose.y;
    noseX = map(nosesX, -30, 600, windowWidth, 0);
    noseY = map(nosesY, 200, 590, 0, windowHeight);
    // console.log(noseY);

    noseMove();

  }
}

function draw() {
  background(255, 255, 255, 5);

  
  for (var i = 0; i < particles.length; i ++) {
    let p = particles[i];
    posX = p.x + (noseX - width / 2) /5;
    posY = p.y + (noseY - height / 2) / 5;
    let distance = dist(p.x, p.y, posX, posY);
    let maxDistance = 350;
    let alpha = map(distance, 0, maxDistance, 250, 0, true);
    noStroke();
    fill(0, 0, 0);
    // fill(p.clr[0],p.clr[1],p.clr[2]);
    
    

    ellipse(posX, posY, 1);

    p.x += (noise(p.x / 200, p.y / 200, 10) - 0.6) * 10 ;
    p.y += (noise(p.x / 200, p.y / 200, 10) - 0.5) * 10;
    // console.log(posX + posY);
   
  }
fill(255,0,0);
  ellipse(x,y, 3);
  
}

function gotDisconnect(id) {
  print(id + ": disconnected");
}

function gotData(data, id) {
  
  let d = JSON.parse(data);
  x = d.posX;
  y = d.posY;
  // console.log(data);
  // let pobject = {
  //   x: d.posX,
  //   y: d.posY,
  //   clr: d.clr,
  // }
  // particles.push(pobject);
}

function noseMove() {
  
  x = noseX;
  y = noseY;
  posX = noseX;
  posY = noseY;
  // let dataToSend = {x: noseX, y: noseY, posX: noseX, posY: noseY, clr:color(255,0,0,255)};
  let dataToSend = {x: noseX, y: noseY, posX: noseX, posY: noseY, clr:color(255,0,0,255)};
  p5lm.send(JSON.stringify(dataToSend));
  // console.log("noseMoved");
}
