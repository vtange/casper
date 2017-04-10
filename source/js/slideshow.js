function Slideshow(element){
    this.slides = [];//[{mini:<img>,real:<img>}]stores images
    this.currentIdx = null;
    this.offsets = {x:0,y:0};
    this.centerBias = {x:50,y:50};
    this.canvas = element;
    this.cxt = element.getContext("2d");
}

var _SS = new Slideshow(document.getElementById("slideshow"));

window.addEventListener("resize",function(){
    if(_SS.currentIdx != null)
        _SS.load(_SS.currentIdx);
});

function loadToSlideshow(img, idx){
    var src = img.getAttribute("src");
    var realsrc = img.getAttribute("real-src");
    var ctr_x = img.getAttribute("ctr-x");
    var ctr_y = img.getAttribute("ctr-y");

    if(!_SS.slides[idx])
    {
        _SS.slides[idx] = _SS.createSlide();
    }
    _SS.slides[idx].mini = img;
    _SS.slides[idx].ctr_x = ctr_x;
    _SS.slides[idx].ctr_y = ctr_y;
    img.style.display = "none";
}

function loadMulti(imgSrc, idx){
    if(!_SS.slides[idx])
    {
        _SS.slides[idx] = _SS.createSlide("multi");
    }

    _SS.slides[idx].arrImgs.push({src:imgSrc,img:null});
}

Slideshow.prototype.createSlide = function(type){
    if(type == "multi")
    {
        return {
            arrImgs: []
        }
    }
    else{
        return {
            mini:null,
            real:null,
            ctr_x:0,
            ctr_y:0
        };
    }
}

Slideshow.prototype.resize = function(img){
    //get ratio of canvas
    var canvasRatio = this.canvas.clientWidth / this.canvas.clientHeight;
    var imageRatio = img.width/img.height;
    var offsets = this.offsets;
/*--
1000
[  2.0  ]500

600
[   ]400 -> 300
*/

    if(canvasRatio > imageRatio)
    {
        this.canvas.width = img.width;
        this.canvas.height = img.width/canvasRatio;
    }
    else if(canvasRatio < imageRatio)
    {
        this.canvas.width = img.height*canvasRatio;
        this.canvas.height = img.height;
    }

    offsets.y = Math.min(0,-(img.height-this.canvas.height)*this.centerBias.y/100);
    offsets.x = Math.min(0,-(img.width-this.canvas.width)*this.centerBias.x/100);
    return offsets;
}

Slideshow.prototype.load = function(index){
    var tis = this;
    var cover = document.getElementById("slideshow-cover");
    var slide = this.slides[index];
    var isReload = this.currentIdx == index;
    this.currentIdx = index;

    if(slide.mini)
    {
        //set centerBias for slide offset
        this.centerBias.x = parseInt(slide.ctr_x,10);
        this.centerBias.y = parseInt(slide.ctr_y,10);

        if(slide.real)
        {
            //overwrite canvas with div
        }
        else
        {
            this.drawSingle(slide.mini);

            //begin loading real size image
            slide.real = new Image();
            slide.real.src = slide.mini.getAttribute("real-src");
            slide.real.onload = function(){
                //overwrite canvas with div
            }.bind(this);
        }
    }
    else
    {
        if(!isReload)
        {
            slide.arrImgs.forEach(function(imgObj,index){
                tis.drawMulti(imgObj,index,cover);
            });
        }
    }
}

Slideshow.prototype.drawSingle = function(img)
{
    //resize to prep for slides
    this.offsets = this.resize(img);

    //draw
    this.cxt.drawImage(img,this.offsets.x,this.offsets.y);
}

Slideshow.prototype.drawMulti = function(imgObj, index, cover)
{
    var yPos = [600, 290, 395, 640, 500, 300, 650, 240, 545, 410, 700, 260];
    var scale = [];

    //build divs with images
    var div = document.createElement("div");
    div.classList.add("img-floaty");
    div.style.backgroundImage = "url("+imgObj.src+")";
    div.style.left = 100*(this.canvas.clientWidth/this.slides[this.currentIdx].arrImgs.length*(index-0.5))/this.canvas.clientWidth+"%";
    cover.appendChild(div);
    window.setTimeout(function(){
        div.style.opacity = 1;
        div.style.transform = "translateY(-"+yPos[index]+"px)";
    },30*index);
}