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
<!DOCTYPE HTML PUBLIC "~//IETF//DTD HTML//EN">
<html>
<link rel="stylesheet" type="text/css" href="../css/sutime.css">
<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="../js/sutime.js"></script>

<p id="suTimeDisplay">Estimated Travel Time: </p>

<form id="my-form">
    Distance
    <input type="text" name="distance" value="0" />
    Speed
    <input type="text" name="speed" value="max" />
    <button type="submit">Go</button>
</form>

<button onclick="resetForm()">Reset</button>
<p><button onclick="history.go(-1);">Back</button></p>
<p><a href="?action=logout">Log Out</a></p>
<body>
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
