var mainDiv = document.getElementById('content');
var finishedLessonsCount = 0;
var isCurrentPaneExercise = false;  //exercise - true, validation - false
var correctExercises = 0;
var shownExNumber = 0;
var onMenu = true;
var numberOfHintsUsed = 0;
var numberOfMaxHints;


function displayLessonMenu(lessons) {

    onMenu = true;
    exLessDiv.innerHTML = "";

    //Add all the buttons for lessons into the div
    for (var i = 0; i < lessons.length; i++) {
        var lessonButton = document.createElement("button");
        var lesson = lessons[i];
        lessonButton.innerHTML = "LESSON " + lesson.lessonID + "<br />" + lesson.lessonName;
        lessonButton.className = "btn btn-primary";

        lessonButton.addEventListener("click", (function (lesson2) {
            return function () {
                loadLesson(lesson2);
                onMenu = false;
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
    var exercises = lesson.exercises;
    currentUserLesson = new finishedLesson(lesson.lessonName, lesson.lessonID, [], 0, 0);

    displayExercise(exercises);
    addHintEvents();

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

function addHintEvents() {
}
function validateExercise(exercises) {
    //check if the main div is displaying an exercise or an answer validation
    if (isCurrentPaneExercise && currentExercise.type !== "explanation") {
        console.log(currentExercise.type);
        shownExNumber++;

        //if the user has chosen an answer
        if (typeof currentAnswer !== 'undefined') {
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
                    break;
                case "multiChoice":
                    var isUserCorrect = checkAnswer(correctAnswer);
                    displayAnswerMessage(isUserCorrect, exLessDiv);
                    currentUserLesson.exercises.push({
                        "exercise": currentExerciseNumber,
                        "answer": currentAnswer,
                        "correct": isUserCorrect
                    });
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

    if (currentExerciseNumber < exercises.length) {
        currentExercise = exercises[currentExerciseNumber];
        isCurrentPaneExercise = true;


        switch (currentExercise.type) {
            case "multiChoice":
                //Extract the correct answer
                correctAnswer = currentExercise.answers[0];
                break;
            case "inputText":
                correctAnswer = currentExercise.answers;
                break;
            case "explanation":
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
    }
}

function displaySpecificExercise(exercise) {

    var exerciseType = exercise.type;

    switch (exerciseType) {
        case "multiChoice":
            displayMultipleChoice(exercise.question, exercise.answers, exLessDiv, exercise.shuffleAnswers);
            break;
        case "explanation":
            displayExplanation(exercise.question, exercise.explanation, exLessDiv);
            break;
        case "inputText":
            displayInputText(exercise.question, exercise.answers, exLessDiv);
        //    code block
        //    break;
        //default:
        //    code block
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

function displayAnswerMessage(isUserCorrect, div) {
    isCurrentPaneExercise = false;
    if (isUserCorrect) {
        correctExercises++;
    }

    div.innerHTML = "";

    //Add the title
    var questionLabel = document.createElement("h3");
    questionLabel.innerHTML = currentExercise.question;
    div.appendChild(questionLabel);

    //Create the answer div
    var correctAnswerDiv = document.createElement("div");
    correctAnswerDiv.innerHTML = "Your answer - " + currentAnswer + "<br>Possible answers - " + correctAnswer;



    //create alert div
    var alertDiv = document.createElement("div");
    alertDiv.setAttribute("role", "alert");

    //display different alerts depending if the user is correct
    if (isUserCorrect) {
        alertDiv.setAttribute("class", "alert alert-success fade show");
        var text = "  Correct!";
    } else {
        alertDiv.setAttribute("class", "alert alert-danger fade show");
        var text = "  Incorrect";
    }

    //add text to alert
    var t = document.createTextNode(text);
    alertDiv.appendChild(t);

    div.appendChild(alertDiv);
    div.appendChild(correctAnswerDiv);

}