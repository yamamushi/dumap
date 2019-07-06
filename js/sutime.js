function calculateDistance(distance, speed) {

    if (!isNumber(distance)) {
        return "Calculator distance must be a number value."
    }
    if (distance <= 0) {
        return "Calculator expects a distance value greather than zero.";
    }
    if (speed === "max"){
        speed = 30000;
    }
    if (!isNumber(speed)){
        return "Calculator speed must be a number value or 'max'";
    }
    if (speed > 30000) {
        return "Calculator maximum accepted speed is 30000";
    }
    if (speed <= 0){
        return "Calculator expects a speed greater than 0 or 'max'";
    }

    distance = distance * 200; // Scaling
    return (distance/speed) * 3600;
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}


function secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

function updateOutput(output) {
    var obj = $("#suTimeDisplay");
    updateText(obj, output);
};

function updateText(obj, output) {
    obj.html(output);
}


$(function() {
    $('#my-form').on("submit",function(e) {
        e.preventDefault(); // cancel the actual submit

        distance = $('#my-form :input[name="distance"]').val();
        speed = $('#my-form :input[name="speed"]').val()

        time = calculateDistance(distance, speed);

        if (!isNumber(time)) {
            time = "Error: " + time;
            updateOutput(time.fontcolor("red"));
        }

        updateOutput("Estimated Travel Time: "+secondsToDhms(time));
    });
});

function resetForm() {
    $('#my-form :input[name="distance"]').val('0');
    $('#my-form :input[name="speed"]').val('max');
    updateOutput("Estimated Travel Time: ");
};

