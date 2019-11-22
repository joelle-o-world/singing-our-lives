import { MediaInterface } from "./MediaInterface";


class MediaUploads{
  constructor(){
    this.items = [];

    this.makeHTML();

    this.onupload = null;
  }

  makeHTML(){
    //make div body for whole element
    this.div = document.createElement('div');
    this.div.id = 'media_uploads_body';

    this.mediaList = document.createElement('div');
    this.mediaList.id = 'playbacksDiv';

    //add buttons and test to main body:
    this.div.appendChild(this.mediaList);

    //return the main body:
    return this.div;
  }

  add(blob) {
    try {
      let item = new MediaInterface(blob);
      this.items.push(item);
      this.mediaList.appendChild(item.makeHTML())

    } catch(err) {
      console.error(err)
    }
  }

  clear() {
    while(this.mediaList.firstChild)
      this.mediaList.removeChild(this.mediaList.firstChild);

    this.items = [];
  }

  get blobs() {
    return this.items
      .filter(media => media.enabled)
      .map(media => media.blob);
  }
}

export{MediaUploads}
