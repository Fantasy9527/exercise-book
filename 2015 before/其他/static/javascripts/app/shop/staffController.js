define(["shopApp", "ractivePackage"], function(app) {
  app.controller("staffController", ["$scope", "$http", "$location", function($scope, $http, $location) {
    var models = []
   var ractive = new Ractive({
     el: '#container',
     template: '#role-tpl',
     data: {
       models: [],
       showingModels:[],
       adding: false,
       editing: -1,
       roleid: -1,
       getRoles: function() {
         var roles = []
         models.forEach(function(e){
           roles.push(e.role)
         })
         return roles
       },
       getRole: function(roleid) {
         for (var i = 0; i < models.length; i++) {
           if (models[i].role.id == roleid) {
             return models[i].role
           }
         }
         return ''
       }
     }
   })
   ractive.set('brandId', brandId);
   ractive.set('shopId', shopId);
   function initDate() {
     $('#birthday').datetimepicker()
     $('#workday').datetimepicker()
   }
   function filterByRole(roleid) {
     var ret = []
     models.forEach(function(e) {
       if (roleid == -1 || e.role.id == roleid) {
         e.staff.forEach(function(ee){
           ret.push(ee)
         })
       }
     })
     ret.sort(function(a, b) { return a.sn.localeCompare(b.sn) })
     return ret
   }
   function addModel(model) {
     models.forEach(function(e){
       if (e.role.id == model.role) {
         e.staff.push(model)
       }
     })
   }
   function findModel(staffid) {
     for (var i = 0; i < models.length; i++) {
       var staff = models[i].staff
       for (var j = 0; j < staff.length; j++) {
         if (staff[j].id == staffid) {
           return staff[j]
         }
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
   $.get("/home/brand/"+brandId+"/shop/"+shopId+"/staffs").done(function(data) {
     models = data
     ractive.set('models', data)
     ractive.fire('Refresh')
     ractive.fire('FilterRole', -1)
   }).fail(function(xhr) {
     Warning(xhr)
   })
   ractive.on('OnAddModel', function(event) {
     this.set('adding', true)
     this.set('editing', -1)
     var model = this.get('addingModel')
     model.name = ''
     model.workday = staffTime.workday
     model.birthday = staffTime.birthday
     model.password = '***'
     this.update('addingModel')
     initDate()
     $('#model-name').focus()
   })
   ractive.on('OnFilterRole', function(event, roleid) {
     ractive.fire('FilterRole', roleid)
   })
   ractive.on('OnSaveModel', function(event, staffid) {
     if (!Validate('#form')) {
       return
     }
     var self = this
     self.updateModel()
     var adding = self.get('adding')
     var oldmodel = self.get('addingModel')
     if (!oldmodel.role) {
       alert("没有选择岗位类型")
       return
     }
     var model = jQuery.extend(true, {}, oldmodel)
     if(model.name == undefined || model.name == ""){
       alert("姓名不能为空!")
       return
     }
     if(model.sn == undefined || model.sn == ""){
       alert("工号不能为空!")
       return
     }
     if(model.sn.length > 5 || isNaN(model.sn)==true){
       alert("工号必须是5位的数字!")
       return
     }
     if (adding) {
       Post("/home/brand/"+brandId+"/shop/"+shopId+"/staff", model).done(function(data) {
         model.salt = model.password = "***"
         model.creditMonth = data.staffRole.creditMonth
         model.creditUsedMonth = 0
         model.id = data.staff.id
         addModel(model)
         self.get('showingModels').unshift(model)
         updateShowingModels(self.get("showingModels"), model)
         oldmodel.name = ''
         self.update('addingModel')
         self.update('showingModels')
         self.set('editing', -1)
         self.fire('Refresh')
         $('#model-name').focus()
       }).fail(function(xhr) {
         Warning(xhr)
       })
     } else {
       Post("/home/brand/"+brandId+"/shop/"+shopId+"/staff/" + staffid, model).done(function(data) {
         model.salt = model.password = "***"
         updateModel(models, model)
         updateShowingModels(self.get("showingModels"), model)
         self.update('showingModels')
         self.set('editing', -1)
         self.fire('Refresh')
       }).fail(function(xhr) {
         Warning(xhr)
       })
     }
   })
   ractive.on('OnEditModel', function(event, staffid) {
     this.set('adding', false)
     this.set('editing', staffid)
     var model = jQuery.extend(true, {}, findModel(staffid))
     this.set('addingModel', model)
     initDate()
     $('#model-name').focus()
   })
   ractive.on('OnRemoveModel', function(event) {
     var self = this
     var editing = self.get('editing')
     var url = "/home/brand/"+brandId+"/shop/"+shopId+"/role/" + editing
     Remove(url).done(function(ok) {
       models.forEach(function(m) {
         for (var i = 0; i < m.staff.length; i++) {
           if (m.staff[i].id == editing) {
             m.staff.splice(i, 1)
             break
           }
         }
       })
       self.fire('FilterRole', self.get('roleid'))
       self.set('editing', -1)
       self.update('models')
     }).fail(function(xhr) {
       Warning(xhr)
     })
   })
   ractive.on('OnCancelSave', function(event) {
     this.set('adding', false)
     this.set('editing', -1)
   })
   ractive.on('Refresh', function() {
     var count = 0
     models.forEach(function(e){
       e.count = e.staff.length
       count += e.count
     })
     this.set('modelTotal', count)
     this.update('models')
   })
   ractive.on('FilterRole', function(roleid) {
     this.set('roleid', roleid)
     var data = filterByRole(roleid)
     this.set('showingModels', data)
     this.set('addingModel.role', roleid)
   })

  }])
})
