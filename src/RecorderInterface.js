//October 27, 2019
//Rewriting RecorderInterface using Mozilla MediaStream Recorder API
//https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API
var mediaRecorder;
var audio_samples = [];
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
      navigator.mediaDevices.getUserMedia (
        {
          audio: true
        })

        .then(function(stream) { //execute if successful
          console.log("## Stream sucessfully established. Recording...");

          mediaRecorder = new MediaRecorder(stream);//pass the stream into new MediaRecorder()

          mediaRecorder.start();//start recording



          //event handler, executed whenever new data is available from the MediaRecorder
          mediaRecorder.ondataavailable = function(e){//***this is only being called once?? so this still doesn't work
            console.log('dataavailable');
            audio_samples.push(e.data);
          }

          //event handler, executed when MediaRecorder.stop() is called:
          mediaRecorder.onstop = function(e){
            console.log('## mediaRecorder.onstop event ocurred.');
            console.log('audio_samples.length: ' + audio_samples.length);
            //make an audio element to hold the recorded stream:

            //test: automatically download the recorded audio when stream is stopped:
            var blob = new Blob(audio_samples, { 'type' : 'audio/ogg; codecs=opus' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = "test.webm";
            a.click();
            window.URL.revokeObjectURL(url);
          }

        }

      })

      .catch(function(err) {//execute if error
        console.log('The following getUserMedia error occured: ' + err);
      }
    );
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
