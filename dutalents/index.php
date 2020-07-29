<?php
include '../config.php';
include '../library/vars.php';
include '../library/global.php';

//session_start();  // This is handled in global.php now

if(session('access_token')) {

    //CHECK SESSION TIMEOUT
    if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 600)) {
        // last request was more than 10 minutes ago
        session_unset();
        session_destroy();
        session_write_close();
        setcookie(session_name(),'',0,'/');
        session_regenerate_id(true);
        header("Location: /");
        die();
    }
    $_SESSION['LAST_ACTIVITY'] = time(); // update last activity time stamp

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
            if ($field == ALPHA_AUTHORIZED_ROLE_ID || $field == NQSTAFF_ROLE_ID) {
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
  <link rel="apple-touch-icon" href="assets/icons/icon-180x180.png">
  <link rel="manifest" href="manifest.webmanifest">
  <meta name="theme-color" content="#1976d2">
<link rel="stylesheet" type="text/css" href="styles.be6c6058f0da3b91fd1a.css"></head>

<body style="background-color: #303030;">
  <div class="app-root">
    <app-root></app-root>
  </div>
  <noscript><img src="assets/images/need-javascript.png" /></noscript>
<script src="runtime-es2015.409e6590615fb48d139f.js" type="module"></script><script src="runtime-es5.409e6590615fb48d139f.js" nomodule defer></script><script src="polyfills-es5.2dcde1efe3c1bf4aaa25.js" nomodule defer></script><script src="polyfills-es2015.a0fa45e0fa52702b64f0.js" type="module"></script><script src="main-es2015.b4f22cf379fc90763235.js" type="module"></script><script src="main-es5.b4f22cf379fc90763235.js" nomodule defer></script></body>

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

