//To receive messages:
//socket.on('<name_of_incoming_message>',<function_to_handle_incoming_data>);
//To  send messages:
// socket.emit('<name_of_outgoing_message>',<any_data>);

//-vars to handle socket connection:------------
let socket;
let server_url;
//----------------------------------------------

//-vars to handle pages:------------------------
let welcomePage;
let recordPage;
let thankYouPage;
//----------------------------------------------

//-vars to handle audio:------------------------
let mic, recorder, soundFile;
let state = 0;//clicking record buttons will increment state
//----------------------------------------------

var submitted;


function preload() {
  //load fonts/images:
}

function setup(){
  createCanvas(windowHeight,windowWidth);

  //Connect to socket server on startup:-
  server_url = 'http://localhost:3000';
  socket = io.connect(server_url);
  //-------------------------------------

  //initialize pages:--------------------
  welcomePage = new WelcomePage();
  recordPage = new RecordPage();
  thankYouPage = new ThankYouPage();
  //-------------------------------------

  //audio set up:------------------------
  mic = new p5.AudioIn();
  mic.start();
  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);
  soundFile = new p5.SoundFile();
  //-------------------------------------

  submitted = false;

  resizeCanvas(windowWidth, windowHeight);
}

//MAIN LOOP:
function draw(){
  background(255);
  welcomePage.run();
  recordPage.run();
  thankYouPage.run();
}


function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}


function mousePressed(){
  if( (welcomePage.button.mouseIsOver()) && (welcomePage.isDisplaying) ){
    welcomePage.button.isOn = !welcomePage.button.isOn;
    welcomePage.isDisplaying = false;
    recordPage.isDisplaying = true;
  }

  if( (recordPage.recordbutton.mouseIsOver()) && (recordPage.isDisplaying) ){
    if (state === 0) {
      mic.start();
      // Tell recorder to record to a p5.SoundFile which we will use for playback
      recorder.record(soundFile);
      recordPage.recordbutton.text = "Recording...";
      recordPage.recordbutton.isOn = true;
      state++;
    } else if (state == 1){
      recorder.stop();
      recordPage.recordbutton.text = "Recorded";
      recordPage.recordbutton.isOn = false;
      state++;
    }
  }

  if( (recordPage.playstopbutton.mouseIsOver())  && (recordPage.isDisplaying)){
    if(state == 2){
      soundFile.play();
      recordPage.playstopbutton.text = "Playing...";
      recordPage.playstopbutton.isOn = true;
      state++;
    } else if(state == 3 ){
      soundFile.stop();
      recordPage.playstopbutton.text = "Play";
      recordPage.playstopbutton.isOn = false;
      state--;
    }
  }

  if( (recordPage.submitbutton.mouseIsOver())  && (recordPage.isDisplaying)){
    if(state >= 2 && !recordPage.submitbutton.isOn){
      if(socket.id != undefined){
        var filename = socket.id + ".wav";
      } else {
        var filename = "socketUndefined.wav";
      }
      saveSound(soundFile, filename);
      recordPage.submitbutton.isOn = true;
      recordPage.submitbutton.text = "Submitted."
    }
  }

  if( (recordPage.continuebutton.mouseIsOver()) && (recordPage.isDisplaying)){
    recordPage.isDisplaying = false;
    thankYouPage.isDisplaying = true;
  }

  if( (thankYouPage.submitbutton.mouseIsOver()) && (thankYouPage.isDisplaying)){
    let data = {
      email: thankYouPage.email.value(),
      comments: thankYouPage.additionalComments.value(),
      date_time: "Form submitted on "+day()+"/"+month()+"/"+year()+" at "+hour()+":"+minute()+":"+second()+"."
    };
    socket.emit('formFill',data);
    console.log("Form submitted:");
    console.log(data);
    submitted = true;
    thankYouPage.text.body = "";
  }
}



class Button{
  constructor(x_,y_,w_,h_,text_,c1,c2,c3){
    this.x = x_;
    this.y = y_;
    this.h = h_;
    this.w;
    this.text = text_;

    this.isOn = false;

    this.onCol = c1;
    this.offCol = c2;
    this.hovCol = c3;

    this.textOnCol = c2;
    this.textOffCol = c3;
    this.textHovCol = c2;

    this.buttonCol = this.offCol;
    this.textCol = this.textOffCol;

  }

  run(){
    this.update();
    this.display();
  }

  updateDimensions(x_,y_,w_,h_){
    this.x = x_;
    this.y = y_;
    this.h = h_;
    this.w = w_;
  }

  update(){
    if(this.mouseIsOver()){
      this.buttonCol = this.hovCol;
      this.textCol = this.textHovCol;
    } else if (this.isOn){
      this.buttonCol = this.onCol;
      this.textCol = this.textOnCol;
    } else {
      this.buttonCol = this.offCol;
      this.textCol = this.textOffCol;
    }
  }

  display(){
    fill(this.buttonCol);
    stroke(this.offCol);
    rectMode(CENTER);

    textSize(this.h);

    rect(this.x,this.y,this.w,this.h);

    fill(this.textCol);

    textAlign(CENTER,CENTER);
    text(this.text,this.x,this.y);
  }

  mouseIsOver(){
    if(
      (mouseX > this.x - (this.w/2)) &&
      (mouseX < this.x + (this.w/2)) &&
      (mouseY > this.y - (this.h/2)) &&
      (mouseY < this.y + (this.h/2))
    ){
      return true;
    } else {
      return false;
    }
  }


}

class TextEntry{
  constructor(x_,y_){
    this.x = x_;
    this.y = y_;
  }

  update(){

  }
}


//==Page Classes:===============================================
//---Welcome Page:-----------------------------------------
class WelcomePage{
  constructor(){
    this.isDisplaying = true;

    this.text = {
      title: "Welcome.",
      body: ""
    };

    this.button_text = "Take part."

    this.box_x = width/2;
    this.box_y = height/2;
    this.box_w = width/4;
    this.box_h = height/4;
    this.title_size = this.box_h/4;
    this.body_size = this.title_size *.3;
    this.spacing = this.body_size *.5;
    this.button = new Button(
      this.box_x,//x
      this.box_y+(this.box_h/2),//y
      100,
      this.box_h/8,//h
      this.button_text,//text
      color(200),
      color(0),
      color(255)
    );
  }

  run(){
    this.updateDimensions();
    if(this.isDisplaying){
      this.display();
    }

    this.button.updateDimensions(
      this.box_x,//x
      this.box_y+(this.box_h/2),//y
      200,
      this.box_h/8,//h
    );
  }

  updateDimensions(){
    this.box_x = width/2;
    this.box_y = height/2;
    this.box_w = width/4;
    this.box_h = height/3;
    this.title_size = this.box_h/4;
    this.body_size = this.title_size *.3;
    this.spacing = this.body_size *.5;
  }

  display(){
    rectMode(CORNER);
    textAlign(CENTER);
    noStroke();
    fill(0);
    textLeading(this.spacing);
    //Title:
    let tx = this.box_x - (this.box_w/2);
    let ty = this.box_y - (this.box_h/2);
    textSize(this.title_size);
    text(this.text.title,tx,ty,this.box_w,this.box_h);
    //Body:
    let bx = this.box_x - (this.box_w/2);
    let by = this.box_y - (this.box_h/2) + this.title_size + this.spacing;
    textSize(this.body_size);
    text(this.text.body,bx,by,this.box_w,this.box_h);

    //Button:
    this.button.run();
  }
}
//---------------------------------------------------------

//---Record Page:------------------------------------------
class RecordPage{
  constructor(){
    this.isDisplaying = false;

    // this.box_x = width/2;
    // this.box_y = height/2;
    // this.box_w = width*.7;
    // this.box_h = height/3;
    // this.margin = 2;
    // this.button_width = this.box_w;
    // this.button_height = (this.box_h/3);
    this.box_x;
    this.box_y;
    this.box_w;
    this.box_h;
    this.margin;
    this.button_width;
    this.button_height;


    this.recordbutton = new Button(
      this.box_x,
      this.box_y-this.button_height,
      this.button_width,
      this.button_height,
      "Record",
      color(200),
      color(0),
      color(255)
    );

    this.playstopbutton = new Button(
      this.box_x,
      this.box_y,
      this.button_width,
      this.button_height,
      "Play",
      color(200),
      color(0),
      color(255)
    );

    this.submitbutton = new Button(
      this.box_x,
      this.box_y+this.button_height,
      this.button_width,
      this.button_height,
      "Submit",
      color(200),
      color(0),
      color(255)
    );

    this.continuebutton = new Button(
      this.box_x,
      this.box_y+this.button_height*1.5,
      this.button_width*.8,
      this.button_height*.8,
      "Continue",
      color(200),
      color(0),
      color(255)
    );
  }

  run(){
    this.updateDimensions();
    if(this.isDisplaying){
      this.display();
    }
  }

  updateDimensions(){
    // this.box_x = width/2;
    // this.box_y = height/2;
    // this.box_w = width/4;
    // this.box_h = height/3;
    this.box_x = width/2;
    this.box_y = height/2;
    this.box_w = width*.5;
    this.box_h = height/3;
    this.margin = 2;
    this.button_width = this.box_w;
    this.button_height = (this.box_h/3);

    this.recordbutton.updateDimensions(
      this.box_x,
      this.box_y-this.button_height,
      this.button_width,
      this.button_height,
    );

    this.playstopbutton.updateDimensions(
      this.box_x,
      this.box_y,
      this.button_width,
      this.button_height,
    );

    this.submitbutton.updateDimensions(
      this.box_x,
      this.box_y+this.button_height,
      this.button_width,
      this.button_height,
    );

    this.continuebutton.updateDimensions(
      this.box_x,
      this.box_y+this.button_height*2.5,
      this.button_width*.8,
      this.button_height*.8,
    );

  }

  display(){
    this.recordbutton.run();
    this.playstopbutton.run();
    this.submitbutton.run();
    this.continuebutton.run();
  }

}
//---------------------------------------------------------

//---ThankYou Page:----------------------------------------
class ThankYouPage{
  constructor(){
    this.isDisplaying = false;

    this.text = {
      title: "Thank you.",
      body: "Thank you for contributing to Singing Our Lives! Please provide your email address below if you are okay with us getting in contact with you.  Please also add anything else that you didn't get a chance to say earlier, and press 'Submit' when you are finished."
    };

    this.box_x;
    this.box_y;
    this.box_w;
    this.box_h;
    this.title_size;
    this.body_size;
    this.spacing;

    this.input_w;

    this.submitbutton = new Button(
      0,
      0,
      0,
      0,
      "Submit",
      color(200),
      color(0),
      color(255)
    );

    //html elements:
    this.email = createInput("Email (optional)");
    this.additionalComments = createElement('textarea',"Anything else to add?");
    this.email.hide();
    this.additionalComments.hide();
  }

  run(){
    this.updateDimensions();
    if(this.isDisplaying){
      this.display();
    }
  }

  updateDimensions(){
    this.box_x = width/2;
    this.box_y = height*.2;
    this.box_w = width*.6;
    this.box_h = height/4;
    this.title_size = this.box_h/4;
    this.body_size = this.title_size *.3;
    this.spacing = this.body_size *.5;

    textSize(this.body_size);
    //input size is set in terms of visible characters
    //to convert to pixels: visChar = desiredPix/(widthOfChar)
    this.input_w = 100/textWidth("t");

    this.submitbutton.updateDimensions(
      this.box_x,
      this.box_h*2,
      100,
      this.body_size,
    );
  }

  display(){
    rectMode(CORNER);
    textAlign(CENTER);
    noStroke();
    fill(0);
    textLeading(this.spacing);
    //Title:
    let tx = this.box_x - (this.box_w/2);
    let ty = this.box_y - (this.box_h/2);
    textSize(this.title_size);
    text(this.text.title,tx,ty,this.box_w,this.box_h);
    //Body:
    let bx = this.box_x - (this.box_w/2);
    let by = this.box_y - (this.box_h/2) + this.title_size + this.spacing*2;
    textSize(this.body_size);
    text(this.text.body,bx,by,this.box_w,this.box_h);

    let ex = this.box_x-(this.input_w*textWidth("t")/2);
    let ey = this.box_h*1.5;
    this.email.attribute('size',this.input_w);
    this.email.attribute('rows',);
    this.email.position(ex,ey);

    let acx = this.box_x-(this.input_w*textWidth("t")/2);
    let acy = ey+this.spacing*4.5;
    this.additionalComments.attribute('size',this.input_w);
    this.additionalComments.position(acx,acy);

    if(!submitted){
      this.email.show();
      this.additionalComments.show();
    } else {
      this.email.hide();
      this.additionalComments.hide();
    }

    this.submitbutton.run();
  }

}
//---------------------------------------------------------

//============================================================
