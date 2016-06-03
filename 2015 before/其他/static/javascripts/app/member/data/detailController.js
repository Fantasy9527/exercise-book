define(["memberApp","datetimepicker", "tool"],function(app){
  /*会员基本信息controller*/
  app.controller('detailController', function($scope, $http, $stateParams, $timeout, $location, $anchorScroll) {
      /*设置页面名称*/
      $scope.currentMember={};
      $scope.bindToAddingModel = function(val, value) {
          eval("$scope." + val + "='" + value + "'");
      }
      /*设置当前bread显示*/
      $scope.cardState = -1;
      $scope.memberId = $stateParams.memberId;
      /*拼接获取会员详细信息的url*/
      var getMemberDetailUrl = '/home/brand/' + brandId + '/member/' + $stateParams.memberId;
      /*获取会员的详细信息*/
      $http.get(getMemberDetailUrl).success(function(data) {
          $scope.model = data.member.member;
          $scope.model.memberType = data.member.member_type.id;
          $scope.model.memberTypeName = data.member.member_type.name;
          data.staffs.forEach(function(staff) {
              if (staff.id == $scope.model.sale_staff) {
                  $scope.model.sale_staff = staff.name;
              }
          })
          console.log(data);
          $scope.model.card_no = data.card.card_no
          $scope.model.rfid = data.card.rfid
          $scope.model.total_balance = formatPrice($scope.model.charge_balance + $scope.model.gift_balance);
          $scope.model.create_on = $scope.model.create_on.substr(0, 10);
          data.identTypes.forEach(function(identType) {
              if (identType.id == $scope.model.id_type) {
                  $scope.model.identType = identType.id
                  $scope.model.identTypeName = identType.name
              }
          })
          if ($scope.model.sex != '男' && $scope.model.sex != '女') {
              $scope.model.sex = '';
          }
      })
      /*挂失和冻结*/
      $scope.changeMemberState = function(val) {
          if (val == 1) {
              $scope.warnInfo = "再次启用";
          } else if (val == 2) {
              $scope.warnInfo = "停用";
          } else if (val == 192) {
              $scope.warnInfo = "挂失";
          }
          var saveModelUrl = '/home/brand/' + brandId + '/member/' + $scope.memberId + '/save';
          var postModel = JSON.parse(JSON.stringify($scope.model));
          postModel.state = val;
          $http.post(saveModelUrl, postModel).success(function(data) {
              $scope.model.state = data.state;
              $scope.showAlert = 1;
              $timeout(function() {
                  $scope.showAlert = -1;
              }, 5000)
          })
      }

      $scope.isEdit = -1;
      $scope.showEditAlert = -1;
      $scope.sexes = ["男", "女"]
      $scope.editMember = function() {
          $scope.isEdit = 1
          getEditMemberBase()
      }
      function getEditMemberBase(){
          $scope.editModel = JSON.parse(JSON.stringify($scope.model))
          var url = '/home/brand/' + brandId + '/member/edit/base'
          $http.get(url).success(function(data){
              $scope.memberTypes = data.memberTypes
              $scope.identTypes = data.identTypes
          })
      }
      $scope.hideEdit = function() {
          $scope.isEdit = -1;
      }
      function packageModel(){
          $scope.memberTypes.forEach(function(memberType){
              if($scope.model.memberType == memberType.id){
                  $scope.model.memberTypeName = memberType.name
                  return
              }
          })
          $scope.identTypes.forEach(function(identType){
              if($scope.model.identType == identType.id){
                  $scope.model.identTypeName = identType.name
                  return
              }
          })
      }
      $scope.saveModel = function() {
          var saveModelUrl = '/home/brand/' + brandId + '/member/' + $scope.memberId + '/save';
          $http.post(saveModelUrl, $scope.editModel).success(function(data) {
              $scope.model = JSON.parse(JSON.stringify($scope.editModel))
              packageModel()
              $scope.isEdit = -1;
              $scope.showEditAlert = 1;
              $location.hash('isEditAlert');
              $anchorScroll();
              $timeout(function() {
                  $scope.showEditAlert = -1;
              }, 5000)
              $scope.model.name = data.name;
              $scope.model.birthday = data.birthday;
          }).error(function(data){
              alert(data.message)
          })
      }
      $('.datepickerTime').datetimepicker();
      //调整
      $scope.balanceChange = function() {
          $scope.modalOpen = true;
          $scope.giftChangeValue = "";
          $scope.chargeChangeValue = "";
          $scope.pointChangeValue = "";
      }

      $scope.closeModel = function() {
          //余额窗口关闭
          $scope.modalOpen = false;
          //积分窗口关闭
          $scope.pointModalOpen = false;
          //充值窗口还原
          $scope.changeBtnShow = true;
          $scope.changeRemark = "";
      }

      $scope.changeBtnShow = true;
      $scope.isRecharge = false;

      $scope.recharge = function() {
          $scope.changeBtnShow = false;
          $scope.isRecharge = true;
      }

      $scope.withhold = function() {
          $scope.changeBtnShow = false;
          $scope.isRecharge = false;
      }

      $scope.changeBalance = function(s) {
          var json;
        if(($scope.chargeChangeValue===""&&$scope.giftChangeValue==="")||($scope.chargeChangeValue==0&&$scope.giftChangeValue==0)){
          alert("请在需要调整的账户输入调整金额");
          return
        }

          if (s == "isChargeChange") {
              json = {
                  "charge": isRecharge($scope.chargeChangeValue)==""?0:isRecharge($scope.chargeChangeValue),
                  "gift": isRecharge($scope.giftChangeValue)==""?0:isRecharge($scope.giftChangeValue),
                  "point": 0,
                  "remark": $scope.changeRemark
              }
          } else {
              json = {
                  "charge": 0,
                  "gift": 0,
                  "point": isRecharge($scope.pointChangeValue)==""?0:isRecharge($scope.pointChangeValue),
                  "remark": $scope.changeRemark
              }
              if(json.point==0){
                alert("请输入有意义的调整数字");
                return
              }
          }

          function isRecharge(e) {
              if ($scope.isRecharge) {
                  return e
              } else {
                  return -e
              }
          }
          if($.trim(json.remark)==""){
              alert("备注不能为空");
              return
          }

          if(json.remark.length>100){
              alert("备注不能超过100个字");
              return
          }

          $http.post("/home/brand/" + brandId + "/member/balance/" + $stateParams.memberId, json).success(function(res) {
              $scope.model.charge_balance = res.charge_balance;
              $scope.model.gift_balance = res.gift_balance;
              $scope.model.point = res.point;
              $scope.closeModel()
          }).error(function(res) {
              alert(res.message)
          })
      }
      //积分调整
      $scope.pointOpen = function() {
          $scope.modalOpen = false;
          $scope.pointModalOpen = true;
      }
  })
})
