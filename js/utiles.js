'use strict'
var gGameInterval;
var gTime = 0;

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function startTime() {
    var elTimer = document.querySelector('.timer');
    gGameInterval = setInterval(function () {
        gTime += 1;
        var gtimeToShow = '';
        if (gTime < 10) gtimeToShow = '00:0' + gTime;
        else if (gTime < 60) gtimeToShow = '00:' + gTime;
        else {
            var minutes = (parseInt(gTime / 60) < 10) ? '0' + (parseInt(gTime / 60)) : (parseInt(gTime / 60));
            var seconds = (gTime % 60 < 10) ? '0' + gTime % 60 : gTime % 60;
            gtimeToShow = minutes + ':' + seconds;
        }
        elTimer.innerText = gtimeToShow;

    }, 1000);

}
function stopTime() {
    clearInterval(gGameInterval);
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = '00:00'
    gTime = 0;
}