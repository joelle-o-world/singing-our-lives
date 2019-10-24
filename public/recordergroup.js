class RecorderGroup{
  constructor(parentID){
    this.num_recorders = 1;
    this.recorders = [this.num_recorders];
    for(let i = 0; i < this.num_recorders; i++){
      this.recorders[i] = new Recorder();
    }
    this.parent = document.getElementById(parentID);
  }

  makeHTML(){
    for(let i = 0; i < this.num_recorders; i++){
      this.parent.appendChild(this.recorders[i].makeHTML());
    }
  }
}
