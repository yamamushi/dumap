<?php
include 'config.php';
include 'library/vars.php';
include 'library/global.php';

session_start();

// When Discord redirects the user back here, there will be a "code" and "state" parameter in the query string
if(get('code')) {

    // Exchange the auth code for a token
    $token = apiRequest($tokenURL, array(
        "grant_type" => "authorization_code",
        'client_id' => OAUTH2_CLIENT_ID,
        'client_secret' => OAUTH2_CLIENT_SECRET,
        'redirect_uri' => 'http://dual.sh',
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
    $blacklistfile = file_get_contents('./data/blacklist.json');
    $blacklist = json_decode($blacklistfile, false);

    $isbanned = false;

    foreach($blacklist as $banned){
        if($banned->id == $user->id) {
            $isbanned = true;
        }
    }

    $found = false;
    if($isbanned == false){
        foreach ($data->roles as $field) {
            if ($field == ALPHA_AUTHORIZED_ROLE_ID) {
                $found = true;

                echo '<html>';
                echo '<head>';
                echo '<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">';
                echo '<link rel="stylesheet" type="text/css" href="./css/mainmenu.css">';
                echo '</head>';
                echo '<body>';
                echo '<div class="navbar">';
                echo '<a>Welcome '.$user->username.'!</a>';
                echo '<a id="a1" href="./wiki/index.php">Wiki</aa1>';
                echo '<a id="a1" href="./map/map.php">Solar System Map</a1>';
                echo '<a id="a1" href="./craft/index.php">Crafting Calculator</a1>';
                echo '<a id="a1" href="./sutime/index.php">Travel Time Calculator</a1>';
                echo '<a id="a2" href="./index.php?action=logout">Log Out</a2>';
                echo '</div>';
                echo '</body>';
                echo '</html>';
                //echo 'ID: '.$user->id.'<br>';
            }
        }
    }

    if ($found == false) {
        echo '<h3>Unauthorized</h3>';
        echo '<p><a href="?action=logout">Log Out</a></p>';
    }
} else {
    echo '<h3>Welcome to Dual.sh</h3>';
    echo '<br>';
    echo 'To continue, please <a href="?action=login">click here</a> to sign in.';
}

?>