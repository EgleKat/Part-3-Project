var allLessons = readLessonJson();
var exLessDiv = document.getElementById('change');
displayLessons(allLessons);
//displayMultipleChoice("what's up", ["nth", "yes", "no"], exLessDiv, true);










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