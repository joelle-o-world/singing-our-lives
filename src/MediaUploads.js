import {PlaybackInterface} from "./PlaybackInterface";


class MediaUploads{
  constructor({includeSendButton=false}={}){
    this.blobs = [];

    this.includeSendButton = includeSendButton;

    this.makeHTML();

    this.onupload = null;
  }

  makeHTML(){
    //make div body for whole element
    this.mediaUploadsBody = document.createElement('div');
    this.mediaUploadsBody.id = 'media_uploads_body';

    this.heading = document.createElement('h1');
    this.heading.id = 'media_heading';
    this.heading.innerHTML = 'Upload an image of yourself (optional):';

    this.playbacksDiv = document.createElement('div');
    this.playbacksDiv.id = 'playbacksDiv';

    //make a new file button:
    this.uploadFileButton = document.createElement('input');
    this.uploadFileButton.type = 'file';
    this.uploadFileButton.id = 'uploadFileButton';
    this.uploadLabel = document.createElement('label');
    this.uploadLabel.id = 'uploadLabel';
    this.uploadLabel.className = 'recorderButton';
    this.uploadLabel.htmlFor = 'uploadFileButton';
    this.uploadLabel.innerHTML = 'Upload an image';
    this.uploadFileButton.addEventListener('change',() => this.fileUploaded());

    //make an upload button:
    this.sendButton = document.createElement('button');
    this.sendButton.innerText = 'Send files';
    this.sendButton.className = 'recorderButton';
    this.sendButton.addEventListener('click', () => this.upload());

    //add buttons and test to main body:
    this.mediaUploadsBody.appendChild(this.heading);
    this.mediaUploadsBody.appendChild(this.uploadFileButton);
    this.mediaUploadsBody.appendChild(this.uploadLabel);
    this.mediaUploadsBody.appendChild(this.playbacksDiv);
    if(this.includeSendButton)
      this.mediaUploadsBody.appendChild(this.sendButton);


    //return the main body:
    return this.mediaUploadsBody;
  }

  newFile(file){
    // add the new blob to the array
    this.blobs.push(file);

    if(file.type.slice(0,5) == "audio"){
      console.log("it's an audio blob");
      // make a playback interface to display the blob to the user
      let player = new PlaybackInterface(file, this);
      this.playbacksDiv.appendChild(player.makeHTML());
    }

    else if (file.type.slice(0,5) == 'image'){
      console.log('User uploaded image:');
      console.log(file);
      let filereader = new FileReader();
      filereader.addEventListener('load',() => this.addImg(filereader.result));
      filereader.readAsDataURL(file);
    }

    else {
      console.log("it ain't audio or an image!");
    }
  }

  addImg(readerresult){
    let imgWrap = document.createElement('div');
    imgWrap.className = 'img_display_wrapper';

    let img = document.createElement('img');
    img.className = 'img_display_img';
    img.src = readerresult;

    imgWrap.appendChild(img);
    this.playbacksDiv.appendChild(imgWrap);
  }

  fileUploaded(){
    let files = this.uploadFileButton.files;
    for(let i = 0; i < files.length; i++){
      this.newFile(files[i]);
    }
    //clear the <input> after upload:
    this.uploadFileButton.value = "";
  }

  upload(){
    //Need to filter these, but I don't understand how
    //the filtering section of RecorderInterface.upload() works
    console.log('Sending Files');
    let blobsToUpload = this.blobs;
    if(this.onupload){
      this.onupload(blobsToUpload);
    }
    this.sendButton.innerText = 'Files sent';
  }
}

export{MediaUploads}
