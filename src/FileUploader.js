class FileUploader{
  constructor(file) {
    this.makeHTML();
  }

  makeHTML(){
    //new div to contain HTML elements:
    this.fileUploadBody = document.createElement('div');
    //give the new div a class name:
    this.fileUploadBody.className = 'file_upload_body';

  }
}

export {FileUploader}
