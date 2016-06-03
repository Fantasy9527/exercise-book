define(["shopApp", "ractivePackage"], function(app) {
  app.controller("printingController", ["$scope", "$http", "$location", function($scope, $http, $location) {
    var models, printers, kitchenPrintingTypes
   var ractive = new Ractive({
     el: '#container',
     template: '#tpl',
     data: {
       models: [],
       showingModels:[],
       editing: -1,
       addingModel: {}
     }
   })
   function filterModel(roleid) {
     var ret = []
     models.forEach(function(e) {
       if (roleid == -1 || e.role.id == roleid) {
         e.staff.forEach(function(ee){
           ret.push(ee)
         })
       }
     })
     return ret
   }
   function addModel(model) {
     models.forEach(function(e){
       if (e.role.id == model.role) {
         e.staff.push(model)
       }
     })
   }
   function findModel(modelid) {
     for (var i = 0; i < models.length; i++) {
       if (models[i].id == modelid) {
         return models[i]
       }
     }
     return undefined
   }
   function updateModel(models, model) {
     for (var i = 0; i < models.length; i++) {
       var role = models[i]
       for (var j = 0; j < role.staff.length; j++) {
         if (role.staff[j].id == model.id) {
           if (role.staff[j].role == model.role) {
             role.staff[j] = model
           } else {
             var r = role.staff.splice(j, 1)
             console.log(r)
             addModel(model)
           }
           return
         }
       }
     }
   }
   function updateShowingModels(showing, model) {
     for (var i = 0; i < showing.length; i++) {
       if (showing[i].id == model.id) {
         showing[i] = model
         return
       }
     }
   }
   // 获取模型数据
   $.get('/home/brand/'+brandId+'/shop/'+shopId+'/printings').done(function(data) {
     models = data.models
     printers = data.printers
     kitchenPrintingTypes = data.kitchenPrintingTypes
     ractive.set('models', models)
     ractive.set('printers', printers)
     ractive.set('kitchenPrintingTypes', kitchenPrintingTypes)
     ractive.fire('Refresh')
   }).fail(function(xhr) {
     Warning(xhr)
   })
   ractive.on('OnAddModel', function(event) {
     this.set('editing', 0)
     if (printers.length > 0) {
       this.set('addingModel.printer', printers[0].id)
     }
     $('#model-name').focus()
   })
   ractive.on('OnSaveModel', function(event, id) {
     if (!Validate('#form')) {
       return
     }
     var self = this
     self.updateModel()
     var editing = self.get('editing')
     var model = self.get('addingModel')
     if (!model.printer) {
       alert("请先选择打印机！")
       return
     }
     if (editing == 0) {
       Post('/home/brand/'+brandId+'/shop/'+shopId+'/printing', model).done(function(data) {
         models.unshift(data)
         self.update('models')
         self.set('editing', -1)
       }).fail(function(xhr) {
         Warning(xhr)
       })
     } else {
       Post('/home/brand/'+brandId+'/shop/'+shopId+'/printing/' + id, model).done(function(data) {
         for (var i = 0; i < models.length; i++) {
           if (models[i].id === id) {
             models[i] = data
             break
           }
         }
         self.update('models')
         self.set('editing', -1)
       }).fail(function(xhr) {
         Warning(xhr)
       })
     }
   })
   ractive.on('OnEditModel', function(event, id) {
     this.set('editing', id)
     var model = jQuery.extend(true, {}, findModel(id))
     this.set('addingModel', model)
     $('#model-name').focus()
   })
   ractive.on('OnRemoveModel', function(event) {
     var self = this
     var editing = self.get('editing')
     var url = '/home/brand/'+brandId+'/shop/'+shopId+'/printing/' + editing
     Remove(url).done(function(ok) {
       for (var i = 0; i < models.length; i++) {
         if (models[i].id === editing) {
           models.splice(i, 1)
           break
         }
       }
       self.set('editing', -1)
       self.update('models')
     }).fail(function(xhr) {
       Warning(xhr)
     })
   })
   ractive.on('OnCancelSave', function(event) {
     this.set('editing', -1)
   })
  }])
})
