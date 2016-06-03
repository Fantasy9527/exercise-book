var globalObject={};
       $(document).on('click', '.check-all', function(e) {
         if ($(this).is(':checked')) {
           $('.multi-selected').find('.check-item').each(function() {
             $(this).prop('checked', true);
             $(this).parent().parent().parent().addClass('selected');
           });
         } else {
           $('.multi-selected').find('.check-item').each(function() {
             $(this).prop('checked', false);
             $(this).parent().parent().parent().removeClass('selected');
           });
         }
       });

       $(document).on('click', '.check-item', function(e) {
         if ($(this).is(':checked')) {
           $(this).parent().parent().parent().addClass('selected');
         } else {
           $(this).parent().parent().parent().removeClass('selected');
         }
       });

       var clearSelected = function() {
         $('.check-all').prop('checked', false);
         $('.multi-selected').find('.check-item').each(function() {
           $(this).prop('checked', false);
           $(this).parent().parent().parent().removeClass('selected');
         });
       }

       var objectClone = function(model) {
         return jQuery.extend(true, {}, model) // clone
       }

       // 获取 HTTP Get 请求的查询值
       var getQueryString = function(name) {
         name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
         var re = new RegExp("[\\?&]" + name + "=([^&#]*)")
         var results = re.exec(location.search)
         return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "))
       }

       var updateQueryString = function(name, value) {
         var uri = location.search
         var re = new RegExp("([?&])" + name + "=.*?(&|$)", "i")
         var separator = uri.indexOf('?') !== -1 ? "&" : "?"
         if (uri.match(re)) {
           return uri.replace(re, '$1' + name + "=" + value + '$2')
         } else {
           return uri + separator + name + "=" + value
         }
       }

       var updateUrlQueryString = function(uri, name, value) {
         var re = new RegExp("([?&])" + name + "=.*?(&|$)", "i")
         var separator = uri.indexOf('?') !== -1 ? "&" : "?"
         if (uri.match(re)) {
           return uri.replace(re, '$1' + name + "=" + value + '$2')
         } else {
           return uri + separator + name + "=" + value
         }
       }



       $(function() {
         var brandId = location.pathname.replace('/home/brand/', '').replace(/(\w+)(\/.+)?/gi, "$1");
         //判断用户头像
         $(".user-block img").eq(0).attr("src") == "" && $(".user-block img").eq(0).attr("src", "/assets/images/user.jpg");

         if (location.pathname != "/home") {
           //如果不是主页加载列表;
           initBrandList()
         } else {
           $("#brandList").hide();
           $(".go-course").hide();
         }

         function initBrandList() {
           $.ajax({
             url: "/home/brand/" + brandId + "/get",
             type: "get",
             success: function(data) {
               $("#brandName").html(data.name)
             },
             error: function() {}
           })

           $.ajax({
             url: "/home/brands",
             type: "get",
             success: function(data) {
               for (var i = 0; i < data.length; i++) {
                 var oLi = $("<li></li>");
                 if (!data[i].logo) {
                   data[i].logo = "/assets/images/user.jpg";
                 }
                 oLi.html("<a class='clearfix' href='/home/brand/" + data[i].id + "/board'> <img src = '" + data[i].logo + "' alt =''/><div class = 'detail'> <strong>" + data[i].name + "</strong> <p class = 'no-margin' >" + returnRemark(data[i].remark) + "</p> </div></a> ");
                 $("#brandSwitch").append(oLi)
               }
             }
           })

           function returnRemark(remark) {
             if (remark == undefined) {
               return ""
             } else {
               return remark
             }
           }
         }


         //临时处理
         globalObject.host = "/static/backend/index.html#/"
         if (location.host.indexOf("sanyipos.com") == -1) {
           //本地环境
           globalObject.host = "/signdev/index.html#/"
         }


         $("#orderList").attr("href", globalObject.host + "home/order");
         $(".backHome").attr("href", globalObject.host + "home");
         $("#editProfile").attr("href", globalObject.host + "home/profile")
         $("#editPassword").attr("href", globalObject.host + "home/password")
         console.log(brandId);
         $(".go-course").on("click",function(){
           location.href=globalObject.host+"course?brand="+brandId;
         })
         //注销
         $("#logout").on("click",function(res){
            $.ajax({
              url:"/quit",
              type:"get",
              success:function(){
              location.href=globalObject.host+"login"
              }
            })
         })




       })
