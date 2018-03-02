var allLessons = readLessonJson();
var exLessDiv = document.getElementById('change');
displayExplanationMenu();
displayLessonMenu(allLessons);
var userName = "Alexandria";
var finishedLessons = { "userName": userName, "lessons": [] };



//on 'Enter' click the button
$(document).on('keyup', function (e) {
    //if the user is on the lesson menu - don't register click
    if (!onMenu) {
        var key = e.which;
        if (key == 13)  // the enter key ascii code
        {
            document.getElementsByClassName('submit')[0].click();
        }
    }
});










function finishedLesson(name, id, exercises, totalCorrect, totalExCount) {
    this.name = name;
    this.id = id;
    this.exercises = exercises;
    this.totalCorrect = totalCorrect;
    this.totalExCount = totalExCount;
}


function readLessonJson() {
    var lessons;
    var dataPath1 = "data/lessons.json";
    var lessonRequest = new XMLHttpRequest();

    lessonRequest.open('GET', dataPath1, false);
    lessonRequest.onload = function () {
        lessons = JSON.parse(lessonRequest.responseText);
    };

    lessonRequest.send();
    return lessons;
}

function displayExplanationMenu() {
    //create button

    var explanationMenuDiv = document.createElement("div");
    mainDiv.appendChild(explanationMenuDiv);

}