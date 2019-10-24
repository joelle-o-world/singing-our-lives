import {AudioIn, SoundFile, SoundRecorder} from 'p5';
import 'p5/lib/addons/p5.sound';

const micRoberts = new AudioIn;
console.log('p5 audio in:', micRoberts)

class RecorderInterface {
  constructor(){
    this.makeHTML();

    this.updateState("waiting");
  }


  makeHTML(){
    // Return recorder body and exit early if already exists.
    if(this.recorderBody)
      return this.recorderBody;

    //create a new div to contain the HTML for this object:
    this.recorderBody = document.createElement('div');
    //give it a class name to stylize it later:
    this.recorderBody.className = 'recorder_body';

    //create a record button:
    this.recordbutton = document.createElement('button');
    this.recordbutton.className = 'recorderButton';
    this.recordbutton.innerHTML = 'Start Recording';
    this.recordbutton.addEventListener("click", () => this.record());

    // create a stop recording button
    this.stoprecordingbutton = document.createElement("button");
    this.stoprecordingbutton.className = "recorderButton";
    this.stoprecordingbutton.innerHTML = "Stop Recording";
    this.stoprecordingbutton.addEventListener("click", () => this.stop());

    //create a playback button:
    this.playbackbutton = document.createElement('button');
    this.playbackbutton.className = 'recorderButton';
    this.playbackbutton.innerHTML = 'Play Recording';
    this.playbackbutton.addEventListener("click", () => this.play());

    //append all elements to the recorderBody:
    this.recorderBody.appendChild(this.recordbutton);
    this.recorderBody.appendChild(this.stoprecordingbutton);
    this.recorderBody.appendChild(this.playbackbutton);

    return this.recorderBody;
  }

  /** Hide and show buttons dending upon the new state. */
  updateState(state) {
    this.state = state;

    console.log("updateState(", state, ")")

    switch(state) {
      case 'waiting':
        console.log("## state is waiting")
        this.recordbutton.innerText = "Start Recording";
        this.recordbutton.hidden = false;
        this.stoprecordingbutton.hidden = true;
        this.playbackbutton.hidden = true;
        console.log('##', this.playbackbutton, this.playbackbutton.hidden)
        break;
      
      case 'recording':
        this.recordbutton.hidden = true;
        this.stoprecordingbutton.hidden = false;
        this.playbackbutton.hidden = true;
        break;
      
      case 'recorded':
        this.recordbutton.innerText = "Record again?"
        this.recordbutton.hidden = false;
        this.stoprecordingbutton.hidden = true;
        this.playbackbutton.hidden = false;
        break;

      case 'playing':
        break;

      default:
        console.warn("Unknown state:", state);
    }
  }

  record() {
    console.log("## Calling record()")

    this.recorder = new SoundRecorder();
    this.recorder.setInput(micRoberts);
    this.soundFile = new SoundFile();
    this.recorder.record(this.soundFile);

    this.updateState("recording");
  }

  stop() {
    console.log("## Calling stop()")
    this.recorder.stop();
    this.updateState("recorded")
  }

  play() {
    console.log("## Calling play()")
    console.log("Sound file:", this.soundFile)
    this.soundFile.play();

    this.updateState("playing");

    console.log("TODO: Set state back to 'recorded' once playback finishes.")
  }
}

export {RecorderInterface}