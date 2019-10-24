//Global variables:
let p5mic;
let nr = 2;
let recs = [nr];
let rec_buttons = [nr];
let p5recorders = [nr];
let p5SoundFiles = [nr];

//main setup:
function setup(){
  noCanvas();

  p5mic = new p5.AudioIn();

  for (let i = 0; i < nr; i++){
    recs[i] = new Recorder('recorder_wrapper',i);
    recs[i].makeHTML();

    let thisSpecificIRightNow = i;
    rec_buttons[i] = document.getElementById('recorderButton'+i);
    console.log(rec_buttons[i]);
    rec_buttons[i].addEventListener('click',
      () => checkRecorderState(thisSpecificIRightNow)
    );

    p5recorders[i] = new p5.SoundRecorder();
    p5recorders[i].setInput(p5mic);
    p5SoundFiles[i] = new p5.SoundFile();
  }
}

function checkRecorderState(index){
  console.log('yessir');
  let r = recs[index];
  let pr = p5recorders[index];
  let ps = p5SoundFiles[index];

  //based on https://p5js.org/examples/sound-record-save-audio.html
  p5mic.start();
  r.state += 1;
  console.log("rec state", r.state);
  if (r.state === 1) {
    // console.log("State 1");
    r.recordbutton.innerHTML = 'Recording...';
    r.recordbutton.setAttribute('style','background-color:red');
    pr.record(ps);
  } else if (r.state === 2) {
    console.log("State 2");
    r.recordbutton.innerHTML = 'Done Recording. Click to Play';
    pr.stop();
  } else if (r.state === 3) {
    console.log("State 3");
    ps.play();
    saveSound(ps, 'mySound.wav');
  }
}
