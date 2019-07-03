<?php
include 'config.php';
include 'library/vars.php';
include 'library/global.php';

session_start();

if(session('access_token')) {
    $user = apiRequest($apiURLBase);
    $guilds = apiRequest($apiURLGuilds);
    $guildmember = apiBotRequest($apiURLGuildMember, $user->id);
    $data = json_decode($guildmember);

    $found = FALSE;

    foreach($data->roles as $field) {
        if($field == ALPHA_AUTHORIZED_ROLE_ID) {
            $found = TRUE;
            echo <<<EOL


<!--Original credit goes to Kirito for v1.0 of the map. It has since been updated to 2.0 by Yamamushi and Drystion-->
<!DOCtype html>

<html lang="en">

<head>

	<meta http-equiv="X-UA-Compatible" content="chrome=1" />
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />

	<title>
		3D Dual Universe Map
	</title>

	<link rel="stylesheet" type="text/css" href="css/styles.css">
	<script type="text/javascript" src="http://d3js.org/d3.v3.min.js"></script>
	<script type="text/javascript" src="http://x3dom.org/x3dom/dist/x3dom-full.js"></script>
	<script type="text/javascript" src="./js/main.js"></script>
</head>

<body>
<table width=100%><tr width=100%><td width=10%>
<span id="options" OnClick="open_Options()">
	Options
</span></td><td width=90%>
<span id="map">
	Alioth System Map
</span></td></tr></table>
<div id="plot"></div>
<div id="legend">
	Display : click - Center : double-click - Rotate : drag - Zoom : Scroll or right-drag - <a href="?action=logout">Log Out</a>
</div>
<div id="credits">
	Original credit goes to Kirito for v1.0 of the map. Modifications by Yamamushi and Drystion (2019).
</div>
<div id="menu">
	Hide Orbits
	<input type="checkbox" id="orbitals_Checkbox" OnClick="orbitals_Check()" />
	<br>
	Orbit Visibility
	<input type="range" min="1" max="100" value="60" id="orbitals_Visibility" OnClick="orbitals_Visibility()" />
	<br>
</div>
<div id="info_Panel">
</div>

<script>
	window.onload = start_Up();
</script>
</body>
</html>


EOL;
        }
        //echo $field;
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
