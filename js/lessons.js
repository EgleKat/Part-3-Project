var mainDiv = document.getElementById('content');
var userName;
var finishedLessonsCount = 0;

function displayLessons(lessons) {

    exLessDiv.innerHTML = "";
    
    //Add all the buttons for lessons into the div
    for (var i = 0; i < lessons.length; i++) {
        var lessonButton = document.createElement("button");
        var lesson = lessons[i];
        lessonButton.innerHTML = "LESSON " + lesson.lessonID + "\n" + lesson.lessonName;
        lessonButton.className = "btn btn-primary";

        lessonButton.addEventListener("click", (function (lesson2) {
            return function () {
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
    currentExerciseNumber = 0;
    var exercises = lesson.exercises;
    currentUserLesson = new finishedLesson(lesson.lessonName, lesson.lessonID, []);

    displayExercise(exercises);


    //create 'Next' button
    var nextButton = document.createElement('button');
    nextButton.innerHTML = "Next";

    nextButton.addEventListener("click", function () {
        validateExercise(exercises);
    });

    var nextButtonDiv = document.createElement('div');
    nextButtonDiv.setAttribute("class", "nextButton");
    nextButtonDiv.appendChild(nextButton);
    mainDiv.appendChild(nextButtonDiv);

}


function validateExercise(exercises) {
    console.log(currentExercise.type);
    if (currentExercise.type !== "explanation") {

        //If the user didn't select any option
        if (typeof currentAnswer !== 'undefined') {

            var isUserCorrect = checkAnswer(correctAnswer);
            currentUserLesson.exercises.push({
                "exercise": currentExerciseNumber,
                "answer": currentAnswer,
                "correct": isUserCorrect
            });

            console.log(isUserCorrect);
        }
        else {
            displayInfoAlert("You have to select an answer to proceed");
            return;
        }
    } else if (currentExercise.type === "explanation") {
        currentUserLesson.exercises.push({
            "exercise": currentExerciseNumber
        });

    }

    //display next exercise
    currentExerciseNumber++;
    displayExercise(exercises);

    //clear current answer
    currentAnswer = undefined;
}

function displayExercise(exercises) {

    if (currentExerciseNumber < exercises.length) {
        currentExercise = exercises[currentExerciseNumber];

        if (currentExercise.type !== "explanation") {
            //Extract the correct answer
            correctAnswer = currentExercise.answers[0];
        }
        displaySpecificExercise(currentExercise);

    } else
        finishLesson(currentUserLesson);

}

function checkAnswer(correctAnswer) {
    //current answer is stored globally
    if (correctAnswer == currentAnswer)
        return true;
    else return false;
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
    //clear global variables
    currentUserLesson = undefined;
    currentExercise = undefined;
    currentAnswer = undefined;
    correctAnswer = undefined;

    //add user's progress to overall progress
    finishedLessons.push(userLesson);
    finishedLessonsCount++;

    //remove the next button
    mainDiv.removeChild(document.getElementsByClassName("nextButton")[0]);

    //display lesson menu
    displayLessons(allLessons);

}

function displayInfoAlert(text) {

    //create div
    var alertDiv = document.createElement("div");
    alertDiv.setAttribute("class", "alert alert-info fade show");
    alertDiv.setAttribute("role", "alert");

    var t = document.createTextNode(text);
    alertDiv.appendChild (t);

    exLessDiv.appendChild(alertDiv);

    window.setTimeout(function () {
        $(".alert").alert('close');
    }, 2000);
}