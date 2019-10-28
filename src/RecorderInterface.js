import { PlaybackInterface } from "./PlaybackInterface";

//October 27, 2019
//Rewriting RecorderInterface using Mozilla MediaStream Recorder API
//https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API
let mediaRecorder;
class RecorderInterface {
  constructor(){
    this.recordings = [];
    
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

    // Create div for playback interfaces
    this.playbacksDiv = document.createElement('div');

    // Add an upload button
    this.uploadBtn = document.createElement('button');
    this.uploadBtn.className = 'recorderButton';
    this.uploadBtn.innerText = 'Send 0 recordings';
    this.uploadBtn.addEventListener('click', () => this.upload())

    //append all elements to the recorderBody:
    this.recorderBody.appendChild(this.recordbutton);
    this.recorderBody.appendChild(this.stoprecordingbutton);
    this.recorderBody.appendChild(this.playbacksDiv);
    this.recorderBody.appendChild(this.uploadBtn);

    return this.recorderBody;
  }

  /** Hide and show buttons dending upon the new state. */
  updateState(state) {
    if(state) {
      this.state = state;

      switch(state) {
        case 'waiting':
          console.log("## state is waiting")
          this.recordbutton.innerText = "Start Recording";
          this.recordbutton.disabled = false;
          this.stoprecordingbutton.disabled = true;
          break;

        case 'recording':
          this.recordbutton.disabled = true;
          this.stoprecordingbutton.disabled = false;
          break;

        case 'recorded':
          this.recordbutton.innerText = "Record again?"
          this.recordbutton.disabled = false;
          this.stoprecordingbutton.disabled = true;
          break;

        default:
          console.warn("Unknown state:", state);
      }
    }

    let nEnabledRecordings = this.recordings.filter(o => o.enabled).length
    this.uploadBtn.innerText = "Send " 
      +  nEnabledRecordings
      + " recordings";
    this.uploadBtn.disabled = nEnabledRecordings == 0;
  }

  record() {
    console.log("## Calling record()");
    this.updateState('recording');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {//Check whether getUserMedia is supported by the browser before running anything else
      console.log('## getUserMedia supported.');//Print if it is supported

      navigator.mediaDevices.getUserMedia ({
        audio: true,
        video: false
      })//returns a promise
      .then(stream => { //execute if successful
        console.log("## Stream sucessfully established. Recording...");
        let audioElement = document.getElementById('recorderAudio');

        mediaRecorder = new MediaRecorder(stream);//pass the stream into new MediaRecorder()
        let chunks = []; //array to store audio chunks

        mediaRecorder.start(); //start recording



        //event handler, executed whenever new data is available from the MediaRecorder
        mediaRecorder.ondataavailable = e => {
          console.log('## data available');
          chunks.push(e.data);
        }

        //event handler, executed when MediaRecorder.stop() is called:
        mediaRecorder.onstop = e => {
          console.log('## mediaRecorder.onstop event ocurred.');

          let blob = new Blob(chunks, {type: 'audio/wav;'});
          this.addPlayback(blob);
        }
      })
      .catch(function(err) {//execute if error
        console.log('The following getUserMedia error occured: ' + err);
      });
    } else {
      console.log('getUserMedia not supported on your browser!'); //Print if getUserMedia is not supported
    }

  }

  stop() {
    console.log("## Calling stop()");
    mediaRecorder.stop();
    this.updateState("recorded");
  }

  addPlayback(blob) {
    let player = new PlaybackInterface(blob, this);
    this.playbacksDiv.appendChild(player.makeHTML());
    this.recordings.push(player);

    this.updateState();
  }

  clearPlaybacks() {
    this.recordings = [];
    while(this.playbacksDiv.firstChild)
      this.playbacksDiv.removeChild(this.playbacksDiv.firstChild);

    this.updateState();
  }

  upload() {
    let blobsToUpload = this.recordings.filter(o => o.enabled)
      .map(o => o.audioBlob);
    
    console.log("## blobs to upload:", blobsToUpload);

    this.clearPlaybacks();
  }
}

export {RecorderInterface}
