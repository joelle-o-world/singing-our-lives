export class MediaInterface {
  constructor(blob) {
    if(!blob instanceof Blob)
      throw "MediaInterface expects a blob.";

    this.enabled = true;
    this.blob = blob;
    let [mime, codec] = blob.type.split(';');
    this.mediaKind = mime.split('/')[0];

    this.makeHTML();
  }

  makeHTML() {
    if(this.div)
      return this.div;

    // Create div
    this.div = document.createElement('div');
    this.div.className = "sol_MediaInterface";

    // Create enabled check box
    let checkbox = document.createElement("input");
    checkbox.setAttribute('type', 'checkbox');
    checkbox.checked = this.enabled;
    checkbox.addEventListener('change', () => {
      this.enabled = checkbox.checked;
      this.div.setAttribute('checked', this.enabled);
      if(this.parentMediaUploads)
        this.parentMediaUploads.updateState();
    });

    // Create media
    switch(this.mediaKind) {
      case 'audio':
        this.mediaElement = document.createElement('audio');
        this.mediaElement.src = window.URL.createObjectURL(
          this.blob
        );
        this.mediaElement.controls = true;
        break;

      case 'image':
        this.mediaElement = document.createElement('img');
        this.mediaElement.src = window.URL.createObjectURL(
          this.blob
        );
        break;


      default:
        throw `Unexpected media kind: ${this.mediaKind}`;
    }

    /*let deleteButton = document.createElement('button');
    deleteButton.innerText = 'discard';
    deleteButton.onclick = () => {
      this.enabled = false;
      if(this.div.parentElement)
        this.div.parentElement.removeChild(this.div);
      if(this.parentMediaUploads)
        this.parentMediaUploads.updateState();
    };*/

    this.div.appendChild(checkbox);
    this.div.appendChild(this.mediaElement);
    //this.div.appendChild(deleteButton);

    return this.div;
  }
}