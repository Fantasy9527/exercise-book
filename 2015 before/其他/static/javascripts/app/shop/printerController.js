define(["shopApp", "ractivePackage"], function(app) {
  app.controller("printerController", ["$scope", "$http", "$location", function($scope, $http, $location) {
    var models, printerTypes, states
   var ractive = new Ractive({
     el: '#container',
     template: '#tpl',
     data: {
       models: [],
       editing: -1,
       editingModelDefault: {
         ipPort: 9100,
         baudRate: 19200,
         serialPort: 'ttyS1',
         printerType: 1,
         printerWidth: 1,
         state: 1
       },
       readOnly: function(type, expect) {
         return type == expect ? 'readOnly' : ''
       }
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
   $.get('/home/brand/'+brandId+'/shop/'+shopId+'/printers').done(function(data) {
     models = data.models
     printerTypes = data.printerTypes
     states = data.states
     printerWidths=data.printerWidths
     ractive.set('models', models)
     ractive.set('printerTypes', printerTypes)
     ractive.set('printerWidths', printerWidths)
     ractive.set('states', states)
     ractive.fire('Refresh')
   }).fail(function(xhr) {
     Warning(xhr)
   })
   ractive.on('OnAddModel', function(event) {
     this.set('editing', 0)
     var add = jQuery.extend(true, {}, this.get('editingModelDefault'))
     add.name = ''
     this.set('editingModel', add)
     this.update('editingModel')
     $('#model-name').focus()
   })
   ractive.on('OnSaveModel', function(event, id) {
     if (!Validate('#form')) {
       return
     }
     var self = this
     self.updateModel()
     var editing = self.get('editing')
     var add = self.get('editingModel')
     if (add.printerType == 1) {
       add.serialPort = null
       add.baudRate = null
     }
     if (add.printerType == 2) {
       add.ip = null
       add.ipPort = null
     }
     if (editing == 0) { // add
       Post('/home/brand/'+brandId+'/shop/'+shopId+'/printer', add).done(function(data) {
         models.push(data)
         self.update('models')
         self.set('editing', -1)
       }).fail(function(xhr) {
         Warning(xhr)
       })
     } else { // save
       Post('/home/brand/'+brandId+'/shop/'+shopId+'/printer/'+ id, add).done(function(data) {
         for (var i = 0; i < models.length; i++) {
           if (models[i].id == data.id) {
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
     this.set('editingModel', model)
     $('#model-name').focus()
   })
   ractive.on('OnRemoveModel', function(event) {
     var self = this
     var editing = self.get('editing')
     var url = '/home/brand/'+brandId+'/shop/'+shopId+'/printer/' + editing
     Remove(url).done(function(data) {
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
