var canvas;


var audiotape;
var audio_segs;
var buff_size;
let buffer = [];

let audioin, recorder, soundfile;

let n = 0.0;

let p5Ready = false
function setup() {
  // Do nothing
  p5Ready = true;
}

let isVisualiserRunning = false;
function setup_visualiser() {
  if(p5Ready) {
    canvas = createCanvas(windowWidth,300);
    canvas.parent('p5canvas');

    audio_segs = 21;

    audiotape = new AudioTape(color("#652a80"),2,audio_segs);

    buff_size = audio_segs;
    for(let i = 0; i < buff_size; i++){
      buffer.push(0.0);
    }

    audioin = new p5.AudioIn(err => console.error(err));
    audioin.start(() => {
      isVisualiserRunning = true;
      //console.log('## mic started successfully')
    }, () => {
      //console.error("Mic failed")
    })

    window.audioin = audioin
  }
}

function draw() { 
  if(isVisualiserRunning) {
    getAudioContext().resume();
    var vol = audioin.getLevel();
    var r = vol * 300;
    // var r = noise(n) * 120;
    background(255);
    audiotape.update(r);
    n += 0.1;
}
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}


//AudioTape Class:
class AudioTape{
  //--CONSTRUCTOR------------------------------------
  constructor(tpc,nc,segs) {
    this.tape_color = tpc;
    this.segments = segs;
    this.fsegments = segs;
    this.corners = [];
    this.tape_segments =[];
    this.audio_values = [];
    this.previous_values = [];
    this.num_corners = nc;
    for(let i = 0; i < this.num_corners; i++){
      this.corners.push(createVector(0,0));
    }

    for(let i = 0; i < this.segments; i++){
      this.tape_segments.push(createVector(0,0));
      this.audio_values.push(0.0);
      this.previous_values.push(0.0);
    }
    this.glob_corners = [createVector(0,height*.4),createVector(width,height*.4)];
    this.findPoints(this.glob_corners);


  }
  //-------------------------------------------------


  //--FILL-CORNERS-ARRAY------------------
  //in order to keep the length of these arrays flexible, store the starting points in the main program, and pass them through to this object via this function
  findPoints(global_corners) {
    //find corners:........................
    for (let i = 0; i < this.num_corners; i++) {
      this.corners[i].x = global_corners[i].x;
      this.corners[i].y = global_corners[i].y;
    }
    //.....................................

    //find segments:.......................
    //this part was tricky!! Needed to find the index of tape_segments for each iteration of the for loop, such that every segment has a coordinate in it
    //to do this, iterate through every pair of corners. for each pair of corners, iterate through the tape_segments array the same number of times as there are segments in each tape
    //then go back to top of loop, increasing the index of tape_segments by the number of segments in the tape each time
    for (let c = 0; c < this.num_corners-1; c++) {
      for (let t = 0; t < this.segments/(this.num_corners-1); t++) {
        let x = lerp(this.corners[c].x, this.corners[c+1].x, t/(this.fsegments/(this.num_corners-1)));
        let y = lerp(this.corners[c].y, this.corners[c+1].y, t/(this.fsegments/(this.num_corners-1)));
        this.tape_segments[t+((this.segments/(this.num_corners-1))*c)] = createVector(x, y);
      }
    }
    //.....................................
  }
  //--------------------------------------

  //--UPDATE------------------------------
  update(audio_read) {
    this.audio_values[0] = audio_read;
    for (let i = 1; i < this.audio_values.length; i++) {
      this.audio_values[i] = this.previous_values[i-1];
    }
    this.display();
    for(let i = 0; i < this.previous_values.length; i++){
      this.previous_values[i] = this.audio_values[i];
    }

  }
  //--------------------------------------

  //--DISPLAY()----------------------------
  display() {
    noFill();
    stroke(this.tape_color);
      strokeWeight(5);
    beginShape();
    for (let i = 0; i < this.tape_segments.length; i++) {
      //ellipse(tape_segments[i].x,tape_segments[i].y,10,10);
      if (i%2==0) {
        vertex(this.tape_segments[i].x, this.tape_segments[i].y+this.audio_values[i]);
      } else {
        vertex(this.tape_segments[i].x, this.tape_segments[i].y-this.audio_values[i]);
      }
    }
    vertex(this.corners[this.corners.length-1].x, this.corners[this.corners.length-1].y);
    endShape();
  }
  //--------------------------------------
}
