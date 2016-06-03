window.onload = function () {
    slide = new Slide(".pageBox");
    slide.init()

}



function Slide(slideBox) {
    this.slideBox = document.querySelector(slideBox);
    //最大父级
    this.slideC = this.slideBox.querySelector("ul");
    //翻页内容
    this.page = this.slideC.querySelectorAll("li");
    //页
    this.pageHeight = document.documentElement.offsetHeight;
    //屏幕高度
    this.pageNum = this.page.length;
    //总页数
    this.indexPage = 0;
    this.indexPosY = 0;
    //初始偏离
    this.switch = true;
    this.animateTime = "0.3s ease-out"

}

Slide.prototype.init = function () {
    //样式初始化
    this.slideBox.style.height = this.pageHeight + "px";
    this.slideC.style.height = (this.pageHeight * this.pageNum) + "px";
    for (var i = 0; i < this.pageNum; i++) {
        this.page[i].style.height = this.pageHeight + "px";

    }
    this.touch();

}


Slide.prototype.touch = function () {
    var _this = this;

    this.addEvent(this.slideBox, "touchstart", function () {
        _this.touchStart()
    });
    this.addEvent(this.slideBox, "touchmove", function () {

        _this.touchMove()

    });



    this.addEvent(this.slideBox, "touchend", function () {

        _this.touchEnd()
    })
}

Slide.prototype.touchStart = function (ev) {

    var oEvent = window.event || ev;
    oEvent.preventDefault();
    var touch = oEvent.changedTouches[0];

    //console.log(this)
    this.moveTouchX = this.startTouchX = touch.pageX;
    this.moveTouchY = this.startTouchY = touch.pageY;
     this.slideC.style.webkitTransition = "none";
    // var re = /-\d+|\d+/g;
    // this.indexPosY = re.exec(this.slideC.style.webkitTransform) || 0;
    //取属性里出现的自然数
}



Slide.prototype.touchMove = function (ev) {
    var oEvent = window.event || ev;
    var touch = oEvent.changedTouches[0];
    this.moveTouchX = touch.clientX;
    this.moveTouchY = touch.clientY;
    this.dVal = this.indexPosY - (this.startTouchY - this.moveTouchY);
                // 当前位置-(触摸初始位置-触摸到的位置)=移动的距离
    if(this.dVal<-((this.pageNum-1)*this.pageHeight)){
        this.dVal=-((this.pageNum-1)*this.pageHeight)
    }else if(this.dVal>0){
         this.dVal=0
        }

    //this.slideC.style.webkitTransform = "translateY(" + () + "px)";
   
    this.slideC.style.webkitTransform = 'translate3d(0,' + this.dVal + 'px,0)';

}



Slide.prototype.touchEnd = function () {
    var _this = this;
    if (this.startTouchY - this.moveTouchY <= -50) {
        // alert(1)// 向下划
        this.switch = false;
        this.indexPage--;
        if (this.indexPage < 0) {
            this.indexPage = 0
        }

        this.slideC.style.webkitTransition = this.animateTime;
        this.slideC.style.webkitTransform = 'translate3d(0,' + (this.pageHeight * -this.indexPage) + 'px,0)';
        

        this.addEvent(this.slideC, "webkitTransitionEnd", function () {

            this.style.webkitTransition = "none";
            _this.switch = true;

        })

    } else if (this.startTouchY - this.moveTouchY >= 50) {
        //  alert(-1)//向上划
        this.switch = false;
        this.indexPage++;
        if (this.indexPage >= this.pageNum - 1) {
            this.indexPage = this.pageNum - 1;
        }


        this.slideC.style.webkitTransition = this.animateTime;
        this.slideC.style.webkitTransform = 'translate3d(0,' + (this.pageHeight * -this.indexPage) + 'px,0)';
        this.addEvent(this.slideC, "webkitTransitionEnd", function () {

            this.style.webkitTransition = "none";
            _this.switch = true;

        })

    } else {
        // alert(0) //不动
        this.switch = false;
        this.slideC.style.webkitTransition = this.animateTime;
        this.slideC.style.webkitTransform = 'translate3d(0,' + (this.pageHeight * -this.indexPage) + 'px,0)';
        this.addEvent(this.slideC, "webkitTransitionEnd", function () {

            this.style.webkitTransition = "none";
            _this.switch = true;

        })
    }

    this.indexPosY = this.pageHeight * -this.indexPage;
    //删除事件
    this.delEvent(this.slideBox, "touchstart");
    this.delEvent(this.slideBox, "touchMove")

}


Slide.prototype.addEvent = function (ele, ev, fn) {
    if (ele.addEventListener) {

        ele.addEventListener(ev, fn, false);
    } else if (ele.attachEvent) {
        ele.attachEvent("on" + ev, fn);
    }

}


Slide.prototype.delEvent = function (ele, ev, fn) {
    if (window.removeEventListerner) { // 标准浏览器

        ele.removeEventListerner(ev, fn, false);

    } else if (window.detachEvent) { // IE浏览器

        ele.detachEvent("on" + ev, fn);
    }


}