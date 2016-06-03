define(["systemApp","ractivePackage"], function(app) {
  app.controller("groupController", ["$rootScope", "$scope", "$http", "$location", "$timeout",
    function($rootScope, $scope, $http, $location, $timeout) {
         var models, subgroups
        var ractive = new Ractive({
          el: "#container",
          template: "#tpl",
          data: {
            editing: -1,
            type: ""
          }
        })
        function findModel(id) {
          for (var i = 0; i < models.length; i++) {
            if (models[i].id == id) {
              return models[i]
            }
          }
          return undefined
        }
        function findSubGroup(id) {
          for (var i = 0; i < subgroups.length; i++) {
            if (subgroups[i].id == id) {
              return subgroups[i]
            }
          }
          return undefined
        }
        function fillModel(model) {
          model.subgroups = []
          subgroups.forEach(function(e) {
            if (e.group == model.id) {
              model.subgroups.push(e)
            }
          })
        }
        $.get("/home/brand/"+brandId+"/groups").done(function(data) {
          subgroups = data.subgroups
          models = []
          data.groups.forEach(function(e) {
            if (e.productType < 5) {
              fillModel(e)
              models.push(e)
            }
          })
          ractive.set("models", models)
          ractive.set("subgroups", subgroups)
        }).fail(function(xhr) {
          Warning(xhr)
        })
        ractive.on("OnAddModel", function(event) {
          this.set("editing", 0)
          this.set("type", "group")
          this.set("editingModel", {})
          $("#model-name").focus()
        })
        ractive.on("OnEditModel", function(event, type, id) {
          // 过滤掉来自按钮的事件，因为 ractive 没有过滤掉这个事件, 使用 event.original.preventDefault() 也没用
          if (event.original.target.nodeName == "A") {
            return
          }
          this.set("editing", id)
          this.set("type", type)
          var model;
          if (type == "group") {
            model = findModel(id)
          } else if (type == "subgroup") {
            model = findSubGroup(id)
            this.set("groupid", model.group)
          }
          var editingModel = jQuery.extend(true, {}, model)
          this.set("editingModel", editingModel)
          $("#model-name").focus()
        })
        ractive.on("OnSaveModel", function(event) {
          if (!Validate("#form")) {
            return
          }
          var self = this;
         // console.log(self);
          if(self.get("editingModel").productType==4&&self.get("editingModel").name!="套餐"){
           alert("套餐不允许修改名字")
           return
          }

          self.updateModel()
          var editing = self.get("editing")
          var model = self.get("editingModel")
          // group
          var url = "/home/brand/"+brandId+"/group"
          if (editing > 0) {
            url += "/" + editing
          }
          Post(url, model).done(function(data) {
            if (editing > 0) {
              var group = findModel(data.id)
              group.name = data.name
              group.remark = data.remark
            } else {
              models.push(data)
            }
            self.set("editing", -1)
            self.update("models")
          }).fail(function(xhr) {
            Warning(xhr)
          })
        })
        ractive.on("OnRemoveModel", function(event) {
          var self = this;
          var editing = self.get("editing");
          if(self.get("editingModel").productType==4){
            alert("系统大类,是不允许删除的");
            return;
          }
          var url = "/home/brand/"+brandId+"/group/" + editing
          Remove(url).done(function(data) {
            for (var i = 0; i < models.length; i++) {
              if (models[i].id == editing) {
                models.splice(i, 1)
                break;
              }
            }
            self.set("editing", -1)
            self.update("models")
          }).fail(function(xhr) {
            Warning(xhr)
          })
        })
        ractive.on("OnAddSubGroup", function(event, groupid) {
          event.original.preventDefault()
          this.set("editing", 0)
          this.set("groupid", groupid)
          this.set("type", "subgroup")
          this.set("editingModel", {})
          $("#model-name").focus()
        })
        ractive.on("OnSaveSubGroup", function(event) {
          var self = this;
          self.updateModel()
          if (!Validate("#subform")) {
            return
          }
          var editing = self.get("editing")
          var groupid = self.get("groupid")
          var model = self.get("editingModel")
          // group
          var url = "/home/brand/"+brandId+"/group/" + groupid + "/subgroup"
          if (editing > 0) {
            url += "/" + editing
          }
          Post(url, model).done(function(data) {
            var group = findModel(groupid)
            if (editing > 0) {
              var subgroup = findSubGroup(data.id)
              subgroup.name = data.name
              subgroup.remark = data.remark
            } else {
              subgroups.push(data)
              fillModel(group)
            }
            self.set("editing", -1)
            self.update("models")
          }).fail(function(xhr) {
            Warning(xhr)
          })
        })
        ractive.on("OnRemoveSubGroup", function(event) {
          var self = this;
          var groupid = self.get("groupid")
          var editing = self.get("editing")
          var url = "/home/brand/"+brandId+"/group/" + groupid + "/subgroup/" + editing
          Remove(url).done(function(data) {
            for (var i = 0; i < subgroups.length; i++) {
              if (subgroups[i].id == editing) {
                subgroups.splice(i, 1)
                break;
              }
            }
            var model = findModel(groupid)
            for (var i = 0; i < model.subgroups.length; i++) {
              if (model.subgroups[i].id == editing) {
                model.subgroups.splice(i, 1)
                break
              }
            }
            self.set("editing", -1)
            self.update("models")
          }).fail(function(xhr) {
            Warning(xhr)
          })
        })
        ractive.on("OnCancelSave", function(event) {
          this.set("editing", -1)
          this.set("type", "")
        })
        ractive.on("OnShowingGroupBtn", function(event, groupid) {
          if (event.hover) {
            this.set("showingBtn", groupid)
          } else {
            this.set("showingBtn", 0)
          }
        })
        ractive.on("OnSwapGroup", function(event, i, j) {
          var a = models[i]
          var b = models[j]
          var model = {
            id1: a.id, order1: a.order,
            id2: b.id, order2: b.order
          }
          var self = this
          Post("/home/brand/"+brandId+"/group/swap", model).done(function(data) {
            models[i] = b
            models[j] = a
            a.order = model.order2
            b.order = model.order1
            self.update("models")
          }).fail(function(xhr){Warning(xhr)})
        })
        ractive.on("OnShowingSubBtn", function(event, subid) {
          if (event.hover) {
            this.set("showingSubBtn", subid)
          } else {
            this.set("showingSubBtn", 0)
          }
        })
        ractive.on("OnSwapSubGroup", function(event, group, i, j) {
          var models = findModel(group).subgroups
          var a = models[i]
          var b = models[j]
          var model = {
            id1: a.id, order1: a.order,
            id2: b.id, order2: b.order
          }
          var self = this
          var url = "/home/brand/"+brandId+"/group/" + group + "/subgroup/swap"
          Post(url, model).done(function(data) {
            models[i] = b
            models[j] = a
            a.order = model.order2
            b.order = model.order1
            self.update("models")
          }).fail(function(xhr){Warning(xhr)})
        })

    }
    ])
})
