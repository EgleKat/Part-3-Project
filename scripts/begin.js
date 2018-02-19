var allLessons = readLessonJson();
displayLessons(allLessons);











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