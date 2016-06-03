define(["shopApp", "ractivePackage"], function(app) {
  app.controller("lineupController", ["$scope", "$http", "$location", function($scope, $http, $location) {
    var groups = ['A', 'B', 'C', 'D', 'E']
    var models = []
    var ractive = new Ractive({
      el: '#container',
      template: '#tpl',
      data: {
        editing: '',
        persons: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20],
        editingModel: {
          minSize: 1,
          maxSize: 1
        }
      }
    })
    function findGroup(arr, name) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].name == name) {
          return arr[i]
        }
      }
      return {
        name: name
      } // 默认返回空对象
    }

    function findModel(name) {
      for (var i = 0; i < models.length; i++) {
        if (models[i].name == name) {
          return models[i]
        }
      }
      return undefined
    }

    function isOver(models, exclude, num) {
      for (var i = 0; i < models.length; i++) {
        var m = models[i]
        if (m.name != exclude && m.minSize && m.maxSize) {
          if (num >= m.minSize && num <= m.maxSize) {
            return true
          }
        }
      }
      return false
    }
    $.get("/home/brand/" + brandId + '/shop/' + shopId + "/paiduis").done(function(data) {
      groups.forEach(function(g) {
        models.push(findGroup(data.models, g))
      })
      ractive.set('models', models)
    }).fail(function(xhr) {})
    ractive.on('OnEditModel', function(event, name) {
      this.set('editing', name)
      var model = findModel(name)
      this.set('editingModel', objectClone(model))
      $('#minSize').focus()
    })
    ractive.on('OnSaveModel', function(event, name) {
      var self = this
      self.updateModel()
      var model = self.get('editingModel')
      model.name = name
        // 判断大小
      if (model.minSize > model.maxSize) {
        alert('"最小人数"不能超过"最大人数"')
        return
      }
      // 判断是否有交集
      if (isOver(models, name, model.minSize)) {
        alert('"最小人数"与其他分组重复, 请修改')
        return
      }
      if (isOver(models, name, model.maxSize)) {
        alert('"最大人数"与其他分组重复, 请修改')
        return
      }
      var url = "/home/brand/" + brandId + '/shop/' + shopId + "/paidui"
      Post(url, model).done(function(data) {
        for (var i = 0; i < models.length; i++) {
          if (models[i].name == data.name) {
            models[i] = data
          }
        }
        self.set('editing', '')
        self.update('models')
      }).fail(function(xhr) {
        alert("保存失败")
      })
    })
    ractive.on('OnRemoveModel', function(event, id) {
      var self = this
      var url = "/home/brand/" + brandId + '/shop/' + shopId + "/paidui/" + id
      Remove(url).done(function(data) {
        for (var i = 0; i < models.length; i++) {
          var model = models[i]
          if (model.id == id) {
            models[i] = {
                name: model.name
              } // 只保留名字
            break
          }
        }
        self.set('editing', '')
        self.update('models')
      }).fail(function(xhr) {
        alert("删除失败")
      })
    })
    ractive.on('OnCancelModel', function() {
      this.set('editing', '')
    })
  }])
})
