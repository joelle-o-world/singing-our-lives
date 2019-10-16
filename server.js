//////////////////////////////////////////////
//Uses Express, a minimalist web-application
//framework, to host html and js files and
//handle socket connections.
//////////////////////////////////////////////

console.log("Server is running...");

//--Start Filesystem:----------------------------
var fs = require('fs');
// var mkdirp = require('mkdirp');
//-----------------------------------------------

//--Start Server:---------------------------------
//Require the library:--------
//require('express') returns a function call,
//and stores it in the variable "express":
var express = require('express');
//----------------------------
//Create the app:-------------
//call the function now associated with var express,
//and store the returned result in var app:
var app = express();
//----------------------------
//Listen on port "serv_port"--
//port used to connect to server:
var serv_port = 3000;
//start server by storing app.listen() in var server:
var server = app.listen(serv_port);
//----------------------------
//Host the files in "public":-
app.use(express.static('public'));
//----------------------------
//-----------------------------------------------

//--Start Socket.io:---------------------------------
//Require the library:--------
var socket = require('socket.io');
//Remember, socket is storing a FUNCTION
//----------------------------
//Create a socket attached to the server
//{"var server = app.listen(serv_port)"}
var server_io = socket(server);
//When a new socket connection event occurs,
//a socket is passed to the specified function:
server_io.sockets.on('connection', newConnection);

//Remember, a socket is passed to newConnection()
//upon a new connection to the socket
function newConnection(socket){
  //Print the id of each new socket connection:
  console.log('New connection with socket ID ' + socket.id);

  //if there is a message called "mouse", pass whatever is
  //contained within it to the function "mouseMsg":
  socket.on('formFill', saveForm);

  function saveForm(data){
    console.log("Form received: ");
    console.log(data);


    var filepath = "./formfills/12oct19" + socket.id;
    var filename = filepath+"/"+socket.id+".json"
    var json = JSON.stringify(data,null,2);
    //make a folder to hold the json and, later, the wav file:
    fs.mkdirSync(filepath);
    //write the json file:
    fs.writeFileSync(filename, json);
    console.log("Form saved as " + filename + ".");
  }

}
