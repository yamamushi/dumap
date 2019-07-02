<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
ini_set('max_execution_time', 300); //300 seconds = 5 minutes. In case if your CURL is slow and is loading too much (Can be IPv6 problem)

error_reporting(E_ALL);
include 'config.php';

$authorizeURL = 'https://discordapp.com/api/oauth2/authorize';
$tokenURL = 'https://discordapp.com/api/oauth2/token';
$apiURLBase = 'https://discordapp.com/api/users/@me';
$apiURLGuilds = 'https://discordapp.com/api/users/@me/guilds';
$apiURLGuildMember = 'https://discordapp.com/api/v6/guilds/184691218184273920/members/';
$apiURLGuildRoles = 'https://discordapp.com/api/v6/guilds/184691218184273920/roles/';


session_start();

// Start the login process by sending the user to Discord's authorization page
if(get('action') == 'login') {

  $params = array(
    'client_id' => OAUTH2_CLIENT_ID,
    'redirect_uri' => 'http://dual.sh/index.php',
    'response_type' => 'code',
    'scope' => 'identify guilds'
  );

  // Redirect the user to Discord's authorization page
  header('Location: https://discordapp.com/api/oauth2/authorize' . '?' . http_build_query($params) . "&scope=identify%20guilds");
  die();
}


// When Discord redirects the user back here, there will be a "code" and "state" parameter in the query string
if(get('code')) {

  // Exchange the auth code for a token
  $token = apiRequest($tokenURL, array(
    "grant_type" => "authorization_code",
    'client_id' => OAUTH2_CLIENT_ID,
    'client_secret' => OAUTH2_CLIENT_SECRET,
    'redirect_uri' => 'http://dual.sh/index.php',
    'code' => get('code')
  ));
  $logout_token = $token->access_token;
  $_SESSION['access_token'] = $token->access_token;


  header('Location: ' . $_SERVER['PHP_SELF']);
}

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
	Display : click - Center : double-click - Rotate : drag - Zoom : Scroll or right-drag
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
  }
} else {
  echo '<h3>Not logged in</h3>';
  echo '<p><a href="?action=login">Log In</a></p>';
}


if(get('action') == 'logout') {
  // This must to logout you, but it didn't worked(

  $params = array(
    'access_token' => $logout_token
  );

  // Redirect the user to Discord's revoke page
  header('Location: https://discordapp.com/api/oauth2/token/revoke' . '?' . http_build_query($params));
  die();
}

function apiRequest($url, $post=FALSE, $headers=array()) {
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

  $response = curl_exec($ch);


  if($post)
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));

  $headers[] = 'Accept: application/json';

  if(session('access_token'))
    $headers[] = 'Authorization: Bearer ' . session('access_token');

  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

  $response = curl_exec($ch);
  return json_decode($response);
}

function apiBotRequest($url, $user=NULL) {
    $ch = curl_init();
    curl_setopt_array($ch, array(
        CURLOPT_URL            => $url . $user,
        CURLOPT_HTTPHEADER     => array('Authorization: Bot ' . BOT_TOKEN),
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_FOLLOWLOCATION => 1,
        CURLOPT_VERBOSE        => 1,
        CURLOPT_SSL_VERIFYPEER => 0,
    ));
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}

function get($key, $default=NULL) {
  return array_key_exists($key, $_GET) ? $_GET[$key] : $default;
}

function session($key, $default=NULL) {
  return array_key_exists($key, $_SESSION) ? $_SESSION[$key] : $default;
}

?>