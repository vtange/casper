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
        _SS.load(_SS.slides[_SS.currentIdx]);
});

function loadToSlideshow(img){
    var src = img.getAttribute("src");
    var realsrc = img.getAttribute("real-src");
    var ctr_x = img.getAttribute("ctr-x");
    var ctr_y = img.getAttribute("ctr-y");
    var idx = _SS.slides.length;
    _SS.slides.push({
        mini:img,
        real:null,
        ctr_x:ctr_x,
        ctr_y:ctr_y
    });
    img.style.display = "none";

    //if null currentIdx, idx = 0, and loadSlide
    if(_SS.currentIdx == null)
    {
        _SS.currentIdx = 0;
        _SS.load(_SS.slides[_SS.currentIdx]);
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

Slideshow.prototype.load = function(slide){
    this.centerBias.x = parseInt(slide.ctr_x,10);
    this.centerBias.y = parseInt(slide.ctr_y,10);
    if(slide.real)
    {
        this.draw(slide.real);
    }
    else
    {
        this.draw(slide.mini);

        //begin loading real size image
        slide.real = new Image();
        slide.real.src = slide.mini.getAttribute("real-src");
        slide.real.onload = function(real){
            this.load(slide);
        }.bind(this);
    }
}

Slideshow.prototype.draw = function(img)
{
    //resize to prep for slides
    this.offsets = this.resize(img);

    //draw
    this.cxt.drawImage(img,this.offsets.x,this.offsets.y);
}