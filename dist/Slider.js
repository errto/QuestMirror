 　var elem = document.getElementsByClassName('range');
　 var rangeValue = function (elem, target) {
　 　　return function(evt){
　　　 　　target.innerHTML = elem.value;
 　　　}
　 }
　 for(var i = 0, max = elem.length; i < max; i++){
 　　　bar = elem[i].getElementsByTagName('input')[0];
 　　　target = elem[i].getElementsByTagName('span')[0];
　　　 bar.addEventListener('input', rangeValue(bar, target));
　 }