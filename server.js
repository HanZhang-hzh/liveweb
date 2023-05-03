// We need the file system here
var fs = require('fs');

// Express is a node module for building HTTP servers
var express = require('express');
var app = express();

//openaiapi
require('dotenv').config();
const OpenAi = require('openai-api');
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAi(apiKey);
let openSockets = [];
let peers = [];

async function generateFirstLine(prompt) {
  const gptResponse = await openai.complete({
    engine: 'davinci',
    prompt: prompt,
    maxTokens: 16,
    temperature: 0.9,
    // topP: 1,
    presencePenalty: 0,
    frequencyPenalty: 0,
    bestOf: 5,
    n: 1,
    stream: false,
    // stop: ['\n']
  });
// console.log(gptResponse.data.choices);
  // return gptResponse.data.choices[0].text.trimRight('\n','.',',',' ','(','[','{','<','"','\'','`','/','\\','_','-','+','*','&','^','%','$','#','@','!','~','|',';',':',']','}','>','?','=');));
  //trimright nothing at the beginning
  // let response = gptResponse.data.choices[0].text.trimLeft('\n', '.', ',', ' ','(','[','{','<','"','\'','`','/','\\','_','-','+','*','&','^','%','$','#','@','!','~','|',';',':',']','}','>','?','=');
  // return response.trim();
  let response = gptResponse.data.choices[0].text.replace(/^[.\s,()]+/, '');
return response.trim();

}

// Tell Express to look in the "public" folder for any files first
app.use(express.static('public'));

// If the user just goes to the "route" / then run this function
app.get('/', function (req, res) {
  res.send('Hello World!')
});

// Here is the actual HTTP server 
// In this case, HTTPS (secure) server
var https = require('https');

// Security options - key and certificate
var options = {
  key: fs.readFileSync('privkey1.pem'),
  cert: fs.readFileSync('cert1.pem')
};

// We pass in the Express object and the options object
var httpServer = https.createServer(options, app);

// Default HTTPS port
httpServer.listen(443);

const { Server } = require('socket.io');
const io = new Server(httpServer, {});

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 

  // We are given a websocket object in our function
  async function (socket) {
    peers.push({socket: socket});
  console.log("We have a new client: " + socket.id + " peers length: " + peers.length);
  
  socket.on('list', function() {
    let ids = [];
    for (let i = 0; i < peers.length; i++) {
      ids.push(peers[i].socket.id);
    }
    console.log("ids length: " + ids.length);
    socket.emit('listresults', ids);			
  });
  
  // Relay signals back and forth
  socket.on('signal', (to, from, data) => {
    console.log("SIGNAL", to, data);
    let found = false;
    for (let i = 0; i < peers.length; i++) {
      console.log(peers[i].socket.id, to);
      if (peers[i].socket.id == to) {
        console.log("Found Peer, sending signal");
        peers[i].socket.emit('signal', to, from, data);
        found = true;
        break;
      }				
    }	
    if (!found) {
      console.log("never found peer");
    }
  });
  
  socket.on('disconnect', function() {
    console.log("Client has disconnected " + socket.id);
      io.emit('peer_disconnect', socket.id);
    for (let i = 0; i < peers.length; i++) {
      if (peers[i].socket.id == socket.id) {
        peers.splice(i,1);
      }
    }			
  });

  socket.on("move", function(data) {
    data.id = socket.id;
    io.emit("move", data);
  });
  
    if (!openSockets.includes(socket)) {
      openSockets.push(socket);
    }

    console.log("We have a new client: " + socket.id);

    // Generate the first line of the poem
    const firstLine = await generateFirstLine("Mrs Dalloway said she would buy the flowers herself");
    console.log('First line:', firstLine);
    socket.emit('firstLine', firstLine);
    // socket.on('poem',function(data){
    //     console.log(data);
    //     socket.broadcast.emit('poem',data);
    // })
    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('chatmessage', function(data) {
      // Data comes in as whatever was sent, including objects
      console.log("Received: 'chatmessage' " + data);
      // Send it to all of the clients
      socket.emit('chatmessage', data);
    });

   //generate another verse based on the chatmessage
    socket.on('generate-verse', async (message) => {
        console.log(`Generating verse for message: ${message}`);
        const verse = await generateFirstLine(message);
        console.log(`Generated verse: ${verse}`);
        socket.broadcast.emit('chatmessage', verse);
      });

    socket.on('mouse', function(data) {
      //io.emit("mouse", data);
      socket.broadcast.emit("mouse", data); });

    io.on('connection', function(socket) {
      console.log('a user connected');
    
    
  // When the user disconnects
  socket.on('disconnect', function() {
    const socketIndex = openSockets.indexOf(socket);
    if (socketIndex !== -1) {
      openSockets.splice(socketIndex, 1);
    }

    console.log("Client has disconnected " + socket.id);
  });
});
});
