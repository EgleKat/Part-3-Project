var mainDiv = document.getElementById('content');
var finishedLessonsCount = 0;
var isCurrentPaneExercise = false;  //exercise - true, validation - false
var correctExercises = 0;
var maxPointsPerLesson = 0;
var onMenu = true;
var numberOfMaxHints;
var usedHintsPerLesson = [];//an array of strings that represent which hints have been clicked on by the user
var allHints = [];

function displayLessonMenu(lessons) {
    onMenu = true;
    exLessDiv.innerHTML = "";
    changeMainHeading("Labas, " + userName);
    changeHintHeading();
    //Add all the buttons for lessons into the div
    for (var i = 0; i < lessons.length; i++) {
        var lessonButtonDiv = document.createElement("div");
        lessonButtonDiv.className = ("lessonButtonDiv");
        lessonButtonDiv.setAttribute("id", lessons[i].lessonName);
        var lessonButton = document.createElement("button");
        var lesson = lessons[i];
        lessonButton.innerHTML = "LESSON " + lesson.lessonID + "<br />" + lesson.lessonName;
        lessonButton.className = "lessonButton btn btn-primary";

        lessonButton.addEventListener("click", (function (lesson2) {
            return function () {
                onMenu = false;
                loadLesson(lesson2);
            };
        })(lesson));

        lessonButtonDiv.appendChild(lessonButton);
        exLessDiv.appendChild(lessonButtonDiv);

        for (var l = finishedLessons.lessons.length - 1; l >= 0; l--) {
            //If the user has finished the lesson
            if (finishedLessons.lessons[l].name == lessons[i].lessonName) {

                var finishedLsn = finishedLessons.lessons[l];
                var countCorrect = finishedLsn.totalCorrect;
                var maxCount = finishedLsn.maxPointsAvailable;


                //If the user finished the lesson with more than half answers being successful
                if (countCorrect >= maxCount / 2) {
                    lessonButton.style.backgroundColor = "#4CAF50"; //make button green
                }
                //If the user answered all the questions correctly
                if (countCorrect === maxCount) {
                    //create an 'Expert' badge and add it to the div
                    var labelSpan = document.createElement("span");
                    labelSpan.className = ("badge");
                    labelSpan.classList.add("badge-warning", "badge-secondary", "lessonBadge");
                    labelSpan.innerHTML = "Expert!";
                    lessonButtonDiv.appendChild(labelSpan);
                }

                //Display the number of correct answers in a div
                var countDiv = document.createElement("div");
                countDiv.className = ("countInMenu");
                lessonButtonDiv.appendChild(countDiv);
                //If the user's score per lesson is less than 0, make it 0
                if (countCorrect < 0)
                    countDiv.innerHTML = ("Recent progress: 0/" + maxCount);
                else
                    countDiv.innerHTML = ("Recent progress: " + countCorrect + " / " + maxCount);

                //Add a repeat lesson with only questions button
                var repeatQuestions = document.createElement("button");
                repeatQuestions.innerHTML = "Redo Questions Only";
                repeatQuestions.className = "repeatButton btn";

                repeatQuestions.addEventListener("click", (function (lesson2) {
                    return function () {
                        onMenu = false;
                        loadLesson(lesson2);
                    };
                })(removeExplanations(lesson)));
                lessonButtonDiv.appendChild(repeatQuestions);


                break;
            }
        }

    }

}
var currentExerciseNumber;
var currentExercise;
var currentAnswer;
var correctAnswer;
var currentUserLesson;

function loadLesson(lesson) {
    numberOfMaxHints = lesson.hints;
    currentExerciseNumber = 0;
    changeHintHeading();
    changeMainHeading(lesson.lessonName);
    var exercises = lesson.exercises;
    currentUserLesson = new finishedLesson(lesson.lessonName, lesson.lessonID, [], 0, 0);

    displayExercise(exercises);
    //create 'Next' button
    var nextButton = document.createElement('button');
    nextButton.classList.add("bottomButton", "submit", "btn-lg", "btn-info");
    nextButton.innerHTML = "Next";

    nextButton.addEventListener("click", function () {
        validateExercise(exercises);
    });

    var nextButtonDiv = document.createElement('div');
    nextButtonDiv.setAttribute("id", "bottomButtonDiv");
    nextButtonDiv.appendChild(nextButton);
    mainDiv.appendChild(nextButtonDiv);

}

function validateExercise(exercises) {
    //check if the main div is displaying an exercise or an answer validation
    if (isCurrentPaneExercise && currentExercise.type !== "explanation") {

        //if the user has chosen an answer
        if (typeof currentAnswer === 'string' || (Array.isArray(currentAnswer) && currentAnswer.length != 0)) {
            //TODO fix repeating code
            //check the correct answer based on the exercise type
            switch (currentExercise.type) {
                case "inputText":
                    var userCorrectIncorrectObj = checkAnswer(correctAnswer);
                    displayAnswerMessage(userCorrectIncorrectObj, exLessDiv);
                    currentUserLesson.exercises.push({
                        "exercise": currentExerciseNumber,
                        "answer": currentAnswer,
                        "correct": userCorrectIncorrectObj.isUserCorrect
                    });
                    maxPointsPerLesson++;
                    break;
                case "multiChoice":
                    var isUserCorrect = checkAnswer(correctAnswer);
                    displayAnswerMessage(isUserCorrect, exLessDiv);
                    currentUserLesson.exercises.push({
                        "exercise": currentExerciseNumber,
                        "answer": currentAnswer,
                        "correct": isUserCorrect
                    });
                    maxPointsPerLesson++;
                    break;
                case "multiSelect":
                    var userCorrectIncorrectObj = checkAnswer(correctAnswer);
                    displayAnswerMessage(userCorrectIncorrectObj, exLessDiv);
                    currentUserLesson.exercises.push({
                        "exercise": currentExerciseNumber,
                        "answer": currentAnswer,
                        "correct": userCorrectIncorrectObj.usersCorrectAnswers.length,
                        "incorrect": userCorrectIncorrectObj.usersIncorrectAnswers.length
                    });
                    maxPointsPerLesson += currentExercise.correctAnswers.length;
                    break;
            }

            //if the user hasn't chosen an answer 
        } else {
            displayInfoAlert("You have to answer the question to proceed.");
            return;
        }

    }
    //if it's a validation message, display next exercise, add it to the hint list
    else {
        //if it is an explanation, log it
        if (currentExercise.type === "explanation") {
            currentUserLesson.exercises.push({
                "exercise": currentExerciseNumber
            });
            addNewExplanation(currentExercise.question, currentExercise.explanation);

        }
        //display next exercise
        currentExerciseNumber++;
        displayExercise(exercises);
    }

}

function displayExercise(exercises) {

    if (currentExerciseNumber < exercises.length) {
        currentExercise = exercises[currentExerciseNumber];
        isCurrentPaneExercise = true;

        updateMainHeadingWithQuestionNumber((currentExerciseNumber + 1));
        //Extract the correct answer
        switch (currentExercise.type) {
            case "multiChoice":
                correctAnswer = currentExercise.correctAnswer;
                break;
            case "inputText":
                //an array of all possible answers
                correctAnswer = currentExercise.answers;
                break;
            case "explanation":
                break;
            case "multiSelect":
                //an array of correct answers
                correctAnswer = currentExercise.correctAnswers;
                //set the answer variable to be an array
                currentAnswer = [];
                break;
        }
        displaySpecificExercise(currentExercise);

    } else
        finishLesson(currentUserLesson);

}
/**
 * Check whether the currentAnswer is correct and return a boolean or an object with correct and incorrect answers
 * @param {string||array} correctAnswer 
 */
function checkAnswer(correctAnswer) {
    //currentAnswer is stored globally
    switch (currentExercise.type) {
        case "multiChoice":
            return (correctAnswer === currentAnswer);
            break;
        case "inputText":
            var answers = reformatPunctuation(currentExercise.answers.slice(0));
            var userAnswer = reformatPunctuation([currentAnswer])[0];
            var answerScore = {};
            for (var i = 0; i < answers.length; i++) {
                var editDistance = getEditDistance((userAnswer.toLowerCase().trim()), (answers[i].toLowerCase().trim()));
                if (editDistance <= 1) {
                    answerScore.isUserCorrect = true;
                    answerScore.distance = editDistance;
                    return answerScore;
                }
                // if (userAnswer.toLowerCase().trim() === answers[i].toLowerCase().trim())
                //   return true;
            }
            return false;
            break;
        case "multiSelect":
            var answerScore = { usersCorrectAnswers: [], usersIncorrectAnswers: [] };
            outerloop:
            for (var l = 0; l < currentAnswer.length; l++) {
                for (var m = 0; m < correctAnswer.length; m++) {
                    if (currentAnswer[l] === correctAnswer[m]) {
                        // answerScore++;
                        answerScore.usersCorrectAnswers.push(currentAnswer[l]);
                        continue outerloop;
                    }
                }
                // answer didn't match any of the correct ones so didn't continue outer loop
                //answerScore--;
                answerScore.usersIncorrectAnswers.push(currentAnswer[l]);
            }
            return answerScore;
            break;
    }
}
/**
 * remove commas from the string
 * @param {*} changeMe 
 */
function reformatPunctuation(changeMe) {
    for (var i = 0; i < changeMe.length; i++) {
        changeMe[i] = changeMe[i].replace(',', " ");
        changeMe[i] = changeMe[i].replace('.', "");
        changeMe[i] = changeMe[i].replace('-', " ");
        changeMe[i] = changeMe[i].replace('–', " ");
        changeMe[i] = changeMe[i].replace(/\s+/, " ");
    }
    return changeMe;
}

function displaySpecificExercise(exercise) {

    var exerciseType = exercise.type;

    switch (exerciseType) {
        case "multiChoice":
            var allAnswers = exercise.extraAnswers.slice();
            allAnswers.push(correctAnswer);
            displayMultipleChoice(exercise.question, allAnswers, exLessDiv, exercise.shuffleAnswers);
            break;
        case "explanation":
            displayExplanation(exercise.question, exercise.explanation, exLessDiv);
            break;
        case "inputText":
            displayInputText(exercise.question, exercise.answers, exLessDiv);
            break;
        case "multiSelect":
            displayMultiSelect(exercise.question, exercise.correctAnswers.concat(exercise.extraAnswers), exLessDiv, exercise.shuffleAnswers);
            break;
    }


}

function finishLesson(userLesson) {


    //add user's progress to overall progress
    userLesson.totalCorrect = correctExercises;
    userLesson.maxPointsAvailable = maxPointsPerLesson;
    finishedLessons.lessons.push(userLesson);
    finishedLessonsCount++;
    console.log(JSON.stringify(finishedLessons));

    //remove the next button child
    mainDiv.removeChild(document.getElementById("bottomButtonDiv"));

    displayLessonStats();

    //clear global variables
    currentUserLesson = undefined;
    currentExercise = undefined;
    currentAnswer = undefined;
    correctAnswer = undefined;
    userLesson = undefined;

}

function displayLessonStats() {
    var statsDiv = document.createElement("div");
    statsDiv.className = ("stats");
    //Display correct out of all exercises
    exLessDiv.innerHTML = "";
    var text;
    if (correctExercises >= maxPointsPerLesson / 2) {
        text = 'Good Job';
    } else {
        text = 'Jinkies! You answered less than half of the answers correctly.';
    }
    if (correctExercises < 0) correctExercises = 0;
    text = text + " <br/> " + correctExercises + "/" + maxPointsPerLesson;
    statsDiv.innerHTML = text;
    exLessDiv.appendChild(statsDiv);
    //add a button to finish lesson
    var buttonDiv = document.createElement('div');
    buttonDiv.setAttribute("id", "bottomButtonDiv");

    var finishButton = document.createElement('button');
    finishButton.classList.add("bottomButton", "submit", "btn-lg", "btn-info");
    finishButton.innerHTML = "OK";

    finishButton.addEventListener("click", function () {
        collapseAllHints();
        //clear the hint array
        usedHintsPerLesson = [];
        //display lesson menu
        displayLessonMenu(allLessons);
        correctExercises = 0;
        maxPointsPerLesson = 0;
        mainDiv.removeChild(document.getElementById("bottomButtonDiv"));
        displayTimeoutMessage();
    });
    buttonDiv.appendChild(finishButton);
    mainDiv.appendChild(buttonDiv);
    playLessonAudio(true);

}

function displayInfoAlert(text) {

    //create div
    var alertDiv = document.createElement("div");
    alertDiv.setAttribute("class", "alert alert-info fade show");
    alertDiv.setAttribute("role", "alert");

    var t = document.createTextNode(text);
    alertDiv.appendChild(t);

    mainDiv.appendChild(alertDiv);

    window.setTimeout(function () {
        $(".alert-info").alert('close');
    }, 2000);
}
/**
 * Display the 'corect'/'incorrect' message after pressing next
 * @param {bool/obj} correctness defines if the user was correct 
 * @param {*} div 
 */
function displayAnswerMessage(correctness, div) {

    isCurrentPaneExercise = false;

    div.innerHTML = "";

    //Add the title
    var questionLabel = document.createElement("h3");
    questionLabel.innerHTML = currentExercise.question;
    div.appendChild(questionLabel);

    //If the exercise is not multiple checkbox select
    if (currentExercise.type != "multiSelect") {
        displaySimpleAnswerMessage(correctness, div);
    }
    else {
        displayComplexAnswerMessage(correctness, div);
    }

    currentAnswer = undefined;
}

function displaySimpleAnswerMessage(correctness, div) {
    var isUserCorrect;
    if (currentExercise.type === 'inputText') {
        isUserCorrect = correctness.isUserCorrect;
    }
    else {
        isUserCorrect = correctness;
    }
    //TODO move this, it shouldn't be in this method
    if (isUserCorrect) {
        correctExercises++;
    }
    var allCorrectAnswersDiv = document.createElement("div");

    var userAnswerDiv = document.createElement("div");
    userAnswerDiv.setAttribute("role", "alert");

    var userAnswerText;

    if (isUserCorrect) {
        userAnswerDiv.setAttribute("class", "alert alert-success show");
        if (currentExercise.type === 'inputText' && correctness.distance > 0) {
            userAnswerText = "Correct with TYPO";
        }
        else
            userAnswerText = "Correct";
    }
    else {
        userAnswerDiv.setAttribute("class", "alert alert-danger show");
        userAnswerText = "Incorrect";
    }
    div.appendChild(userAnswerDiv);

    //yellow alert message
    if (currentExercise.type === 'inputText' || !isUserCorrect) {
        allCorrectAnswersDiv.setAttribute("class", "alert alert-warning show");
        allCorrectAnswersDiv.setAttribute("role", "alert");
        var text = "  Correct Answer:  " + correctAnswer;
        //add text to alert
        var t = document.createTextNode(text);
        allCorrectAnswersDiv.appendChild(t);
        div.appendChild(allCorrectAnswersDiv);
    }

    userAnswerText = userAnswerText + ": " + currentAnswer;
    var t1 = document.createTextNode(userAnswerText);
    userAnswerDiv.appendChild(t1);
    //Play sound
    playExerciseAudio(isUserCorrect);


}

function displayComplexAnswerMessage(usersAnswers, div) {

    correctExercises = correctExercises + usersAnswers.usersCorrectAnswers.length - usersAnswers.usersIncorrectAnswers.length;;
    var isUserCorrect = false;
    //create alert div
    var correctAlertDiv = document.createElement("div");
    correctAlertDiv.setAttribute("role", "alert");
    var incorrectAlertDiv = document.createElement("div");
    incorrectAlertDiv.setAttribute("role", "alert");
    var allCorrectAnswersDiv = document.createElement("div");
    allCorrectAnswersDiv.setAttribute("role", "alert");

    //If the user didn't get any answers correct, don't show it 
    if (usersAnswers.usersCorrectAnswers.length > 0 || (typeof usersAnswers.usersCorrectAnswers === 'undefined')) {
        correctAlertDiv.setAttribute("class", "alert alert-success fade show");
        var text = "  Correct:    " + usersAnswers.usersCorrectAnswers;

        //add text to alert
        var t = document.createTextNode(text);
        correctAlertDiv.appendChild(t);
        div.appendChild(correctAlertDiv);

        isUserCorrect = true;
    }

    //If the user didn't get any answers incorrect, don't show 'Incorrect' 
    if (usersAnswers.usersIncorrectAnswers.length > 0 || (typeof usersAnswers.usersIncorrectAnswers === 'undefined')) {
        incorrectAlertDiv.setAttribute("class", "alert alert-danger fade show");
        var text = "  Incorrect:  " + usersAnswers.usersIncorrectAnswers;
        //add text to alert
        var t = document.createTextNode(text);
        incorrectAlertDiv.appendChild(t);
        div.appendChild(incorrectAlertDiv);

    }

    if (usersAnswers.usersCorrectAnswers.length < correctAnswer.length) {
        allCorrectAnswersDiv.setAttribute("class", "alert alert-warning fade show");
        var text = "  All correct Answers:  " + correctAnswer;
        //add text to alert
        var t = document.createTextNode(text);
        allCorrectAnswersDiv.appendChild(t);
        div.appendChild(allCorrectAnswersDiv);
    } else {
        playExerciseAudio(isUserCorrect);

    }




}

function displayTimeoutMessage() {
    var timer = new Timer();

    timer.start({ countdown: true, startValues: { seconds: 2 } });
    $('#timerModal .values').html(timer.getTimeValues().toString());
    timer.addEventListener('secondsUpdated', function (e) {
        $('#timerModal .values').html(timer.getTimeValues().toString());
    });
    timer.addEventListener('targetAchieved', function (e) {
        $("#timerModal").modal('hide');
    });
    $('#timerModal').modal({ backdrop: 'static', keyboard: false });

}
/**
 * Take a lesson object and return a lesson object where all explanations are removed from the exercises array
 * @param {obj} lsn 
 */
function removeExplanations(lsn) {
    var newLsn = JSON.parse(JSON.stringify(lsn));
    newLsn.exercises = [];
    Object.keys(lsn).forEach(function (key, index) {
        if (key === 'exercises') {
            for (var i = 0; i < lsn[key].length; i++) {
                if (lsn[key][i].type !== 'explanation') {
                    newLsn.exercises.push(lsn.exercises[i]);
                }
            }
        }
    });
    newLsn.exercises = shuffle(newLsn.exercises);
    return newLsn;
}

function playExerciseAudio(correct) {
    var audio;
    if (correct) {
        audio = new Audio('audio/correct.mp3');
        audio.play();
    } else {
        audio = new Audio('audio/incorrect2.mp3');
        audio.play();
    }
}

function playLessonAudio(finishedLesson) {
    if (finishedLesson) {
        audio = new Audio('audio/finish.wav');
        audio.play();
    }
}