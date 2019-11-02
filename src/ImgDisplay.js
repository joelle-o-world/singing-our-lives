class ImgDisplay{
  constructor(imgBlob) {
    this.makeHTML();
    this.imgBlob = imgBlob;
  }

  makeHTML(){
    this.imgWrap = document.createElement('div');
    this.imgWrap.className = 'img_display_wrapper';

    this.img = document.createElement('img');
    this.img.id = 'img_display_img';
    console.log('Blob in ImgDisplay:');
    console.log(this.imgBlob);

    let fr = new FileReader();
    // fr.addEventListener('load', () => this.loadImg());
    fr.readAsDataURL(this.imgBlob);

    this.imgWrap.appendChild(this.img);
    return this.imgWrap;
  }

  loadImg(){
    
  }
}

export {ImgDisplay}
