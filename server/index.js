//////////////////////////////////////////////
//Uses Express, a minimalist web-application
//framework, to host html and js files and
//handle socket connections.
//////////////////////////////////////////////


const fs = require('fs');
const path = require('path')
const express = require('express');
const https = require('https');
const http = require('http');
const extName = require('ext-name');

const {saveWav} = require('./saveWav.js')

//SSL Certification:------
const cert = fs.readFileSync('./ssl/singingyourlife_co_uk.crt');
const ca = fs.readFileSync('./ssl/singingyourlife_co_uk.ca-bundle');
const key = fs.readFileSync('./ssl/singingyourlife.co.uk.key');
const https_options = {cert, ca, key};
//-------------------------



const {
  acceptableMediaFileExtensions,
  serv_port,
  https_port,
  http_port,
  outputDir
} = require("./config.js")

const app = express();
// const server = app.listen(serv_port);
const http_server = http.createServer(app);
const https_server = https.createServer(https_options,app);
//--Redirect http traffic to https:---
//https://www.namecheap.com/support/knowledgebase/article.aspx/9705/33/installing-an-ssl-certificate-on-nodejs#https_express
app.use((req, res, next) =>{
  if(req.protocol == 'http'){
    res.redirect(301,`https://${req.headers.host}${req.url}`);
  }
  next();
});
//-------
app.use(express.static('public'));
http_server.listen(http_port);
https_server.listen(https_port);

//--Start Socket.io:---------------------------------
const socket = require('socket.io');
// const server_io = socket(server);
const server_io = socket(https_server);
server_io.sockets.on('connection', newConnection);

function newConnection(socket){
  //Print the id of each new socket connection:
  console.log('New connection with socket ID ' + socket.id);

  const sessionDirectory = path.resolve(outputDir, socket.id)
  const sessionAudioFiles = [];

  socket.on('formFill', data => {
    console.log("User", socket.id, "submitted feedback", data);

    let filePath = path.resolve(sessionDirectory, "feedback.json");
    let json = JSON.stringify(data,null,2);
    // make a folder to hold the json
    if(!fs.existsSync(sessionDirectory))
      fs.mkdirSync(sessionDirectory);

    //write the json file:
    fs.writeFileSync(filePath, json);
    console.log("Form saved as " + filePath + ".");
  });

  socket.on('upload', files => {
    console.log("User", socket.id, "uploaded", files.length, "files");

    let n = 1;
    for(let {type, buffer} of files) {
      // Destructure media type string.
      const [MIME, codec] = type.split(";");
      const [mediaKind] = MIME.split('/');

      let filename = (sessionAudioFiles.length+1) + '.wav';
      let filepath = path.resolve(sessionDirectory, filename);
      sessionAudioFiles.push(filepath);

      console.log("## MIME: ", MIME)

      // Create the session directory if it doesn't exist.
      if(!fs.existsSync(sessionDirectory))
        fs.mkdirSync(sessionDirectory);

      if(mediaKind == 'audio')
        saveWav(buffer, type, filepath);
      else {
        // Find appropriate file extension based on MIME
        const [{ext}] = extName.mime(MIME);

        // If found a file extension and its in the list
        if(ext && acceptableMediaFileExtensions.includes(ext)) {
          let filename = (sessionAudioFiles.length+1) + '.' + ext;
          let filepath = path.resolve(sessionDirectory, filename);
          sessionAudioFiles.push(filepath);

          console.log("Saving", filepath);
          fs.writeFile(filepath, buffer, err => {
            if(err)
            console.log("Error saving audio file:", filepath);
            else
            console.log("Successfully saved", filepath);
          })
        } else{
          console.log("Unsupported MIME:", MIME, '('+ext+')');
        }
      }
    }
  })


  socket.on('disconnect', () => {
    console.log("User disconnected", socket.id);
  })

}

console.log("Server is running...");
