class ImgDisplay{
  constructor(imgUrl) {
    this.makeHTML();
    this.imgUrl = imgUrl;
  }

  makeHTML(){
    this.imgWrap = document.createElement('div');
    this.imgWrap.className = 'img_display_wrapper';

    this.img = document.createElement('img');
    this.img.id = 'img_display_img';
    console.log(this.imgUrl);

    this.imgWrap.appendChild(this.img);
    return this.imgWrap;
  }

  loadImg(){

  }
}

export {ImgDisplay}
