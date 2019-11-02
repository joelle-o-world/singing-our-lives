class MediaUploads(){
  constructor(){
    this.blobs = [];
    this.makeHTML();
  }

  makeHTML(){
    this.fileSetBody = document.createElement('div');
    this.fileSetBody.className = "file_set_body";
    //create a file upload input:
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
  }
}
export{MediaUploads}
