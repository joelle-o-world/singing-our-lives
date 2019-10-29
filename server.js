//////////////////////////////////////////////
//Uses Express, a minimalist web-application
//framework, to host html and js files and
//handle socket connections.
//////////////////////////////////////////////


const fs = require('fs');
const path = require('path')
const express = require('express');

const app = express();
const serv_port = 3000;
const  server = app.listen(serv_port);
app.use(express.static('public'));

//--Start Socket.io:---------------------------------
const socket = require('socket.io');
const server_io = socket(server);
server_io.sockets.on('connection', newConnection);

function newConnection(socket){
  //Print the id of each new socket connection:
  console.log('New connection with socket ID ' + socket.id);

  const sessionDirectory = "./formfills/" + socket.id;
  const sessionAudioFiles = [];

  socket.on('formFill', data => {
    console.log("Form received: ");
    console.log(data);


    let filepath = sessionDirectory
    let filename = path.resolve(filepath, "feedback.json");
    let json = JSON.stringify(data,null,2);
    //make a folder to hold the json and, later, the wav file:
    fs.mkdirSync(filepath);
    //write the json file:
    fs.writeFileSync(filename, json);
    console.log("Form saved as " + filename + ".");
  });
  
  socket.on('audioupload', files => {
    console.log("User", socket.id, "uploaded", files.length, "recordings");

    let n = 1;
    for(let {type, buffer} of files) {
      const [MIME, codec] = type.split(";");
      if(MIME == "audio/wav;") {
        let filename = (sessionAudioFiles.length+1) + '.wav'
        let filepath = path.resolve(
          sessionDirectory, filename
        );
        sessionAudioFiles.push(filepath);

        console.log("Saving", filepath);
        fs.mkdirSync(sessionDirectory);
        fs.writeFile(filepath, buffer, 
          () => console.log("Saved ", filepath)
        );
      } else if(MIME == "audio/webm") {
        let filename = (sessionAudioFiles.length+1) + '.webm'
        let filepath = path.resolve(
          sessionDirectory, filename
        );
        sessionAudioFiles.push(filepath);

        console.log("Saving", filepath);
        fs.mkdirSync(sessionDirectory);
        fs.writeFile(filepath, buffer, 
          () => console.log("Saved ", filepath)
        );
      } else
        console.warn("Unsupported MIME:", '\"'+type+'\"');
    }
  })
  

  socket.on('disconnect', () => {
    console.log("User disconnected", socket.id);
  })

}

console.log("Server is running...");
