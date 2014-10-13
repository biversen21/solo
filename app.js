$(function(){
	
	var counter = 1;
	
  var factorial = function(num){
		counter++;
		
		if (num > 1) {
			$('.container').append('<h4>var current: ' + num + ' stack: <span class="newSpan' + num + '"></span></h4>');
			
			for (var i = 0; i < counter; i++) {
				$(".newSpan" + num).html(' (' + (num) + ' * <span class="newSpan' + (num -1) +'">factorial(' + (num - 1) + ') </span>)');
			}
						
			setTimeout(function(){return num * factorial(num - 1)}, 1000);
			
		} else {
			$('.container').append('<h4>var current: 1 stack: 1');
			return 1;
		}
		
  }
	
	var filler = function(runs){
		var result = 1;
		var resultArray = [];
		for (var i = 1; i <= runs; i++) {
			result = result * i;
			resultArray.push(result);
		}
		fillResult(resultArray);
	}
	
  var fillResult = function(result){
		for (var i = result.length; i > 0; i--) {
	  	$('h4:nth-of-type(' + i + ')').append(' result: ' + result[result.length - i]);
			$('.newSpan1').html('1');
		}
  }	
	
	$('.startFactorial').on('click', function(){
		$('.container').empty();
		var factorialStart = $('#factorialNum').val();
		factorial(factorialStart);
		setTimeout(function(){filler(factorialStart)}, 5000);
	})
});
