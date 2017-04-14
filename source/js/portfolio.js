"use strict";
(function(){
var portfolio = document.querySelector(".works-marker");
var projects = document.getElementsByTagName("section")[0];
if(!portfolio||!projects){return;}
var gallery = portfolio.getElementsByTagName("img");
function createPopup(x,y, title, text){
    clearPopup();
    var pop = document.createElement("div");
    var titleEl = document.createElement("h5");
    var textEl = document.createElement("span");
    var arrow = document.createElement("i");
    var boxclose = document.createElement("a");
    boxclose.classList.add("boxclose");
    boxclose.addEventListener("click",clearPopup);
    arrow.classList.add("arrow");
    arrow.classList.add("up");
    titleEl.innerHTML = title;
    textEl.innerHTML = text;
    pop.id = "work-desc-popup";
    pop.classList.add("work-desc-popup");
    pop.style.top = y+25+"px";
    pop.style.left = x-35+"px";
    pop.appendChild(arrow);
    pop.appendChild(boxclose);
    pop.appendChild(titleEl);
    pop.appendChild(textEl);
    document.body.appendChild(pop);
    pop.classList.add("popup-anim");
}
function clearPopup(){
    var pop = document.getElementById("work-desc-popup");
    if(pop)
        document.body.removeChild(pop);
}
window.onresize = function(){
    clearPopup();
}
for(let i = gallery.length-1; i >= 0; i--)
{
    var img = gallery[i];
    var article = projects.querySelector("article[name="+img.getAttribute("alt")+"]");
    var title = article.getAttribute("title");
    var txt = article.innerText;
    (function(title,text){
        //prevent reference to last title, txt
        img.addEventListener("click",function(event){
            createPopup(event.pageX, event.pageY, title, text);
        });
    }(title,txt));
    img.addEventListener("blur",function(event){
        clearPopup();
    });
}
})();