define(["shopApp", "ractivePackage"], function(app) {
  app.controller("tableController", ["$scope", "$http", "$location", function($scope, $http, $location) {
    var types, groups, models, printers
    var ractive = new Ractive({
      el: '#container',
      template: '#tpl',
      data: {
        types: [],
        groups: [],
        models: [],
        showingModels: [],
        editing: -1,
        editingGroup: -1,
        editingModel: {
          size: 4
        },
        tableType: -1,
        tableGroup: -1,
        typeTotal: 0,
        groupTotal: 0,
        getTableType: function(tableType) {
          for (var i = 0; i < types.length; i++) {
            if (types[i].id == tableType) {
              return types[i]
            }
          }
          return {}
        },
        getTableGroup: function(tableGroup) {
          for (var i = 0; i < groups.length; i++) {
            if (groups[i].id == tableGroup) {
              return groups[i]
            }
          }
          return {}
        }
      }
    })

    function filter(tableType, tableGroup) {
      var ret = []
      models.forEach(function(e) {
        if (tableType == -1) {
          if (tableGroup == -1 || e.tableGroup == tableGroup) {
            ret.push(e)
          }
        } else if (tableGroup == -1) {
          if (tableType == -1 || e.tableType == tableType) {
            ret.push(e)
          }
        } else if (e.tableType == tableType && e.tableGroup == tableGroup) {
          ret.push(e)
        }
      })
      return ret
    }

    function addModel(model) {
      models.push(model)
    }

    function findModel(id) {
      for (var i = 0; i < models.length; i++) {
        if (models[i].id == id) {
          return models[i]
        }
      }
      return {}
    }

    function updateModel(models, model) {
      for (var i = 0; i < models.length; i++) {
        if (models[i].id == model.id) {
          models[i] = model
        }
      }
    }

    function fillModel(model) {
      if (model.printer) {
        model._printer = findPrinter(model.printer)
      } else {
        model._printer = {}
      }
    }

    function countByGroup(groupid) {
      var total = 0
      types.forEach(function(e) {
        e.count = 0
      })
      models.forEach(function(e) {
        if (e.tableGroup == groupid || groupid == -1) {
          types.forEach(function(ee) {
            if (ee.id == e.tableType) {
              ee.count += 1
              total += 1
            }
          })
        }
      })
      return total
    }

    function countByType(typeid) {
      var total = 0
      groups.forEach(function(e) {
        e.count = 0
      })
      models.forEach(function(e) {
        if (e.tableType == typeid || typeid == -1) {
          groups.forEach(function(ee) {
            if (ee.id == e.tableGroup) {
              ee.count += 1
              total += 1
            }
          })
        }
      })
      return total
    }

    function findGroup(id) {
      for (var i = 0; i < groups.length; i++) {
        if (groups[i].id == id) {
          return groups[i]
        }
      }
      return {}
    }

    function findPrinter(id) {
      for (var i = 0; i < printers.length; i++) {
        if (printers[i].id == id) {
          return printers[i]
        }
      }
      return {}
    }
    // 获取模型数据
    $.get("/home/brand/" + brandId + "/shop/" + shopId + "/tables").done(function(data) {
      types = data.types
      groups = data.groups
      models = data.models
      printers = data.printers
        // 填充打印机
      models.forEach(function(e) {
        fillModel(e)
      })
      ractive.set('types', types)
      ractive.set('groups', groups)
      ractive.set('models', models)
      ractive.set('printers', printers)
      ractive.fire('Filter')
      ractive.fire('Refresh')
    }).fail(function(xhr) {
      Warning(xhr)
    })
    ractive.on('OnFilterType', function(event, id) {
      this.set('tableType', id)
      this.fire('Filter')
      this.fire('Refresh')
    })
    ractive.on('OnFilterGroup', function(event, id) {
      this.set('tableGroup', id)
      this.fire('Filter')
      this.fire('Refresh')
    })
    ractive.on('OnAddGroup', function(event) {
      this.set('editingGroup', 0)
      this.set('groupName', '')
      $('#groupName').focus()
    })
    ractive.on('OnEditGroup', function(event) {
      var groupid = this.get('tableGroup')
      this.set('editingGroup', 1)
      this.set('groupName', findGroup(groupid).name)
      $('#groupName').focus()
    })
    ractive.on('OnSaveGroup', function(event) {
      if (!Validate('#groupform')) {
        return
      }
      var self = this
      var name = self.get('groupName')
      var groupid = self.get('tableGroup')
      var editingGroup = self.get('editingGroup')
      var model = {
        name: name
      }
      var url = "/home/brand/" + brandId + "/shop/" + shopId + "/table/group"
      if (editingGroup > 0) {
        url += '/' + groupid
      }
      Post(url, model).done(function(data) {
        if (editingGroup > 0) {
          findGroup(groupid).name = data.name
        } else {
          model.id = data.id
          groups.push(model)
          self.set('tableGroup', model.id)
        }
        self.set('editingGroup', -1)
        self.fire('Filter')
        self.fire('Refresh')
        self.update('groups')
      }).fail(function(xhr) {
        Warning(xhr)
      })
    })
    ractive.on('OnRemoveGroup', function(event) {
      var self = this
      var tableGroup = self.get('tableGroup')
      var url = "/home/brand/" + brandId + "/shop/" + shopId + "/table/group/" + tableGroup
      Remove(url).done(function(ok) {
        for (var i = 0; i < groups.length; i++) {
          if (groups[i].id == tableGroup) {
            groups.splice(i, 1)
            break
          }
        }
        self.update('models')
        self.set('tableGroup', -1)
      }).fail(function(xhr) {
        Warning(xhr)
      })
    })
    ractive.on('OnCancelSaveGroup', function(event) {
      this.set('editingGroup', -1)
    })
    ractive.on('OnAddModel', function(event) {
      this.set('editing', 0)
      this.set('editingModel.name', '')
      $('#model-name').focus()
    })
    ractive.on('OnSaveModel', function(event) {
      if (!Validate('#form')) {
        return
      }
      var self = this
      self.updateModel()
      var oldmodel = self.get('editingModel')
      var model = jQuery.extend(true, {}, oldmodel)
      var editing = self.get('editing')
      if (editing == 0) {
        Post("/home/brand/" + brandId + "/shop/" + shopId + "/table", model).done(function(data) {
          model.id = data.id
          fillModel(model)
          addModel(model)
          self.get('showingModels').unshift(model)
          self.set('editingModel.name', '')
          self.fire('Refresh')
        }).fail(function(xhr) {
          Warning(xhr)
        })
      } else if (editing > 0) {
        Post("/home/brand/" + brandId + "/shop/" + shopId + "/table/" + editing, model).done(function(data) {
          fillModel(model)
          updateModel(models, model)
          updateModel(self.get('showingModels'), model)
          self.set('editing', -1)
          self.update('showingModels')
          self.fire('Refresh')
          self.set('editing', -1)
        }).fail(function(xhr) {
          Warning(xhr)
        })
      }
    })
    ractive.on('OnCancelSave', function(event) {
      this.set('editing', -1)
    })
    ractive.on('OnEditModel', function(event, tableid) {
      // 过滤掉来自按钮的事件，因为 ractive 没有过滤掉这个事件, 使用 event.original.preventDefault() 也没用
      if (event.original.target.nodeName == 'A') {
        return
      }
      this.set('editing', tableid)
      var model = jQuery.extend(true, {}, findModel(tableid))
      this.set('editingModel', model)
      $('#model-name').focus()
    })
    ractive.on('OnRemoveModel', function(event) {
      var self = this
      var editing = self.get('editing')
      var url = "/home/brand/" + brandId + "/shop/" + shopId + "/table" + editing
      Remove(url).done(function(ok) {
        for (var i = 0; i < models.length; i++) {
          if (models[i].id === editing) {
            models.splice(i, 1)
            break
          }
        }
        self.set('editing', -1)
        self.fire('Filter')
        self.fire('Refresh')
        self.update('showingModels')
      }).fail(function(xhr) {
        Warning(xhr)
      })
    })
    ractive.on('Filter', function() {
      var tableType = this.get('tableType')
      var tableGroup = this.get('tableGroup')
      this.set('editingModel.tableType', tableType)
      this.set('editingModel.tableGroup', tableGroup)
      var showing = filter(tableType, tableGroup)
      this.set('showingModels', showing)
      this.set('editingGroup', -1)
    })
    ractive.on('Refresh', function() {
      var tableType = this.get('tableType')
      var tableGroup = this.get('tableGroup')
      var groupTotal = countByType(tableType)
      var typeTotal = countByGroup(tableGroup)
      this.update('types')
      this.update('groups')
      this.set('groupTotal', groupTotal)
      this.set('typeTotal', typeTotal)
    })
    ractive.on('OnShowingBtn', function(event, tableid) {
      if (event.hover) {
        this.set('showingBtn', tableid)
      } else {
        this.set('showingBtn', 0)
      }
    })
    ractive.on('OnSwap', function(event, i, j) {
      var self = this
      var models = self.get('showingModels')
      var a = models[i]
      var b = models[j]
      var model = {
        id1: a.id,
        order1: a.order,
        id2: b.id,
        order2: b.order
      }
      Post("/home/brand/" + brandId + "/shop/" + shopId + "/table/swap", model).done(function(data) {
        models[i] = b
        models[j] = a
        a.order = model.order2
        b.order = model.order1
        var allmodels = self.get("models")
        allmodels.sort(function(a, b) {
          return a.order - b.order
        })
        self.update('showingModels')
      }).fail(function(xhr) {
        Warning(xhr)
      })
    })

  }])
})
