
//格式化金额
function formatMoney(money){
  var price = money ? Math.round(money*100)/100 : 0
  if(price >= 0 ){
    return addSeparator(price)
  } else {
    return "-" + addSeparator(Math.abs(price))
  }
}

function formatPrice(price){
  return price ? Math.round(100 * price)/100 : 0
}

function formatYuan(integer){
  return integer.toString().replace( /\B(?=(?:\d{3})+$)/g, ',' )
}

function addSeparator(money){
  money = money.toFixed(3)
  var integer = money.toString().split(".")[0]
  var decimal = money.toString().split(".")[1]
  if(decimal == undefined || parseInt(decimal) == 0){
    return formatYuan(integer)
  } else if(decimal.length > 2 && decimal.substr(2, 1) > 5){
      if(decimal.substring(0, 2) == '99'){ //小数部分需要进位
        return formatYuan(parseInt(integer) + 1)
      } else {
        return formatYuan(integer) + "." + (parseInt(decimal.substring(0, 2)) + 1)
      }
    } else {
      var len = decimal.length
      if(decimal.substr(1,1) == 0){
        len = 1
      } else if(len > 2){
        len = 2
      }
      return formatYuan(integer) + "." + decimal.substring(0, len)
    }
}