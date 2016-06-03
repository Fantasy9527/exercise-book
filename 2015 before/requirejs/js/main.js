require.config({
    paths:{
        zepto:"zepto.min",
        a:"a",
        b:"a"
    }
})





//require(["zepto"],function(){
//
//   $(".aaa").css("background","#000")
//})

require(["a"],function(a){
    a.dosome()


})

