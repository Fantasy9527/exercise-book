require.config({
  paths: {
    "jquery": "/assets/endless/js/jquery-1.11.1.min",
    "bootstrap": "/assets/endless/js/bootstrap.min",
    "momentWithLangs": "/assets/javascripts/moment-with-langs",
    "datetimepicker": "/assets/javascripts/bootstrap-datetimepicker.min",
    "pace": "/assets/endless/js/pace.min",
    "popupoverlay": "/assets/endless/js/jquery.popupoverlay.min",
    "slimscroll": "/assets/endless/js/jquery.slimscroll.min",
    "modernizr": "/assets/endless/js/modernizr.min",
    "cookie": "/assets/endless/js/jquery.cookie.min",
    "endless": "/assets/endless/js/endless/endless",
    "parsley": "/assets/endless/js/parsley.min.zh_cn",
    "init": "/assets/javascripts/sanyi-init",
    "main": "/assets/javascripts/main",
    "stickUp": "/assets/javascripts/stickUp.min",
    "echarts": "/assets/javascripts/eCharts"
  },
  shim: {
    "bootstrap": {
      deps: ["jquery"]
    },
    "momentWithLangs": {
      deps: ["jquery", "bootstrap"]
    },
    "datetimepicker": {
      deps: ["momentWithLangs"]
    },
    "popupoverlay": {
      deps: ["jquery", "bootstrap"]
    },
    "slimscroll": {
      deps: ["jquery", "bootstrap"]
    },
    "endless": {
      deps: ["jquery", "bootstrap", "modernizr", "popupoverlay", "slimscroll"]
    },
    "parsley": {
      deps: ["jquery", "bootstrap"]
    },
    "stickUp": {
      deps: ["jquery", "bootstrap"]
    },
    "init": {
      deps: ["jquery", "bootstrap"]
    },
    "main": {
      deps: ["jquery", "bootstrap"]
    },
    "jquery": {
      exports: "jQuery"
    }

  }
});
var area = null;
require([
  'echarts',
  'echarts/chart/config',
  'echarts/chart/bar',
  'echarts/chart/line',
  'echarts/chart/map',
  'echarts/chart/pie',
  "pace",
  "endless",
  "stickUp",
  "init",
  "main",
  "datetimepicker"
], function(echarts, ecConfig) {
  jQuery(function($) {
    $(document).ready(function() {
      if ($('.time-tabStickUp').length != 0) {
        $('.time-tabStickUp').stickUp({
          marginTop: '65px'
        });
      }
    });
  });
  //时间计算-----------------------------
  var time = {};
  var timeData = null;
  var searchArea = '';
  var brandId = location.pathname.replace('/home/brand/', '').replace(/(\w+)(\/.+)?/gi, "$1");
  //console.log(brandId)
  area = 'country=1';

  //时间获取
  $.ajax({
    url: "/home/brand/" + brandId + "/board/dayspan",
    type: "get",
    cache: true,
    success: function(data) {
      timeData = data;
      returnTime('week');
      //console.log(data)
      //console.log(returnTime('week'))
      chartsFire();
    }
  })


  function returnTime(timeType) {
    if (timeType == 'today') {
      for (var i = 0; i < timeData.length; i++) {
        if (timeData[i].id == 1) {
          time.beginTime = timeData[i].begin;
          time.endTime = timeData[i].end;
          break
        }
      }

    } else if (timeType == 'yesterday') {
      for (var i = 0; i < timeData.length; i++) {
        if (timeData[i].id == 2) {
          time.beginTime = timeData[i].begin;
          time.endTime = timeData[i].end;
          break
        }
      }


    } else if (timeType == 'week') {
      for (var i = 0; i < timeData.length; i++) {
        if (timeData[i].id == 3) {
          time.beginTime = timeData[i].begin;
          time.endTime = timeData[i].end;
          break
        }
      }

    } else if (timeType == 'month') {
      for (var i = 0; i < timeData.length; i++) {
        if (timeData[i].id == 4) {
          time.beginTime = timeData[i].begin;
          time.endTime = timeData[i].end;
          break
        }
      }

    } else if (timeType == 'season') {
      for (var i = 0; i < timeData.length; i++) {
        if (timeData[i].id == 5) {
          time.beginTime = timeData[i].begin;
          time.endTime = timeData[i].end;
          break
        }
      }

    } else if (timeType == 'year') {
      for (var i = 0; i < timeData.length; i++) {
        if (timeData[i].id == 6) {
          time.beginTime = timeData[i].begin;
          time.endTime = timeData[i].end;
          break
        }
      }

    } else if (timeType == 'other') {
      return
    }
    return time
  }






  //初始化图标对象-----------------------------

  //第一页
  var timeConsumption = echarts.init(document.getElementById('timeConsumption'));
  var collectType = echarts.init(document.getElementById('collectType'));
  var coreCharst = echarts.init(document.getElementById('coreCharst'));
  var incomeMapCharts = echarts.init(document.getElementById('incomeMapCharts'));;

  //第二页
  var classifyCharst = echarts.init(document.getElementById('classifyCharst'));
  var classifyCharst2 = echarts.init(document.getElementById('classifyCharst2'));
  var foodCharst = echarts.init(document.getElementById('topfoodCharst'));
  var returnFood = echarts.init(document.getElementById('returnFood'));
  var returnFood2 = echarts.init(document.getElementById('returnFood2'));
  //第三页
  // var incomeCharst = echarts.init(document.getElementById('incomeCharst'));
  // var sexCharst = echarts.init(document.getElementById('sexCharst'));
  // var ageCharts = echarts.init(document.getElementById('ageCharts'));
  // var addVipCharst = echarts.init(document.getElementById('addVipCharst'));
  // var vipMapCharts = echarts.init(document.getElementById('vipMapCharts'));

  $(window).on("resize", function() {
    //第一页

    coreCharst.resize();
    incomeMapCharts.resize();
    timeConsumption.resize();
    collectType.resize();
    //第二页
    classifyCharst.resize();
    classifyCharst2.resize();
    foodCharst.resize();
    returnFood.resize();
    returnFood2.resize();

    //第三页
    //addVipCharst.resize();
    //  incomeCharst.resize();
    //sexCharst.resize();
    // addVipCharst.resize();
    // vipMapCharts.resize();
    // ageCharts.resize();
  })
  tabCharstInit();


  //图标对象存起来
  var aCharst = [
    [timeConsumption, collectType, coreCharst, incomeMapCharts],
    [classifyCharst, classifyCharst2, foodCharst, returnFood, returnFood2],
    //  [incomeCharst, sexCharst, ageCharts, addVipCharst, vipMapCharts]
  ];


  //全部启动-----------------------------
  function chartsFire() {
    //函数名存起来
    var aTabcharstFn = [
      [coreCharstFn, collectTypeFn, timeConsumptionFn, jsonArrange, incomeMapChartsFn],
      [classifyCharstFn, foodCharstFn, topfoodTable, returnFoodFn, returnFoodFn2],
      //  [incomeCharstFn, sexCharstFn, ageChartsFn, addVipCharstFn, vipMapChartsFn]
    ];
    //全部启动
    for (var i = 0; i < aTabcharstFn.length; i++) {
      for (var k = 0; k < aTabcharstFn[i].length; k++) {
        aTabcharstFn[i][k]();
      }
    }
  }


  //Tab按钮刷新图表
  function tabCharstInit() {
    var lastTab = 0;

    $("#charst-tab li").on("click", function() {
      var index = $(this).index();
      $("#tab-content-charst .tab-charst-c").css("display", "none");
      $("#tab-content-charst .tab-charst-c").eq(index).addClass("fadeInDown")
      $("#tab-content-charst .tab-charst-c").eq(index).css("display", "block");
      console.log(aCharst)
      for (var k = 0; k < aCharst[index].length; k++) {
        aCharst[index][k].resize();
        aCharst[index][k].restore();
      }
    })
  }





  //自定义时间-----------------------------
  regionData = function() {
    $("#region-data .dropdown-menu li").on("click", function() {
      $("#region-data .btn").html($(this).html() + '<span class="caret"></span>')
        //点击获取新的图表数据
    })
  }



  var oldEle = 3;
  var navTabFirstClick = true;
  navTab = function() {
    $("#time-tab li").on("click", function() {
      //点击时间导航获取新的图表数据
      if ($(this).has("span").length > 0) {
        oldEle = $("#time-tab .active").index();
        $("#time-tab li").removeClass("active");
        $(this).addClass("active");
        //  console.log();
        if ($(this).data('time') != 'other') {
          returnTime($(this).data('time'))
          chartsFire()
        }
      }
      //console.log(oldEle)
    })
  };


  timeBar = function() {
    var showToggle = true;
    $(".timeBar").on("click", function() {
      $(this).parent().parent().find("li").removeClass("active")
      $(".timeBar").addClass("active");
      if (showToggle) {
        showToggle = false;
        $(".timeBar").find(".dropdown-menu").fadeIn();
      } else {
        showToggle = true;
        $(".timeBar").find(".dropdown-menu").fadeOut();
      }
      return false;
    });
    $(".timeBar input").on("click", function() {
      return false
    });


    $(document).on("click", function(e) {
      if (e.target == $(".timeBar .dropdown-menu")[0] || $(".timeBar .dropdown-menu").has(e.target).length > 0) {
        showToggle = false;
        $(".timeBar .dropdown-menu").fadeIn();
      } else {
        if (showToggle == false) {
          $("#time-tab .active").removeClass("active");
          $("#time-tab li").eq(oldEle).addClass("active");
        }
        showToggle = true;
        $(".timeBar .dropdown-menu").fadeOut();
      }

    })

    $(".timeBar .btn").on("click", function() {
      showToggle = true;
      $(".timeBar .dropdown-menu").fadeOut();
      if ($('#beginTime').val() == "" || $('#endTime').val() == "") {
        $(".timeBar>span").html("自定义")

      } else {
        $(".timeBar>span").html($('#beginTime').val() + " ~ " + $('#endTime').val())
        time.beginTime = $('#beginTime').val();
        time.endTime = $('#endTime').val();
        // alert()
        chartsFire();
        //console.log(time);
      }
      return false
    });



    function initDate() {
      $('#beginTime').datetimepicker()
      $('#endTime').datetimepicker()
    }
    setTimeout(initDate, 1000)
      // initDate()
  }








  //24小时统计
  function timeConsumptionFn() {
    //条形统计图
    var option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['消费量']
      },
      color: ["#65cea7"],
      toolbox: {
        show: false
      },
      xAxis: [{
        type: 'category',
        data: ['0点', '1点', '2点', '3点', '4点', '5点', '6点', '7点', '8点', '9点', '10点', '11点', '12点', '13点', '14点', '15点', '16点', '17点', '18点', '19点', '20点', '21点', '22点', '23点', ]
      }],
      yAxis: [{
        type: 'value'
      }],
      series: [{
        name: '消费量',
        type: 'bar',
        data: [],
        markPoint: {
          data: [{
            type: 'max',
            name: '最大值'
          }, {
            type: 'min',
            name: '最小值'
          }]
        },
        markLine: { //平均值标识
          data: [{
            type: 'average',
            name: '平均值'
          }]
        }
      }]
    };

    $.ajax({
      url: '/home/brand/' + brandId + '/board/incoming',
      type: 'get',
      data: 'begin=' + time.beginTime + '&end=' + time.endTime + '&grouping=hour&' + area,
      cache: true,
      success: function(data) {
        for (var i = 0; i < data.length; i++) {
          option.series[0].data.push(data[i].kpi.realValue);
        }
        timeConsumption.setOption(option);
      }
    })
  }

  //收银
  function collectTypeFn() {
    var option = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: { //小图标样式跟数据文字
        //orient : 'vertical',
        x: 'center',
        y: 'bottom',
        data: []
      },
      color: ["#ff836d", "#78d6b2", "#67afbd", "#f4cf7f", "#27AE60", "#7F8C8D", "#2980B9", "#b7da90", "#143b17", "#23685e", "#31102b", "#160716", "#c14491", "#eee6cb", "#82cd69", "#3cb5b1", "#a0355a"],
      toolbox: {
        show: false

      },
      series: [{
        name: '收银方式',
        type: 'pie',
        radius: ['50%', '70%'],
        itemStyle: {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          },
          emphasis: {
            label: {
              show: true,
              position: 'center',
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          }
        },
        data: []
      }]
    };


    $.ajax({
      url: "/home/brand/" + brandId + "/board/payment",
      type: "get",
      data: "begin=" + time.beginTime + "&end=" + time.endTime + '&' + area,
      cache: true,
      success: function(data) {
        //console.log(data)
        var isZero = 0;
        for (var i = 0; i < data.length; i++) {
          option.legend.data.push(data[i].name);
          if (data[i].value == 0) {
            isZero++
          }
        }

        //console.log(isZero)
        if (isZero == data.length) {
          option.series[0].data = [{
            value: 1,
            name: '暂无数据'
          }];
          option.legend.data = [];
          option.legend.data[0] = '暂无数据'
        } else {
          option.series[0].data = data;
        }
        collectType.clear();
        collectType.setOption(option);
        collectTable(data)
      }
    })
  }


  //收银表格
  function collectTable(data) {
    data.sort(function(a, b) {
      return b.value - a.value
    })
    var maxPage = Math.ceil(data.length / 10);
    var indexPage = 0;
    if (maxPage == 1 || maxPage == 0) {
      $("#collectType-panel-footer").hide()
    } else {
      $("#collectType-panel-footer").show();

    }



    for (var i = 0; i < maxPage; i++) {
      var oBtn = $("<li>", {
        class: "page"
      })
      if (i == 0) {
        oBtn.addClass("active")
      }

      oBtn.html("<a href='javascript:;'>" + (i + 1) + "</a>");
      $('#collectTypeTableBtn li').eq(-1).before(oBtn)
    }
    initData();

    function initData() {
      $("#collectTypeTable tbody").html("");
      for (var i = indexPage * 10; i < indexPage * 10 + 10; i++) {
        var oTr = $("<tr>");
        if (data[i]) {
          oTr.append(
            "<td>" + (i + 1) + ". " + data[i].name + "</td>" +
            "<td>" + data[i].value + "</td>"
          )
          $("#collectTypeTable tbody").append(oTr)
        } else {
          oTr.append(
            "<td>-</td>" +
            "<td>-</td>"
          )
          $("#collectTypeTable tbody").append(oTr)
        }
      }

    }


    $("#collectTypeTableBtn .preBtn").on("click", function() {
      indexPage--;
      if (indexPage < 0) {
        indexPage = 0
      }
      $("#collectTypeTableBtn .active").removeClass("active");
      $("#collectTypeTableBtn .page").eq(indexPage).addClass("active");
      initData();

    })

    $("#collectTypeTableBtn .nexBtn").on("click", function() {
      indexPage++;
      if (indexPage >= maxPage) {
        indexPage = maxPage - 1;
      }
      $("#collectTypeTableBtn .active").removeClass("active");
      $("#collectTypeTableBtn .page").eq(indexPage).addClass("active")
      initData()

    })

    $("#collectTypeTableBtn .page").on("click", function() {
      $("#collectTypeTableBtn .active").removeClass("active");
      $("#collectTypeTableBtn .page").eq($(this).index() - 1).addClass("active");
      indexPage = $(this).find("a").html() - 1
      initData()

    })
  }

  var coreTimeType = "day";
  var coreDataType = "realValue";


  //核心统计
  function coreCharstFn() {
    coreCharst.clear();
    var option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: '#48b',
            width: 2,
            type: 'solid'
          },
          crossStyle: {
            color: '#1e90ff',
            width: 1,
            type: 'dashed'
          },
          shadowStyle: {
            size: 'auto',
            color: 'rgba(150,150,150,0.3)'
          }
        }
      },
      dataZoom: {
        show: true,
        realtime: true,
        start: 0,
        end: 100
      },
      color: ["rgb(55,180,148)"],
      legend: {
        data: []
      },
      grid: {
        x: 76,
        y: 11,
        x2: 40,
        y2: 80
      },
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        data: []
      }],
      yAxis: [{
        type: 'value',
        borderColor: "#000"
      }],
      series: [{
        name: '',
        type: 'line',
        smooth: true,
        itemStyle: {
          normal: {
            areaStyle: {
              type: 'default',
              color: "rgba(0,0,0,0)"
            }
          }
        },
        data: []

      }]
    };

    var startTime = time.beginTime;
    var endTime = time.endTime;
    coreTimeType = $("#core .tab-left .active").data("charts");
    coreDataType = $("#core-tab .active").data("charts");

    $("#core-tab-l li").off();
    $("#core-tab-l li").on("click", function() {
      coreTimeType = $(this).data("charts");
      coreDataType = $("#core-tab .active").data("charts");
      //console.log(dataType)
      initCharst(startTime, endTime, coreTimeType, coreDataType);
    });


    $("#core-tab li").off();
    $("#core-tab li").on("click", function() {
      coreDataType = $(this).data("charts");
      coreTimeType = $("#core-tab-l .active").data("charts");

      initCharst(startTime, endTime, coreTimeType, coreDataType);
    })



    initCharst(startTime, endTime, coreTimeType, coreDataType);
    //$("#core-tab li").removeClass("active").eq(0).addClass("active");
    //$("#core .tab-left li").removeClass("active").eq(0).addClass("active");
    //默认为天
    function initCharst(start, end, grouping, type) {
      coreCharst.clear();
      //console.log(grouping);
      //console.log(type);
      $.ajax({
        url: "/home/brand/" + brandId + "/board/incoming",
        type: "get",
        data: "begin=" + start + "&end=" + end + "&grouping=" + grouping + '&' + area,
        cache: true,
        success: function(data) {
          option.series[0].data = [];
          option.xAxis[0].data = [];
          if (type == "realValue") {
            option.series[0].name = "销售收入";
            for (var i = 0; i < data.length; i++) {
              option.series[0].data[i] = data[i].kpi.realValue;
              option.xAxis[0].data[i] = data[i].time;
            }

          } else if (type == "person") {
            option.series[0].name = "人数"
            for (var i = 0; i < data.length; i++) {
              option.series[0].data[i] = data[i].kpi.person;
              option.xAxis[0].data[i] = data[i].time;
            }

          } else if (type == "avgOfOrder") {
            option.series[0].name = "桌均消费"
            for (var i = 0; i < data.length; i++) {
              option.series[0].data[i] = data[i].kpi.avgOfOrder;
              option.xAxis[0].data[i] = data[i].time;
            }
          } else if (type == "avgOfPerson") {
            option.series[0].name = "人均消费"
            for (var i = 0; i < data.length; i++) {
              option.series[0].data[i] = data[i].kpi.avgOfPerson;
              option.xAxis[0].data[i] = data[i].time;
            }

          } else if (type == "turnRate") {
            option.series[0].name = "翻台率";
            /*option.tooltip.formatter=function(params){
                return

            }*/
            for (var i = 0; i < data.length; i++) {
              //console.log(data[i].kpi.turnRate)
              option.series[0].data[i] = data[i].kpi.turnRate * 100;
              option.xAxis[0].data[i] = data[i].time;
            }

          }

          // 为echarts对象加载数据;

          coreCharst.setOption(option);

        }
      })
    }



  }





  function classifyCharstFn() {
    classifyCharst.clear();
    classifyCharst2.clear();
    var option = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: { //小图标样式跟数据文字
        //orient : 'vertical',
        x: 'center',
        y: 'bottom',
        data: []
      },
      color: ["#ff836d", "#78d6b2", "#67afbd", "#f4cf7f", "#27AE60", "#7F8C8D", "#2980B9", "#b7da90", "#143b17", "#23685e", "#31102b", "#160716", "#c14491", "#eee6cb", "#82cd69", "#3cb5b1", "#a0355a"],
      toolbox: {
        show: false

      },
      series: [{
        name: '菜品分类',
        type: 'pie',
        radius: ['50%', '70%'],
        itemStyle: {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          },
          emphasis: {
            label: {
              show: true,
              position: 'center',
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          }
        },
        data: []
      }]
    };


    var option2 = {
      tooltip: {
        show: true,
        trigger: 'axis'
      },

      color: ["#65cea7"],
      toolbox: {
        show: false,
        feature: {
          mark: {
            show: true
          },
          dataView: {
            show: true,
            readOnly: false
          },
          magicType: {
            show: true,
            type: ['line', 'bar']
          },
          restore: {
            show: true
          },
          saveAsImage: {
            show: true
          }
        }
      },
      xAxis: [{
        type: 'value',
        boundaryGap: [0, 0.01]
      }],
      yAxis: [{
        type: 'category',
        data: []
      }],
      series: [{
        name: '菜品分类销售统计',
        type: 'bar',
        data: []

      }]
    };





    var classifyType = function(type) {
      $.ajax({
        url: "/home/brand/" + brandId + "/board/goodsgroup",
        type: "get",
        data: 'begin=' + time.beginTime + '&end=' + time.endTime + "&sorting=" + type + '&' + area,
        cache: true,
        success: function(data) {
          for (var i = 0; i < data.length; i++) {
            option.series[0].data[i] = {
              value: data[i][type],
              name: data[i].name
            }

            option.legend.data.push(data[i].name);

          }

          if (option.legend.data.length == 0) {
            option.series[0].data[i] = {
              value: 1,
              name: '暂无数据'
            }
            option.legend.data[0] = '暂无数据'
          }
          ////////////////////////////////////////
          //条形统计图

          for (var i = 0; i < data.length; i++) {
            if (data[i].value == null) {
              option2.series[0].data.push(0);
            } else {
              option2.series[0].data.push(data[i][type]);
            }

            if (data[i].name == null) {
              option2.yAxis[0].data.push(0);
            } else {
              option2.yAxis[0].data.push(data[i].name);
            }

          }
          if (option2.yAxis[0].data.length == 0 || option2.series[0].data.length == 0) {
            option2.yAxis[0].data = ['暂无数据'];
            option2.series[0].data = [0];

          }
          classifyCharst2.setOption(option2);
          classifyCharst.setOption(option);
        }
      })
    }



    classifyType('value');
    $('#classify .tab-bar li').removeClass("active").eq(0).addClass("active")
    $('#classify .tab-bar li').off().on('click', function() {
      if ($(this).index() == 0) {
        classifyCharst.clear();
        classifyCharst2.clear();
        //清零
        option.series[0].data = [];
        option.legend.data = [];
        //清零
        option2.yAxis[0].data = [];
        option2.series[0].data = [];
        //运行
        classifyType('value');
      } else {
        classifyCharst.clear();
        classifyCharst2.clear();
        //清零
        option.series[0].data = [];
        option.legend.data = [];
        //清零
        option2.yAxis[0].data = [];
        option2.series[0].data = [];
        //运行
        classifyType('count');
      }

    })


  }




  function foodCharstFn() {
    foodCharst.clear();
    var option = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: { //小图标样式跟数据文字
        //orient : 'vertical',
        x: 'center',
        y: 'bottom',
        data: []
      },
      color: ["#ff836d", "#78d6b2", "#67afbd", "#f4cf7f", "#27AE60", "#7F8C8D", "#2980B9", "#b7da90", "#143b17", "#23685e", "#31102b", "#160716", "#c14491", "#eee6cb", "#82cd69", "#3cb5b1", "#a0355a"],
      toolbox: {
        show: false

      },
      series: [{
        name: 'Top前十销售金额菜品',
        type: 'pie',
        radius: ['50%', '70%'],
        itemStyle: {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          },
          emphasis: {
            label: {
              show: true,
              position: 'center',
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          }
        },
        data: []
      }]
    };

    var foodType = function(type) {
      $.ajax({
        url: "/home/brand/" + brandId + "/board/goods",
        type: "get",
        data: 'begin=' + time.beginTime + '&end=' + time.endTime + "&sorting=" + type + "&page=0" + '&' + area,
        cache: true,
        success: function(data) {
          for (var i = 0; i < data.stats.length; i++) {
            function returnName() {
              if (data.stats[i].unitTypeName) {
                return data.stats[i].name + "  (" + data.stats[i].unitTypeName + ")"
              } else {
                return data.stats[i].name
              }
            }
            option.series[0].data[i] = {
              value: data.stats[i][type],
              name: returnName()
            }
            option.legend.data.push(returnName());
          }

          if (option.legend.data.length == 0) {
            option.series[0].data[i] = {
              value: 1,
              name: '暂无数据'
            }
            option.legend.data[0] = '暂无数据'
          }
          // 为echarts对象加载数据
          foodCharst.setOption(option);
        }

      })


    }

    foodType("value");
    $("#topTen .tab-bar li").removeClass("active").eq(0).addClass("active");

    $("#topTen .tab-bar li").off().on('click', function() {
      foodCharst.clear();
      if ($(this).index() == 0) {
        option.legend.data = [];
        option.series[0].data = [];
        foodType('value');
      } else {
        option.legend.data = []
        option.series[0].data = []
        foodType('count');
      }
    })
  }





  function foodCharstFn2() {
    foodCharst2.clear()
    var option = {
      tooltip: {
        show: true,
        trigger: 'axis'
      },

      color: ["#65cea7"],
      toolbox: {
        show: false,
        feature: {
          mark: {
            show: true
          },
          dataView: {
            show: true,
            readOnly: false
          },
          magicType: {
            show: true,
            type: ['line', 'bar']
          },
          restore: {
            show: true
          },
          saveAsImage: {
            show: true
          }
        }
      },
      xAxis: [{
        type: 'value',
        boundaryGap: [0, 0.01]
      }],
      yAxis: [{
        type: 'category',
        data: ['单锅', '加料', '主食', '酒水', '凉菜', '套餐', '涮菜', '组合锅', '酱料']
      }],
      series: [{
        name: '2011年',
        type: 'bar',
        data: [28203, 13489, 12034, 104970, 91744, 80230, 74970, 61744, 50230]
      }]
    };


    // 为echarts对象加载数据
    foodCharst2.setOption(option);



  }






  function returnFoodFn() {
    returnFood.clear();
    var option = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: { //小图标样式跟数据文字
        //orient : 'vertical',
        x: 'center',
        y: 'bottom',
        data: []
      },
      color: ["#ff836d", "#78d6b2", "#67afbd", "#f4cf7f", "#27AE60", "#7F8C8D", "#2980B9", "#b7da90", "#143b17", "#23685e", "#31102b", "#160716", "#c14491", "#eee6cb", "#82cd69", "#3cb5b1", "#a0355a"],
      toolbox: {
        show: false

      },
      series: [{
        name: '退菜原因',
        type: 'pie',
        radius: ['50%', '70%'],
        itemStyle: {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          },
          emphasis: {
            label: {
              show: true,
              position: 'center',
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          }
        },
        data: []
      }]
    };


    returnFood2.clear()
    var returnFood2option = {

      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['退菜']
      },
      toolbox: {
        show: false,
        feature: {
          mark: {
            show: true
          },
          dataView: {
            show: true,
            readOnly: false
          },
          magicType: {
            show: true,
            type: ['line', 'bar']
          },
          restore: {
            show: true
          },
          saveAsImage: {
            show: true
          }
        }
      },
      color: ["#65cea7"],
      xAxis: [{
        type: 'category',
        data: []
      }],
      yAxis: [{
        type: 'value'
      }],
      series: [{
        name: '退菜',
        type: 'bar',
        data: [],
        markPoint: {
          data: [{
            type: 'max',
            name: '最大值'
          }, {
            type: 'min',
            name: '最小值'
          }]
        },
        markLine: {
          data: [{
            type: 'average',
            name: '平均值'
          }]
        }
      }]
    };

    // 为echarts对象加载数据

    $.ajax({
      url: '/home/brand/' + brandId + '/board/returndish',
      type: "get",
      data: 'begin=' + time.beginTime + '&end=' + time.endTime + '&' + area,
      dataType: "json",
      cache: true,
      success: function(returndishData) {
        returndishCount("value");


        $("#returndishTab li").removeClass("active").eq(0).addClass("active");
        $("#returndishTab li").off().on("click", function returndishTab() {
          if ($(this).index() == 0) {
            returnFood.clear();
            returnFood2.clear()
            returndishCount("value");

          } else {
            returnFood.clear();
            returnFood2.clear()
            returndishCount("count");
          }


        })






        function returndishCount(type) {
          var isZero = 0;
          option.legend.data.length = 0;
          option.series[0].data.length = 0;
          returnFood2option.xAxis[0].data.length = 0;
          returnFood2option.series[0].data.length = 0;
          for (var i = 0; i < returndishData.length; i++) {
            option.legend.data.push(returndishData[i].name)
            option.series[0].data.push({
              value: returndishData[i][type],
              name: returndishData[i].name
            })
            returnFood2option.xAxis[0].data.push(returndishData[i].name)
              //returnFood2option.legend.data.push(returndishData[i].name)
            returnFood2option.series[0].data.push(returndishData[i][type])

            if (returndishData[i][type] == 0) {
              isZero++;
            }
          }

          if (isZero == returndishData.length) {
            option.series[0].data = [{
              value: 1,
              name: '暂无数据'
            }];
            option.legend.data = [];
            option.legend.data[0] = '暂无数据'
          }

          returnFood.setOption(option);
          returnFood2.setOption(returnFood2option);
        }


      }
    })






  }




  function returnFoodFn2() {


  }



  function incomeCharstFn() {
    incomeCharst.clear()
    var option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['充值', '抵扣']
      },
      toolbox: {
        show: false,

      },
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      }],
      yAxis: [{
        type: 'value'
      }],
      series: [{
        name: '充值',
        type: 'line',
        stack: '总量',
        data: [120, 132, 101, 134, 90, 230, 210]
      }, {
        name: '抵扣',
        type: 'line',
        stack: '总量',
        data: [220, 182, 191, 234, 290, 330, 310]
      }]
    };

    // 为echarts对象加载数据
    incomeCharst.setOption(option);

  }






  function sexCharstFn() {
    sexCharst.clear();
    var option = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: { //小图标样式跟数据文字
        orient: 'vertical',
        x: 'left',

        data: ['男', '女']
      },
      color: ["#ff836d", "#fad495", "#78d6b2", "#67afbd", "#f4cf7f", "#27AE60", "#7F8C8D", "#2980B9", "#be6354", "f5d693", "#f5d693", "fe9886", "#68afbe"],
      toolbox: {
        show: false

      },
      series: [{
        name: '男女比例',
        type: 'pie',
        radius: ['50%', '70%'],
        itemStyle: {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          },
          emphasis: {
            label: {
              show: true,
              position: 'center',
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          }
        },
        data: [{
            value: 335,
            name: '男'
          }, {
            value: 310,
            name: '女'
          }


        ]
      }]
    };


    // 为echarts对象加载数据
    sexCharst.setOption(option);


  }




  function ageChartsFn() {
    ageCharts.clear();
    var option = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        x: 'left',

        data: ['18岁以下', '18岁~24岁', '25岁~29岁', '30岁~34岁', '35岁~39岁', '40岁~49岁', '50岁~59岁', '60岁以上', '未知']
      },

      toolbox: {
        show: false,

      },
      color: ["#ff836d", "#fad495", "#78d6b2", "#67afbd", "#f4cf7f", "#27AE60", "#7F8C8D", "#2980B9", "#be6354", "f5d693", "#f5d693", "fe9886", "#68afbe"],
      series: [{
        name: '年龄分布',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [{
          value: 335,
          name: '18岁以下'
        }, {
          value: 310,
          name: '18岁~24岁'
        }, {
          value: 234,
          name: '25岁~29岁'
        }, {
          value: 135,
          name: '30岁~34岁'
        }, {
          value: 1548,
          name: '35岁~39岁'
        }, {
          value: 1548,
          name: '40岁~49岁'
        }, {
          value: 1548,
          name: '50岁~59岁'
        }, {
          value: 1548,
          name: '60岁以上'
        }, {
          value: 1548,
          name: '未知'
        }]
      }]
    };


    // 为echarts对象加载数据
    ageCharts.setOption(option);

  }



  function addVipCharstFn() {
    addVipCharst.clear()
    var option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['实体会员卡', '扫码关注']
      },
      toolbox: {
        show: false,
        feature: {
          mark: {
            show: true
          },
          dataView: {
            show: true,
            readOnly: false
          },
          magicType: {
            show: true,
            type: ['line', 'bar', 'stack', 'tiled']
          },
          restore: {
            show: true
          },
          saveAsImage: {
            show: true
          }
        }
      },
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      }],
      yAxis: [{
        type: 'value'
      }],
      series: [{
        name: '实体会员卡',
        type: 'line',
        stack: '总量',
        itemStyle: {
          normal: {
            areaStyle: {
              type: 'default'
            }
          }
        },
        data: [60, 62, 61, 74, 90, 110, 110]
      }, {
        name: '扫码关注',
        type: 'line',
        stack: '总量',
        itemStyle: {
          normal: {
            areaStyle: {
              type: 'default'
            }
          }
        },
        data: [110, 92, 91, 124, 140, 160, 150]
      }]
    };


    // 为echarts对象加载数据
    addVipCharst.setOption(option);

  }




  function vipMapChartsFn() {
    vipMapCharts.clear();
    var option = {

      tooltip: {
        trigger: 'item'
      },
      dataRange: {
        min: 0,
        max: 2500,
        x: 'left',
        y: 'bottom',
        text: ['高', '低'], // 文本，默认为数值文本
        calculable: true,
        color: ['orangered', 'yellow', 'lightskyblue']
      },
      toolbox: {
        show: false

      },
      series: [{
          name: 'vip',
          type: 'map',
          mapType: 'china',
          roam: false,
          itemStyle: {
            normal: {
              label: {
                show: true
              }
            },
            emphasis: {
              label: {
                show: true
              }
            }
          },
          data: [{
            name: '北京',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '天津',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '上海',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '重庆',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '河北',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '河南',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '云南',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '辽宁',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '黑龙江',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '湖南',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '安徽',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '山东',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '新疆',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '江苏',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '浙江',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '江西',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '湖北',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '广西',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '甘肃',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '山西',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '内蒙古',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '陕西',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '吉林',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '福建',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '贵州',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '广东',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '青海',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '西藏',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '四川',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '宁夏',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '海南',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '台湾',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '香港',
            value: Math.round(Math.random() * 1000)
          }, {
            name: '澳门',
            value: Math.round(Math.random() * 1000)
          }]
        }

      ]
    };


    vipMapCharts.setOption(option);

  }




  function topfoodTable() {
    var indexPage = 0;
    var valueType = 'value';
    var arr = [];
    var pageMax = 0;

    function getTableData() {
      $.ajax({
        url: "/home/brand/" + brandId + "/board/goods",
        data: "begin=" + time.beginTime + "&end=" + time.endTime + "&sorting=" + valueType + "&page=" + indexPage + '&' + area,
        type: 'get',
        cache: true,
        success: function(data) {
          data.stats.value;
          data.stats.count;
          pageMax = data.pages.max;
          var page = 0;
          $("#topTen tbody").html('')
          for (var i = 0; i < 10; i++) {
            var oTr = $('<tr></tr>');
            if (typeof data.stats[i] != 'undefined') {
              page++;
              oTr.append($('<td></td>').html((function() {
                if (data.stats[i].unitTypeName) {
                  return (indexPage * 10) +
                    page + ".  " + data.stats[i].name +
                    "  (" + data.stats[i].unitTypeName + ")";
                } else {
                  return (indexPage * 10) + page + ".  " + data.stats[i].name
                }

              })()))
              if (valueType == 'count') {
                oTr.append($('<td></td>').html(data.stats[i].count));
              } else {
                oTr.append($('<td></td>').html(data.stats[i].value));
              }
            } else {
              //如果没有数据

              oTr.append($('<td></td>').html('-'));
              oTr.append($('<td></td>').html('-'));

            }
            $("#topTen tbody").append(oTr)
          }

          //如果有数据;
          if (pageMax == 0) {
            $('#topTen-panel-footer').hide();
          } else {
            $('#topTen-panel-footer').show();
          }


          //$('#topBtn').html("");
          $('#topBtn .page').remove();
          for (var i = 0; i < data.pages.showing.length; i++) {
            var oLi = $("<li></li>").attr('class', 'page');
            if (data.pages.showing[i] != undefined) {
              oLi.html('<a href="javascript:;">' + (data.pages.showing[i] + 1) + '</a>');
            } else {
              oLi.html('<a href="javascript:;">...</a>');
            }
            if (data.pages.showing[i] == data.pages.current) {
              oLi.addClass("active");
            }
            console.log(data.pages.showing[i]);
            //console.log(data.pages.showing[i]+1)
            $('#topBtn li').eq(-1).before(oLi);
          }
          isDisabled()

        }
      })
    }


    getTableData();
    $('#topBtn li:last').on('click', function() {
      if (indexPage >= pageMax) {
        indexPage = pageMax
      } else {
        indexPage++;
        getTableData()
      }
    })




    $('#topBtn li:first').on('click', function() {
      if (indexPage <= 1) {
        indexPage = 0;
      } else {
        indexPage--;
      }
      getTableData();
    })

    $('#topBtn').on('click', 'li', function() {
      if ($(this).data('type') != 'btn') {
        indexPage = $(this).find('a').html() - 1;
        getTableData();
      }


    })

    function isDisabled() {
      if ($('#topBtn li').eq(1).hasClass('active')) {
        $('#topBtn li').eq(0).hide();
      } else {
        $('#topBtn li').eq(0).show();
      }
      if ($('#topBtn li').eq(-2).hasClass('active')) {
        $('#topBtn li').eq(-1).hide();
      } else {
        $('#topBtn li').eq(-1).show();
      }

    }

    $('#velueType').html("金额")
    $("#topTen .tab-bar li").on('click', function() {
      indexPage = 0;
      firstInit = true;
      if ($(this).index() == 0) {
        //第一页
        valueType = 'value';
        getTableData();
        $('#velueType').html("金额")
      } else {
        //第二页
        valueType = 'count';
        getTableData();
        $('#velueType').html("数量")

      }
    })
  }


  function jsonArrange() {
    //门店排行-------------------------
    $.ajax({
      url: '/home/brand/' + brandId + '/board/incoming',
      type: "get",
      data: 'begin=' + time.beginTime + '&end=' + time.endTime + "&grouping=shop" + '&' + area,
      dataType: "json",
      success: function(cityData) {
        shopTableData();

        function shopTableData() {
          var page = 1;
          var nexPage = 0;
          var prePage = 0;
          $('#shopTableBtn .active').remove();
          $('#shopTableBtn .page').remove();
          $('#shopTable tbody').html('');

          if (cityData.length == 0) {
            cityData.length = 1;
            $("#shop-panel-footer").hide()

          } else if (cityData.length / 10 <= 1) {
            $("#shop-panel-footer").hide()
          } else {

            $("#shop-panel-footer").show()
          }
          for (var i = 0; i < Math.ceil(cityData.length / 10); i++) {
            var oLi = $("<li></li>").attr('class', 'page');
            oLi.html('<a href="javascript:;">' + (i + 1) + '</a>');
            $('#shopTableBtn li').eq(-1).before(oLi);
          }
          $('#shopTableBtn li').eq(1).addClass('active');

          for (var i = 0; i < 10; i++) {
            var oTr = $('<tr></tr>');

            if (cityData[i]) {
              oTr.append($('<td></td>').html(i + 1 + ". " + cityData[i].shop.name));
              oTr.append($('<td></td>').html(cityData[i].kpi.realValue));
              oTr.append($('<td></td>').html(Math.round(cityData[i].kpi.ratioOfAll * 10000) / 100 + "%"));
            } else {
              oTr.append($('<td></td>').html('-'));
              oTr.append($('<td></td>').html('-'));
              oTr.append($('<td></td>').html('-'));
            }

            $('#shopTable').append(oTr)
          }

          function shopTableDataPadding() {
            $('#shopTable tbody').html('');
            for (var i = (page - 1) * 10; i < page * 10; i++) {
              var oTr = $('<tr></tr>');
              if (cityData[i]) {
                // oTr.append($('<td></td>').html(i + 1));
                // oTr.append($('<td></td>').html(cityData[i].shop.name));
                oTr.append($('<td></td>').html(i + 1 + ". " + cityData[i].shop.name));
                oTr.append($('<td></td>').html(cityData[i].kpi.realValue));
                oTr.append($('<td></td>').html(Math.round(cityData[i].kpi.ratioOfAll * 10000) / 100 + "%"));
              } else {
              //  oTr.append($('<td></td>').html('-'));
                oTr.append($('<td></td>').html('-'));
                oTr.append($('<td></td>').html('-'));
                oTr.append($('<td></td>').html('-'));

              }
              $('#shopTable tbody').append(oTr)
            }

            $('#shopTableBtn .active').removeClass('active');
            $('#shopTableBtn li').eq(page).addClass('active');


          }


          $('#shopTableBtn .nexBtn').on('click', function() {
            page++;
            // console.log(page)

            if (page >= Math.ceil(cityData.length / 10)) {
              page = Math.ceil(cityData.length / 10)
            }
            shopTableDataPadding()

          })


          $('#shopTableBtn .preBtn').on('click', function() {
            page--;
            $('#shopTable tbody').html('');
            if (page <= 1) {
              page = 1
            }
            shopTableDataPadding()

          })

          $('#shopTableBtn .page').on('click', function() {
            page = $(this).index();

            $('#shopTable tbody').html('');
            shopTableDataPadding()

          })
        }
      },
      error: function(data) {}
    })
    provinceDataPadding()
  }


  /**
   * 省份营业收入分布
   * 表格数据初始化
   */
  function provinceDataPadding() {
    $('.provinceTableName').html('省份')
    $.ajax({
      url: '/home/brand/' + brandId + '/board/incoming',
      type: "get",
      data: 'begin=' + time.beginTime + '&end=' + time.endTime + "&grouping=province" + '&' + area,
      dataType: "json",
      cache: true,
      success: function(cityData) {
        provinceTableData(cityData);
      }
    })
  }

  function provinceTableData(cityData) {
    // console.log(cityData);
    var page = 1;
    var nexPage = 0;
    var prePage = 0;
    $('#provinceTableBtn .active').remove();
    $('#provinceTable tbody').html('');
    if (cityData.length == 0) {
      cityData.length = 1;
      $('#province-panel-footer').hide()
    } else if (cityData.length / 10 <= 1) {
      $('#province-panel-footer').hide()
    } else {
      $('#province-panel-footer').show()
    }
    $("#provinceTableBtn .addPage").remove();
    for (var i = 0; i < Math.ceil(cityData.length / 10); i++) {
      var oLi = $("<li></li>").attr('class', 'page addPage');
      oLi.html('<a href="javascript:;">' + (i + 1) + '</a>');
      $('#provinceTableBtn li').eq(-1).before(oLi);
    }

    $('#provinceTableBtn li').eq(1).addClass('active');

    function tableDataPadding() {
      $('#provinceTable tbody').html('');

      for (var i = (page - 1) * 10; i < page * 10; i++) {
        var oTr = $('<tr></tr>');
        if (cityData[i]) {
          var name;
          if(!!cityData[i].province){
            name=cityData[i].province.name
          }else {
            name=cityData[i].city.name
          }
          oTr.append($('<td></td>').html(i + 1 + ". " + name));
          oTr.append($('<td></td>').html(cityData[i].kpi.realValue));
          oTr.append($('<td></td>').html(Math.round(cityData[i].kpi.ratioOfAll * 10000) / 100 + "%"));
        } else {
          oTr.append($('<td></td>').html('-'));
          oTr.append($('<td></td>').html('-'));
          oTr.append($('<td></td>').html('-'));
        }
        $('#provinceTable tbody').append(oTr)
      }

      $('#provinceTableBtn .active').removeClass('active');
      $('#provinceTableBtn li').eq(page).addClass('active');
    }

    for (var i = 0; i < 10; i++) {
      var oTr = $('<tr></tr>');
      if (cityData[i]) {
        //兼容城市与省
        oTr.append($('<td></td>').html(
          (i + 1 + ". ") +
          (cityData[i].province ? cityData[i].province.name : cityData[i].city.name)
        ));
        oTr.append($('<td></td>').html(cityData[i].kpi.realValue));
        oTr.append($('<td></td>').html(Math.round(cityData[i].kpi.ratioOfAll * 10000) / 100 + "%"));

      } else {
        oTr.append($('<td></td>').html('-'));
        oTr.append($('<td></td>').html('-'));
        oTr.append($('<td></td>').html('-'));
      }
      $('#provinceTable tbody').append(oTr)
    }



    $('#provinceTableBtn .nexBtn').on('click', function() {

      page++;
      $('#provinceTable tbody').html('');
      if (page >= Math.ceil(cityData.length / 10)) {
        page = Math.ceil(cityData.length / 10)
      }
      tableDataPadding()

    })


    $('#provinceTableBtn .preBtn').on('click', function() {

      page--;

      if (page <= 1) {
        page = 1
      }
      tableDataPadding()

    })

    $('#provinceTableBtn .page').on('click', function() {
      page = $(this).index();

      $('#provinceTable tbody').html('');
      tableDataPadding()
    })
  }

  /**
   * 省份营业收入分布
   * 地图获取数据
   */
  function incomeMapChartsFn() {
    incomeMapCharts.clear();

    var curIndx = 0;
    var mapType = [
      'china',
      // 23个省
      '广东', '青海', '四川', '海南', '陕西',
      '甘肃', '云南', '湖南', '湖北', '黑龙江',
      '贵州', '山东', '江西', '河南', '河北',
      '山西', '安徽', '福建', '浙江', '江苏',
      '吉林', '辽宁', '台湾',
      // 5个自治区
      '新疆', '广西', '宁夏', '内蒙古', '西藏',
      // 4个直辖市
      '北京', '天津', '上海', '重庆',
      // 2个特别行政区
      '香港', '澳门'
    ];



    var option = {
      title: {
        //text : 'china （滚轮或点击切换）',

      },
      tooltip: {
        show: false,
        trigger: 'item',
        formatter: '点击进入该省<br/>{b}'
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        data: ['']
      },

      dataRange: {
        min: 0,
        max: 10000000,
        color: ['orange', 'yellow'],
        text: ['高', '低'], // 文本，默认为数值文本
        calculable: true,
        color: ['orangered', 'yellow', 'lightskyblue']
      },
      series: [{
        name: '',
        type: 'map',
        mapType: 'china',
        selectedMode: 'single',
        itemStyle: {
          normal: {
            label: {
              show: true
            }
          },
          emphasis: {
            label: {
              show: true
            }
          }
        },
        data: []

      }]
    };


    incomeMapCharts.un();
    incomeMapCharts.on(ecConfig.EVENT.MAP_SELECTED, function(param) {
      var mapDataToggle = true;
      var len = mapType.length;
      var mt = mapType[curIndx % len];
      if (mt == 'china') {
        // 全国选择时指定到选中的省份
        var selected = param.selected;
        for (var i in selected) {
          if (selected[i]) {
            mt = i;
            while (len--) {
              if (mapType[len] == mt) {
                curIndx = len;
                getCityData();

              }
            }
            break;
          }
        }

      } else {
        curIndx = 0;
        mt = 'china';
        provinceDataPadding();
      }

      option.series[0].mapType = mt;
      incomeMapCharts.setOption(option, true);

      function getCityData() {
        $.ajax({
          url: '/home/brand/' + brandId + '/board/incoming',
          type: "get",
          data: 'begin=' + time.beginTime + '&end=' + time.endTime + "&grouping=province" + '&' + searchArea,
          dataType: "json",
          cache: true,
          success: function(provinceData) {

            for (var i = 0; i < provinceData.length; i++) {
              if (provinceData[i].province.name == param.target) {
                //设置地图
                //option.series[0].mapType = mt;
                $('.provinceTableName').html('城市')
                mapDataToggle = false
                $.ajax({
                  url: '/home/brand/' + brandId + '/board/incoming',
                  type: "get",
                  data: 'begin=' + time.beginTime + '&end=' + time.endTime + "&grouping=city" + '&province=' + provinceData[i].province.id,
                  dataType: "json",
                  cache: true,
                  success: function(cityData) {
                    provinceTableData(cityData);
                  }
                })
                break
              }

            }
            if (mapDataToggle) {
              mt = 'china'
            }
          }
        })
      }
    });




    $.ajax({
      url: '/home/brand/' + brandId + '/board/incoming',
      type: "get",
      data: 'begin=' + time.beginTime + '&end=' + time.endTime + "&grouping=province" + '&' + area,
      dataType: "json",
      cache: true,
      success: function(mapProvinceData) {

        $.ajax({
          url: '/home/brand/' + brandId + '/board/incoming',
          type: "get",
          data: 'begin=' + time.beginTime + '&end=' + time.endTime + "&grouping=city" + '&' + area,
          dataType: "json",
          cache: true,
          success: function(mapCityData) {
            var ProvinceArr = [];
            var CityArr = [];
            for (var i = 0; i < mapProvinceData.length; i++) {
              ProvinceArr.push({
                id: mapProvinceData[i].province.id,
                name: mapProvinceData[i].province.name,
                value: mapProvinceData[i].kpi.realValue
              })

            }


            for (var i = 0; i < mapCityData.length; i++) {
              CityArr.push({
                id: mapCityData[i].city.id,
                name: mapCityData[i].city.name,
                value: mapCityData[i].kpi.realValue
              })

            }
            option.series[0].data = ProvinceArr.concat(CityArr);
            incomeMapCharts.setOption(option);
          }
        })

      }
    })
  }





  CityPlug = function(ele) {
    this.$ele = $(ele)
    this.init();
  }

  CityPlug.prototype.init = function() {
    this.dataPadding()
    this.toggle();
    this.testChange();
    this.sel();
    this.bgcolor();
    this.shopShow();

  }

  CityPlug.prototype.dataPadding = function() {
    var _this = this;
    $.ajax({
      url: "/home/brand/" + brandId + "/area/country/1/shops",
      type: "get",
      dataType: "json",
      cache: true,
      success: function(data) {
        _this.data = data;

        var ulBox = $('<ul></ul>').addClass('f-cb province-ul').data('citytype', 'province');
        for (var i = 0; i < _this.data.length; i++) {

          var oA = $('<a></a>').html(_this.data[i].name).attr('href', 'javascript:void(0);');
          var oLi = $("<li></li>").data('areaId', _this.data[i].id)
            .data('areaType', 'province');

          oLi.append(oA);
          ulBox.append(oLi);
        }
        _this.$ele.find(".city-menu").append(ulBox);
        _this.$ele.find(".city-menu").append($('<div></div>').addClass('divider').css('clear', 'both'));

      }
    });


  }
  CityPlug.prototype.sel = function() {
    var _this = this;
    _this.$ele.find('.city-menu').on('click', '.country-ul li', function() {
      $('.city-ul').remove();
      $('.province-ul').remove();
      _this.$ele.find(".city-menu .divider").remove();

      if ($(this).find('a').hasClass('active')) {

      }

      var ulBox = $('<ul></ul>').addClass('f-cb province-ul').data('citytype', 'province');
      for (var i = 0; i < _this.data.length; i++) {

        var oA = $('<a></a>').html(_this.data[i].name).attr('href', 'javascript:void(0);');
        var oLi = $("<li></li>").data('areaId', _this.data[i].id)
          .data('areaType', 'province');

        oLi.append(oA);
        ulBox.append(oLi);
      }
      _this.$ele.find(".city-menu").append(ulBox);
      _this.$ele.find(".city-menu").append($('<div></div>').addClass('divider').css('clear', 'both'));


    })

    _this.$ele.find(".city-menu").on("click", ".province-ul li", function() {
      if (_this.$ele.find(".city-menu ul").length > 1) {
        _this.$ele.find(".city-menu ul:eq(2)").remove();
        _this.$ele.find(".city-menu .divider:last").remove();
      }


      _this.$ele.indexLi = $(this).index();
      var ulBox2 = $('<ul data-citytype="city" class="f-cb city-ul"></ul>');
      var divider = $('<div class="divider" style="clear:both"></div>')
      for (var i = 0; i < _this.data[_this.$ele.indexLi].cities.length; i++) {

        var oA2 = $('<a href="javascript:void(0);"></a>').html(_this.data[_this.$ele.indexLi].cities[i].name);
        var oLi2 = $("<li></li>").data('areaId', _this.data[_this.$ele.indexLi].cities[i].id)
          .data('areaType', 'city');
        oLi2.append(oA2);
        ulBox2.append(oLi2);
      }
      _this.$ele.find(".city-menu").append(ulBox2);
      _this.$ele.find(".city-menu").append(divider);

    })

  }

  CityPlug.prototype.shopShow = function() {
    var _this = this;
    _this.$ele.find(".city-menu").on("click", ".province-ul li", function() {
      _this.$ele.find(".shop-menu").fadeIn();
      _this.$ele.find(".shop-menu").html('');
      for (var k = 0; k < _this.data[_this.$ele.indexLi].cities.length; k++) {
        for (var j = 0; j < _this.data[_this.$ele.indexLi].cities[k].shops.length; j++) {
          var oLi = $('<li></li>').data('areaId', _this.data[_this.$ele.indexLi].cities[k].shops[j].id)
            .data('areaType', 'shop');
          var oA = $('<a href=""></a>').html(_this.data[_this.$ele.indexLi].cities[k].shops[j].name);
          oLi.append(oA);
          _this.$ele.find(".shop-menu").append(oLi);
        }
      }
    })



    _this.$ele.find(".city-menu").on("click", ".city-ul li", function() {
      _this.$ele.find(".shop-menu").fadeIn();
      _this.$ele.find(".shop-menu").html('');
      var cityIndex = $(this).index()

      for (var j = 0; j < _this.data[_this.$ele.indexLi].cities[cityIndex].shops.length; j++) {

        var oLi = $('<li></li>').data('areaId', _this.data[_this.$ele.indexLi].cities[cityIndex].shops[j].id)
          .data('areaType', 'shop');
        var oA = $('<a href=""></a>').html(_this.data[_this.$ele.indexLi].cities[cityIndex].shops[j].name);
        oLi.append(oA);
        _this.$ele.find(".shop-menu").append(oLi);
      }
    })
  }


  CityPlug.prototype.testChange = function() {
    var _this = this;
    _this.$ele.find(".city-menu").on("click", "li", function() {
      _this.$ele.find(".btn .pull-left ").html($(this).find("a").html())
        //console.log($(this).find("a").html())
    })
  }

  CityPlug.prototype.toggle = function() {
    var _this = this;
    _this.showToggle = true;
    _this.$ele.find(".btn").on("click", function() {
      if (_this.showToggle) {
        _this.showToggle = false;
        _this.$ele.find(".city-menu").fadeIn();
        if ($(".shop-menu li a").hasClass("active")) {
          $(".shop-menu").fadeIn();
        }

      } else {
        _this.showToggle = true;
        _this.$ele.find(".city-menu,.shop-menu").fadeOut();

      }
      return false

    });


    $(document).on("click", function(e) {

      if (e.target == $(".city-plug .city-menu")[0] || $(".city-plug .city-menu").has(e.target).length > 0) {
        _this.showToggle = false;
        _this.$ele.find(".city-menu").fadeIn();
      } else {
        _this.showToggle = true;
        _this.$ele.find(".city-menu,.shop-menu").fadeOut();
      }
    })
  }

  CityPlug.prototype.bgcolor = function() {
    var _this = this;
    _this.$ele.find(".city-menu").on("click", "ul li a", function() {
      /*if ($(this).hasClass('active')) {
        $(this).removeClass('active');
      } else {

      }*/
      $(this).parent().parent("ul").find("li a").removeClass("active");
      $(this).addClass("active");
      area = $(this).parent().data('areaType') + '=' + $(this).parent().data('areaId');
      chartsFire();
      ws.close()
      realTimeData()
    })

    _this.$ele.find(".shop-menu").on("click", "li a", function() {
      _this.$ele.find(".shop-menu .active").removeClass('active')
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
      } else {
        $(this).parent().parent("ul").find("li a").removeClass("active");
        $(this).addClass("active");
      }
      area = $(this).parent().data('areaType') + '=' + $(this).parent().data('areaId');
      chartsFire();
      ws.close();
      realTimeData();
      _this.$ele.find(".btn .pull-left ").html($(this).html());
      _this.$ele.find(".city-menu,.shop-menu").fadeOut();
      _this.showToggle = true;
      return false;
    })
  }
  new CityPlug(".city-plug")
  navTab();
  regionData();
  timeBar();






  realTimeData();

  function realTimeData() {
    ws = null;
    var brandId = location.pathname.replace('/home/brand/', '').replace('/board', '');
    var addr = location.origin.replace('http', 'ws') + "/home/brand/" + brandId + "/board/kpi?" + area;
    //console.log(addr)

    ws = new WebSocket(addr);
    ws.onopen = function() {
      ws.send(JSON.stringify("getShopKpi"))

    }


    $('#paid').html('-'); //实收金额
    $('#pastCustomerCount').html('-'); //结账人数
    $('#perCustomerTransaction').html('-'); //平均客单价
    $('#average').html('-') //平均消费
    $('#unpaid').html('-'); //未收金额
    $('#currentCustomerCount').html('-'); //正在用餐人数
    $('#currentTableCount').html('-'); //当前开台
    $('#turnoverRate').html('-') //翻台率
    $(".max-shop-count").html('-') //总门店
    $(".close-shop-count").html('-') //未开业
    $(".open-shop-count").html('-') //已开业

    ws.onmessage = function(e) {
      //clearTimeout(timer)
      var data = JSON.parse(e.data);
      var average = parseInt((isNaN(data.paid / data.pastCustomerCount) ? 0 : data.paid / data.pastCustomerCount) * 100) / 100;
      var perCustomerTransaction = parseInt((isNaN(data.paid / (data.orderCount - data.currentTableCount)) ? 0 : (data.paid / (data.orderCount - data.currentTableCount))) * 100) / 100;
      $('#timeDay').html(data.day);
      $('#paid').html('' + moneyHandle(data.paid)); //实收金额
      $('#pastCustomerCount').html(data.pastCustomerCount + ''); //结账人数
      $('#perCustomerTransaction').html('' + perCustomerTransaction); //平均客单价
      $('#average').html('' + average) //平均消费
      $('#unpaid').html('' + moneyHandle(data.unpaid)); //未收金额
      $('#currentCustomerCount').html(data.currentCustomerCount + ''); //正在用餐人数
      $('#currentTableCount').html(data.currentTableCount + ''); //当前开台
      $('#turnoverRate').html(Math.floor((data.orderCount / data.tableCount) * 10000) / 100 + "%") //翻台率
      $(".max-shop-count").html(data.closeCount + data.openCount) //总门店
      $(".close-shop-count").html(data.closeCount) //未开业
      $(".open-shop-count").html(data.openCount) //已开业

      function moneyHandle(num) {
        return parseInt(num * 100) / 100

      }


    }


  }





})
