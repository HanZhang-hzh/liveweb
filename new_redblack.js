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
let video;
let users = [];
let alpha = 0;
let beta = 0;
let gamma = 0;
let mobileConnect;
let oFont;
var inverted = false;


function setup() {
  
  createCanvas(windowWidth, windowHeight);
  fade = 0;
  for (var i = 0; i < width; i += 20) {
    for (var o = 0; o < height; o += 5) {
      particles.push({
        x: i,
        y: o,
        // clr: color(0, 0, 0, 255)
        clr: [0,0,0]
      });
    }
  }

  //device orientation
  window.addEventListener("click", function () {
    alert("Hi");
          DeviceOrientationEvent.requestPermission()
          .then(response => {
              //if (response == 'granted') {
        alert("Try moving your phone");
              window.addEventListener('deviceorientation', mobileMove)

         

    })
})
// window.addEventListener("DOMContentLoaded", function () {
//     alert("Hi");
//           DeviceOrientationEvent.requestPermission()
//           .then(response => {
//               //if (response == 'granted') {
//         alert("Try moving your phone");
//               window.addEventListener('deviceorientation', mobileMove)

         

//     })
// })
        



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
    noseY = map(nosesY, 310, 590, 0, windowHeight);
    // console.log(noseY);

    noseMove();

  }
}

function mobileMove(e){
        mobileConnect = true;
        alpha = e.alpha,
        beta = e.beta,
        gamma = e.gamma;

        let dataToSend = {
            alpha: alpha,
            beta: beta,
            gamma: gamma,
            // mobileConnect : true
          } // set the color to red initially};
          p5lm.send(JSON.stringify(dataToSend));
}

function draw() {
  background(0,0,0, 5);
  
//   if (mobileConnect){
  //let color1= color(random(255), random(255), random(255));
  let randomNum = Math.floor(alpha / 360 * 87);
  fill(255,255,255,50);
   

  //change font to myfont
  push();
  textFont(myFont);
  fill(0,0,randomNum);

//   textSize(300);
  textSize(randomNum * 15);
  textAlign(CENTER, CENTER);
  text(randomNum, width/2, height/2 - 50);
// } 
   pop();
    
   if (randomNum == 86){
    location.reload();
   }
//    ellipse(alpha, beta, 50);
   
  console.log(alpha + ","+ beta);
  for (var i = 0; i < particles.length; i += 5) {
    p = particles[i];
    posX = p.x + (noseX - width / 2) /5;
    posY = p.y + (noseY - height / 2) / 5;
    let distance = dist(p.x, p.y, posX, posY);
    let maxDistance = 150;
    //let alpha = map(distance, 0, maxDistance, 250, 0, true);
    noStroke();
    // fill(0, 0, 0);
    //fill(p.clr[0],p.clr[1],p.clr[2]);
    
    fill(255,255,255)
    
    //ellipse(posX +30, posY+30, 1);
    //displaying the numbers from 0 - 86 according to the mobilephone orientation

    textFont(oFont);
    textSize((i%86+1)/6);
    textAlign(CENTER, CENTER);
    text(i%86+1, posX + 30, posY + 30);

    p.x += (noise(p.x / 200, p.y / 200, 3000) - 0.6) *  6 ;
    p.y += (noise(p.x / 200, p.x / 200, 30000) - 0.5) * 6

    // p.x += (noise(p.y / 200, p.y / 200) - 0.6) * 6 ;
    // p.y += (noise(p.x / 200, p.x / 200) - 0.5) * 6;

    // p.x += (noise(-1*p.x, p.x));
    // p.y += (noise(-1*p.y, p.y));
    //p.y += (noise(-10, 10));

    //p.y += (noise(p.x / 200, p.y / 200) - 0.5) * 6;


    if (p.x < 0) {
        
        p.clr = color(99);
        p.x = width;
    } else if (p.x > width) {
        p.x = 0;
        p.clr = [0,0,0];
    }
    if (p.y < 0) {
        p.clr = [0,0,0];
        p.y = height;
    } else if (p.y > height) {
        p.clr = [0,0,0];
        p.y = 0;
    }
    // console.log(p.x + posY);
   
  }
fill(0,0,0);
// fill(p.clr[0],p.clr[1],p.clr[2]);

    
  ellipse(x,y, 3);


  //if the ellipse overlap with the new coming ellipse from a new user, reverse the background and the ellipse's color
  if(newX != -1 && newY != -1){
  if (dist(x, y, newX, newY) > 500 && !inverted) {
    // background(255,255,255,5);
   
    // fill(255,255,255);
    // ellipse(x,y, 3);
    // for (var i = 0; i < particles.length; i += 5) {
    //   p = particles[i];
    //   posX = p.x + (noseX - width / 2) /5;
    //   posY = p.y + (noseY - height / 2) / 5;
    //   noStroke();
    //   fill(190,190,190);
    //   ellipse(posX, posY, 5);
    //   push();
    
      
    //   p.x -= (noise(p.x / 200, p.y / 200, 10) - 0.6) * 6 ;
    //   p.y -= (noise(p.y / 200, p.y / 200, 30) - 0.5) * 6;
    
    // }
    // push();
    filter(INVERT);
    inverted = true;
    // pop();
    
  } else if (dist(x, y, newX, newY) <= 500 && inverted) {
    filter(INVERT);
    inverted = false;
  }
}
//   console.log(dist(x, y, newX, newY));
  
}

function gotDisconnect(id) {
  print(id + ": disconnected");
}

function gotData(data, id) {
  
  let d = JSON.parse(data);
  if ("x" in d){
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
 
//   mobileMove();
} else if ("alpha" in d){
    alpha = d.alpha;
    // console.log(alpha);
    //
    // background(random(255),random(255),random(255),10);

    //send text to each user
    
}
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

// function mobileMove(){
//     let alpha = 
//    }
// }

function preload(){
    myFont = loadFont('Codystar-Regular.ttf');
    oFont = loadFont('saintecolombe.otf');
}