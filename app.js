$(function(){
  var factorial = function(num){
		var current = num;
		var result = 1;
		
		var recurse = function(current){
			result *= current;
			return (current > 1) ? recurse(current - 1) : result;
		}
		var finalResult = recurse(num)
  }
	
	
});
