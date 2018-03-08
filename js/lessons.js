var mainDiv = document.getElementById('content');
var finishedLessonsCount = 0;
var isCurrentPaneExercise = false;  //exercise - true, validation - false
var correctExercises = 0;
var shownExNumber = 0;
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
        var lessonButton = document.createElement("button");
        var lesson = lessons[i];
        lessonButton.innerHTML = "LESSON " + lesson.lessonID + "<br />" + lesson.lessonName;
        lessonButton.className = "btn btn-primary";

        lessonButton.addEventListener("click", (function (lesson2) {
            return function () {
                onMenu = false;
                loadLesson(lesson2);
            };
        })(lesson));
        exLessDiv.appendChild(lessonButton);
    }

}
var currentExerciseNumber;
var currentExercise;
var currentAnswer;
var correctAnswer;
var currentUserLesson;
function loadLesson(lesson) {
    numberOfMaxHints = 3;
    currentExerciseNumber = 0;
    changeHintHeading();
    changeMainHeading(lesson.lessonName);
    var exercises = lesson.exercises;
    currentUserLesson = new finishedLesson(lesson.lessonName, lesson.lessonID, [], 0, 0);

    displayExercise(exercises);
    //create 'Next' button
    var nextButton = document.createElement('button');
    nextButton.setAttribute("class", "submit");
    nextButton.innerHTML = "Next";

    nextButton.addEventListener("click", function () {
        validateExercise(exercises);
    });

    var nextButtonDiv = document.createElement('div');
    nextButtonDiv.setAttribute("class", "bottomButton");
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
                    var isUserCorrect = checkAnswer(correctAnswer);
                    displayAnswerMessage(isUserCorrect, exLessDiv);
                    currentUserLesson.exercises.push({
                        "exercise": currentExerciseNumber,
                        "answer": currentAnswer,
                        "correct": isUserCorrect
                    });
                    shownExNumber++;
                    break;
                case "multiChoice":
                    var isUserCorrect = checkAnswer(correctAnswer);
                    displayAnswerMessage(isUserCorrect, exLessDiv);
                    currentUserLesson.exercises.push({
                        "exercise": currentExerciseNumber,
                        "answer": currentAnswer,
                        "correct": isUserCorrect
                    });
                    shownExNumber++;
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
                    shownExNumber += currentExercise.correctAnswers.length;
                    break;
            }

            //if the user hasn't chosen an answer 
        } else {
            displayInfoAlert("You have to select an answer to proceed");
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
    //clear current answer
    currentAnswer = undefined;

}

function displayExercise(exercises) {

    currentAnswer = undefined;
    if (currentExerciseNumber < exercises.length) {
        currentExercise = exercises[currentExerciseNumber];
        isCurrentPaneExercise = true;

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

function checkAnswer(correctAnswer) {
    //currentAnswer is stored globally
    switch (currentExercise.type) {
        case "multiChoice":
            return (correctAnswer === currentAnswer);
            break;
        case "inputText":
            var answers = currentExercise.answers;
            for (var i = 0; i < answers.length; i++) {
                if (currentAnswer === answers[i])
                    return true;
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
    userLesson.totalExCount = shownExNumber;
    finishedLessons.lessons.push(userLesson);
    finishedLessonsCount++;
    console.log(JSON.stringify(finishedLessons));

    //remove the next button child
    mainDiv.removeChild(document.getElementsByClassName("bottomButton")[0]);

    displayLessonStats();

    //clear global variables
    currentUserLesson = undefined;
    currentExercise = undefined;
    currentAnswer = undefined;
    correctAnswer = undefined;
    userLesson = undefined;

}

function displayLessonStats() {
    //Display correct out of all exercises
    exLessDiv.innerHTML = "";
    exLessDiv.innerHTML = "Good Job<br>" + correctExercises + "/" + shownExNumber;

    //add a button to finish lesson
    var buttonDiv = document.createElement('div');
    buttonDiv.setAttribute("class", "bottomButton");

    var finishButton = document.createElement('button');
    finishButton.setAttribute("class", "submit");
    finishButton.innerHTML = "OK";

    finishButton.addEventListener("click", function () {
        collapseAllHints();
        //clear the hint array
        usedHintsPerLesson = [];
        //display lesson menu
        displayLessonMenu(allLessons);
        correctExercises = 0;
        shownExNumber = 0;
        mainDiv.removeChild(document.getElementsByClassName("bottomButton")[0]);
    });
    buttonDiv.appendChild(finishButton);
    mainDiv.appendChild(buttonDiv);


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
        $(".alert").alert('close');
    }, 2000);
}

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

}

function displaySimpleAnswerMessage(isUserCorrect, div) {
    //TODO move this, it shouldn't be in this method
    if (isUserCorrect) {
        correctExercises++;
    }

    var allCorrectAnswersDiv = document.createElement("div");
    allCorrectAnswersDiv.setAttribute("role", "alert");
    var userAnswerDiv = document.createElement("div");
    userAnswerDiv.setAttribute("role", "alert");
    

    allCorrectAnswersDiv.setAttribute("class", "alert alert-warning show");
    var text = "  All correct Answers:  " + correctAnswer;
    //add text to alert
    var t = document.createTextNode(text);
    allCorrectAnswersDiv.appendChild(t);

    var userAnswerText;
    if(isUserCorrect) {
        userAnswerDiv.setAttribute("class", "alert alert-success show");
        userAnswerText = "Correct";
    }
    else{
        userAnswerDiv.setAttribute("class", "alert alert-danger show");
        userAnswerText = "Incorrect";
    }

    console.log(currentAnswer);
    userAnswerText = userAnswerText + ": " + currentAnswer;
    var t1 = document.createTextNode(userAnswerText);
    userAnswerDiv.appendChild(t1);    
    
    div.appendChild(userAnswerDiv);
    div.appendChild(allCorrectAnswersDiv);

}

function displayComplexAnswerMessage(usersAnswers, div) {

    correctExercises = correctExercises + usersAnswers.usersCorrectAnswers.length - usersAnswers.usersIncorrectAnswers.length;;

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

    }

    //If the user didn't get any answers incorrect, don't show it 
    if (usersAnswers.usersIncorrectAnswers.length > 0 || (typeof usersAnswers.usersIncorrectAnswers === 'undefined')) {
        incorrectAlertDiv.setAttribute("class", "alert alert-danger fade show");
        var text = "  Incorrect:  " + usersAnswers.usersIncorrectAnswers;
        //add text to alert
        var t = document.createTextNode(text);
        incorrectAlertDiv.appendChild(t);
        div.appendChild(incorrectAlertDiv);

    }

    allCorrectAnswersDiv.setAttribute("class", "alert alert-warning fade show");
    var text = "  All correct Answers:  " + correctAnswer;
    //add text to alert
    var t = document.createTextNode(text);
    allCorrectAnswersDiv.appendChild(t);
    div.appendChild(allCorrectAnswersDiv);



}