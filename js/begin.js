var allLessons = readLessonJson();
var exLessDiv = document.getElementById('change');
displayNameInput();
var userName;
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


/**
 * Show a dialog (modal) pop-up and get a user name from an input box
 */
function displayNameInput() {
    $('#myModal').modal({ backdrop: 'static', keyboard: false });
    $("#acceptUserName").click(function () {
        var name = $('#userNameInput').val();
        name.trim();

        //If the name is NOT (undefined and empty)
        if (typeof name !== 'undefined' && name.length > 0) {
            $("#myModal").modal('hide');
            userName = name;
            displayLessonMenu(allLessons);
        }
    });


}

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

/**
 * @param {String} heading the heading/title of the explanation
 * @param {String} value the explanation string
 */
function addNewExplanation(heading, value) {

    //If the explanation already exists, break out of the function
    for (var i = 0; i < allHints.length; i++) {
        if (allHints[i] === heading)
            return;
    }

    allHints.push(heading);

    //hide the primary message
    document.getElementById("primaryExplanation").classList.add("d-none");
    var explanationMenuDiv = document.getElementById("explanations");
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
    link.addEventListener("click", (function (e) {
        addHintEvents(this, e);
    }));

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


/**
 * 
 * @param {any} link html <a> reference
 * @param {event} e  click event
 */
function addHintEvents(link, e) {
    if (onMenu) {
        //if the user is in a lesson
    } else {
        //check if the user has already clicked on the hint, break function
        for (var hintIndex = 0; hintIndex < usedHintsPerLesson.length; hintIndex++) {
            if (link.innerHTML === usedHintsPerLesson[hintIndex]) {
                return;
            }
        }
        //if the user has more hints to use up, allow, otherwise stop the link from opening
        if (usedHintsPerLesson.length < numberOfMaxHints) {
            usedHintsPerLesson.push(link.innerHTML);
            changeHintHeading();
        } else {
            e.stopPropagation();
            //TODO SHOW AN ALERT
        }

    }
}


function changeHintHeading() {
    var div = document.getElementById("explanationMenu");
    var heading = div.children[0];

    if (onMenu)
        heading.innerHTML = "Recap";
    else {
        heading.innerHTML = ("Hints:   " + (numberOfMaxHints - usedHintsPerLesson.length) + "  left");
    }
}

function changeMainHeading(value) {
    var div = document.getElementById("content");
    var heading = div.children[0];
    heading.innerHTML = value;

}

function updateMainHeadingWithQuestionNumber(value) {
    var div = document.getElementById("content");
    var heading = div.children[0];
    var headingText = heading.innerHTML;
    if (hasNumber(headingText)) {
        heading.innerHTML = headingText.replace(/[0-9][0-9]?/, value);
    } else
        heading.innerHTML = headingText + "   " + value;


}


function collapseAllHints() {
    for (var i = 0; i < allHints.length; i++) {
        $('[id="' + allHints[i] + 'Ex"]').collapse('hide');
    }
}