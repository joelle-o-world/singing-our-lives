class PlaybackInterface {
  constructor(audioBlob, parentRecorder) {
    this.parentRecorder = parentRecorder;
    this.audioBlob = audioBlob;
    this.enabled = true;

    this.makeHTML();
  }

  makeHTML() {
    // Exit early if div already exists
    if(this.div)
      return this.div;

    // Create div
    this.div = document.createElement('div');
    this.div.className = "sol_playback";

    // Create enabled check box
    let checkbox = document.createElement("input");
    checkbox.setAttribute('type', 'checkbox');
    checkbox.checked = this.enabled;
    checkbox.addEventListener('change', () => {
      this.enabled = checkbox.checked;
      if(this.parentRecorder)
        this.parentRecorder.updateState();
    });

    // Create audio
    this.audioElement = document.createElement('audio');
    this.audioElement.src = window.URL.createObjectURL(this.audioBlob);
    this.audioElement.controls = true;

    let deleteButton = document.createElement('button');
    deleteButton.innerText = 'discard';
    deleteButton.onclick = () => {
      this.enabled = false;
      if(this.div.parentElement)
        this.div.parentElement.removeChild(this.div);
      if(this.parentRecorder)
        this.parentRecorder.updateState();
    };

    this.div.appendChild(checkbox);
    this.div.appendChild(this.audioElement);
    this.div.appendChild(deleteButton);

    return this.div;
  }
}

export {PlaybackInterface};