//This class is here to provide the app with useful utility functions, such as shuffle an array etc.

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}
function searchKeyPress(e) {
    console.log("PRESSED KEY");
    // look for window.event in case event isn't passed in
    e = e || window.event;
    if (e.keyCode == 13) {
        document.getElementByClassName('submit').click();
        return false;
    }
    return true;
}

function removeElementFromArray(array, element) {
    const index = array.indexOf(element);

    if (index !== -1) {
        array.splice(index, 1);
    }
}

function hasNumber(value) {
    return /\d/.test(value);
}