var allLessons = readLessonJson();
var exLessDiv = document.getElementById('change');
displayLessonMenu(allLessons);
var finishedLessons = [];


//on 'Enter' click the button
$(document).on('keyup', function (e) {
    if (!onMenu) {
        var key = e.which;
        if (key == 13)  // the enter key ascii code
        {
            document.getElementsByClassName('submit')[0].click();
        }
    }
});










function finishedLesson(name, id, exercises) {
    this.name = name;
    this.id = id;
    this.exercises = exercises;
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