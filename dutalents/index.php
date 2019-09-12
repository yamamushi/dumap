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
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>DU Talents</title>
    <base href="/dutalents/">

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="favicon.ico">
<link rel="stylesheet" type="text/css" href="styles.09c385c348149c6ab585.css"></head>

<body>
    <div class="app-root">
    <app-root></app-root>
    </div>
<script src="runtime-es2015.703a23e48ad83c851e49.js" type="module"></script><script src="polyfills-es2015.4d31cca2afc45cfd85b5.js" type="module"></script><script src="runtime-es5.465c2333d355155ec5f3.js" nomodule></script><script src="polyfills-es5.03d8c9fc4ed8e610412b.js" nomodule></script><script src="main-es2015.302f3b4621c961906963.js" type="module"></script><script src="main-es5.8cd93db9a36b3df8110c.js" nomodule></script></body>

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
