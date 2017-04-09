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
            this.drawSingle(slide.real);
        }
        else
        {
            this.drawSingle(slide.mini);

            //begin loading real size image
            slide.real = new Image();
            slide.real.src = slide.mini.getAttribute("real-src");
            slide.real.onload = function(){
                this.load(slide);
            }.bind(this);
        }
    }
    else
    {
        //standard canvas width
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        
        //if first draw
        if(!isReload)
        {
            slide.arrImgs.forEach(function(imgObj,index){
                if(!imgObj.img)
                {
                    imgObj.img = new Image();
                    imgObj.img.src = imgObj.src;
                    imgObj.img.onload = function(){
                        tis.drawMulti(imgObj,index);
                    }
                }
                else
                {
                    tis.drawMulti(imgObj,index);
                }

            });
        }
        else
        {


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

Slideshow.prototype.drawMulti = function(imgObj, index)
{
    var yPos = [400, 90, 195, 440, 300, 100, 450, 40, 345, 210, 500, 60];
    var scale = [];

    //load/animate images (275 tall 400 wide)
    window.setTimeout(function(){
        //save blank state
        this.cxt.save();

        //set transforms
        var now = Date.now();
        var animDurr = 1500;//1.5sec
        this.cxt.translate(0,-100-yPos[index]);
        this.cxt.shadowColor = 'rgba(0,0,0,0.1)';
        this.cxt.shadowBlur = 20;
        this.cxt.shadowOffsetX = 15;
        this.cxt.shadowOffsetY = 15;

        //draw
        this.cxt.drawImage(
            imgObj.img,
            this.canvas.width/this.slides[this.currentIdx].arrImgs.length*(index-0.5),
            this.canvas.height-100
        );

        //rdy for next img
        this.cxt.restore();
    }.bind(this),60*index);
}