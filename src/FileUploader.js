class FileUploader{
  constructor(file) {
    this.makeHTML();
  }

  makeHTML(){
    //new div to contain HTML elements:
    this.fileUploadBody = document.createElement('div');
    //give the new div a class name:
    this.fileUploadBody.className = 'file_upload_body';


    //make a file upload input:
    this.fileupload = document.createElement('input');
    this.fileupload.type = 'file';
    this.fileupload.className = 'fileUpload';
    this.fileupload.addEventListener('change',() => this.uploaded());

    return this.fileUploadBody;
  }

  uploaded(){
    if('files' in this.fileUpload){
      if(this.fileUpload.files.length != 0){
        console.log('there are files');
      } else {
        console.log('there are no files');
      }
    }
  }
}

export {FileUploader}
