 "use strict";

document.addEventListener("DOMContentLoaded", main);

function main(){
    var edit_button = document.getElementById("md-edit-button");
    var editor = edit_button.parentElement;
    var text = document.getElementById("orig-md");
    text.style.display = "none";

    edit_button.addEventListener("click",function(){
        //toggle css
        editor.style.transform = editor.style.transform != "none" ? "none" : "translateY(260px)";
        text.style.display = text.style.display != "none" ? "none" : "";
    });
};