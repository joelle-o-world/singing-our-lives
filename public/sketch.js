//Global variables:
let rg;//instance of RecorderGroup()

var pages = [ //array containing references to divs containing pages
  document.getElementById("page1"),
  document.getElementById("page2"),
  document.getElementById("page3"),
];

//main setup:
function setup(){
  rg = new RecorderGroup();
  rg.makeHTML();
}


//functions:
function openPage(n) {
  for(let page of pages) {
    page.hidden = true;
  }
  pages[n].hidden = false;
}
