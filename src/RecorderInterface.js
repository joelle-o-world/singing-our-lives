

/** Ordered list of MIME types. The recorder will choose the first type in the list that is supported by the MediaStream. */
const mimePriorities = [
  'audio/vnd.wave',
  'audio/wave',
  'audio/wav',
  'audio/x-wav',
  'audio/webm',
]

let mediaRecorder;
class RecorderInterface {
  constructor() {

    this.onrecord = null;

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
    this.recorderBody.className = 'sol_RecorderInterface';

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

    //append all elements to the recorderBody:
    this.recorderBody.appendChild(this.recordbutton);
    this.recorderBody.appendChild(this.stoprecordingbutton);
    return this.recorderBody;
  }

  /** Hide and show buttons dending upon the new state. */
  updateState(state) {
    if(state) {
      this.state = state;

      switch(state) {
        case 'waiting':
          this.recordbutton.innerText = "Start Recording";
          this.recordbutton.disabled = false;
          this.stoprecordingbutton.disabled = true;
          break;

        case 'requestingAudio':
          this.recordbutton.innerText = "Please enable microphone..";
          this.recordbutton.disabled = true;
          this.stoprecordingbutton.disabled = true;
          break;

        case 'recording':
          this.recordbutton.innerText = 'Recording...'
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
  }

  record() {
    console.log("## Calling record()");
    this.updateState("requestingAudio");

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {//Check whether getUserMedia is supported by the browser before running anything else
      console.log('## getUserMedia supported.');//Print if it is supported

      navigator.mediaDevices.getUserMedia ({
        audio: true,
        video: false
      })//returns a promise
      .then(stream => { //execute if successful

        this.updateState('recording');
        console.log("## Stream sucessfully established. Recording...");
        let audioElement = document.getElementById('recorderAudio');

        let mimeType = undefined;
        for(let mime of mimePriorities)
          if(MediaSource.isTypeSupported(mime)) {
            mimeType = mime;
            break;
          }

        // pass the stream into new MediaRecorder()
        mediaRecorder = new MediaRecorder(
          stream,
          {mimeType},
        );

        /** array to store audio chunks */
        let chunks = [];

        mediaRecorder.start(); //start recording

        //event handler, executed whenever new data is available from the MediaRecorder
        mediaRecorder.addEventListener('dataavailable', e => {
          console.log('## data available', e.data.type);
          chunks.push(e.data);
        })

        //event handler, executed when MediaRecorder.stop() is called:
        mediaRecorder.addEventListener('stop', e => {
          console.log('## mediaRecorder.onstop event ocurred.');
          let mime = chunks[0].type;
          if(chunks.some(chunk => chunk.type != mime))
            throw "Something bad happened.";

          let blob = new Blob(chunks, {type: mime});
          if(this.onrecord){
            this.onrecord(blob);
          } else
            console.warn('no behaviour defined for handling new recordings.')

        })
      })
      .catch(function(err) {//execute if error
        console.error('The following getUserMedia error occured: ' + err);
      });
    } else {
      console.error('getUserMedia not supported on your browser!'); //Print if getUserMedia is not supported
    }

  }

  stop() {
    console.log("## Calling stop()");
    mediaRecorder.stop();
    this.updateState("recorded");
  }
}

export {RecorderInterface}
