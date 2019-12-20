<?php
include '../config.php';
include '../library/vars.php';
include '../library/global.php';

//session_start();  // This is handled in global.php now

if(session('access_token')) {
    $user = apiRequest($apiURLBase);
    $guilds = apiRequest($apiURLGuilds);
    $guildmember = apiBotRequest($apiURLGuildMember, $user->id);
    $data = json_decode($guildmember);
    $blacklistfile = file_get_contents('./data/blacklist.json');
    $blacklist = json_decode($blacklistfile, false);

    $isbanned = false;
    foreach($blacklist as $banned){
        if($banned->id == $user->id) {
            $isbanned = true;
        }
    }

    $found = FALSE;
    if($isbanned == false) {
        foreach ($data->roles as $field) {
            if ($field == ALPHA_AUTHORIZED_ROLE_ID) {
                $found = TRUE;
                echo <<<EOL

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style>
        body { background-color:lightgrey }
        button { text-align:center; width:80px; }
        </style>
    </head>

    <body>
      <div>
        <h1 style="text-align:center; padding-top:2%; padding-bottom:2%;
                   margin:0px; background-color:black; color:white">
          Braking Calculator
        </h1>
      </div>
      <form>
        <table align="center" width="80%" height="60%">
            <tr><td>Initial Speed:</td><td/></tr>
            <tr><td><input type="number" name="initialSpeed" id="IS" min="0" value="29999"/>
                    <input type="radio" id="startKPH" name="startUnits" value="0.277777777778" checked="true"/>
                    <label for="startKPH">kph</label>
                    <input type="radio" id="startMPS" name="startUnits" value="1"/>
                    <label for="startMPS">mps</label></td><td/></tr>
            <tr><td>Ending Speed:</td><td/></tr>
            <tr><td><input type="number" name="endingSpeed" id="ES" min="0" value="0"/>
                    <input type="radio" id="endKPH" name="endUnits" value="0.277777777778" checked="true"/>
                    <label for="endKPH">kph</label>
                    <input type="radio" id="endMPS" name="endUnits" value="1"/>
                    <label for="endMPS">mps</label></td><td/></tr>
            <tr><td>Rest Mass:</td><td/></tr>
            <tr><td><input type="number" name="restMass" id="RM" step=".01" min="0.01" value="1"/>
                    <input type="radio" id="massTon" name="massUnits" value="1000" checked="true"/>
                    <label for="massTon">t</label>
                    <input type="radio" id="massKg" name="massUnits" value="1"/>
                    <label for="massKg">Kg</label></td><td/></tr>
            <tr><td>Engine Thrust:</td>
                <td>Obstruction:</td></tr>
            <tr><td><input type="number" name="engineThrust" id="ET" step=".1" min="0" value="0"/>
                    <input type="radio" id="kN" name="engUnits" value="1000" checked="true"/>
                    <label for="kN">kN </label>
                    <input type="radio" id="N" name="engUnits" value="1"/>
                    <label for="N">N</label></td>
                <td><input type="number" name="engineFct" id="EF" min="0" max="1" step=".1" value="0.0"/></td></tr>
            <tr><td>T50:</td><td/></tr>
            <tr><td><input type="number" name="t50" id="T5" min="0" step="0.1" value="0"/>
                    <label for="t50">seconds</label></td></tr>
            <tr><td>Retro-Rocket:</td>
                <td>Obstruction:</td></tr>
            <tr><td><input type="number" name="retroThrust" id="RT" min="0" step="0.1" value="0"/>
                    <input type="radio" id="rkN" name="rrUnits" value="1000" checked="true"/>
                    <label for="rkN">kN </label>
                    <input type="radio" id="rN" name="rrUnits" value="1"/>
                    <label for="rN">N</label></td>
                <td><input type="number" name="retroFct" id="RF" min="0" max="1" step=".1" value="0.0"/></td></tr>
            <tr><td colspan="2"><br></td></tr>
            <tr><th colspan="2" align="center"><button style="width:25%" type="submit">Calculate</button></th></tr>
            <tr><td colspan="2"><br></td></tr>
            <tr><th id="results" colspan="2" align="center"></th></tr>
        </table>
      </form>
      <p/>
      <h3>Assumptions</h3>
      <ol>
          <li>The braking occurs in space and in the absence of gravity.</li>
          <li>The engine's thrust is anti-parallel to the ship's velocity.</li>
          <li>If the engine thrust and T50 value are non-zero, then the
              engine's "throttle" is set to 100%.</li>
          <li>The rest mass includes both the ship and cargo measured when
              the ship is not moving.</li>
      </ol>

<script language="javascript" type="text/javascript">
var form = document.querySelector("form")
var iS = document.getElementById("IS")
var eS = document.getElementById("ES")

var c  = 30000*1000/3600;
var c2 = c*c;

form.addEventListener("submit", function (event) {
    var data = new FormData(form);
    var input = [];
    for (const entry of data) {
        input[entry[0]] = entry[1];
    }

    var initialSp = input["initialSpeed"]*input["startUnits"];

    if (initialSp >= c) {
        iS.focus();
        window.alert("Initial speed cannot exceed maximum speed.");
        event.preventDefault();
        return;
    }
    var finalSp = input["endingSpeed"]*input["endUnits"];

    if (finalSp >= initialSp) {
        iS.focus();
        window.alert("Ending speed must be less than initial speed.");
        event.preventDefault();
        return;
    }
    var restMass = input["restMass"]*input["massUnits"];
    var engThrust = input["engineThrust"] * input["engUnits"];
    var engObstruction = input["engineFct"];
    var rrThrust = input["retroThrust"] * input["rrUnits"];
    var rrObstruction = input["retroFct"];
    var t50 = input["t50"];

    var a0   = -engThrust * (1-engObstruction)/restMass;
    var b0   = -rrThrust * (1-rrObstruction)/restMass;
    var totA = a0+b0;

    if (totA == 0) {
        window.alert("A source of thrust must be supplied.");
        event.preventDefault();
        return;
    }
    var distance = 0;
    var time     = 0;

    if (t50 > 0) {
        var k1 = Math.asin(initialSp/c);

        var C1 = Math.PI*(a0/2+b0);
        var C2 = a0*t50;
        var C3 = c*Math.PI;
        var t3 = C3*k1;

        var v = function(t) {
            var w   = (C1*t - C2*Math.sin(Math.PI*t/2/t50) + t3)/C3
            var tan = Math.tan(w);
            return c*tan/Math.sqrt(tan*tan+1);
        }
        time = 2*t50;

        if (v(time) <= finalSp) {
            var lasttm = 0;

            while (time - lasttm > 0.5) {
                var tm = (lasttm+time)/2;
                var vt = v(tm);
                if (vt > finalSp) {
                    lasttm = tm;
                }
                else {
                    time = tm;
                }
            }
        }

        var tinc  = time/100;

        for (tm = 1; tm <= 100; ++tm) {
            time       = tm*tinc;
            var speed  = v(time);
            distance  += (speed+initialSp)*tinc/2;
            initialSp  = speed;
        }
    }

    if (initialSp > finalSp) {
        var k1    = c*Math.asin(initialSp/c);
        var k2    = c2 *Math.cos(k1/c)/totA;
        var t     = (c * Math.asin(finalSp/c) - k1)/totA;
        var d     = k2 - c2 * Math.cos((totA*t + k1)/c)/totA;
	    distance += d
        time     += t
    }
    var min       = Math.floor(time/60);   time -= 60*min;
    var sec       = Math.round(time);
    var time_s    = min + "m:" + sec +"s";
    var su        = Math.floor(distance/200000);
    var remainder = distance - 200000*su;
    var suFrac_s  = "" + Math.round(100*remainder/200000)/100;
    var km        = Math.round(distance/1000);
    var distance_s= su + suFrac_s.substr(1,4) + "su (" + km + "km)";

    document.getElementById("results").innerHTML =
            "Braking ends after " + time_s +", and " + distance_s + " distance";
    event.preventDefault();
})
</script>
</body>
</html>


EOL;
            }
        }
    }

    if ($found == FALSE) {
        echo '<h3>Unauthorized</h3>';
        echo '<p><a href="?action=logout">Log Out</a></p>';

    }
} else {
    echo '<h3>You must login before you can view this page, taking you back to the homepage now.</h3>';
    echo '<p>If this page does not automatically redirect you, <a href="http://dual.sh/index.php">click here.</a></p>';
    header('Refresh: 5; URL=http://dual.sh/index.php');
}

?>
