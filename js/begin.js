var allLessons = readLessonJson();
var exLessDiv = document.getElementById('change');
displayLessons(allLessons);
var finishedLessons = [];

//displayMultipleChoice("what's up", ["nth", "yes", "no"], exLessDiv, true);









function finishedLesson(name, id,  exercises) {
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