seajs.config({
    alias:{
        "a.js":"a"
    }

})

seajs.use(["a.js"],function(a){
  
  
   a.dosome()


})













