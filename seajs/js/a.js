seajs.config({
    alias:{
        "jQuery":"jquery-2.1.1.min"
    }

})
define(function(require,exports,module){
    
    require("jquery");
      
    exports.dosome=function(){
   
        $("body").css("background","#000");
    
    }
    

})






/*seajs.config({
    alias:{
        "jQuery":"http://code.jquery.com/jquery-2.1.1.min.js"

}

})

define("a.js",["jQuery"],function(require,exports,module){


    exports.dosome=function(){
        
   $("body").css("background","#000");
   
    
    }
})// 性能不好*/













