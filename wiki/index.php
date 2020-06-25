<?php
/**
 * WikWiki - simple wiki in one PHP file. http://smasty.net/wikwiki
 * Copyright (c) 2011 Martin Srank, http://smasty.net
 *
 * Licensed under the terms and conditions of
 * the MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Modified work Copyright 2019 - Yamamushi
 *
 * Notes:
 *
 * Diff Lib Documentation - http://code.iamkate.com/php/diff-implementation/
 *
 */

define('PAGE_TITLE', 'Dual.sh');
define('BASE_PAGE', 'Home Page');

include '../config.php';
include '../library/vars.php';
include '../library/global.php';
require_once '../library/class.Diff.php';

ini_set('magic_quotes_runtime', 0);

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
    $blacklistfile = file_get_contents('../data/blacklist.json');
    $blacklist = json_decode($blacklistfile, false);
    define('FOOTER_TEXT', 'Currently logged in as <b>'.$user->username.'</b> || <a href="http://dual.sh/">Click here</a> to go back to the Dual.sh main menu || <a href="?action=logout">Click here</a> to log out || Powered by <a href="https://github.com/smasty/WikWiki">WikWiki</a>.');

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
            }
            // INIT HERE

            if (!@file_exists(dirname(__FILE__) . '/wikdata') || !@is_writable(dirname(__FILE__) . '/wikdata')) {
                $ok = @mkdir(dirname(__FILE__) . '/wikdata');
                if (!$ok) {
                    die('WikWiki cannot access the data directory ./wikdata/!
                         Please create the directory and make it writeable by PHP.');
                }
            }

            $msg = '';

// Instantiate Texy parser.
            require dirname(__FILE__) . '/../library/texy.min.php';
            $texy = new Texy();
            $texy->encoding = 'utf-8';
            $texy->headingModule->top = 2;
            $texy->headingModule->generateID = true;
            $texy->allowed['image'] = true;
            $texy->registerLinePattern('parseWikiLinks', '~\[([^|\]]+)(?:\s*\|\s*([^\]]+)\s*)?\]~', 'wikilinks');


            // texy init path
            $page = parseQueryString(@$_SERVER['QUERY_STRING']);
            if (empty($_GET)) {
                $page = titleToId(BASE_PAGE);
            }


// Save content.
            if (!empty($_POST)) {
                //echo print_r($_POST);
                if ($_POST['search'] == 'Search'){
                    if (isset($_POST['searchphrase']) && $_POST['searchphrase'] != '') {
                        printHeader("Search results for: \"".$_POST['searchphrase']."\"");
                        printSearch($_POST['searchphrase']);
                        printFooter($user, "Search");
                        exit;
                    }

                }
                else if (!savePageContent($_POST, $user)) {
                    $msg = 'Edit failed. Please, try again.';
                }

            }


// Edit/create page
            if (array_key_exists('edit', $_GET)) {
                $title = idToTitle($_GET['edit']);
                printHeader(!$title ? "Create new page" : "Edit page '$title'");
                printEdit($title);
                printFooter($user, $title);
                exit;
            } // History
            elseif (array_key_exists('history', $_GET)) {
                $title = idToTitle($_GET['history']);
                printHeader("Modification History for '$title'");
                printHistory($title);
                printFooter($user, $title);
                exit;
            } // Backlinks
            elseif (isset($_GET['backlinks']) && pageExists($_GET['backlinks'])) {
                $title = idToTitle($_GET['backlinks']);
                printHeader("Backlinks for '$title'");
                printBacklinks($title);
                printFooter($user, $title);
                exit;
            } elseif (isset($_GET['recent'])) {
                $count = $_GET['recent'];
                if (!is_numeric($count)) {
                    $count = 10;
                }
                printHeader("$count Most Recent Changes");
                printRecentChanges($count);
                printFooter($user);
                exit;
            } // Show page
            elseif ($page) {
                $title = idToTitle($page);
                printHeader($title);
                printContent($title);
                printFooter($user, $title);
                exit;
            } else {
                header('Location: ./?Special:NotFound');
                exit;
            }

        }
    }

    if ($found == FALSE) {
        echo '<h3>Unauthorized</h3>';
        echo '<p><a href="?action=logout">Log Out</a></p>';
        die();
    }
} else {
    echo '<h3>You must login before you can view this page, taking you back to the homepage now.</h3>';
    echo '<p>If this page does not automatically redirect you, <a href="http://dual.sh/index.php">click here.</a></p>';
    header('Refresh: 5; URL=http://dual.sh/index.php');
}



/**
 * Get page ID form HTTP query-string.
 * @param string $queryString
 * @return strng|false
 */
function parseQueryString($queryString){
    return preg_match('~\w+=.*~', $queryString) ? false : $queryString;
}


/**
 * Texy parser for Wiki links syntax.
 * @param TexyParser $parser
 * @param array $matches
 * @param string $name
 * @return TexyHtml|string
 */
function parseWikiLinks($parser, $matches, $name){

    $page = trim($matches[1]);
    $id = titleToId($matches[1]);

    $el = TexyHtml::el('a')
        ->href("?$id")
        ->setText(isset($matches[2]) ? $matches[2] : $page);

    if(!pageExists($page)){
        $el->class = 'new';
        $el->title = "Create page '$page'";
        $el->href("?edit=$id");
    }
    return $el;
}


/**
 * Convert page title to ID.
 * @param string $title
 * @return string
 */
function titleToId($title){
    return preg_replace('~\s+~i', '_', trim($title));
}


/**
 * Convert ID to page title.
 * @param string $id
 * @return string
 */
function idToTitle($id){
    return str_replace('_', ' ', $id);
}


/**
 * Print HTML header.
 * @param string $page
 * @return void
 */
function printHeader($page = BASE_PAGE){
    global $msg;
    $message = $msg ? "<div class=\"msg\">$msg</div>" : '';
    $html_title = "$page | " . PAGE_TITLE;

    echo <<<PAGE_HEAD
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>$html_title</title>
<link rel="stylesheet" href="../css/wiki.css">
</head>
<body>
  <div id="container">
    <div id="main">
    $message
    <h1>$page</h1>
    <div id="content">
PAGE_HEAD;
}


/**
 * Print HTML footer.
 * @param string $page
 * @return void
 */
function printFooter($user, $page = BASE_PAGE){
    $sidebar = getSidebar($user, $page);
    $footer = strftime(FOOTER_TEXT);
    echo <<<PAGE_FOOT
      </div>
    </div>
    <div id="sidebar">
    $sidebar
    </div>
    <div id="footer">
    $footer
    </div>
  </div>
</body>
</html>
PAGE_FOOT;
}


/**
 * Generate HTML sidebar.
 * @param string $page
 * @return void
 */
function getSidebar($user, $page = BASE_PAGE){
    $title = PAGE_TITLE;
    $id = titleToId($page);
    $mod = 'not yet.';
    $toc = $bl = '';
    $historylink = '';
    if(pageExists($page)){
        $mod = date('d.m.Y, H:i:s', filemtime(getFilePath($page)));
        $toc = generateToc();
        $bl = "<li class=\"backlinks\"><a href=\"./?backlinks=$id\">Backlinks</a></li>";
    }

    $difffilepath = getDiffFilePath($page);
    if (file_exists($difffilepath)) {
        $historylink = "<li class=\"create-new-link\"><a href=\"./?history=$id\">View Page History</a></li>";
    }

     $page_sidebar = "
<p id=\"title\"><a href=\"./\">$title</a></p>
<ul class=\"sidebar-list\">
<h3>Navigation</h3>
  <li><a href=\"http://dual.sh/wiki/\">Wiki Home</a></li>
  <li><a href=\"http://dual.sh/\">Dual.sh Menu</a></li>
  <li class=\"create-new-link\"><a href=\"./?edit=\">Create New Page</a></li>
  <li class=\"recent-changes-link\"><a href=\"./?recent=10\">Recent Changes</a></li>
<form action=\"\" method=\"POST\">
<input type=\"text\" name=\"searchphrase\" value=\"\" style=\"width: 100px; height: 18px; font-size:14px;\" >
<input type=\"submit\" value=\"Search\" name=\"search\" style=\"width: 80px; margin-left: 12px\">
</form>
</ul>
<br>
$toc
<ul class=\"sidebar-list\">";

if ($id != "Search") {
    $page_sidebar = $page_sidebar."
<h3>Page Tools</h3>
  <li class=\"edit-link\"><a href=\"./?edit=$id\">Edit Page</a></li>
  $bl
  $historylink 
  <li class=\"modified\"><em>Page Last Updated:<br> $mod</em></li>
</ul>";
}
$page_sidebar = $page_sidebar."
<br>
<div class=\"loggedin\"><em>Logged in as <b>$user->username</b></em></div>
<br><br>
<a href=\"?action=logout\">Log Out</a>";


    return $page_sidebar;
}


/**
 * Print the content of the page.
 * @global Texy $texy
 * @param string $page
 * @return void
 */
function printContent($page = BASE_PAGE){
    global $texy;
    if(pageExists($page)){
        echo $texy->process(getContent($page));
        echo '<br>';
        echo '<button onclick="history.go(-1);">Go Back</button>';
    } elseif(pageExists('Special:NotFound')){
        echo $texy->process(str_replace('%PAGE%', $page, getContent('Special:NotFound')));
    } else{
        echo $texy->process("The page you're looking for does not exist at the moment. "
            . "However, you can [$page | create it] right now.");
    }
}


/**
 * Print HTML for edit <form>.
 * @param string $page
 * @return void
 */
function printEdit($page){
    $title = $content = $id = '';
    if($page){
        $title = $page;
        $id = titleToId($page);
        if(pageExists($page)){
            $content = getContent($page);
        }
    }

    echo <<<EDIT_FORM
<form action="./?edit=$id" method="post" id="edit-form" name="editForm">
  <p id="edit-block-title" class="edit-block">
    <label for="edit-title">Page:</label>
    <input type="text" id="edit-title" name="title" value="$title">
  </p>
  <div id="edit-block-content" class="edit-block">
    <label for="edit-content">Content:</label>
    <textarea name="content" id="edit-content" rows="15" cols="80">$content</textarea>
  </div>
  <p id="edit-block-submit" class="edit-block">
    <button type="submit" name="save">Save</button>
    <button onclick="window.location='http://dual.sh/wiki/?$id';">Cancel</button> <button onclick="history.go(-1);">Go Back</button>
  </p>
  <p id="edit-block-help" class="edit-block">
    You can use <a href="http://texy.info/en/syntax">Texy! syntax</a> and some HTML too.<br>
    <small>Use [Sample Page] to link to "Sample Page". Use [Sample Page | link to sample] for custom label.</small>
</form>
EDIT_FORM;
}


/**
 * Print HTML for backlinks.
 * @global Texy $texy
 * @param string $page
 * @return void
 */
function printBacklinks($page){
    global $texy;
    $s = "[$page | Go back to page]

    This is a list of all pages that link to [$page].\n";

    $l = array();
    foreach(new FilesystemIterator(dirname(__FILE__) . '/wikdata', FilesystemIterator::SKIP_DOTS) as $file){
        if(checkBacklink($file, $page)){
            $l[] = "- [" . fileToTitle($file) . "]";
        }
    }
    if(empty($l)){
        $s .= "\nNo backlinks found.";
    } else{
        $s .= ".[#backlinks-list]\n" . implode("\n", $l);
    }

    echo $texy->process($s);
}


/**
 * Check file for baclinks to $page.
 * @param string $file
 * @param string $page
 * @return string
 */
function checkBacklink($file, $page){
    $c = file_get_contents($file);
    return preg_match("~\[$page(\s*\|\s*[^\w]*)?]~m", $c);
}


/**
 * Convert file path to title.
 * @param string $file
 * @return string
 */
function fileToTitle($file){
    return idToTitle(pathinfo($file, PATHINFO_FILENAME));
}


/**
 * Print HTML for recent changes.
 * @global Texy $texy
 * @param int $count
 * @return void
 */
function printRecentChanges($count){
    global $texy;
    $list = array();
    foreach(new FilesystemIterator(dirname(__FILE__) . '/wikdata', FilesystemIterator::SKIP_DOTS) as $file){
        $filetypes = array("wik");
        $filetype = pathinfo($file, PATHINFO_EXTENSION);
        if (in_array(strtolower($filetype), $filetypes)) {
            $list[filemtime($file)] = fileToTitle($file);
        }
    }
    krsort($list);

    $list = array_slice($list, 0, $count, true);
    $s = '';
    foreach($list as $t => $l){
        $s .= "\n- [$l] (" . date("d.m.Y, H:i:s", $t) . ")";
    }

    echo $texy->process($s);

}


/**
 * Get file path for page.
 * @param string $page
 * @return string
 */
function getFilePath($page){
    return dirname(__FILE__) . '/wikdata/' . titleToId($page) . '.wik';
}


/**
 * Checks for existence of page.
 * @param string $page
 * @return bool
 */
function pageExists($page){
    $path = getFilePath($page);
    return file_exists($path) && is_readable($path);
}


/**
 * Get the content of the page.
 * @param string $page
 * @return string|false
 */
function getContent($page){
    $path = getFilePath($page);
    if(pageExists($page)){
        return file_get_contents($path);
    }
    return false;
}


/**
 * Save page.
 * @param array $fields
 * @return bool
 */
function savePageContent($fields, $user){
    if(@get_magic_quotes_gpc()){
        $fields = array_map(stripslashes, $fields);
    }

    $file = getFilePath($fields['title']);

    $content = trim($fields['content']);
    saveDiffContent($fields['title'], $file, $content, $user);

    $do = file_put_contents($file, trim($fields['content']));
    if($do){
        header("Location: ./?" . titleToId($fields['title']));
        exit;
    } else{
        return false;
    }
}


/**
 * Generate table of contents HTML blockz.
 * @global Texy $texy
 * @return TexyHtml
 */
function generateToc(){
    global $texy;
    if(!$texy->headingModule->TOC){
        return '';
    }
    $block = TexyHTML::el('div');
    $block->id = 'toc';
    $block->create('h3', 'Contents');
    $toc = TexyHTML::el('ul');
    $block->add($toc);
    $lists[0] = $toc;
    $aList = 0;
    $level = 2;

    foreach($texy->headingModule->TOC as $heading){
        if($heading['level'] > $level){
            for($level; $heading['level'] > $level; ++$level){
                if($lists[$aList]->count() != 0){
                    $ul = $lists[$aList][$lists[$aList]->count() - 1]->create('ul');
                } else{
                    $li = $lists[$aList]->create('li');
                    $ul = $li->create('ul');
                }
                $lists[] = $ul;
            }
            $aList = count($lists) - 1;
        } elseif($heading['level'] < $level){
            $diff = $level - $heading['level'];

            $lists = array_slice($lists, 0, - $diff);

            $level = $heading['level'];
        }
        $aList = count($lists) - 1;
        $li = $lists[$aList]->create('li');
        $a = $li->create('a')->href('#' . $heading['el']->attrs['id'])->setText($heading['title']);
    }
    return $block->toHtml($texy);
}


/**
 * Get file path for page.
 * @param string $page
 * @return string
 */
function getDiffFilePath($page){
    return dirname(__FILE__) . '/wikdata/' . titleToId($page) . '-history.json';
}

/**
 * Get save diff content for history
 */
function saveDiffContent($title, $file, $content, $user) {
    $filecontents = file_get_contents($file);
    $contentDiff = Diff::toTable(Diff::compare($filecontents, $content));

    $record = (object) [
        'username' => $user->username,
        'id' => $user->id,
        'timestamp' => date('m/d/Y h:i:s a', time()),
        'diff' => $contentDiff,
    ];
    $formattedHistory = $record; //json_encode($record);

    $difffilepath = getDiffFilePath($title);
    if (file_exists($difffilepath)) {
        $inp = file_get_contents($difffilepath);
        $tempArray = json_decode($inp);
        array_unshift($tempArray, $record);
        $jsonData = json_encode($tempArray);
        $formattedHistory = $jsonData;
    } else {
        $formattedHistory = "[".json_encode($formattedHistory)."]";
    }

    file_put_contents($difffilepath, $formattedHistory);
}

/**
 * Print page for History
 * @param string $page
 * @return void
 */
function printHistory($page){
    $title = $content = $id = '';
    if($page){
        $title = $page;
        $id = titleToId($title);
        $id = titleToId($page);
        if(pageExists($page)){
            $file = file_get_contents(getDiffFilePath($page));
            $decodedfile = json_decode($file);
            foreach ($decodedfile as $entry) {
                $content = $content.$entry->timestamp." - ".$entry->username." (".$entry->id.")<br><p>".$entry->diff."</p><br>";
            }
        }
    }


    echo <<<HISTORY
$content
<br>
<a href="http://dual.sh/wiki/?$id">Return to article</a>
HISTORY;
}


/**
 * Print page for Search results
 * @param string $searchstring
 * @return null
 */
function printSearch($searchstring){
    global $texy;
    if (strlen($searchstring) < 3){
        echo <<<HISTORY
Query $searchstring is too short, it must be between 3 and 30 characters.
<br>
<a href="http://dual.sh/wiki/">Return to Homepage</a>
HISTORY;
        return;
    }
    if (strlen($searchstring) > 30){
        echo <<<HISTORY
Query $searchstring is too long, it must be between 3 and 30 characters.
<br>
<a href="http://dual.sh/wiki/">Return to Homepage</a>
HISTORY;
        return;
    }

    $result = getGrepSearch($searchstring);
    $results = preg_split('/\s+/', $result);

    $output = "";
    foreach ($results as $unparsed) {
        if (strlen($unparsed) > 0) {
            $unparsed = substr($unparsed, strlen("./wikdata/"));
            $output = $output."[".fileToTitle($unparsed)."]"."<br>";
        }
    }
    $output = $texy->process($output);


    echo <<<HISTORY
$output 
<br>
<a href="http://dual.sh/wiki/">Return to Homepage</a>
HISTORY;
}

/**
 * Use Grep to get Search results
 * @param string $searchstring
 * @return string
 */
function getGrepSearch($searchstring)
{
    return shell_exec('grep -il "'.$searchstring.'" ./wikdata/*.wik');
}