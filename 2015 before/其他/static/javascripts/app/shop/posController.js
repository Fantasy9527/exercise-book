define(["shopApp", "ractivePackage"], function(app) {
  app.controller("posController", ["$scope", "$http", "$location", function($scope, $http, $location) {
    var models, printers, displays
    var ractive = new Ractive({
      el: '#container',
      template: '#tpl',
      data: {
        models: [],
        editing: -1,
        editingModel: {}
      }
    })
    function findModel(modelid) {
      for (var i = 0; i < models.length; i++) {
        if (models[i].id == modelid) {
          return models[i]
        }
      }
      return undefined
    }
    function fillModel(model) {
      printers.forEach(function(e) {
        if (model.bind_printer_id == e.id) {
          model._bind_printer = e
        }
        if (model.use_printer_id == e.id) {
          model._use_printer = e
        }
      })
      displays.forEach(function(e) {
        if (model.guest_display_id == e.id) {
          model._guest_display = e
        }
      })
    }
    // 获取模型数据
    $.get('/home/brand/'+brandId+'/shop/'+shopId+'/poses').done(function(data) {
      models = data.models
      printers = data.printers
      displays = data.displays
      models.forEach(function(e) {
        fillModel(e)
      })
      ractive.set('models', models)
      ractive.set('printers', printers)
      ractive.set('displays', displays)
    }).fail(function(xhr) {
      Warning(xhr)
    })
    ractive.on('OnEditModel', function(event, id) {
      this.set('editing', id)
      if (id > 0) {
        var model = jQuery.extend(true, {}, findModel(id))
        this.set('editingModel', model)
      } else {
        this.set('editingModel.name', '')
      }
      this.update('editingModel')
      $('#model-name').focus()
    })
    ractive.on('OnSaveModel', function(event, id) {
      if (!Validate('#form')) {
        return
      }
      var self = this
      var editing = self.get('editing')
      var editingModel = self.get('editingModel')
      var url = '/home/brand/'+brandId+'/shop/'+shopId+'/pos'
      if (editing > 0) {
        url = url + '/' + id
      }
      Post(url, editingModel).done(function(data) {
        if (editing == 0) {
          models.unshift(data)
        } else {
          for (var i = 0;  i < models.length; i++) {
            if (models[i].id == data.id) {
              models[i] = data
            }
          }
        }
        fillModel(data)
        self.update('models')
        self.set('editing', -1)
      }).fail(function(xhr) {
        Warning(xhr)
      })
    })
    ractive.on('OnRemoveModel', function(event) {
      var self = this
      var editing = self.get('editing')
      var url = '/home/brand/'+brandId+'/shop/'+shopId+'/pos/' + editing
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
