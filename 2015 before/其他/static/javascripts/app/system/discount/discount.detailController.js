define(["systemApp","ractivePackage"], function(app) {
  app.controller("discount.detailController", ["$scope", "$http", "$location", "$document", "$rootScope","$state", function($scope, $http, $location, $document, $rootScope,$state) {
    $scope.$state=$state;
    var models, groups, details, plan;
    var ractive = new Ractive({
      el: "#container",
      template: "#tpl",
      data: {
        showingModels: [],
        configed: true,
        group: -1,
        subgroup: -1,
        discount: 100
      }
    })
    ractive.set("discount", $state.params.discount);
    function filterModels(configed, group) {
      var ret = []
      for (var i = 0; i < models.length; i++) {
        var model = models[i]
        if (group == -1 || model.group == group) {
          if (configed && isDiscount(model)) {
            ret.push(model)
          }
          if (!configed && !isDiscount(model)) {
            ret.push(model)
          }
        }
      }
      return ret
    }

    function findModel(subgroup) {
      for (var i = 0; i < models.length; i++) {
        var model = models[i]
        if (model.id == subgroup) {
          return model
        }
      }
      return {}
    }

    function fillModel(model) {
      for (var i = 0; i < details.length; i++) {
        if (details[i].subgroup == model.id) {
          model["_discount"] = details[i]
          return
        }
      }
    }



    function isDiscount(model) {
      return model._discount && model._discount.percentage < 100
    }
    $.get("/home/brand/"+brandId+"/discount/"+$state.params.discount+"/details").done(function(data) {
      models = data.models
      groups = data.groups
      details = data.details
      plan = data.plan
      ractive.set("models", models)
      ractive.set("groups", groups)
      ractive.set("details", details)
      ractive.set("plan", plan)
      ractive.fire("Filter")
      ractive.fire("Refresh")
    }).fail(function(xhr) {
      Warning(xhr)
    })
    ractive.on("OnConfigFilter", function(event, configed) {
      this.set("configed", configed)
      this.fire("Refresh")
      this.fire("Filter")
    })
    ractive.on("OnGroupFilter", function(event, id) {
      this.set("group", id)
      this.fire("Refresh")
      this.fire("Filter")
    })
    ractive.on("OnEditModel", function(event, subgroup) {
      var model = findModel(subgroup)
      var editingModel = jQuery.extend(true, {}, model)
      if (!isDiscount(editingModel)) {
        editingModel._discount = {
            percentage: this.get("discount")
          } // 默认值
      }
      this.set("editingModel", editingModel)
      this.set("subgroup", subgroup)
      $("#model-value").select()
      $("#model-value").focus()
    })
    ractive.on("OnSaveModel", function(event) {
      if (!Validate("#form")) {
        return
      }
      var self = this
      var editingModel = self.get("editingModel")
      if (editingModel._discount.percentage != "" && editingModel._discount.percentage == 0) {
        if (confirm("折扣率为0的菜品将被设置为免费，是否确认设置？") == false) {
          return
        }
      }
      var model = {
        subgroup: editingModel.id,
        percentage: editingModel._discount.percentage
      }
      Post("/home/brand/"+brandId+"/discount/"+$state.params.discount+"/detail", model).done(function(data) {
        var updated = false
        for (var i = 0; i < details.length; i++) {
          if (details[i].id == data.id) {
            details[i] = data
            updated = true
            break
          }
        }
        if (!updated) {
          details.push(data)
        }
        var m = findModel(editingModel.id)
        fillModel(m)
        self.update("showingModels")
        self.set("subgroup", -1)
        self.set("discount", m._discount.percentage)
        self.fire("Refresh")
      }).fail(function(xhr) {
        Warning(xhr)
      })
    })
    ractive.on("OnCancelModel", function(event) {
      this.set("subgroup", -1)
    })
    ractive.observe("selectedAll", function(ok) {
      this.set("batchSet", ok && this.get("showingModels").length > 0);
      console.log(this.get("showingModels"))

    })
    ractive.on("SelectRow", function(event) {
      this.set("batchSet", $(".check-item:checked").length > 0)
    })
    ractive.on("OnBatchSet", function(event) {
      if (!Validate("#batchForm")) {
        return
      }
      var self = this
      self.updateModel()
      var selected = []
      $(".check-item:checked").map(function() {
        selected.push($(this).attr("id"))
      })
      var batchDiscount = self.get("batchDiscount")
      if (batchDiscount != "" && batchDiscount == 0) {
        if (confirm("折扣率为0的菜品将被设置为免费，是否确认设置？") == false) {
          return
        }
      }
      var model = {
        subgroups: selected,
        percentage: batchDiscount
      }
      Post("/home/brand/"+brandId+"/discount/"+$state.params.discount+"/detail/batch", model).done(function(data) {
        details = data
        clearSelected()
        models.forEach(function(model) {
          fillModel(model)
        })
        self.set("details", details)
        self.set("selectedAll", false)
        self.fire("Refresh")
        self.update("showingModels")
      }).fail(function(xhr) {
        Warning(xhr)
      })
    })
    ractive.on("Filter", function() {
      models.forEach(function(e) {
        fillModel(e)
      })
      this.set("selectedAll", false)
      var group = this.get("group")
      var configed = this.get("configed")
      var showingModels = filterModels(configed, group)
      this.set("showingModels", showingModels)
    })
    ractive.on("Refresh", function() {
      var stats = {
        configed: 0,
        unconfiged: 0
      }
      groups.forEach(function(e) {
        stats[e.id] = {
          configed: 0,
          unconfiged: 0
        }
      })
      models.forEach(function(e) {
        if (isDiscount(e)) {
          stats[e.group].configed += 1
          stats.configed += 1
        } else {
          stats[e.group].unconfiged += 1
          stats.unconfiged += 1
        }
      })
      this.set("stats", stats)
    })




  }])
})
