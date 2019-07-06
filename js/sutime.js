function calculateDistance(distance, speed) {

    if (!isNumber(distance)) {
        return "Calculator distance must be a number value."
    }
    if (distance <= 0) {
        return "Calculator expects a distance value greather than zero.";
    }
    if (speed == "max"){
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
    return (distance/speed) * 3600; // Seconds scaling
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}


function formatTime(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
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

        updateOutput("Estimated Travel Time: "+formatTime(time));
    });
});

function resetForm() {
    $('#my-form :input[name="distance"]').val('0');
    $('#my-form :input[name="speed"]').val('max');
    updateOutput("Estimated Travel Time: ");
};

