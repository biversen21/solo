$(function(){
	
	var counter = 1;
	
  var factorial = function(num){
		counter++;
		
		$('.container').append('<h4>var current: ' + num + ' stack: </h4>');
		
		for (var i = 0; i < counter; i++) {
			var content = 'factorial(' + (num - 1) + ')';
			$('h4:nth-of-type(' + i + ')').append('<span>' + num + ' * (' + content + ')</span>');
		}
		
		if (num > 1) {
			setTimeout(function(){return num * factorial(num - 1)}, 1000);
		} else {
			return 1;
		}
		
  }
	
  var fillResult = function(runs){
		var subResult = 1;
		var returnedVal;
		
		for (var i = 1; i <= runs; i++) {
			subResult = subResult * i;
		  $('h4:nth-of-type(' + (runs - i + 1) + ')').append('<span> Result: ' + subResult);
	  }
  }	
	
	$('.startFactorial').on('click', function(){
		$('.container').empty();
		var factorialStart = $('#factorialNum').val();
		factorial(factorialStart);
		// setTimeout(function(){fillResult(factorialStart)}, 5000);
	})
});
