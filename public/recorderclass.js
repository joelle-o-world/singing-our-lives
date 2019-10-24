class Recorder{
  constructor(parentID,index){
    this.parent = document.getElementById(parentID);
    this.recorderBody;
    this.recordbutton;
    this.playbackbutton;

    this.state = 0;
    this.index = index;
  }


  makeHTML(){
    //create a new div to contain the HTML for this object:
    this.recorderBody = document.createElement('div');
    //give it a class name to stylize it later:
    this.recorderBody.className = 'recorder_body';

    //create a record button:
    this.recordbutton = document.createElement('button');
    this.recordbutton.className = 'recorderButton';
    this.recordbutton.id = 'recorderButton' + this.index;
    this.recordbutton.innerHTML = 'Start Recording';

    //create a playback button:
    this.playbackbutton = document.createElement('button');
    this.playbackbutton.className = 'recorderButton';
    this.playbackbutton.innerHTML = 'Play Recording';


    //append all elements to the recorderBody:
    this.recorderBody.appendChild(this.recordbutton);
    this.recorderBody.appendChild(this.playbackbutton);
    this.parent.appendChild(this.recorderBody);
  }
}
