<?php
include 'config.php';
include 'library/vars.php';
include 'library/global.php';

session_start();

// When Discord redirects the user back here, there will be a "code" and "state" parameter in the query string
if (get('code')) {

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

if (session('access_token')) {

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

    foreach ($blacklist as $banned) {
        if ($banned->id == $user->id) {
            $isbanned = true;
        }
    }

    $found = false;
    if ($isbanned == false) {
        foreach ($data->roles as $field) {
            if ($field == ALPHA_AUTHORIZED_ROLE_ID) {
                $found = true;

                echo <<<EOL
    <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Dual.sh</title>
    <link rel="icon" type="image/png" href="favicon.ico">
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="css/startpage.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.6/css/all.css" integrity="sha384-VY3F8aCQDLImi4L+tPX4XjtiJwXDwwyXNbkH7SHts0Jlo85t1R15MlXVBKLNx+dj" crossorigin="anonymous">
</head>
<body>


<div class="container">

    <div id="top-bar" class="flexbar">
        <span id="time">00:00</span>
        <span id="welcome-greeting"> </span>
        <span class="pull-right" ><a class="link accent-link" id="editBtn" href="#">Edit</a></span>
    </div>
    <div class="flexbar">
        <form id="search" autocomplete="off" action="wiki/" method="post">
            <input type="hidden" name="search" value="Search">
            <input  type="text" name="searchphrase" placeholder="Wiki Search...">
        </form>
    </div>

    <div id="content">
        <!--Dynamically Populated-->
    </div>
    <div id="server-status-bar">
    </div>

    <!--<div class="flexbar">
        <div id="weather" class="pull-right">
            <h4 id="w-location"></h4>
            <img id="w-icon"></img>
            <span>
					<h4 id="w-temp"></h4>
					<h4 id="w-desc"></h4>
				</span>
        </div>
    </div>-->

</div>

<section id="settings" class="background">
    <div class="menu">
        <div class="nav-area">
            <a class="nav-item active" id="details" href="#">Details</a>
            <a class="nav-item" id="theme" href="#">Theme</a>
        </div>
        <div class="menu-content">
            <span class="pull-right" id="errorMessage" >Error</span>
            <div class = "settings-section details active">
                <p class="label">Location</p>
                <span>
						<input  type="text"  id="coordinateInput" placeholder="Enter your Coordinates">
                </span>
            </div>
            <div class="settings-section theme">
                <p class="label">Accent Color</p>
                <span><input  type="text"  id="colorInput" placeholder="Enter a Color."></span>
                <p class="label">Background Image</p>
                <span><input  type="file"  id="backgroundImgInput" onchange="changeBg(this)"><a href='#' id="hideButton" class="link accent-link pull-right" onclick="toggleBg();">Hide/Show</a></span>
                <p class="label">Background Color</p>
                <span><input  type="text"  id="bgcolorInput" placeholder="Enter a Color."></span>
            </div>

            <div class="close-settings">
                <a class="close" href="#">Close</a>
            </div>
        </div>

    </div>
</section>
<span class="log-out"><a href="?action=logout">Log Out</a></span>

<script type="text/javascript">
    //var username = "<?php echo json_encode($user->id);?>"
    discordusername = "$user->username"
</script>
<!-- <script type="text/javascript" src="./js/weather.js"></script> -->
<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
<script type="text/javascript" src="./js/startpage.js"></script>
</body>
</html>
                
EOL;

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
    echo '<br><br>';
    echo 'To authorize your Discord account for access to this site, please <a href="https://dual.sh/auth">click here</a>.';
}

?>