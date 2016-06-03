define(["shopApp", "ractivePackage"], function(app) {
  app.controller("roleController", ["$scope", "$http", "$location", function($scope, $http, $location) {
    var models, discounts, permissions, rolePermissions, roleDiscounts
   var ractive = new Ractive({
     el: "#modelsbody",
     template: "#role-tpl",
     data: {
       editingModel: {creditMonth:0}
     }
   })
 ractive.set('brandId', brandId);
 ractive.set('shopId', shopId);
   function findRole(id) {
     for (var i = 0; i < models.length; i++) {
       if (models[i].id == id) {
         return models[i]
       }
     }
     return null
   }
   function fillModel(model) {
     model.permissions = []
     permissions.forEach(function(p) {
       var perm = jQuery.extend(true, {}, p)
       model.permissions.push(perm)
       if (hasPerm(model.id, perm.id)){
         perm.checked = true
       } else {
         perm.checked = false
       }
     })
     model.discounts = []
     discounts.forEach(function(p) {
       var discount = jQuery.extend(true, {}, p)
       model.discounts.push(discount)
       if (hasDiscount(model.id, discount.id)){
         discount.checked = true
       } else {
         discount.checked = false
       }
     })
   }
   function hasPerm(role, perm) {
     for (var i = 0; i < rolePermissions.length; i++) {
       var item = rolePermissions[i]
       if (item.role == role && item.permission == perm) {
         return true
       }
     }
     return false
   }
   function hasDiscount(role, discount) {
     for (var i = 0; i < roleDiscounts.length; i++) {
       var item = roleDiscounts[i]
       if (item.role == role && item.discount == discount) {
         return true
       }
     }
     return false
   }
   function replacePerms(role, perms) {
     for (var i = rolePermissions.length - 1; i >= 0; i--) {
       if (rolePermissions[i].role == role) {
         rolePermissions.splice(i, 1)
       }
     }
     perms.forEach(function(e) {
       var model = {role: role, permission: e}
       rolePermissions.push(model)
     })
   }
   function replaceDiscs(role, discs) {
     for (var i = roleDiscounts.length - 1; i >= 0; i--) {
       if (roleDiscounts[i].role == role) {
         roleDiscounts.splice(i, 1)
       }
     }
     discs.forEach(function(e) {
       var model = {role: role, discount: e}
       roleDiscounts.push(model)
     })
   }
   $.get("/home/brand/"+brandId+"/shop/"+shopId+"/roles").done(function(data) {
     models = data.models
     discounts = data.discounts
     permissions = data.permissions
     rolePermissions = data.rolePermissions
     roleDiscounts = data.roleDiscounts
     models.forEach(function(e) { fillModel(e) })
     ractive.set('models', models)
     ractive.set('discounts', discounts)
     ractive.set('permissions', permissions)
     ractive.set('rolePermissions', rolePermissions)
     ractive.set('roleDiscounts', roleDiscounts)
   }).fail(function(xhr) {
     Warning(xhr)
   })
   ractive.on('OnSaveModel', function(event) {
     if (!Validate('#form')) {
       return
     }
     var arrPerm = []
     $('#perms:checked').map(function() {
       arrPerm.push($(this).val())
     })
     var arrDisc = []
     $('#discs:checked').map(function() {
       arrDisc.push($(this).val())
     })
     var self = this
     var url ="/home/brand/"+brandId+"/shop/"+shopId+"/role"
     var editing = self.get('editing')
     if (editing > 0) {
       url += '/' + editing
     }
     var model = self.get('editingModel')
     model.permissions = arrPerm
     model.discounts = arrDisc
     Post(url, model).done(function(data) {
       replacePerms(data.id, arrPerm)
       replaceDiscs(data.id, arrDisc)
       fillModel(data)
       if (editing == 0) {
         models.unshift(data)
       } else {
         for (var i = 0; i < models.length; i++) {
           if (models[i].id == data.id) {
             models[i] = data
             break
           }
         }
       }
       self.update('models')
       self.set('editing', -1)
     }).fail(function(xhr) {
       Warning(xhr)
     })
   })
   ractive.on('OnCancelSave', function(event) {
     this.set('role', {})
     this.set('editing', -1)
   })
   ractive.on('selectRow', function(event) {
     var tr = $(event.node).parent().parent().parent()
     tr.toggleClass("selected")
   })
   ractive.on('OnEdit', function(event, id) {
     var role = findRole(id)
     var editingModel = jQuery.extend(true, {}, role) // clone
     this.set('editing', id)
     this.set('editingModel', editingModel)
     $("#name").focus()
   })
   ractive.on('OnRemoveModel', function(event) {
     var self = this
     var editing = self.get('editing')
     var url ="/home/brand/"+brandId+"/shop/"+shopId+"/role/"+ editing
     Remove(url).done(function(ok) {
       for (var i = 0; i < models.length; i++) {
         if (models[i].id === editing) {
           models.splice(i, 1)
           break
         }
       }
       self.update('models')
     }).fail(function(xhr) {
       Warning(xhr)
     })
   })
   ractive.on('OnAddModel', function(event) {
     this.set('editing', '0')
     $("#name").focus()
   })

  }])
})
