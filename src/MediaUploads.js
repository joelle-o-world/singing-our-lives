import {PlaybackInterface} from "./PlaybackInterface";
import {FileUploader} from "./FileUploader";


class MediaUploads{
  constructor(){
    this.blobs = [];

    this.makeHTML();

    this.onupload = null;
  }

  makeHTML(){
    this.mediaUploadsBody = document.createElement('div');
    this.mediaUploadsBody.id = 'media_uploads_body';

    this.newFileButton = document.createElement('button');
    this.newFileButton.innerHTML = 'Upload File';

    this.mediaUploadsBody.appendChild(this.newFileButton);
    return this.mediaUploadsBody;
  }
  //look at type of blob, and make an html element for it depending on what it is
}

export{MediaUploads}
