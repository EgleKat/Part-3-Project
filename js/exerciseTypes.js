//This script defines how to display different types of exercises on screen

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

function displayExplanation(question, explanation, div) {

    div.innerHTML = "";

    //Add the title
    var questionLabel = document.createElement("h3");
    questionLabel.innerHTML = question;
    div.appendChild(questionLabel);

    //Create the explanation div
    var explDiv = document.createElement("div");
    explDiv.innerHTML = explanation;

    //add everything to the div
    div.appendChild(explDiv);

}

function displayInputText(question, answers, div) {

    div.innerHTML = "";
    //Add the question
    var questionLabel = document.createElement("h3");
    questionLabel.innerHTML = question;
    div.appendChild(questionLabel);


    //Create the text div
    var textInputDiv = document.createElement("div");

    //create text input field
    var input = document.createElement("INPUT");
    input.setAttribute("id", "exTextInput");
    input.setAttribute("type", "text");

    input.onchange = function () {
        currentAnswer = input.value.trim();
    }
    input.onpaste = function () {
        input.value = "";
        displayInfoAlert("You shouldn't paste answers in! That's cheating! ");
    }
    div.appendChild(input);

}

