define(["systemApp"], function(app) {
  app.controller("goodsDetailController", ["$scope", "$http", "$location", "$timeout", "$document", "FileUploader","$state", function ($scope, $http, $location, $timeout, $document, FileUploader,$state) {
    $scope.superParams = $location.search();
    $scope.$state=$state;
    function getModel(){
      var url = "/home/brand/" + brandId + "/goodsType/" + $state.params.goodsTypeId + "/detail/get"
      $http.get(url).success(function(data){
        $scope.groups = data.groups
        $scope.sourceSubgroups = data.subgroups
        $scope.subgroups = angular.copy(data.subgroups)
        $scope.unitTypes = data.unitTypes
        $scope.productTypes = data.productTypes
        $scope.sourceGoodsMethods = data.cookings
        $scope.model = {}
        $scope.productType = data.goodses[0].goods.productType
        $scope.model.name = data.goodses[0].goods.name
        $scope.goodsTypeName = angular.copy($scope.model.name)
        $scope.model.sha = data.goodses[0].goods.imageUrl
        $scope.model.source_image = data.goodses[0].source_image
        $scope.model.f56_56_image = data.goodses[0].f56_56_image
        $scope.model.sn = data.goodses[0].goods.sn
        $scope.model.goodses = data.goodses
        $scope.sourceModel = angular.copy($scope.model);
        packageModel();
        $scope.goodsMethods = angular.copy($scope.sourceGoodsMethods)
        $scope.model.sourceGroup = angular.copy($scope.model.group)
        $scope.model.sourceSubgroup = angular.copy($scope.model.subgroup)
      })
    }
    getModel()

    /*包装model*/
    function packageModel(){
      $scope.model.goodses.forEach(function(goods){
        goods.id = goods.goods.id
        if($scope.model.group == undefined){
          $scope.groups.forEach(function(group){
            if(group.id == goods.goods.group){
              $scope.model.group = group.id
              $scope.model.groupName = group.name
              return
            }
          })
        }
        if($scope.model.subgroup == undefined){
          $scope.subgroups.forEach(function(subgroup){
            if(subgroup.id == goods.goods.subgroup){
              $scope.model.subgroup = subgroup.id
              $scope.model.subgroupName = subgroup.name
              return
            }
          })
        }
        goods.isEdit = false
        goods.goodsMethodName = getGoodsMethodName(goods.goodsMethods)
        $scope.productTypes.forEach(function(pt){
          if(goods.goods.productType == pt.id){
            goods.productType = pt.id
            goods.productTypeName = pt.name
            return
          }
        })
        $scope.unitTypes.forEach(function(ut){
          if(goods.goods.unitType == ut.id){
            goods.unitType = ut.id
            goods.unitTypeName = ut.name
            return
          }
        })
      })
    }

    function getUnitTypeName(unitType){
      var name = ""
      $scope.unitTypes.forEach(function(ut){
        if(ut.id == unitType){
          name = ut.name
          return
        }
      })
      return name
    }

    /*包装做法列表*/
    function packageGoodsMethod(goodsMethods){
      $scope.goodsMethods = angular.copy($scope.sourceGoodsMethods)
      if(goodsMethods != undefined){
        $scope.goodsMethods.forEach(function(gms){
          goodsMethods.forEach(function(gm){
            if(gms.id == gm.id){
              gms.selected = true
            }
          })
        })
      }
    }

    function getGoodsMethodName(goodsMethods){
      var goodsMethodName = ""
      goodsMethods.forEach(function(goodsMethod){
        goodsMethodName = goodsMethodName + goodsMethod.name + "  "
      })
      return goodsMethodName
    }

    /**
     * 进入编辑栏
     * @param g
     */
    $scope.enterEdit = function(g){
      methodListSelected = []
      addSelectedArray(g.goodsMethods)
      $scope.model.goodses.forEach(function(goods){
        goods.isEdit = false
        goods.methodSearchArea = false
      })
      g.isEdit = true
      packageGoodsMethod(g.goodsMethods)
      $scope.showAddUnitType = false
      $scope.methodSearchArea = false
      $scope.model.searchKey = undefined
    }

    function addSelectedArray(goodsMethods){
      goodsMethods.forEach(function(gm){
        methodListSelected.push(gm.id)
      })
    }

    /**
     * 收起编辑栏
     * @param event
     * @param g
     */
    $scope.cancelEdit = function(event,g){
      event.stopPropagation()
      if(g == undefined){
        $scope.showAddUnitType = false
        $scope.methodSearchArea = false
      }else {
        g.isEdit = false
      }
    }

    /**
     * 展开添加规格编辑栏
     */
    $scope.addUnitType = function(){
      $scope.showAddUnitType = true
      $scope.addModel = {}
      $scope.addModel.unitType = $scope.unitTypes[0].id
      $scope.addModel.productType = $scope.productTypes[0].id
      packageGoodsMethod()
      $scope.model.goodses.forEach(function(g){
        g.isEdit = false
        g.methodSearchArea = false
      })
    }

    /**
     * 在编辑栏中的弹出框阻止冒泡
     * @param event
     */
    $scope.stopPopArea = function(event){
      event.stopPropagation()
    }

    $scope.goodsMethodToggle = function(event,g){
      if($scope.productType == 6){
        return
      }
      event.stopPropagation()
      if(g == undefined){
        $scope.methodSearchArea = !$scope.methodSearchArea
      }else {
        g.methodSearchArea = !g.methodSearchArea
      }
    }

    /**
     * 菜品方法列表搜索
     * @param searchKey
     * @param goods
     */
    $scope.goodsMethodSearch = function(searchKey, goods){
      $scope.goodsMethods = angular.copy($scope.sourceGoodsMethods)
      if(goods != undefined){ packageGoodsMethod(goods.goodsMethods)}
      $scope.goodsMethods.forEach(function(gm){
        methodListSelected.forEach(function(ms){
          if(gm.id == ms){
            gm.selected = true
            return
          }
        })
      })
      for(var i=0; i<$scope.goodsMethods.length; i++){
        if($scope.goodsMethods[i].name.indexOf(searchKey)==-1){
          $scope.goodsMethods.splice(i, 1)
          i--
        }
      }
    }

    var methodListSelected = []

    $scope.selectGoodsMethod = function(goodsMethod){
      goodsMethod.selected = !goodsMethod.selected
      if(goodsMethod.selected){
        methodListSelected.push(goodsMethod.id)
      } else {
        methodListSelected = methodListSelected.remove(goodsMethod.id)
      }
    }

    /**
     * 获取销售方式
     */
    function getProductTypeName(productType){
      for(var i=0; i<$scope.productTypes.length;i++){
        if(productType == $scope.productTypes[i].id){
          return $scope.productTypes[i].name
        }
      }
    }

    /**
     * 给数组添加过滤重复元素函数
     * @returns {Array}
     */
    Array.prototype.distinct = function(){
      var self = this
      var _array = []
      self.forEach(function(a){
        if(_array.indexOf(a) == -1){
          _array.push(a)
        }
      })
      return _array
    }

    /**
     * 数组添加删除指定元素函数
     * @param ele
     * @returns {Array}
     */
    Array.prototype.remove = function(ele){
      var self = this
      var _array = []
      self.forEach(function(a){
        if(a != ele){
          _array.push(a)
        }
      })
      return _array
    }

    /**
     * 提交编辑栏改动
     * @param g
     */
    $scope.saveEdit = function(g){
      $scope.isSaving = true
      var url = "/home/brand/" + brandId + "/goods/" + g.id + "/goodsMethod/update"
      var postModel = {}
      postModel.goods = g.id
      postModel.productType = g.productType
      postModel.unitType = g.unitType
      postModel.goodsMethods = methodListSelected
      /*$scope.goodsMethods.forEach(function(gm){
        if(gm.selected){
          postModel.goodsMethods.push(gm.id)
        }
      })
      g.goodsMethods.forEach(function(gm){
        postModel.goodsMethods.push(gm.id)
      })*/
      //postModel.goodsMethods = postModel.goodsMethods.distinct()
      $http.post(url, postModel).success(function(){
        g.productTypeName = getProductTypeName(g.productType)
        g.isEdit = false
        var goodsMethods = []
        postModel.goodsMethods.forEach(function(pm){
          $scope.goodsMethods.forEach(function(gm){
            if(gm.id == pm){
              goodsMethods.push(gm)
              return
            }
          })
        })
        g.goodsMethods = goodsMethods
        g.goodsMethodName = getGoodsMethodName(g.goodsMethods)
        $scope.isSaving = false
      })
    }

    /**
     * 删除菜品规格
     * @param g
     */
    $scope.deleteGoods = function(g){
      var url = "/home/brand/" + brandId + "/goods/" + g.id + "/remove"
      $http.delete(url).success(function(){
        for(var i=0;i<$scope.model.goodses.length;i++){
          if($scope.model.goodses[i].id == g.id){
            $scope.model.goodses.splice(i, 1)
            break
          }
        }
      }).error(function(data){
        alert(data.message)
      })
    }

    /**
     * 添加规格
     */
    $scope.addGoods = function(){
      $scope.isSaving = true
      var url = "/home/brand/" + brandId + "/goodsType/" + $state.params.goodsTypeId + "/goods/add"
      var postModel = $scope.addModel
      postModel.goodsMethods = []
      $scope.goodsMethods.forEach(function(gm){
        if(gm.selected){
          postModel.goodsMethods.push(gm.id)
        }
      })
      $http.post(url, postModel).success(function(data){
        var goods = postModel
        var goodsMethods = []
        postModel.goodsMethods.forEach(function(gm){
          $scope.sourceGoodsMethods.forEach(function(sgm){
            if(sgm.id == gm){
              goodsMethods.push(sgm)
              return
            }
          })
        })
        goods.id = data.id
        goods.goodsMethods = goodsMethods
        goods.goodsMethodName = getGoodsMethodName(goods.goodsMethods)
        goods.productTypeName = getProductTypeName(postModel.productType)
        goods.unitTypeName = getUnitTypeName(postModel.unitType)
        goods.isEdit = false
        $scope.model.goodses.unshift(goods)
        $scope.showAddUnitType = false
        $scope.methodSearchArea = false
        $scope.isSaving = false
      }).error(function(data){
        $scope.isSaving = false
        alert(data.message)
      })
    }

    /**
     * 展开菜品基本信息编辑栏
     */
    $scope.enterGoodsTypeEdit = function(){
      $scope.goodsTypeEdit = true
      $scope.model.group = angular.copy($scope.model.sourceGroup)
      $scope.model.subgroup = angular.copy($scope.model.sourceSubgroup)
      $scope.filterSubgroup($scope.model.group)
    }

    /**
     * 过滤小类列表
     * @param group
     */
    $scope.filterSubgroup = function(group){
      $scope.subgroups = angular.copy($scope.sourceSubgroups)
      for(var i=0;i<$scope.subgroups.length;i++){
        if($scope.subgroups[i].group != group){
          $scope.subgroups.splice(i, 1)
          i--
        }
      }
      if($scope.model.group != $scope.model.sourceGroup){
        $scope.model.subgroup = $scope.subgroups[0].id
      }else{
        $scope.model.subgroup = angular.copy($scope.model.sourceSubgroup)
      }
    }

    /**
     * 保存基本信息的修改
     */
    $scope.saveGoodsType = function(){
      var url = "/home/brand/" + brandId + "/goodsType/" + $state.params.goodsTypeId + "/base/update"
      var postModel = {}
      postModel.name = $scope.model.name
      postModel.group = $scope.model.group
      postModel.subgroup = $scope.model.subgroup
      postModel.image = $scope.model.sha
      $http.post(url, postModel).success(function(data){
        location.replace('/home/brand/' + brandId + '/goodsType/' + $state.params.goodsTypeId +  '/detail')
      }).error(function(data){
        alert(data.message)
      })
    }

    /**
     * 收起菜品编辑栏
     */
    $scope.cancelGoodsTypeEdit = function(){
      $scope.goodsTypeEdit = false
      $scope.model.name = angular.copy($scope.sourceModel.name)
      $scope.model.sha = angular.copy($scope.sourceModel.sha)
      $scope.model.f56_56_image = angular.copy($scope.sourceModel.f56_56_image)
      $scope.model.source_image = angular.copy($scope.sourceModel.source_image)
    }

    /**
     * 删除菜品, 删除成功后退回菜品列表
     */
    $scope.deleteGoodsType = function(model){
      var url = '/home/brand/' + brandId + '/goodsType/' + $state.params.goodsTypeId + '/remove'
      $http.delete(url).success(function(){
        location.replace('/home/brand/' + brandId + '/newGoods')
      }).error(function(data){
        alert(data.message)
      })
    }

    /**
     * 展开和收起原始图片
     */
    $scope.openSourceImage = function(){
      $scope.showSourceImage = !$scope.showSourceImage
    }

    /**
     * 上传图片
     */
    /**
     * 上传处理模块
     */
    var uploader = $scope.uploader = new FileUploader({
      url: '/home/brand/' + brandId + '/upload',
      autoUpload: true
    })

    /**
     * 上传过滤器
     */
    uploader.filters.push({
      name: 'customFilter',
      fn: function(item, options) {
        return this.queue.length < 10
      }
    })

    /**
     * 上传前准备
     * @param item
     */
    uploader.onBeforeUploadItem = function (item) {
      $scope.uploading = true
      console.info('onBeforeUploadItem', item)
    }

    /**
     * 文件上传进度
     * @param fileItem
     * @param progress
     */
    uploader.onProgressItem = function (fileItem, progress) {
      $scope.percentage = progress
      console.info('onProgressItem', fileItem, progress)
    }

    /**
     * 文件上传成功
     * @param fileItem
     * @param response
     * @param status
       * @param headers
       */
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers)
      $scope.model.source_image = response.url
      $scope.model.f56_56_image = response.url
      $scope.model.sha = response.sha
      $scope.uploading = false
    }

    /**
     * 删除菜品图片
     */
    $scope.deleteImage = function(model){
      model.f56_56_image = undefined
      model.source_image = undefined
      model.sha = undefined
    }
  }])
})
