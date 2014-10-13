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
	
  var fillResult = function(runs){
		var result = 1;
    for (var i = 1; i <= runs; i++) {
			result = result * i;
    	$('.newSpan' + i).html(result);
    }
  }	
	
	$('.startFactorial').on('click', function(){
		$('.container').empty();
		var factorialStart = $('#factorialNum').val();
		factorial(factorialStart);
		setTimeout(function(){fillResult(factorialStart)}, 5000);
	})
});
