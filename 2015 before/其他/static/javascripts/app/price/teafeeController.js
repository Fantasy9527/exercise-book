define(["priceApp", "ractivePackage"], function(app) {
  app.controller("teafeeController", ["$scope", "$http", "$location", "$state", function($scope, $http, $location, $state) {
    var models, serviceHours, states, teafeeTypes, groups, subgroups, products
    var ractive = new Ractive({
      el: "#container",
      template: "#tpl",
      data: {
        editing: -1,
        getProducts: function(subgroup, serviceHour) {
          var ret = []
          if (!subgroup) {
            return ret
          }
          for (var i = 0; i < products.length; i++) {
            var p = products[i]
            if (p._goods.subgroup == subgroup) {
              if ((serviceHour == -1 && !p.serviceHour) || p.serviceHour == serviceHour) {
                ret.push(p)
              }
            }
          }
          return ret
        },
        getSubGroups: function(group) {
          var ret = []
          subgroups.forEach(function(e) {
            if (e.group == group) {
              ret.push(e)
            }
          })
          return ret
        },
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

    function fillModel(model) {
      if (!model.serviceHour) {
        model.serviceHour = -1
      }
      serviceHours.forEach(function(e) {
        if (e.id == model.serviceHour) {
          model._serviceHour = e
        }
      })
      states.forEach(function(e) {
        if (e.id == model.state) {
          model._state = e
        }
      })
      teafeeTypes.forEach(function(e) {
        if (e.id == model.teafeeType) {
          model._teafeeType = e
        }
      })
      products.forEach(function(e) {
        if (e.id === model.product) {
          model._product = e
        }
      })
    }
    $.get("/home/brand/" + brandId + "/price/" + priceId + "/teafees").done(function(data) {
      models = data.models
      serviceHours = data.serviceHours
      states = data.states
      teafeeTypes = data.teafeeTypes
      groups = data.groups
      subgroups = data.subgroups
      products = data.products
      serviceHours.unshift({
        id: -1,
        name: "全天"
      })
      ractive.set("models", models)
      ractive.set("serviceHours", serviceHours)
      ractive.set("states", states)
      ractive.set("teafeeTypes", teafeeTypes)
      ractive.set("groups", groups)
      ractive.set("subgroups", subgroups)
      ractive.set("products", products)
      ractive.fire("Refresh")
      ractive.update("models")
    }).fail(function(xhr) {
      Warning(xhr)
    })
    ractive.on("OnAddModel", function(event) {
      this.set("editing", 0)
      this.updateModel()
    })
    ractive.on("OnEditModel", function(event, id) {
      var model = findModel(id)
      var editingModel = jQuery.extend(true, {}, model)
      this.set("editingModel", editingModel)
      if (editingModel._product) {
        this.set("goods", editingModel._product._goods)
      }
      this.set("editing", id)
      $("#model-price").select()
      $("#model-price").focus()
    })
    ractive.on("OnSaveModel", function(event) {
      if (!Validate("#form")) {
        return
      }
      var self = this
      self.updateModel()
      var model = self.get("editingModel")
      var editing = self.get("editing")
      var url
      if (editing == 0) {
        url = "/home/brand/" + brandId + "/price/" + priceId + "/teafee"
      } else {
        url = "/home/brand/" + brandId + "/price/" + priceId + "/teafee/" + editing
      }
      if (model.serviceHour == -1) {
        model.serviceHour = null
      }
      Post(url, model).done(function(data) {
        var update = false
        for (var i = 0; i < models.length; i++) {
          if (models[i].id == data.id) {
            models[i] = data
            update = true
            break
          }
        }
        if (!update) {
          models.unshift(data)
        }
        fillModel(data)
        self.update("models")
        self.set("editing", -1)
      }).fail(function(xhr) {
        Warning(xhr)
      })
    })
    ractive.on("OnRemoveModel", function(event, id) {
      var self = this
      var editing = self.get("editing")
      var url = "/home/brand/" + brandId + "/price/" + priceId + "/teafee/" + editing
      Remove(url).done(function(data) {
        for (var i = 0; i < models.length; i++) {
          if (models[i].id === editing) {
            models.splice(i, 1)
            break
          }
        }
        self.update("models")
      }).fail(function(xhr) {
        Warning(xhr)
      })
    })
    ractive.on("OnCancelSave", function(event, id) {
      this.set("editing", -1)
    })
    ractive.on("Refresh", function() {
      models.forEach(function(m) {
        fillModel(m)
      })
    })
  }])
})
