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



<!--Original credit goes to Kirito for v1.0 of the map. It has since been updated to 2.0 by Yamamushi and Drystion-->
<!DOCtype html>

<!--suppress ALL -->
<html lang="en">

<head>

	<meta http-equiv="X-UA-Compatible" content="chrome=1" />
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />

	<title>
		3D Dual Universe Map
	</title>

	<link rel="stylesheet" type="text/css" href="../css/map.css">
	<script type="text/javascript" src="http://d3js.org/d3.v3.min.js"></script>
	<script type="text/javascript" src="http://x3dom.org/x3dom/dist/x3dom-full.js"></script>
	<script type="text/javascript" src="../js/map.js"></script>
</head>

<body>
<span id="map">
	Helios System Map
</span></td></tr></table>
<div id="plot"></div>
<div id="legend">
	Display : click - Center : double-click - Rotate : drag - Zoom : Scroll or right-drag - <a href="?action=logout">Log Out</a> - <button onclick="history.go(-1);">Back </button>
</div>
<div id="credits">
	Original credit goes to Kirito for v1.0 of the map. Modifications by Yamamushi and Drystion (2019).
</div>sb
<div id="options_menu" style="display: none;"></div>
<div id="info_Panel"></div>
<div id="menu" ></div>


<script>
	window.onload = start_Up();
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
