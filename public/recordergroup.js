class RecorderGroup{
  constructor(){
    this.rg = new Recorder();
    this.parent;
    this.testDIV;
  }

  makeHTML(){
    this.parent = document.getElementById('recorderGroupWrapper');

    this.testDIV = document.createElement('div');
    this.testDIV.id = 'recorderWrapper';

    this.parent.appendChild(this.testDIV);

    this.rg.makeHTML();
  }
}
