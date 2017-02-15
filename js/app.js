//hold the current correct answer
var questions = [];
var answer = '';
var level = 0;
var earning = 0;
var interval;
var choices;

// Executes on page load
$(document).ready(function() {
	//Start the background sound
	// startSound('background', true);

	//Get the first 5 esasy questions
	$.getJSON("https://opentdb.com/api.php?amount=5&difficulty=easy", function(data) {
		questions = data.results;
	});

	//Get the next 5 medium questions
	$.getJSON("https://opentdb.com/api.php?amount=5&difficulty=medium", function(data) {
		questions = $.merge(questions, data.results);
	});

	//Get the last 5 hard questions
	$.getJSON("https://opentdb.com/api.php?amount=5&difficulty=hard", function(data) {
		questions = $.merge(questions, data.results);
		// console.log(questions);
		nextQuestion(questions[level]);
	});

	$('.options').click(function(){
		$this = $(this);
		// console.log(chosen==answer ? 'True' : 'False');

		//if correct answer
		$('.options').addClass('disabled');
		if($this.find('span').html() == answer){
			//Play Right
			startSound('rightsound', false);
			$this.fadeToggle().fadeToggle().addClass('disabled correct');
			level++
			raiseLevel();
			setTimeout(function() {
				nextQuestion();
			}, 2000);			
		}
		else{
			//Play Wrong
			startSound('wrongsound', false);
			$this.fadeToggle().fadeToggle().addClass('disabled wrong');
			$('.options').each(function(){
				$this = $(this);
				if($this.find('span').html() == answer){
					$this.fadeToggle().fadeToggle().addClass('disabled correct');
				}
			});

			gameOver();
		}
	});

	$('.levels span').click(function(){
		location.reload();
	});

	$('#fifty').click(function() {
		$(this).addClass('disabled');
		fifty();
	});

	$('#walk-away').click(function(){
		$(this).addClass('disabled');
		walkAway();
	});

	$('#audience').click(function(){
		$(this).addClass('disabled');
		audience();
	});
});


function countDown(time, $element) {
	if(time < 0){
		return;
	}

	clearInterval(interval);
	var elapse = 0;

    interval = setInterval(function() {
        var progressBarWidth = (time-elapse) * $element.width() / time;
        $element.find('div').animate({ width: progressBarWidth }, 500);
        $('.timer').text(time-elapse);
        if (++elapse > time) {
        	clearInterval(interval);
        	gameOver();
        }
    }, 1000);
};

function raiseLevel(){
	$('.levels ul li').removeClass('current');
	$(".levels ul li:nth-child(" + (16-level) + ")").addClass('current');
}

function win(){
	clearInterval(interval);
	$('.levels ul').hide();
	$('.levels span').show().text('You Win!!!<br><br><i>Start Again</i>');
}

function walkAway(){
	clearInterval(interval);
	var take_home = 0;
	$('.options').addClass('disabled');

	if(level > 0){
		 earning = $(".levels ul li:nth-child(" + (16-level) + ")").html();
	}
	console.log(earning);
	$('.levels ul').hide();
	$('.levels span').show().html('Game Over!!! <br><br> Walk Away: <br>GP <b>' + earning + '</b><br><br><i>Start Again</>');
};

function audience(){
	var highest = Math.floor(Math.random()*50) + 50;
	// console.log(highest);

	$(".audience").fadeToggle(1000);

	var count = 0;
	$('.options').each(function(){
		$this = $(this);

		if($this.find('span').html() == answer){
			$(".audience ul li:nth-child(" + (++count) + ")").animate({ height:  highest}, 1000)
		}
		else {
			$(".audience ul li:nth-child(" + (++count) + ")").animate({ height:  Math.floor(Math.random()*highest)}, 1000)
		}
	});
};

function fifty(){
	var second_opt = false;
	$('.options span').fadeOut();

	$('.options').each(function(){
		$this = $(this);

		if($this.find('span').html() == answer){
			$this.find('span').fadeToggle();
		}
		else if(!second_opt || Math.floor(Math.random()*1)){
			$this.find('span').fadeToggle();
			second_opt = true;
		}
	});
}

function gameOver(){
	clearInterval(interval);
	$('.options .lifeline').addClass('disabled');

	if(level > 5){
		earning = 1000;
	}

	$('.levels ul').hide();
	$('.levels span').show().html('Game Over!!! <br><br> Take Home: <br>GP <b>' + earning + '</b><br><br><i>Start Again</>');
};

function nextQuestion(set){
	if(level < 15){
		set = questions[level];

		$('.question p').html(set.question);

		//Get image
		$.ajax({
			headers: {
		    	'Access-Control-Allow-Origin' : '*',
		    },
		});


		$.getJSON("https://en.wikipedia.org/w/api.php?action=query&titles=Abacus&prop=pageimages&format=json&pithumbsize=100", function(data) {
			console.log(1);
		});

		$('.options').removeClass('correct wrong disabled');
		$('.options span').html('').fadeIn();
		$(".audience").fadeOut();

		var span = $('<span />').html(set.correct_answer);
		answer = span.html();

		choices = set.incorrect_answers;
		choices.push(set.correct_answer);
		console.log(choices);
		choices = shuffleOptions(choices);

		$('.option-a span').html(choices[0]);
		$('.option-b span').html(choices[1]);
		$('.option-c span').html(choices[2]);
		$('.option-d span').html(choices[3]);

		countDown(30, $('.progress-bar'));
	}
	else{
		win();
	}
};

function shuffleOptions(options) {
  var currentIndex = options.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = options[currentIndex];
    options[currentIndex] = options[randomIndex];
    options[randomIndex] = temporaryValue;
  }

  return options;
};

/**
* Plays a sound via HTML5 through Audio tags on the page
*
* @require the id must be the id of an <audio> tag.
* @param id the id of the element to play
* @param loop the boolean flag to loop or not loop this sound
*/
startSound = function(id, loop) {
	soundHandle = document.getElementById(id);
	if(loop)
		soundHandle.setAttribute('loop', loop);
	soundHandle.play();
}