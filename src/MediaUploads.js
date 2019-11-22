import {PlaybackInterface} from "./PlaybackInterface";
import { MediaInterface } from "./MediaInterface";


class MediaUploads{
  constructor({includeSendButton=false}={}){
    this.items = [];

    this.includeSendButton = includeSendButton;

    this.makeHTML();

    this.onupload = null;
  }

  makeHTML(){
    //make div body for whole element
    this.div = document.createElement('div');
    this.div.id = 'media_uploads_body';

    this.mediaList = document.createElement('div');
    this.mediaList.id = 'playbacksDiv';

    //make an upload button:
    this.sendButton = document.createElement('button');
    this.sendButton.innerText = 'Send files';
    this.sendButton.className = 'recorderButton';
    this.sendButton.addEventListener('click', () => this.upload());

    //add buttons and test to main body:
    this.div.appendChild(this.mediaList);
    if(this.includeSendButton)
      this.div.appendChild(this.sendButton);

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

  upload(){
    console.log(`Sending Files`);
    let blobsToUpload = this.items
      .filter(media => media.enabled)
      .map(media => media.blob);
    if(this.onupload){
      this.onupload(blobsToUpload);
      this.sendButton.innerText = 'Files sent';
    } else
      throw 'no behaviour defined for uploading files'
  }
}

export{MediaUploads}
