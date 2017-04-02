 "use strict";

document.addEventListener("DOMContentLoaded", main);

function main(){
    var MontserratBold = new FontFaceObserver('MontserratBold');
    MontserratBold.load().then(function () {
        document.body.classList.add("MontserratBold");
    }, function () {
        console.log('Font MontserratBold is not available');
    });
    var MuseoSlab500 = new FontFaceObserver('MuseoSlab500');
    MuseoSlab500.load().then(function () {
        document.body.classList.add("MuseoSlab500");
    }, function () {
        console.log('Font MuseoSlab500 is not available');
    });
};