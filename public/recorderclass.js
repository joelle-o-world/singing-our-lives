class Recorder{
  constructor(){
    this.recorderBody;
    this.startStopButton;
  }

  makeHTML(){
    //create a new div to contain the HTML for this object:
    this.recorderBody = document.createElement('div');
    //give it a class name to stylize it later:
    this.recorderBody.className = 'recorderBody';

    //add a button to the recorderBody:
    this.startStopbutton = document.createElement('button');
    this.startStopbutton.className = 'recorderButton';
    this.startStopbutton.innerHTML = 'Start Recording';

    this.recorderBody.appendChild(this.startStopbutton);
  }
}
// modules.exports = Recorder;
