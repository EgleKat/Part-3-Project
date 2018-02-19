var mainDiv = document.getElementById('content');
var userName;
var finishedLessons = 0;

function displayLessons(lessons) {

    //Add all the buttons for lessons into the div
    for (var i=0; i < lessons.length; i++) {
        var lessonButton = document.createElement("button");
        var lesson = lessons[i];
        lessonButton.innerHTML = "LESSON " + lesson.lessonID + "\n" + lesson.lessonName;
        lessonButton.className = "btn btn-primary";
        mainDiv.appendChild(lessonButton);
    }

}