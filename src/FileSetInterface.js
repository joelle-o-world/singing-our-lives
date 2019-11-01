import { FileUploadInterface } from "./FileUploadInterface";

class FileSetInterface(parentSet){
  constructor(){
    this.parentSet = parentSet;
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
export{FileSetInterface}
