//hold the current correct answer
var questions = [];
var answer = '';
var level = 0;

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
});

// function countDown(timeleft, timetotal, $element) {
//     var progressBarWidth = timeleft * $element.width() / timetotal;
//     $element.find('div').animate({ width: progressBarWidth }, 500)
//     // .html(timeleft + " seconds to go");
//     $('.timer').text(timeleft);
//     if(timeleft > 0) {
//         setTimeout(function() {
//             countDown(timeleft - 1, timetotal, $element);
//         }, 1000);
//     }
// };

function countDown(time, $element) {
	clearInterval();
	var elapse = 0;

    setInterval(function() {
        var progressBarWidth = (time-elapse++) * $element.width() / timetotal;
        $element.find('div').animate({ width: progressBarWidth }, 500)
        // .html(timeleft + " seconds to go");
        $('.timer').text(timeleft);
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
	$('.levels ul').hide();
	$('.levels span').show().text('Game Over!!!');
	setTimeout(function() {
		location.reload();
	}, 2000);
};

function nextQuestion(set){
	if(level < 15){
		set = questions[level];

		$('.question p').html(set.question);

		$('.options').removeClass('correct wrong disabled');

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
		setTimeout(function() {
			gameOver();
		}, 30000);
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