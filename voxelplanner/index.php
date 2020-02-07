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
            if ($field == ALPHA_AUTHORIZED_ROLE_ID) {
                $found = TRUE;
                echo <<<EOL


<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style>
        body { background-color:lightgrey }
        button { text-align:center; width:80px; }
        </style>
    </head>
    
    <body oncontextmenu="return false">
        <div id="title" style="border: 5px solid black; margin: 0px; padding: 0px; width: 619px; background-color: black;">
          <h1 style="text-align:center; 
                   padding-top:15px;
                   padding-bottom:15px;
                   margin:0px;
                   color:white">
            2D Voxel Planner
          </h1>
        </div>
        <div id="grid" style="border: 5px solid black; width: 619px; height: 519px;">
            <div id="menu" style="width: 80px; float: right; display: inline; margin-right: 0px; line-height: 30px; padding: 10px; height: 499px; background-color: grey;">
                <button type="button" id="help">Help</button><br>
                <input type="range" min="4" max="32" step="1" value="7" id="rangeIn" name="range" oninput="rangeChg(value)" onchange="rangeChg(value)" style="width:50px">
                <output id="rangeOut" form="range">7</output>
		<input type="radio" id="size2" name="size" value="2" onclick="changeSize()"/>
		<label for="size2" id="size">&frac12; size</label><br>
		<input type="radio" id="size4" name="size" value="4" onclick="changeSize()"/>
		<label for="size4" id="size">&frac14; size</label><br>
                <button type="button" id="reset">Reset</button><br>
                <button type="button" id="undo">Undo</button><br>
                <button type="button" id="redo" disabled="">Redo</button><br>
                <button type="button" id="reg1">Store 1</button><br>
                <button type="button" id="reg2">Store 2</button><br>
                <button type="button" id="reg3">Store 3</button><br>
                <button type="button" id="voxclr" style="background: rgb(240, 0, 0);">+</button><br>
                <button type="button" id="export">Plan</button><br>
            </div>
            <canvas id="canvas" width="518" height="518">
        </canvas></div>
<script language="javascript" type="text/javascript">
// CONSTANTS
document.getElementById("help").onclick = function() {
    helpwin = window.open("", '_blank');
    helpwin.document.write("<!DOCTYPE html>\
<html lang='en'>\
    <head>\
        <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>\
        <style>\
        body { background-color:white; }\
        </style>\
    </head>\
    \
    <body oncontextmenu='return false'>\
        <style>\
        dl { display: flex; flex-flow: row wrap; }\
        dt { flex-basis: 20%; padding: 2px 4px; text-align: right; font-weight: bold; }\
        dd { flex-basis: 70%; margin: 0; padding: 2px 4px; }\
        </style>\
        <h1>2D Voxel Planner</h1>\
        <p>\
        This utility is both a learning tool for understanding the\
        capabilities and constraints that come with laying out a voxel\
        construct, and a means to generate a 'plan' for constructing the\
        layout into an in-game voxel object.\
        </p>\
        <p>\
        This utility does not handle general voxel constructs.  It is limited\
        to two dimensions (useful in planning tilings, signs etc.), and \
        to either half or quarter voxel positioning of corners\
        (making it much easier to construct the object in-game).\
        </p>\
        <h2>Interface</h2>\
        <p>\
        The utility's interface consists of a large grid where each square\
        represents a potential voxel, and a set of buttons to it's right.\
        Designing a voxel construct consists of assigning a 'material' to\
        a square (by moving the mouse pointer to that square and right-clicking\
        the mouse button) creating a voxel, and adjusting the positions of\
        the voxel's corners (by moving the mouse pointer into the voxel,\
        close to the corner you want to move, press and hold down the left\
        mouse button, move the mouse pointer to one of the dot-like targets,\
        and releasing the left mouse button) to change its shape. Clicking\
        the middle mouse button will revert the voxel the pointer is in to\
        an unset state.\
        <p>\
        To the right of the grid is a series of buttons:\
        </p>\
        <dl>\
            <dt>Help</dt>\
            <dd>\
            Displays this help text in a new window.\
            </dd>\
            <dt>[Size Slider]</dt>\
            <dd>\
            Determines the number of rows and columns to be displayed. You\
            can increase the value up to 32. However, the value can be\
            decreased only if there is a border row and column without a\
            voxel.\
            </dd>\
            <dt>&frac12; &frac14;</dt>\
            <dd>\
            These radio buttons determine the number of rows and columns of\
            'targets' that are displayed on left mouse click.\
            </dd>\
            <dt>Reset</dt>\
            <dd>\
            Sets the current plan to the initial startup of rows and columns\
            of non colored squares.\
            </dd>\
            <dt>Undo</dt>\
            <dd>\
            Undo the last edit when enabled.\
            </dd>\
            <dt>Redo</dt>\
            <dd>\
            Redo the last edit previously undone when enabled.\
            </dd>\
            <dt>Store/Recall 1-3</dt>\
            <dd>\
            Pressing a store button saves the current plan (lost when the\
            window is closed), and replaces the button label with 'Recall'.\
            Press a recall button sets the current plan to the stored value.\
            Note that recalling a plan is not 'undoable'.\
            </dd>\
            <dt>+</dt>\
            <dd>\
            The button's color identifies the material that a voxel will be\
            set to when the right mouse button is clicked. This color changes\
            with each click of the button from: red, green, blue, to magenta\
            and then back to red.\
            </dd>\
            <dt>Plan</dt>\
            <dd>\
            Pop-up a window containing the plan which provides directions on\
            how to create the construct in game.\
            </dd>\
        </dl>\
        <h2>Building the Plan In-Game</h2>\
        <p>\
        To build the plan displayed in the window popped up by the 'Plan'\
        button, a specific 'Voxel board' must be used.  This voxel board is\
        constructed by placing voxels in positions corresponding to the\
        targets displayed in the planner when the left mouse button is\
        pressed. More specifically when the left button is pressed near the\
        upper right corner of a voxel, each shape generated by selecting\
        each target in turn describes the in-game voxel and its position\
        on the voxel board.  Note that the positions of the other three\
        corners can be anything.\
        </p>\
        <p>\
        The pop-up plan consists of a table of two character values whose\
        color matches the one chosen by the player, or are black corresponding\
        to non-voxels in the plan (i.e. displayed with the default white\
        color). Greyed-out non-voxels may be ignored during construction if\
        a 'fill' material is not desired.\
        In that case once the plan has been constructed, the solid black fill\
        voxels in the plan (which must be placed during construction) can be\
        cut from the completed work.\
        </p>\
        <p>\
        The actual process of construction consists of reading the plan from\
        left to right, bottom to top.  Each two character value identifies\
        the row and column (in that order) of the desired voxel on the voxel\
        board. Copying the voxel, selecting the material indicated by the\
        color, and pasting it into position generates the final construct.\
        Note that by pasting the voxels left to right order permits the upper\
        and lower left corner of the pasted voxel to take the position\
    	dictated by\
        the voxel to the left of the pasted voxel. Pasting the voxels from\
        bottom to top results in the lower left and right corners to take the\
        position dictated by the voxel below the pasted voxel. The upper right\
        corner, as mentioned above, is in the position determined by the row\
        and column.\
        </p>\
    </body>\
</html>");
}

var VOX_COLORS   = [ '#F00000', '#00F000', '#00F0F0', '#F000F0', '#F00000' ]
var VOX_INICOUNT = 7;
var VOX_INISIZE  = 2;
var LEFT_MOUSE   = 0;
var MIDDLE_MOUSE = 1;
var RIGHT_MOUSE  = 2;

var VOX_COUNT   = VOX_INICOUNT;
var VOX_SIZE    = VOX_INISIZE;
var VOX_SEL     = VOX_COLORS[0];

// GLOBALS
var scale      = 1;
var title      = document.getElementById('title');
var grid       = document.getElementById('grid');
var canvas     = document.getElementById('canvas');
var menu       = document.getElementById('menu');
var range      = document.getElementById("rangeIn");
var redo       = document.getElementById("redo");
var size2      = document.getElementById("size2");
var size4      = document.getElementById("size4");
var undo       = document.getElementById("undo");
var context    = canvas.getContext("2d");
var redoStack  = [];
var undoStack  = [];
var vertices   = [];
var voxels     = [];
var selectedVertex = -1;        // Vertex index of selected voxel
var selectedVoxel  = -1;        // Voxel index left mouse down selects
var selectedCursor = [-1,-1];   // Position on left mouse down.
var store          = [['reg1'], ['reg2'], ['reg3']];

// FUNCTIONS
function changeSize() {
    if (size2.checked) {
        if (VOX_SIZE == 4) {
            VOX_INISIZE = VOX_SIZE = 2;
            for (var vtxi = 0; vtxi < vertices.length; ++vtxi) {
                vertices[vtxi][0] /= 2;
                vertices[vtxi][1] /= 2;
            }
        }
    }
    else if (size4.checked) {
        if (VOX_SIZE == 2) {
            VOX_INISIZE = VOX_SIZE = 4;
            for (var vtxi = 0; vtxi < vertices.length; ++vtxi) {
                vertices[vtxi][0] *= 2;
                vertices[vtxi][1] *= 2;
            }
        }
    }
    window.onresize();
}

function copyPt(v) {
    return [v[0],v[1]];
};

function distanceSq(p1, p2) {
    var dx = p1[0] - p2[0];
    var dy = p1[1] - p2[1];
    return dx*dx+dy*dy;
}

function doFn(from, to) {
    if (from.length > 0) {
        var fn = from.pop();
        to.push(fn());
        drawVoxList();
    }
}

function drawBox(vertices, color) {
    context.beginPath();
    context.moveTo(scale*vertices[0][0],scale*vertices[0][1]);
    context.lineTo(scale*vertices[1][0],scale*vertices[1][1]);
    context.lineTo(scale*vertices[2][0],scale*vertices[2][1]);
    context.lineTo(scale*vertices[3][0],scale*vertices[3][1]);
    context.closePath();
    if (color != 'White') {
        context.fillStyle = color;
        context.fill();
    }
    context.stroke();
}

function drawLines(i) {
    context.beginPath();
    context.moveTo(scale*i*VOX_SIZE,0);
    context.lineTo(scale*i*VOX_SIZE,scale*VOX_COUNT*VOX_SIZE);
    context.stroke();
    context.beginPath();
    context.moveTo(0, scale*i*VOX_SIZE);
    context.lineTo(scale*VOX_COUNT*VOX_SIZE, scale*i*VOX_SIZE);
    context.stroke();
}

function drawTargets() {
    var pt = initPoint(selectedVoxel,selectedVertex);
    var tics = VOX_SIZE*VOX_COUNT;
    
    if (pt[0] > 0 && pt[0] < tics && pt[1] > 0 && pt[1] < tics) { // interior vertices
        var deltas = [[-1,0,1],[-3,-2,-1,0,1,2,3],[],[-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6]];
        var delta  = deltas[VOX_SIZE-1];
        context.fillStyle = 'Black';
        for (var xi = 0; xi < delta.length; ++xi) {
            for (var yi = 0; yi < delta.length; ++yi) {
                var dxi = delta[xi], dyi = delta[yi];
                
                if (dxi == 0 && dyi == 0) {
                    context.fillRect(scale*pt[0]-2, scale*pt[1]-2, 5, 5);
                }
                else {
                    context.fillRect(scale*(pt[0]+dxi)-1, scale*(pt[1]+dyi)-1, 3, 3);
                }
            }
        }
        
    }
}

function drawVoxList() {
    context.clearRect(0, 0, VOX_COUNT+1, VOX_COUNT+1);
    context.strokeStyle = 'blue';
    context.lineWidth   = 1;
    drawBox([[0,0],
             [VOX_SIZE*VOX_COUNT,0],
             [VOX_SIZE*VOX_COUNT,VOX_SIZE*VOX_COUNT],
             [0,VOX_SIZE*VOX_COUNT],
             [0,0]],
             '#FFFFFF');
    // Colored voxels take priority so draw the 'fill' voxels first.

    for (i = 0; i < voxels.length; ++i) {
        var vox = voxels[i];
        if (vox.state == 'White') {
            drawBox(vox.vertices, vox.state);
        }
    }

    for (i = 0; i < voxels.length; ++i) {
        var vox = voxels[i];
        if (vox.state != 'White') {
            drawBox(vox.vertices, vox.state);
        }
    }
    context.save();
    context.setLineDash([1,2]);

    for (i = 1; i < VOX_COUNT; ++i) {
        drawLines(i);
    }
    context.restore();

    if (undoStack.length == 0) {
        undo.disabled = true;
    }
    else {
        undo.disabled = false;
    }

    if (redoStack.length == 0) {
        redo.disabled = true;
    }
    else {
        redo.disabled = false;
    }
}

function formatBoardId(r, c, id) {
    var row   = id.row;
    var col   = id.col;
    var color = id.discard ? 'rgba(0,0,0,0.3)' : id.color;
    var text  = c==0 ? "" : " ";
    text += "<span style='color:" + color + "'>" + "123456789ABCD"[row] + "123456789ABCD"[col] + "</span>";
    return text
}

function initPoint(voxi,vtxi) {
    vtxi = vtxi % 4;
    var [row, col] = voxCoord(voxi);
    row += [0,0,1,1][vtxi];
    col += [0,1,1,0][vtxi];
    return [col*VOX_SIZE, row*VOX_SIZE];
}
    
function initVoxVtx() {
    for (var vi = 0; vi < VOX_COUNT*VOX_COUNT; ++vi) {
        var skip = Math.floor(vi/VOX_COUNT);
        var ul = vi+skip, ur = ul+1, ll = vi+VOX_COUNT+1+skip, lr = ll+1;
        voxels[vi].vertices =
            [ vertices[ul], vertices[ur], vertices[lr], vertices[ll], vertices[ul]];
    }
}

function loadLocal() {
    redoStack = [];
    undoStack = [];
    
    // IE10+ does not support local storage on file:// URLs. Surprise!
    try {
        var local = window.localStorage.getItem("VOX2D:VOX_COUNT");
        var lsize = window.localStorage.getItem("VOX2D:VOX_SIZE");

        if (typeof(local) === 'undefined' || local === null
         || typeof(lsize) === 'undefined' || lsize === null) {
            window.localStorage.clear();
            throw "no save";
        }
        var count = parseInt(local);
        var size  = parseInt(lsize);

        if (count === 'NaN' || count < 4 || count > 32
         || size  === 'NaN' || size  < 1 || size  > 4) {
            window.localStorage.clear();
            throw "bad save";
        }
        vertices     = JSON.parse(window.localStorage.getItem("VOX2D:VERTICES"));
        voxels       = JSON.parse(window.localStorage.getItem("VOX2D:VOXELS"));

        if (!Array.isArray(vertices) || !Array.isArray(voxels)
         || vertices.length != (count+1)*(count+1)
         || voxels.length   != count*count) {
            window.localStorage.clear();
            throw "bad save";
        }
        VOX_INICOUNT = VOX_COUNT = count;
        VOX_INISIZE  = VOX_SIZE  = size;
    }
    catch(ex) {
        VOX_COUNT = VOX_INICOUNT;
        VOX_SIZE  = VOX_INISIZE;
        vertices  = [];
        voxels    = [];

        for (var y = 0; y <= VOX_COUNT; ++y) {
            for (var x = 0; x <= VOX_COUNT; ++x) {
                vertices[vertices.length] = [x*VOX_SIZE,y*VOX_SIZE];
            }
        }

        for (var i = VOX_COUNT*VOX_COUNT; i--; ) {
            voxels[i] = { state: 'White', vertices: [] };
        }
    }
    finally {
        // Voxels sharing intersections will reference the same vertice:
        initVoxVtx();
        document.getElementById("rangeOut").textContent = ""+VOX_COUNT;
        document.getElementById("voxclr").style.background = VOX_SEL;
        range.value    = VOX_COUNT;

        if (VOX_SIZE == 2) {
            size2.checked = true;
        }
        else {
            size4.checked = true;
        }
    }
}

function localsave() {
    try {
        window.localStorage.clear();
        window.localStorage.setItem("VOX2D:VOX_COUNT", VOX_COUNT);
        window.localStorage.setItem("VOX2D:VOX_SIZE", VOX_SIZE);
        window.localStorage.setItem("VOX2D:VERTICES", JSON.stringify(vertices)); //vxs);
        window.localStorage.setItem("VOX2D:VOXELS", JSON.stringify(voxels));
    }
    catch(ex) {
    }
}

function mouseDown(evt) {
    var pt = mousePoint(evt);
    //console.log(evt, scale);
    //console.log("mouse down:", pt, evt.button);

    if (evt.button == LEFT_MOUSE) {
        if (evt.preventDefault) {
            evt.preventDefault();
        }
        //console.log(evt.button, x, y);
        var voxi = ptToVoxel(pt, false);
        if (voxi >= 0) {
            //console.log(voxi,voxels[voxi]);
            var candidates    = voxels[voxi].vertices;
            var vtxi          = 0;
            var metric        = distanceSq(pt,candidates[vtxi]);
            
            for (var i = 1; i < candidates.length-1; ++i) {
                var next = distanceSq(pt,candidates[i]);
                if (next < metric) {
                    metric = next;
                    vtxi = i;
                }
            }
            selectedVoxel  = voxi;
            selectedCursor = pt;
            selectedVertex = vtxi;
            drawTargets();
        }
    }
    return false;
}

function mousePoint(evt) {
    if (typeof(evt.offsetX) === 'undefined') {
        return [(evt.clientX-canvas.offsetLeft)/scale,
               (evt.clientY-canvas.offsetTop)/scale];
    }
    else {
        return [evt.offsetX/scale, evt.offsetY/scale];
    }
}

function mouseUp(evt) {
    var mpt = mousePoint(evt);
    if (evt.preventDefault) {
        evt.preventDefault();
    }
    var voxi = ptToVoxel(mpt, true);
    
    if (evt.button == RIGHT_MOUSE) {
        if (voxi >= 0) {
            var current   = voxels[voxi].state;
            var sel_color = VOX_SEL;
            var fn1 = function() {
                voxels[voxi].state = sel_color;
                return function() {
                    voxels[voxi].state = current;
                    return fn1;
                }
            };
            redoStack = [];
            undoStack.push(fn1());
        }
    }
    else if (evt.button == MIDDLE_MOUSE) {
        if (voxi >= 0) {
            var vox  = voxels[voxi];

            if (vox.state != 'White') {
                var color  = vox.state;
                var vtx    = vox.vertices;
                var old_v  = vtx.map(copyPt);
                resetVoxel(voxi);
                var new_v  = vtx.map(copyPt);
                var fn3    = function() {
                    for (var i = 0; i < new_v.length; ++i) {
                        [vtx[i][0], vtx[i][1]] = new_v[i];
                    }
                    vox.state = 'White';
                    return function() {
                        for (var i = 0; i < old_v.length; ++i) {
                            [vtx[i][0], vtx[i][1]] = old_v[i];
                        }
                        vox.state = color;
                        return fn3;
                    }
                };
                redoStack = [];
                undoStack.push(fn3());
            }
        }
    }
    else if (evt.button == LEFT_MOUSE) {
        if (selectedVoxel >= 0
         && Math.sqrt(distanceSq(selectedCursor, mpt) > 0.1)) {
            var nearest = nearestTarget(mpt);

            if (nearest) { // vertex order: ul, ur, lr, ll -> 0..3
                var vxi = selectedVoxel, vtx = selectedVertex;
                var vx  = voxels[vxi].vertices[vtx][0];
                var vy  = voxels[vxi].vertices[vtx][1];
                var fn2 = function() {
                    voxels[vxi].vertices[vtx][0] = nearest[0];
                    voxels[vxi].vertices[vtx][1] = nearest[1];
                    return function() {
                        voxels[vxi].vertices[vtx][0] = vx;
                        voxels[vxi].vertices[vtx][1] = vy;
                        return fn2;
                    };
                };
                redoStack = [];
                undoStack.push(fn2());
            }
        }
        selectedVoxel = selectedVertex = -1;
    }
    drawVoxList();
    return false;
}

function nearestTarget(cursor) {
    if (selectedVoxel >= 0) {
        var tics = VOX_SIZE*VOX_COUNT;
        var pt   = initPoint(selectedVoxel,selectedVertex);

        if (pt[0] > 0 && pt[0] < tics && pt[1] > 0 && pt[1] < tics) { // on board
            var deltas = [[-1,0,1],[-3,-2,-1,0,1,2,3],[],[-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6]];
            var delta  = deltas[VOX_SIZE-1];
            var minDistance = VOX_COUNT*VOX_SIZE*VOX_COUNT*VOX_SIZE;
            var nearestPt = [-1,-1];
            
            for (var xi = 0; xi < delta.length; ++xi) {
                for (var yi = 0; yi < delta.length; ++yi) {
                    var dxi = delta[xi], dyi = delta[yi];
                    var newPt = [pt[0]+dxi,pt[1]+dyi];
                    var distSq = distanceSq(cursor,newPt);

                    if (minDistance > distSq) {
                        minDistance = distSq;
                        nearestPt = newPt;
                    }
                }
            }
        }
        
        if (Math.sqrt(minDistance) < VOX_SIZE/4) {
            return nearestPt;
        }
    }
    return undefined;
}
    
function planRange() {
    // Voxel range. If no voxels set, maxrow == -1
    var minr = VOX_COUNT, maxr = -1;
    var minc = VOX_COUNT, maxc = -1;

    for (var i = 0; i < voxels.length; ++i) {
        var vox = voxels[i];
        var r   = Math.floor(i/VOX_COUNT), c = i % VOX_COUNT;

        if (vox.state != 'White') {
            if (r < minr) minr = r;
            if (r > maxr) maxr = r;

            if (c < minc) minc = c;
            if (c > maxc) maxc = c;
        }
    }

    if (maxr >= 0) {
        for (var i = VOX_COUNT+2; i < vertices.length-VOX_COUNT-1; ++i) {
            var x  = vertices[i][0], y = vertices[i][1];
            var ix = VOX_SIZE * (i % (VOX_COUNT+1));
            var iy = VOX_SIZE * Math.floor(i/(VOX_COUNT+1));

            if (x != ix || y != iy) {
                if (ix == 0 || ix == VOX_SIZE*(VOX_COUNT+1)) abort("border vertex moved");
                // A moved vertex has 4 neighboring voxels
                var ulr = Math.floor(i/(VOX_COUNT+1))-1;
                var ulc = (i % (VOX_COUNT+1)) - 1;

                if (ulr < minr)   minr = ulr;
                if (ulr+1 > maxr) maxr = ulr+1;

                if (ulc < minc)   minc = ulc;
                if (ulc+1 > maxc) maxc = ulc+1;
            }
        }
    }
    return { minrow : minr, maxrow : maxr, mincol : minc, maxcol : maxc };
}

function ptToVoxel(pt, whiteOk) {
    // Painting order is [0,length). Search order is (length,0]:
    for (var i = voxels.length-1; i >= 0; --i) {
        var vox = voxels[i];

        if (vox.state != 'White' || whiteOk) {
            //console.log(i,pt,voxels[i]);
            if (0 != wnPnPoly(pt, voxels[i]['vertices'])) {
                return i;
            }
        }
    }
    return -1;
}

function rangeChg(value) {
    var size = parseInt(value);
    //console.log(size);

    if (size != VOX_COUNT) {
        resizeGrid(size);
        range.value = VOX_COUNT;
    }
    document.getElementById('rangeOut').textContent = ""+VOX_COUNT;
    window.onresize();
}

function register(num) {
    var state = store[num];
    if (state.length == 1) {
        state.push(VOX_COUNT);
        state.push(VOX_SIZE);
        state.push(vertices.length);
        state.push(voxels.length);

        for (var i = 0; i < vertices.length; ++i) {
            state.push([vertices[i][0], vertices[i][1]]);
        }
        for (i = 0; i < voxels.length; ++i) {
            state.push({state: voxels[i].state, vertices: []});
        }
        document.getElementById(state[0]).innerHTML = "Recall "+(num+1);
        return;
    }
    undoStack = [];
    redoStack = [];
    VOX_COUNT= state[1];
    VOX_SIZE = state[2];
    var nvtx = state[3];
    var nvox = state[4];
    vertices = state.slice(5,5+nvtx);
    voxels   = state.slice(5+nvtx,5+nvtx+nvox);
    initVoxVtx();
    state.length = 1;
    range.value  = VOX_COUNT;
    document.getElementById(state[0]).innerHTML = "Store " + (num+1);
    document.getElementById('rangeOut').textContent = ""+VOX_COUNT;
    window.onresize();
}

function reset() {
    //console.log("reset");
    try {
        window.localStorage.clear();
    }
    catch(ex) {
    }
    loadLocal();
    window.onresize();
}

function resetVoxel(voxi) {
    var [row,col] = voxCoord(voxi);
    //console.log(voxi, row, col);
    var states    = [];

    for (var r = row-1; r <= row+1; ++r) {
        for (var c = col-1; c <= col+1; ++c) {
            if (r < 0 || c < 0 || r >= VOX_COUNT || c >= VOX_COUNT) {
                states[states.length] = true;
            }
            else {
                states[states.length] = voxels[voxIndex(r,c)].state == 'White';
            }
        }
    }
    var vtx = voxels[voxi].vertices;

    if (states[0] && states[1] && states[3]) {
        [vtx[0][0], vtx[0][1]] = initPoint(voxi, 0);
    }

    if (states[1] && states[2] && states[5]) {
        [vtx[1][0], vtx[1][1]] = initPoint(voxi, 1);
    }

    if (states[5] && states[7] && states[8]) {
        [vtx[2][0], vtx[2][1]] = initPoint(voxi, 2);
    }

    if (states[3] && states[6] && states[7]) {
        [vtx[3][0], vtx[3][1]] = initPoint(voxi, 3);
    }
    vtx[4][0] = vtx[0][0];
    vtx[4][1] = vtx[0][1];
    voxels[voxi].state = 'White';
}

function resizeGrid(count) {
    if (count < 4) abort("input min restriction violated");
    var bounds = planRange();
    //console.log(bounds);
    var numRows = bounds.maxrow - bounds.minrow + 1;
    var numCols = bounds.maxcol - bounds.mincol + 1;

    if (count < VOX_COUNT && bounds.maxrow >= 0) { // If not empty grid
        var minCount = numRows;

        if (minCount < numCols) {
            minCount = numCols;
        }

        if (minCount > count) {
            return; // New size is too small to hold current plan
        }
    }
    var sVoxels   = voxels;
    var oldCount  = VOX_COUNT;

    VOX_INICOUNT = count;
    reset();

    if (bounds.maxrow == -1) {
        return; // Nothing to copy over
    }
    var startRow  = Math.floor((VOX_COUNT-numRows)/2);
    var startCol  = Math.floor((VOX_COUNT-numCols)/2);

    for (var vi = 0; vi < sVoxels.length; ++vi) {
        var r = Math.floor(vi/oldCount), c = vi % oldCount;

        if (r >= bounds.minrow && c >= bounds.mincol
         && r <= bounds.maxrow && c <= bounds.maxcol) {
            var torow = r-bounds.minrow+startRow;
            var tocol = c-bounds.mincol+startCol;
            var colchg= (tocol-c)*VOX_SIZE;
            var rowchg= (torow-r)*VOX_SIZE;
            var index = voxIndex(torow, tocol);
            var sVox  = sVoxels[vi];
            var vox   = voxels[index];
            vox.state = sVox.state;
            vox.vertices[0][0] = sVox.vertices[0][0] + colchg;
            vox.vertices[0][1] = sVox.vertices[0][1] + rowchg;
            vox.vertices[1][0] = sVox.vertices[1][0] + colchg;
            vox.vertices[1][1] = sVox.vertices[1][1] + rowchg;
            vox.vertices[2][0] = sVox.vertices[2][0] + colchg;
            vox.vertices[2][1] = sVox.vertices[2][1] + rowchg;
            vox.vertices[3][0] = sVox.vertices[3][0] + colchg;
            vox.vertices[3][1] = sVox.vertices[3][1] + rowchg;
        }
    }
}

function voxCoord(index) {
    return [Math.floor(index/VOX_COUNT), index % VOX_COUNT];
}

function voxIndex(r,c) {
    return r*VOX_COUNT+c;
}

function voxBoardId(r,c,vox, scale) {
    var adj     = Math.floor(3*VOX_SIZE/2);
    var ur      = vox.vertices[1];
    var col     = scale*(ur[0] - (c+1) * VOX_SIZE + adj);
    var row     = scale*(ur[1] - r * VOX_SIZE + adj);
    var color   = vox.state == 'White' ? 'Black' : vox.state;
    return { color : color, row : row, col : col, discard : false };
}

// From "Inclusion of a Point in a Polygon" by Dan Sunday
function isLeft(p0, p1, p2) {
    var n = ((p1[0] - p0[0]) * (p2[1] - p0[1]) -
             (p2[0] - p0[0]) * (p1[1] - p0[1]));
    return n;
}

function wnPnPoly(p, v) {
    var wn = 0;
    for (var i = 0; i < v.length-1; i++) {
        if (v[i][1] <= p[1]) {
            if (v[i+1][1] > p[1] && isLeft(v[i], v[i+1], p) > 0) ++wn;
        }
        else if (v[i+1][1] <= p[1]) {
            if (isLeft(v[i], v[i+1], p) < 0) --wn;
        }
    }
    return wn;
}

window.onresize = function(e) {
    var th = title.offsetTop+title.offsetHeight+10; // 2*t.border
    var w = window.innerWidth-20, h = window.innerHeight-20;
    var w1 = menu.offsetWidth+h-th, h1 = w+th-menu.offsetWidth;
    if (h1 < h) h = h1; else w = w1;
    canvas.height = canvas.width = h-th-1; // 2*g.border
    grid.style.width = title.style.width = w+"px";
    grid.style.height = (h-th)+"px";
    menu.style.height = (grid.clientHeight-20)+"px"; // 2*m.padding
    scale = canvas.height/(VOX_SIZE*VOX_COUNT);
    //context.setTransform(scale, 0, 0, scale, 0, 0);
    drawVoxList();
};

window.onbeforeunload = localsave;
canvas.addEventListener('mouseup', mouseUp, false);
canvas.addEventListener('mousedown', mouseDown, false);
document.getElementById("reset").onclick = reset;
undo.onclick  = function() {
    doFn(undoStack,redoStack);
};
redo.onclick  = function() {
    doFn(redoStack,undoStack);
};
document.getElementById("reg1").onclick  = function() {
    register(0);
};
document.getElementById("reg2").onclick  = function() {
    register(1);
};
document.getElementById("reg3").onclick  = function() {
    register(2);
};
document.getElementById("voxclr").onclick = function() {
    VOX_SEL = VOX_COLORS[VOX_COLORS.indexOf(VOX_SEL)+1];
    this.style.background = VOX_SEL;
};
document.getElementById("export").onclick = function() {
    var text = "<!DOCTYPE html><html><head><title>Plan</title></head><body>\\n";
    var ids  = [];
    var bounds = planRange();
    //console.log(bounds);
    var scale = 1;

    if (VOX_SIZE == 2) { // are there any voxels made when it was 4?
        for (var vtxi = 0; vtxi < vertices.length; ++vtxi) {
            var vertice = vertices[vtxi];

            if (vertice[0] % 1 == 0.5 || vertice[1] % 1 == 0.5) {
                scale = 2;
                break;
            }
        }
    }
    
    if (VOX_SIZE == 4 || scale == 2) {
        text += "<p>Use 13x13 voxel board:</p><pre>";
    }
    else {
        text += "<p>Use 7x7 voxel board:</p><pre>";
    }


    for (var vr = bounds.minrow; vr <= bounds.maxrow; ++vr) {
        ids[vr-bounds.minrow] = [];
        for (var vc = bounds.mincol; vc <= bounds.maxcol; ++vc) {
            var index = voxIndex(vr,vc);
            ids[vr-bounds.minrow][vc-bounds.mincol] = voxBoardId(vr,vc,voxels[index],scale);
        }
    }

    for (vr = 0; vr < ids.length; ++vr) {
        var cols = ids[vr];

        for (vc = 0; vc < cols.length; ++vc) {
            var id = cols[vc];

            if (id.color == 'Black') {
                id.discard = vr == 0
                          || vc == cols.length-1
                          || (ids[vr][vc+1].color   == 'Black'
                            && ids[vr-1][vc].color   == 'Black'
                            && ids[vr-1][vc+1].color == 'Black');
            }
            text += formatBoardId(vr, vc, id);
        }
        text += "\\n";
    }
    text += "</pre></body></html>";

    var width  = 20 + 35*(bounds.maxcol - bounds.mincol + 1);
    var height = 20 + 25*(bounds.maxrow - bounds.minrow + 1);

    if (typeof(planwin) !== 'undefined') {
        planwin.close();
    }
    planwin = window.open("", "_blank", "width="+width+", height="+height);
    planwin.document.write(text);

};
loadLocal();
window.onresize();
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
