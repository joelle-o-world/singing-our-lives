//October 27, 2019
//Rewriting RecorderInterface using Mozilla MediaStream Recorder API
//https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API
let mediaRecorder;
class RecorderInterface {
  constructor(){
    this.makeHTML();
    this.updateState("waiting");
    //parameters/constraints for the MediaStream
    this.constraints = {
      audio: true,
      video: false
    };
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

    //create an audio element to store recorded audio:
    this.audio = document.createElement('audio');
    this.audio.controls = false;
    this.audio.id = 'recorderAudio';

    //append all elements to the recorderBody:
    this.recorderBody.appendChild(this.recordbutton);
    this.recorderBody.appendChild(this.stoprecordingbutton);
    this.recorderBody.appendChild(this.playbackbutton);
    this.recorderBody.appendChild(this.audio);
    return this.recorderBody;
  }

  /** Hide and show buttons dending upon the new state. */
  updateState(state) {
    this.state = state;

    console.log("## updateState(", state, ")")

    switch(state) {
      case 'waiting':
      console.log("## state is waiting")
      this.recordbutton.innerText = "Start Recording";
      this.recordbutton.hidden = false;
      this.stoprecordingbutton.hidden = true;
      this.playbackbutton.hidden = true;
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
    console.log("## Calling record()");
    this.updateState('recording');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {//Check whether getUserMedia is supported by the browser before running anything else
      console.log('getUserMedia supported.');//Print if it is supported

      navigator.mediaDevices.getUserMedia (this.constraints)//returns a promise
      .then(function(stream) { //execute if successful
        console.log("## Stream sucessfully established. Recording...");
        let audioElement = document.getElementById('recorderAudio');

        mediaRecorder = new MediaRecorder(stream);//pass the stream into new MediaRecorder()
        let chunks = []; //array to store audio chunks

        mediaRecorder.start();//start recording



        //event handler, executed whenever new data is available from the MediaRecorder
        mediaRecorder.ondataavailable = function(e){
          console.log('data available');
          chunks.push(e.data);
        }

        //event handler, executed when MediaRecorder.stop() is called:
        mediaRecorder.onstop = function(e){
          console.log('## mediaRecorder.onstop event ocurred.');

          let blob = new Blob(chunks, {type: 'audio/wav;'});
          let audioURL = window.URL.createObjectURL(blob);//make a url for the created blob
          audioElement.src = audioURL;
          audioElement.controls = true;
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

  play() {
    console.log("## Calling play()")
    // console.log("Sound file:", this.soundFile)
    // this.soundFile.play();

    this.updateState("playing");

    console.log("TODO: Set state back to 'recorded' once playback finishes.")
  }
}

export {RecorderInterface}
