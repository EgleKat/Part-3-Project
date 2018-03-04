var allLessons = readLessonJson();
var exLessDiv = document.getElementById('change');
addNewExplanation('SAYHI', 'LABAS');
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

function addNewExplanation(heading, value) {

    var explanationMenuDiv = document.getElementById("explanationMenu");
    //create, name card div
    var cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "card");

    //heading div
    var headingDiv = document.createElement("div");
    headingDiv.setAttribute("class", "card-header");
    headingDiv.setAttribute("id", heading);

    var headingElement = document.createElement("h5");
    headingElement.setAttribute("class", "mb-0");

    //create link
    var link = document.createElement("a");
    link.setAttribute("data-toggle", "collapse");
    link.setAttribute("href", "#" + heading + "Ex");
    link.innerHTML = heading;

    //content div
    var explDiv = document.createElement("div");
    explDiv.setAttribute("class", "collapse hide");
    explDiv.setAttribute("id", heading + "Ex");

    //card block div
    var explContentDiv = document.createElement("div");
    explContentDiv.setAttribute("class", "card-block");
    explContentDiv.innerHTML = value;


    //add everything to divs
    explanationMenuDiv.appendChild(cardDiv);
    cardDiv.appendChild(headingDiv);
    cardDiv.appendChild(explDiv);

    headingDiv.appendChild(headingElement);
    headingElement.appendChild(link);

    explDiv.appendChild(explContentDiv);
}