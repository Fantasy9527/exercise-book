define(["priceApp","ractivePackage"], function(app) {
  app.controller("minchargeController", ["$scope", "$http", "$location", "$state", function($scope, $http, $location, $state) {
    var models, tableTypes
   var ractive = new Ractive({
     el: "#container",
     template: "#tpl",
     data: {
       editing: -1
     }
   })
   function findModel(typeid) {
     for (var i = 0; i < models.length; i++) {
       var model = models[i]
       if (model.id == typeid) {
         return model
       }
     }
     return {}
   }
   $.get("/home/brand/"+brandId+"/price/"+priceId+"/mincharges").done(function(data) {
     models = data.models
     ractive.set("models", models)
   }).fail(function(xhr) {
     Warning(xhr)
   })
   ractive.on("OnEditModel", function(event, typeid) {
     var model = findModel(typeid)
     var editingModel = jQuery.extend(true, {}, model)
     if (editingModel._mincharge) {
       editingModel._editing = editingModel._mincharge
     } else {
       editingModel._editing = {value:0, tableType:model.id}
     }
     this.set("editingModel", editingModel)
     this.set("editing", typeid)
     $("#model-price").select()
     $("#model-price").focus()
   })
   ractive.on("OnSaveModel", function(event, id) {
     if (!Validate("#form")) {
       return
     }
     var self = this
     var model = self.get("editingModel")
     var url
     if (model._editing.id) {
       url = "/home/brand/"+brandId+"/price/"+priceId+"/mincharge/" + model._editing.id
     } else {
       url = "/home/brand/"+brandId+"/price/"+priceId+"/mincharge"
     }
     Post(url, model._editing).done(function(data) {
       findModel(data.tableType)._mincharge = data
       self.update("models")
     }).fail(function(xhr) {
       Warning(xhr)
     })
     self.set("editing", -1)
   })
   ractive.on("OnRemoveModel", function(event) {
     var self = this
     var model = self.get("editingModel")
     var url = "/home/brand/"+brandId+"/price/"+priceId+"/mincharge/" + model._editing.id
     Remove(url).done(function(data) {
       for (var i = 0; i < models.length; i ++) {
         if (models[i ].id === model.id) {
           models[i ]._mincharge = null
         }
       }
       self.update("models")
       self.set("editing", -1)
     }).fail(function(xhr) {
       Warning(xhr)
     })
   })
   ractive.on("OnCancelModel", function(event, id) {
     this.set("editing", -1)
   })
  }])
})
