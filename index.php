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

                echo <<<EOL

    <html>
    <head>
    <link rel="stylesheet" type="text/css" href="./css/mainmenu.css">
    <script type="text/javascript" src="./js/mainmenu.js"></script>
    </head>
    <body>
    <h3>Welcome to Dual.sh</h3>
    <div class="tab">
        <button class="tablinks" onmouseover="hoverMenuItem(event, 'Wiki')" onclick="window.location='http://dual.sh/wiki/index.php'">Wiki</button>
        <button class="tablinks" onmouseover="hoverMenuItem(event, 'Map')" onclick="window.location='http://dual.sh/map/index.php'">Map</button>
        <button class="tablinks" onmouseover="hoverMenuItem(event, 'Crafting')" onclick="window.location='http://dual.sh/craft/index.php'">Crafting Calculator</button>
        <button class="tablinks" onmouseover="hoverMenuItem(event, 'Crafting v2')" onclick="window.location='http://dual.sh/craft2/index.php'">Crafting Calculator v2</button>
        <button class="tablinks" onmouseover="hoverMenuItem(event, 'Travel')" onclick="window.location='http://dual.sh/sutime/index.php'">Travel Time Calculator</button>
        <button class="tablinks" onmouseover="hoverMenuItem(event, 'Logout')" onclick="window.location='http://dual.sh/index.php?action=logout'">Logout</button>
    </div>

    <div id="Wiki" class="tabcontent">
        <h2>Wiki</h2>
        <p>A Wiki for Lua, Voxelmancy, and many other Dual Universe player topics. Maintained by Yamamushi.</p>
    </div>

    <div id="Map" class="tabcontent">
        <h2>Map</h2>
        <p>An interactive 3D map of the Helios (Alioth) Solar System. Maintained by Drystion.</p> 
    </div>

    <div id="Crafting" class="tabcontent">
        <h2>Crafting Calculator</h2>
         <p>A crafting calculator for queue planning and estimating total completion times (may be out of date). Maintained by Drystion.</p>
    </div>
    
    <div id="Crafting v2" class="tabcontent">
        <h2>Crafting Calculator v2</h2>
         <p>An alternate crafting calculator for 0.16 that is planned to replace the one above. Maintained by Velenka.</p>
    </div>
    
    <div id="Travel" class="tabcontent">
        <h2>Travel Time Calculator</h2>
        <p>A calculator that provides an estimated travel time based on Distance (SU) and Speed (km/h). Provided as an example only, as a better utility is in development.</p>
    </div>

    <div id="Logout" class="tabcontent">
        <h2>Logout</h2>
        <p>Logout and return to the homepage</p> 
    </div>

    <div class="clearfix"></div>
       
    </div>
    
    <p><em>Currently logged in as $user->username - 
    <script type="text/javascript">
    var x = new Date();
    document.write(x);
    </script><em></p>
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
}

?>