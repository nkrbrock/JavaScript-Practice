function displayTime(){
    var date = new Date();
    var day = date.getDate();
    var mon = date.getMonth() + 1;
    var yr = date.getFullYear();

    var time = new Date();
    var hr = time.getHours();
    var min = time.getMinutes();
    var sec = time.getSeconds();
    var mil = time.getMilliseconds();
    var half = " AM";

    (hr >= 12) ? half = " PM" : half;

    // sets the time format to 00:00:00:000
    hr = (hr < 10) ? "0" + hr : hr;
    min = (min < 10) ? "0" + min : min;
    sec = (sec < 10) ? "0" + sec : sec;
    mil = (mil < 10) ? "00" + mil : (mil > 10 && mil < 100) ? "0" + mil: mil;

    var calendar = day + "/" + mon + "/" + yr;
    var fullTime = hr + ":" + min + ":" + sec + ":" + mil + half;

    $(".date").text(calendar);
    $(".time").text(fullTime);

    //controls how frequently the time updates in milliseconds
    setTimeout(displayTime, 10);
}

displayTime();