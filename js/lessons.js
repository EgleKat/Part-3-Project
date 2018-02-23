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
    console.log(currentAnswer);
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
            displayMultipleChoice(exercise.question, [], exLessDiv, false);
        //    code block
        //    break;
        //default:
        //    code block
    }


}

//the question is a string, answers is an array of strings, where the first element is the correct answer
function displayMultipleChoice(question, answers, div, shuffleAnswers) {
    //Loading Multiple Choice
    div.innerHTML = "";

    //Add a question
    var questionLabel = document.createElement("h3");
    questionLabel.innerHTML = question;
    div.appendChild(questionLabel);

    //Create the answer div
    var answerDiv = document.createElement("div");

    //TODO delete this
    //Add input to answerDiv
    var correctAnswer = answers[0];


    //shuffle the answers
    if (shuffleAnswers) {
        answers = shuffle(answers);
    }

    //add all of the answers as radio buttons
    for (var i = 0; i < answers.length; i++) {

        var oneAnswerDiv = document.createElement("p");

        var answer = answers[i];
        //create radio button
        var radioInput = document.createElement('input');
        radioInput.setAttribute('type', 'radio');
        radioInput.setAttribute('name', question);
        radioInput.setAttribute('id', i);
        radioInput.setAttribute('value', answer);

        //Add a listener to the radio button
        radioInput.onclick = function () {
            currentAnswer = this.value;
        }

        //add label
        var label = document.createElement('label');
        label.setAttribute("for", i);
        label.innerHTML = answer;


        //add everything to the div
        oneAnswerDiv.appendChild(radioInput);
        oneAnswerDiv.appendChild(label);
        answerDiv.appendChild(oneAnswerDiv);
    }

    div.appendChild(answerDiv);

}
function finishLesson(userLesson) {
    currentUserLesson = undefined;
    currentExercise = undefined;
    currentAnswer = undefined;
    correctAnswer = undefined;

    finishedLessons.push(userLesson);
    finishedLessonsCount++;
    console.log(finishedLessons);

    mainDiv.removeChild(document.getElementsByClassName("nextButton")[0]);

    displayLessons(allLessons);

}