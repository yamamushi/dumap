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


<!DOCTYPE html>
<html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        
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
                <input type="range" min="4" max="20" step="1" value="10" id="rangeIn" name="range" oninput="rangeChg(value)" onchange="rangeChg(value)" style="width:50px" disabled="">
                <output id="rangeOut" form="range">10</output>
                <button type="button" id="reset">Reset</button><br">
                <button type="button" id="undo">Undo</button><br">
                <button type="button" id="redo" disabled="">Redo</button><br">
                <button type="button" id="reg1">Store 1</button><br">
                <button type="button" id="reg2">Store 2</button><br">
                <button type="button" id="reg3">Store 3</button><br">
                <button type="button" id="voxclr" style="background: rgb(240, 0, 0);">+</button><br">
                <button type="button" id="export">Export</button><br">
            </div>
            <canvas id="canvas" width="518" height="518">
        </canvas></div>
<script language="javascript" type="text/javascript">
// CONSTANTS
var isIe = (navigator.userAgent.toLowerCase().indexOf("msie") != -1 
           || navigator.userAgent.toLowerCase().indexOf("trident") != -1);

var VOX_COLORS   = [ '#F00000', '#00F000', '#00F0F0', '#F000F0', '#F00000' ]
var VOX_INICOUNT = 7;
var VOX_INISIZE  = 2;
var LEFT_MOUSE   = 0;
var RIGHT_MOUSE  = 2;

var VOX_COUNT   = VOX_INICOUNT;
var VOX_SIZE    = VOX_INISIZE;
var VOX_SEL     = VOX_COLORS[1];

// GLOBALS
var scale      = 1;
var title      = document.getElementById('title');
var grid       = document.getElementById('grid');
var canvas     = document.getElementById('canvas');
var menu       = document.getElementById('menu');
var range      = document.getElementById("rangeIn");
var redo       = document.getElementById("redo");
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
    context.fillStyle = color;
    context.fill();
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
    
    if (pt[0] > 0 && pt[0] < tics && pt[1] > 0 && pt[1] < tics) {
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
    for (i = 0; i < voxels.length; ++i) {
        vox = voxels[i];
        drawBox(vox.vertices, vox.state);
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

function init() {
    redoStack = [];
    undoStack = [];
    
    var local = parseInt(window.localStorage.getItem("VOX2D:VOX_COUNT"));
    if (local && local > 0) {
        VOX_INICOUNT = VOX_COUNT = local;
        VOX_SIZE  = parseInt(window.localStorage.getItem("VOX2D:VOX_SIZE"));
        vertices  = JSON.parse(window.localStorage.getItem("VOX2D:VERTICES"));
        voxels    = JSON.parse(window.localStorage.getItem("VOX2D:VOXELS"));
        range.disabled = true;
    }
    else {
        VOX_COUNT = VOX_INICOUNT;
        VOX_SIZE  = VOX_INISIZE;
        vertices  = [];
        voxels    = [];
        range.disabled = false;
    }
    document.getElementById('rangeOut').textContent = ""+VOX_COUNT;
    range.value = VOX_COUNT;
    
    if (vertices.length !== (VOX_COUNT+1)*(VOX_COUNT+1)) {
        vertices  = [];
        for (var y = 0; y <= VOX_COUNT; ++y) {
            for (var x = 0; x <= VOX_COUNT; ++x) {
                vertices[vertices.length] = [x*VOX_SIZE,y*VOX_SIZE];
            }
        }
    }

    if (voxels.length !== VOX_COUNT*VOX_COUNT) {
        voxels = [];
        
        for (var vi = 0; vi < VOX_COUNT*VOX_COUNT; ++vi) {
            voxels[vi] = { state: 'White', vertices: [] };
        }
    }
    console.log(vertices.length);
    
    for (vi = 0; vi < VOX_COUNT*VOX_COUNT; ++vi) {
        var skip = Math.floor(vi/VOX_COUNT);
        var ul = vi+skip, ur = ul+1, ll = vi+VOX_COUNT+1+skip, lr = ll+1;
        voxels[vi].vertices = [ vertices[ul], vertices[ur], vertices[lr],
                                vertices[ll], vertices[ul]];
    }
    document.getElementById("voxclr").style.background = VOX_SEL;
    window.onresize();
}

function initPoint(voxel,vertex) {
    var initPoints = [[0,0],[VOX_SIZE,0],[VOX_SIZE,VOX_SIZE],[0,VOX_SIZE]];
    var pt;
    if (voxel >= 0 && voxel < VOX_COUNT*VOX_COUNT) {
        pt = [initPoints[vertex][0], initPoints[vertex][1]];
        pt[0] += (voxel % VOX_COUNT)*VOX_SIZE;
        pt[1] += Math.floor(voxel/VOX_COUNT)*VOX_SIZE;
    }
    return pt;
}

function localsave() {
    window.localStorage.clear();
    window.localStorage.setItem("VOX2D:VOX_COUNT", VOX_COUNT);
    window.localStorage.setItem("VOX2D:VOX_SIZE", VOX_SIZE);
//  var vxs = "[";
//  var sep = "";
//  
//  for (var vi = 0; vi < vertices.length; ++vi) {
//      vxs += sep + "[" + vertices[vi][0] + "," + vertices[vi][1] + "]";
//      sep = ",";
//  }
//  vxs += "]";
    window.localStorage.setItem("VOX2D:VERTICES", JSON.stringify(vertices)); //vxs);
//  vxs = "[";
//  sep = "";
//  
//  for (vi = 0; vi < voxels.length; ++vi) {
//      var vox = voxels [vi];
//      vxs += sep + " { \"state\" : \"" + vox.state + ", \"vertices\" : [] }";
//      sep = ",";
//  }
//  vxs += "]";
    window.localStorage.setItem("VOX2D:VOXELS", JSON.stringify(voxels));
}

function mouseDown(evt) {
    var pt = mousePoint(evt);
    console.log(evt, scale);
    console.log("mouse down:", pt, evt.button);

    if (evt.button == LEFT_MOUSE) {
        if (evt.preventDefault) {
            evt.preventDefault();
        }
        // console.log(evt.button, x, y);
        var vi = ptToVoxel(pt);
        if (vi >= 0) {
            //console.log(i,voxels[i]);
            var candidates    = voxels[vi].vertices;
            var metric        = distanceSq(pt,candidates[0]);
            var vtx           = 0;
            
            for (var i = 1; i < candidates.length-1; ++i) {
                var next = distanceSq(pt,candidates[i]);
                if (next < metric) {
                    metric = next;
                    vtx = i;
                }
            }
            var offsets = [[0,-1,-VOX_COUNT,-VOX_COUNT-1],
                           [0,1,-VOX_COUNT,-VOX_COUNT+1],
                           [0,1,VOX_COUNT,VOX_COUNT+1],
                           [0,-1,VOX_COUNT-1,VOX_COUNT]][vtx];
            console.log(vi,offsets,vtx,candidates[vtx][0],candidates[vtx][1]);
            for (i = 0; i < offsets.length; ++i) {
                var tmp = vi+offsets[i];
                if (tmp >= 0 && tmp < voxels.length
                 && 0 <= VOX_COLORS.indexOf(voxels[tmp].state)) {
                     var choices    = voxels[tmp].vertices;
                     console.log(tmp,choices);
                     selectedCursor = pt;
                     selectedVoxel  = tmp;
                     for (selectedVertex = 0; 
                              selectedVertex < candidates.length-1;
                              ++selectedVertex) {
                          if (choices[selectedVertex] == candidates[vtx]) {
                              break;
                          }
                     }
                     if (selectedVertex == 4) alert('oops');
                     drawTargets();
                 }
            }

        }
    }
    return false;
}

function mousePoint(evt) {
    if (evt.offsetX == undefined) {
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
    
    if (evt.button == RIGHT_MOUSE) {
        var vi = ptToVoxel(mpt);
        if (vi >= 0) {
            var current   = voxels[vi].state;
            var sel_color = current == 'White' ? VOX_SEL : 'White';
            var fn1 = function() {
                voxels[vi].state = sel_color;
                return function() {
                    voxels[vi].state = current;
                    return fn1;
                }
            };
            redoStack = [];
            undoStack.push(fn1());
            range.disabled = true;
        }
    }
    else if (evt.button == LEFT_MOUSE) {
        if (selectedVoxel >= 0
         && Math.sqrt(distanceSq(selectedCursor, mpt) > 0.1)) {
            var nearest = nearestTarget(mpt);
            if (nearest) { // vertex order: ul, ur, lr, ll -> 0..3
                var vxi = selectedVoxel, vtx = selectedVertex;
                var vx = voxels[vxi].vertices[vtx][0];
                var vy = voxels[vxi].vertices[vtx][1];
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
        var pt = initPoint(selectedVoxel,selectedVertex);
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
        
        if (Math.sqrt(minDistance) < VOX_SIZE/4) {
            return nearestPt;
        }
    }
    return undefined;
}

function ptToVoxel(pt) {
    for (var i = 0; i < voxels.length; ++i) {
        //console.log(i,pt,voxels[i]);
        if (0 != wnPnPoly(pt, voxels[i]['vertices'])) {
            return i;
        }
    }
    return -1;
}

function rangeChg(value) {
    VOX_INICOUNT = parseInt(value);
    init();
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
            state.push({state: voxels[i].state,
                        vertices: []});
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
    
    for (var vi = 0; vi < VOX_COUNT*VOX_COUNT; ++vi) {
        var skip = Math.floor(vi/VOX_COUNT);
        var ul = vi+skip, ur = ul+1, ll = vi+VOX_COUNT+1+skip, lr = ll+1;
        voxels[vi].vertices =
            [ vertices[ul], vertices[ur], vertices[lr], vertices[ll], vertices[ul]];
    }
    state.length = 1;
    document.getElementById(state[0]).innerHTML = "Store " + (num+1);
    window.onresize();
}

function reset() {
    window.localStorage.clear();
    init();
}

function voxURcoord(r,c) {
    var adj  = Math.floor(3*VOX_SIZE/2);
    var vox  = voxels[r*VOX_COUNT+c];
    var ur   = vox.vertices[1];
    var color= vox.state == 'White' ? "Black" : vox.state;
    var col  = ur[0] - (c+1) * VOX_SIZE + adj;
    var row  = ur[1] - r * VOX_SIZE + adj;
    return "<span style='color:" + color + "'>" + "123456789ABCD"[row] + "123456789ABCD"[col] + "</span>";
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
    var text = "<!DOCTYPE html><html><head><title>Export</title></head><body><pre>";
    for (var vr = 0; vr < VOX_COUNT; ++vr) {
        text += voxURcoord(vr, 0);
        for (var vc = 1; vc < VOX_COUNT; ++vc) {
            text += " " + voxURcoord(vr,vc);
        }
        text += "\n";
    }
    text += "</pre></body></html>";
    var popup = window.open("","export","width=" + (20+35*VOX_COUNT)
                                        + ", height=" + (20+25*VOX_COUNT));
    popup.document.write(text);
};
init();
</script>
    
<script src="./twodvoxplanner_files/livecss.js"></script></body></html>






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
