import { MediaInterface } from "./MediaInterface";


class MediaUploads{
  constructor(){
    this.items = [];

    this.makeHTML();

    this.onupload = null;
    this.onupdate = null;
  }

  makeHTML(){
    //make div body for whole element
    this.div = document.createElement('div');
    this.div.className = 'sol_MediaUploads';

    this.header = document.createElement('h2');
    this.header.innerText = 'Your uploads:';

    this.mediaList = document.createElement('div');

    this.nothing = document.createElement('div')
    this.nothing.className = 'nothing'
    this.nothing.innerHTML = "You haven't uploaded anything yet..."

    //add buttons and test to main body:
    this.div.appendChild(this.header);
    this.div.appendChild(this.mediaList);
    this.div.appendChild(this.nothing);

    this.update();

    //return the main body:
    return this.div;
  }

  update() {
    if(this.items.length) {
      this.nothing.hidden = true;
      this.mediaList.hidden = false;
    } else {
      this.nothing.hidden = false;
      this.mediaList.hidden = true;
    }

    if(this.onupdate)
      this.onupdate();
  }

  add(blob) {
    try {
      let item = new MediaInterface(blob);
      this.items.push(item);
      this.mediaList.appendChild(item.makeHTML())

    } catch(err) {
      console.error(err)
    }

    this.update();
  }

  clear() {
    while(this.mediaList.firstChild)
      this.mediaList.removeChild(this.mediaList.firstChild);

    this.items = [];

    this.update();
  }

  get blobs() {
    return this.items
      .filter(media => media.enabled)
      .map(media => media.blob);
  }

  get nChecked() {
    return this.blobs.length;
  }

  get headerText() {
    if(this.header)
      return this.header.innerText;
    else return null
  }

  set headerText(str) {
    // Call makeHTML to make sure header exists
    this.makeHTML();

    this.header.innerText = str;
  }
}

export{MediaUploads}
