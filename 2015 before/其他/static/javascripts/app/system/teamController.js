define(["systemApp", "ractivePackage"], function(app) {
  app.controller("teamController", ["$rootScope", "$scope", "$http", "$location", "$timeout",
      function($rootScope, $scope, $http, $location, $timeout) {
        var teams, shops
        var ractive = new Ractive({
          el: "#container",
          template: "#tpl",
          data: {
            addingMember: 0, //0 不处理 1 查找 2 添加 3 确认
            editingModel: {
              creditMonth: 0
            }
          }
        })

        function findTeam(teamid) {
          for (var i = 0; i < teams.length; i++) {
            if (teams[i].id == teamid) {
              return teams[i]
            }
          }
          return null
        }

        function removeArray(array, id) {
          for (var i = 0; i < array.length; i++) {
            if (array[i].id == id) {
              array.splice(i, 1)
            }
          }
        }

        function findArray(array, id) {
          for (var i = 0; i < array.length; i++) {
            if (array[i].id == id) {
              return array[i]
            }
          }
          return null
        }

        function initTip() {
          $("[data-toggle=tooltip]").tooltip();
        }
        $.get("/home/brand/"+brandId+"/teams").done(function(data) {
          teams = data.teams
          shops = data.shops
          ractive.set("teams", teams)
          ractive.set("shops", shops)
          if (teams.length > 0) {
            ractive.set("teamid", teams[0].id)
            ractive.fire("Goto")
          }
        }).fail(function(xhr) {
          Warning(xhr)
        })
        ractive.on("OnTeamFilter", function(event, teamid) {
          this.set("teamid", teamid)
          this.fire("Goto")
        })
        ractive.on("Goto", function() {
          var self = this
          var teamid = self.get("teamid")
          $.get("/home/brand/"+brandId+"/team/" + teamid).done(function(data) {
            var team = findTeam(teamid)
            team.perms = data.perms
            team.members = data.members
            team.shops = data.shops
            team.isAdmin = false
            team.perms.forEach(function(e) {
              if (e.id == 0) {
                team.isAdmin = true
              }
            })
            self.set("current", team)
            self.fire("OnCancelModel")
          }).fail(function(xhr) {
            Warning(xhr)
          })
        })
        ractive.on("OnAddTeam", function(event) {
          this.set("addingTeam", true)
          $("#teamName").focus()
        })
        ractive.on("OnSaveTeam", function(event) {
          if (!Validate("#form")) {
            return
          }
          var self = this
          var team = self.get("team")
          Post("/home/brand/"+brandId+"/team", team).done(function(data) {
            teams.push(data)
            self.set("addingTeam", false)
            self.set("teamid", data.id)
            self.fire("Goto")
          }).fail(function(xhr) {
            Warning(xhr)
          })
        })
        ractive.on("OnEditTeam", function(event) {
          var current = this.get("current")
          var team = jQuery.extend(true, current, {})
          this.set("team", team)
          this.set("editingTeam", true)
          $("#teamName").focus()
        })
        ractive.on("OnUpdateTeam", function(event) {
          if (!Validate("#teamForm")) {
            return
          }
          var self = this
          var current = self.get("current")
          var url = "/home/brand/"+brandId+"/team/" + current.id
          var model = self.get("team")
          Post(url, model).done(function(data) {
            current.name = data.name
            current.remark = data.remark
            self.update("teams")
            self.update("current")
            self.fire("OnCancelModel")
          }).fail(function(xhr) {
            Warning(xhr)
          })
        })
        ractive.on("OnRemoveTeam", function() {})
        ractive.on("OnCancelModel", function(event) {
          this.set("addingTeam", false)
          this.set("editingTeam", false)
          this.set("addingMember", 0)
          this.set("addingShop", false)
          initTip()
        })
        ractive.on("OnAddMember", function(event) {
          this.set("editingMember", {})
          this.set("addingMember", 1)
          initTip()
        })
        ractive.on("OnFindMember", function(event) {
          if (!Validate("#memberForm")) {
            return
          }
          var self = this
          var current = self.get("current")
          var url = "/home/brand/"+brandId+"/team/" + current.id + "/member/find"
          var email = self.get("editingMember.account")
          Post(url, email).done(function(data) {
            self.set("editingMember.name", data.name)
            self.set("foundOrCreated", "存在")
            self.set("addingMember", 3)
          }).fail(function(xhr) {
            var ret = xhr.responseJSON
            if (ret) {
              if (ret.error_code == 1004) {
                self.set("addingMember", 2); // 不存在，接着要可以创建

                if (email.indexOf("@") != -1) {
                  self.set("editingMember.email", email);
                  self.set("editingMember.addReadonly", "email");
                } else {
                  self.set("editingMember.mobile", email);
                  self.set("editingMember.addReadonly", "mobile");
                }
                // self.set("editingMember.", 2);
                // self.set("editingMember", 2);
                // self.set("editingMember", 2);

              } else if (ret.error_code == 1012) {
                alert("当前群组已经包含了 " + email)
              }
            }
          })
        })
        ractive.on("OnCreateMember", function(event) {
          if (!Validate("#memberForm")) {
            return
          }
          var mailReg=/\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/;
          var phoneReg=/0?(13|14|15|17|18)[0-9]{9}/;

          if(!mailReg.test($(".createMemberForm #email").val())){
            alert("请输入正确的邮箱");
            return;
          }
          if(!phoneReg.test($(".createMemberForm #mobile").val())){
            alert("请输入正确的手机号码");
            return;
          }
          if($(".createMemberForm #name").val()==""){
            alert("名字不能为空");
            return;
          }
          if($(".createMemberForm #name").val().length>6){
            alert("名字不能大于6个字");
            return;
          }
          if($(".createMemberForm #password").val().length<6){
            alert("密码不能小于6位");
            return;
          }
          if($(".createMemberForm #password").val().length>18){
            alert("密码不能大于18位");
            return;
          }



          var self = this
          var current = self.get("current")
          var url = "/home/brand/"+brandId+"/team/" + current.id + "/member/create"
          var model = self.get("editingMember")
          model.accept = true
          Post(url, model).done(function(data) {
            self.set("foundOrCreated", "创建")
            self.set("addingMember", 3)
          }).fail(function(xhr) {
            Warning(xhr)
          })
        })
        ractive.on("OnSaveMember", function(event) {
          if (!Validate("#memberForm")) {
            return
          }
          var self = this
          var current = self.get("current")
          var url = "/home/brand/"+brandId+"/team/" + current.id + "/member/save"
          var model = self.get("editingMember");
          console.log(model)
          var json ={
            account:model.email||model.mobile||model.account
          }
          Post(url, json).done(function(data) {
            current.members.push(data)
            self.fire("OnCancelModel")
          }).fail(function(xhr) {
            Warning(xhr)
          })
        })
        ractive.on("OnRemoveMember", function(event, id) {
          var self = this
          var current = self.get("current")
          var url = "/home/brand/"+brandId+"/team/" + current.id + "/member/" + id
          if (current.isAdmin && current.members.length == 1) {
            alert("无法删除最后一名管理员，管理员组至少有一名成员!")
            return
          }
          var needRefresh = current.isAdmin && id == 663383581
          if (needRefresh) {
            var ret = confirm("确定将自己从 Admin 中移出吗? 移除后将没有管理权限了。")
            if (!ret) {
              return
            }
          }
          Remove(url).done(function(data) {
            removeArray(current.members, id)
              // 从管理员中移出自己后，需要刷新界面
            if (needRefresh) {
              window.location = "/home/brand/"+brandId
            }
          }).fail(function(xhr) {
            Warning(xhr)
          })
        })
        ractive.on("OnAddShop", function(event) {
          var current = this.get("current")
          this.set("addingShop", true)
          var selectShops = []
          shops.forEach(function(e) {
            var find = false
            current.shops.forEach(function(s) {
              if (s.id == e.id) {
                find = true
              }
            })
            if (!find) {
              selectShops.push(e)
            }
          })
          this.set("selectShops", selectShops)
          initTip()
        })
        ractive.on("OnSaveShop", function(event, id) {
          var self = this
          var current = self.get("current")
          var selectShops = self.get("selectShops")
          var shop = findArray(selectShops, id)
          var url = "/home/brand/"+brandId+"/team/" + current.id + "/shop"
          Post(url, {
            shop: shop.id
          }).done(function(data) {
            removeArray(selectShops, id)
            current.shops.push(shop)
          }).fail(function(xhr) {
            Warning(xhr)
          })
        })
        ractive.on("OnRemoveShop", function(event, id) {
          var self = this
          var current = self.get("current")
          var url = "/home/brand/"+brandId+"/team/" + current.id + "/shop/" + id
          Remove(url).done(function(data) {
            if (self.get("addingShop")) {
              self.get("selectShops").push(findArray(current.shops, id))
            }
            removeArray(current.shops, id)
          }).fail(function(xhr) {
            Warning(xhr)
          })
        })
          }])
      })
