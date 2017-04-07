 "use strict";

document.addEventListener("DOMContentLoaded", main);

function loadToCanvas(img){
    var canvas = img.nextElementSibling;
    canvas.height = img.clientHeight;
    canvas.width = img.clientWidth;
    img.style.display = "none";
    var canvasCtxt = canvas.getContext("2d");
    canvasCtxt.drawImage(img,0,0);
}
function main(){
};