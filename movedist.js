let particles = [];
var fade; //for the fade effect
var fadeAmount = 1;
let posX = 0;
let posY = 0;
let noseX, noseY;
let x=0;
let y=0;
let p5lm;
let p;
let newX = -1;
let newY = -1;
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

  
  for (var i = 0; i < particles.length; i += 5) {
    p = particles[i];
    posX = p.x + (noseX - width / 2) /5;
    posY = p.y + (noseY - height / 2) / 5;
    let distance = dist(p.x, p.y, posX, posY);
    let maxDistance = 150;
    //let alpha = map(distance, 0, maxDistance, 250, 0, true);
    noStroke();
    fill(0, 0, 0);
    // fill(p.clr[0],p.clr[1],p.clr[2]);
    
    

    ellipse(posX, posY, 1);


    p.x += (noise(p.x / 200, p.y / 200) - 0.6) * 6 ;
    p.y += (noise(p.x / 200, p.y / 200) - 0.5) * 6;

    // p.x += (noise(-1*p.x, p.x));
    // p.y += (noise(-1*p.y, p.y));
    //p.y += (noise(-10, 10));

    //p.y += (noise(p.x / 200, p.y / 200) - 0.5) * 6;


    if (p.x < 0) {
        p.x = width;
    } else if (p.x > width) {
        p.x = 0;
    }
    if (p.y < 0) {
        p.y = height;
    } else if (p.y > height) {
        p.y = 0;
    }
    // console.log(posX + posY);
   
  }
fill(0,0,0);
// fill(p.clr[0],p.clr[1],p.clr[2]);
  ellipse(x,y, 3);


  //if the ellipse overlap with the new coming ellipse from a new user, reverse the background and the ellipse's color
  if(newX != -1 && newY != -1){
  if (dist(x, y, newX, newY) > 500) {
    background(0,0,0,100);
    fill(255,255,255);
    ellipse(x,y, 3);
    for (var i = 0; i < particles.length; i += 5) {
      p = particles[i];
      posX = p.x + (noseX - width / 2) /5;
      posY = p.y + (noseY - height / 2) / 5;
      let distance = dist(p.x, p.y, posX, posY);
      let maxDistance = 150;
      let alpha = map(distance, 0, maxDistance, 250, 0, true);
      noStroke();
      fill(255, 255,255, alpha);
      // fill(p.clr[0],p.clr[1],p.clr[2]);
      
      
  
      ellipse(posX, posY, 1);
  
      p.x += (noise(p.x / 200, p.y / 200, 10) - 0.6) * 6 ;
      p.y += (noise(p.x / 200, p.y / 200, 30) - 0.5) * 6;
      // console.log(posX + posY);
     
    }
  }
}
  console.log(dist(x, y, newX, newY));
  
}

function gotDisconnect(id) {
  print(id + ": disconnected");
}

function gotData(data, id) {
  
  let d = JSON.parse(data);
  newX = d.posX;
  newY = d.posY;
  //make the color from a new user a different color
  let clr = color(d.clr[0], d.clr[1], d.clr[2], d.clr[3]);
  fill(clr);
  ellipse(newX, newY, 3);
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
  let dataToSend = {x: noseX, y: noseY, posX: noseX, posY: noseY, 
    //clr:color(255,0,0,255),
    //change the color of the new user's ellipse
    clr:[255,0,0,255]
  
  } // set the color to red initially};
  p5lm.send(JSON.stringify(dataToSend));
  // console.log("noseMoved");
}
