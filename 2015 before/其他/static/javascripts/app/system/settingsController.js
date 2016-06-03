define(["systemApp","plupload","ractivePackage"], function(app) {
  app.controller("settingsController", ["$rootScope", "$scope", "$http", "$location", "$timeout",
    function($rootScope, $scope, $http, $location, $timeout) {
        var uploader = new plupload.Uploader({
          runtimes : "html5,flash,silverlight,html4",
          browse_button : "pickfiles",
          container: "container",
          url : "/home/brand/"+brandId+"/settings/logo",
          file_data_name: "file",
          multi_selection: false,
          filters : {
            max_file_size : "10mb",
            mime_types: [
                {title : "Image files", extensions : "jpg,gif,png"}
            ]
          },
          flash_swf_url : "/assets/javascripts/Moxie.swf",
          silverlight_xap_url : "/assets/javascripts/Moxie.xap",
          init: {
            UploadProgress: function(up, file) {},
            FilesAdded: function(up, files) {
              uploader.start()
            },
            FileUploaded: function(up, file, data) {
              var response = JSON.parse(data.response)
              ractive.set("item", "")
              ractive.set("brand", response)
              ractive.update("brand")
            },
            Error: function(up, err) {}
          }
      });


        var brand;
        var ractive = new Ractive({
          el: "#container",
          template: "#tpl",
          data: {}
        })
        $.get("/home/brand/"+brandId+"/getsettings").done(function(data) {
          brand = data.brand
          ractive.set("brand", brand);
          uploader.init()
        }).fail(function(xhr) {
          Warning(xhr)
        })
        ractive.on("OnEditModel", function(event, item) {
          this.set("item", item)
          if (item == "brand.name") {
            this.set("name", brand.name)
            this.set("remark", brand.remark)
          }
          $("#model-name").focus()
        })
        ractive.on("OnSaveModel", function(event) {
          if (!Validate("#form")) {
            return
          }
          var self = this
          self.updateModel()
          var item = self.get("item")
          if (item == "brand.name") {
            var url = "/home/brand/"+brandId+"/settings/brand"
            var model = {name: self.get("name"), remark: self.get("remark")}
            Post(url, model).done(function(data) {
              self.set("brand", data)
              self.update("brand")
              self.set("item", "")
            }).fail(function(xhr) {
              Warning(xhr)
            })
          }
        })
        ractive.on("OnUploadImage", function(event) {
          $("#pickfiles").click()
        })
        ractive.on("OnCancelModel", function(event) {
          this.set("item", "")
        })


    }
  ])
})
