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

    $found = FALSE;

    foreach($data->roles as $field) {
        if($field == ALPHA_AUTHORIZED_ROLE_ID) {
            $found = TRUE;
            echo '<h3>Welcome</h3>';
            echo '<br>';
            echo '<a href="map.php">Map Page</a>';
            echo '<p><a href="?action=logout">Log Out</a></p>';
        }
    }

    if ($found == FALSE) {
        echo '<h3>Unauthorized</h3>';
        echo '<p><a href="?action=logout">Log Out</a></p>';

    }
} else {
    echo '<h3>Welcome to Dual.sh</h3>';
    echo '<br>';
    echo 'To continue, please <a href="?action=login">click here</a> to sign in.';
}

?>