import { EventEmitter } from "events";

export class FilePicker {
  constructor() {
    this.makeHTML();
  }
  
  makeHTML() {
    if(this.div)
      return this.div;

    this.div = document.createElement('div');
    this.div.className = 'sol_FilePicker';

    let label = document.createElement('label');
    label.className = 'recorderButton';
    label.htmlFor = 'uploadFileButton';
    label.innerHTML = 'Upload a file';
    label.addEventListener('click', () => this.button.click())
    
    this.button = document.createElement('input');
    this.button.type = 'file';
    this.button.addEventListener(
      'change',
      event => this.handleFilePick(event)
    );

    this.div.appendChild(label)
    label.appendChild(this.button);
  }

  handleFilePick(e) {
    for(let file of this.button.files)
      if(this.onpick)
        this.onpick(file);
  }
}