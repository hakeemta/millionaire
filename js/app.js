//hold the current correct answer
var questions = [];
var answer = '';
var level = 0;
var interval;

// Executes on page load
$(document).ready(function() {
	$.getJSON("https://opentdb.com/api.php?amount=15&type=multiple", function(data) {
		//console.log(data.results[0].question)
		questions = data.results;
		nextQuestion(questions[level]);
	});

	$('.options').click(function(){
		$this = $(this);
		// console.log(chosen==answer ? 'True' : 'False');

		//if correct answer
		$('.options').addClass('disabled');
		if($this.find('span').html() == answer){
			$this.fadeToggle().fadeToggle().addClass('disabled correct');
			level++
			raiseLevel();
			setTimeout(function() {
				nextQuestion();
			}, 2000);			
		}
		else{
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
		var second_opt = false;

		$(this).addClass('disabled');
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
        $element.find('div').animate({ width: progressBarWidth }, 500)
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
	$('.levels ul').hide();
	$('.levels span').show().text('You Win!!!');
	setTimeout(function() {
		location.reload();
	}, 2000);
}

function gameOver(){
	var take_home = 0;
	$('.options').addClass('disabled');

	if(level > 5){
		take_home = 1000;
	}

	$('.levels ul').hide();
	$('.levels span').show().html('Game Over!!! <br> Take Home: GP ' + take_home + '<br>Start Again');
	setTimeout(function() {
		// location.reload();
	}, 2000);
};

function nextQuestion(set){
	if(level < 15){
		set = questions[level];

		$('.question p').html(set.question);

		//Get image
		// $.getJSON("https://en.wikipedia.org/w/api.php?action=query&titles=Abacus&prop=pageimages&format=jsonp&pithumbsize=100", function(data) {
		// 	console.log(data.thumbnail.source)
		// });

		$('.options').removeClass('correct wrong disabled');
		$('.options span').fadeIn();

		answer = set.correct_answer;

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