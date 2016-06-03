comment_list dd a

var arr=document.querySelectorAll(".comment_list dd")
var aName=[]

for(var i=0;i<arr.length;i++)
	{
		aName.push(arr[i].children[0].innerHTML)
	};
alert(JSON.stringify(aName))
var arr2=JSON.stringify(aName)
var aRR=[]
var json={}
for(var i=0;i<arr2.length;i++){
	
	if(!json[arr2[i]]){
		aRR.push(arr2[i])
		json[arr2[i]]=1
		
		}
	}

alert(aRR)


alert(aRR[ parseInt(aRR.length*Math.random())])


["鸣姐姐瘦子爱喝白开水","雨涛啦lover","lc泪悦君","Summer要洗心革面当学霸","乔貝瑟囉R","种鱼的猫","簡單勒style","钟仲英","乔貝瑟囉R","种鱼的猫","簡單勒style","钟仲英","Summer要洗心革面当学霸","乔貝瑟囉R","种鱼的猫","簡單勒style","钟仲英"]