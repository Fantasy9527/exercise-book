define(["systemApp", "ractivePackage"], function(app) {
  app.controller("tabletypeController", ["$rootScope", "$scope", "$http", "$location", "$timeout",
    function($rootScope, $scope, $http, $location, $timeout) {
      var models, ractive;
      $http.get("/home/brand/" + brandId + "/tabletypes").success(function(res) {
        models = res;
        ractive = new Ractive({
          el: "#container",
          template: "#tpl",
          data: {
            models: models,
            editing: -1,
            adding: false
          }
        })

        ractive.on("saveModel", function(event) {
          if (!Validate("#form")) {
            return
          }
          var am = this.get("addingModel")
          var model = jQuery.extend(true, {}, am)
          var self = this
          Post("/home/brand/"+brandId+"/tabletype", model).done(function(data) {
            self.set("addingModel", {})
            model.id = data.id
            models.unshift(model)
            self.set("editing", -1)
            self.set("adding", false)
          }).fail(function(xhr) {
            console.log(Json(xhr))
            var json = Json(xhr)
            if (json.message) {
              alert(json.message + ". 请检查是否重名")
            }
          })
        });

        ractive.on("cancelSave", function(event) {
          this.set("adding", false)
        });
        ractive.on("editModel", function(event, id) {
          var model = findModel(id)
          var editingModel = jQuery.extend(true, {}, model) // clone
          this.set("editing", id)
          this.set("adding", false)
          this.set("editingModel", editingModel)
          $("#model-name").focus()
        });


        ractive.on("updateModel", function(event, id) {
          if (!Validate("#form")) {
            return
          }
          var self = this
          var model = this.get("editingModel")
          Post("/home/brand/"+brandId+"/tabletype/" + id, model).done(function(data) {
            updateModel(id, model)
            self.set("editing", -1)
            self.set("editingModel", {})

            self.update("models")
          }).fail(function(xhr) {
            console.log(Json(xhr))
            var json = Json(xhr)
            if (json.message) {
              alert(json.message)
            }
          })
        })
        ractive.on("cancelUpdate", function(event) {
          this.set("editing", -1)
        })
        ractive.on("removeModel", function(event) {
          var self = this
          var editing = self.get("editing")
          var url = "/home/brand/"+brandId+"/tabletype/" + editing
          Remove(url).done(function(data) {
            for (var i = 0; i < models.length; i++) {
              if (models[i].id == editing) {
                models.splice(i, 1)
                break
              }
            }
            self.set("editing", -1)
            self.update("models")
          }).fail(function(xhr) {
            Warning(xhr)
          })
        })

        ractive.on("addModel", function(event, id) {
          var tmp = ractive.get("adding")
          ractive.set({
            adding: true
          })
          ractive.set({
            editing: -1
          })
          $("#model-name").focus()
        })
      })


      function findModel(id) {
        var i = 0
        for (i = 0; i < models.length; i++) {
          if (models[i].id == id) {
            return models[i]
          }
        }
        return null
      }

      function updateModel(id, model) {
        var i = 0
        for (i = 0; i < models.length; i++) {
          if (models[i].id == id) {
            models[i] = model
            return
          }
        }
      }



    }
  ])
})
