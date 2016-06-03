define(["shopApp", "ractivePackage"], function(app) {
  app.controller("discountController", ["$scope", "$http", "$location", function($scope, $http, $location) {
    init();
    function init() {
      var models, has_ids
      var ractive = new Ractive({
        el: '#container',
        template: '#tpl',
        data: {
          models: [],
          editing: -1,
          editingModel: {}
        }
      })

      function fillModel(model) {
        model.selected = false
        has_ids.forEach(function(i) {
          if (i == model.id)
            model.selected = true
        })
      }
      // 获取模型数据

      $.get("/home/brand/" + brandId + "/shop/" + shopId + "/has/discounts").done(function(data) {
        models = data.models
        has_ids = data.has_ids
        models.forEach(function(m) {
          fillModel(m)
        })
        ractive.set('models', models)
        ractive.set('has_ids', has_ids)
      }).fail(function(xhr) {
        Warning(xhr)
      })
      ractive.on("OnSelected", function(event, id) {
        var url = "/home/brand/" + brandId + "/shop/" + shopId + "/has/discount/" + id
        var self = this
        Post(url, {}).done(function(data) {
          has_ids.push(id)
          self.fire("OnRefresh")
        }).fail(function(xhr) {
          Warning(xhr)
        })
      })
      ractive.on("OnRemove", function(event, id) {
        var url = "/home/brand/" + brandId + "/shop/" + shopId + "/has/discount/" + id
        var self = this
        Remove(url).done(function(data) {
          for (var i = 0; i < has_ids.length; i++) {
            if (has_ids[i] == id) {
              has_ids.splice(i, 1)
              break
            }
          }
          self.fire("OnRefresh")
        }).fail(function(xhr) {
          Warning(xhr)
        })
      })
      ractive.on('OnRefresh', function(event) {
        models.forEach(function(m) {
          fillModel(m)
        })
        this.update()
      })
    }

  }])
})
