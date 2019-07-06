// GLOBAL

// Global Scene view
// noinspection ES6ConvertVarToLetConst
let scene;

// Options (Do not edit these by hand!)
let hide_Orbitals = false;

// Scaling
let scales = [];
const miniscale = 3000000;
const moonScaling = 100000;
const starScaling = 50000;
const planetScaling = 200000;	//was 1 million for all 3 scaling
const ringScaling = 3000000;	//keep same as miniscale for the same scaling as the planets
const sphereRadius = 0.5; // Not worth changing since scaling handles this
const labelscale = 1.5;
const moon_Distance_Scale = 5; //how much the distance between the moon and planet is multiplied by
const tourRadius = 1.0; // The fuzzy sphere around planets
let mRadius;
let pRadius;

// Colors
const planetsDiffuse = "0 0 1";
const planetsEmissive = "0 0 0";

const moonDiffuse = "1 0 0";
const moonEmissive = "0 0 0";

const fuzzySpheresDiffuse = "0 0 0";
const fuzzySpheresEmissive = "0 1 0";
const fuzzySpheresTransparency = 0.9; // The transparency of those spheres

const ringDiffuse = "0 0 0";
let ringEmmissive = "0.05 0.05 0.05";
let ringTransparency = 0.4;

const starDiffuse = "0 0 0";
const starEmissive = "1 1 0";

const polylineDiffuse = "0 0 0";
const polylineEmissive = "1 0 0";

// Camera
let cameraCenterOfRotation = [0, 8, 0];
let cameraOrientation = [0.75363, -0.48068, -0.44833, 1.15527]; //[10,10,10,-0.5];
let cameraPosition = [-67.29499, -52.52143, 52.12010]; //[-35,-20,90];

// Data
let planet_Data;
let moon_Data;
let orbit_Data;
let star_Data;


// Datapoints
let datapoints;
let newDatapoints;
let datatours;
let newDataTours;
let datapoints_Moon;
let newDatapoints_Moon;
let datapoints_Orbit;
let newDatapoints_Orbit;
let datapoints_Star;
let newDatapoints_Star;
let datapoints_Polyline;
let newDatapoints_Polyline;
let datalabels;

// Data rows
let rows_Planet;
let rows_Moon;
let rows_Orbit;
let rows_Star;
var rows_Polyline;

//planet selection
let current_Planet = -1;//-1 is none selected
let previous_Planet = -1;

// Axis
const axisKeys = ["x", "y", "z"];
const axisRange = [0, 10];

// Plotting
const initialDuration = 0;
const ease = 'linear';

function loadJSON(path, callback) {

    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', path, false); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState === 4 && xobj.status === 200) {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function move_Moons_Further_Away() {
    let temp_Coord_Planet = [];
    let temp_Coord_Moon = [];
    let temp_New_Coords = [];
    for (let ad = 0; ad < moon_Data.length; ad++) {
        //find differnce in pos from home planet and moon, then multiple that distance by a multipler, then add it back to original coord
        for (let ae = 0; ae < planet_Data.length; ae++) {
            // noinspection JSUnresolvedVariable
            if (planet_Data[ae].name === moon_Data[ad].home) {
                //planet is matching moon home
                temp_Coord_Planet = planet_Data[ae].pos;
                break;
            }
        }
        temp_Coord_Moon = moon_Data[ad].pos;
        temp_New_Coords[0] = temp_Coord_Moon[0] - temp_Coord_Planet[0];
        temp_New_Coords[1] = temp_Coord_Moon[1] - temp_Coord_Planet[1];
        temp_New_Coords[2] = temp_Coord_Moon[2] - temp_Coord_Planet[2];
        temp_New_Coords[0] = temp_New_Coords[0] * moon_Distance_Scale;
        temp_New_Coords[1] = temp_New_Coords[1] * moon_Distance_Scale;
        temp_New_Coords[2] = temp_New_Coords[2] * moon_Distance_Scale;
        moon_Data[ad].pos[0] = temp_New_Coords[0] + temp_Coord_Planet[0];
        moon_Data[ad].pos[1] = temp_New_Coords[1] + temp_Coord_Planet[1];
        moon_Data[ad].pos[2] = temp_New_Coords[2] + temp_Coord_Planet[2];
    }
}

// noinspection JSUnusedGlobalSymbols
function updateDistances(event,i) {
    let source = i;
    if (current_Planet === -1) {
        //first selection
        current_Planet = i;
        set_Size_Of_Fuzz();
    } else 
    if (i != current_Planet) {
        //already had a selection
        previous_Planet = current_Planet;
        current_Planet = i;
        set_Size_Of_Fuzz();
    }

    //let datalabels = scene.selectAll(".dynlabel").remove();

    let shapelabel = scene.selectAll(".dynshape");

    shapelabel.append("Text").attr("string", function(d,i) {
        let destination = i;
        if (planet_Data[destination].type === "Moon") {
            return;
        }
        if (planet_Data[destination].type === "Orbit") {
            return;
        }

        let distance = getDistanceBetween(planet_Data[source].name, planet_Data[destination].name);
        let seconds = getTimeFromDistance(distance);
        let estTime = new Date(seconds * 1000).toISOString().substr(11, 8);
        let labeldist;

        if (distance > 0) {
            labeldist = '"' + distance + 'su - Est: ' + estTime + '"';
        } else {
            labeldist = ' "You are HERE" ';
        }
        return '"' + planet_Data[i].name + '"' + ' "" ' + ' "" ' + labeldist;
    }).append("fontstyle").attr("family", "arial").attr("quality", "3").attr("size", "1.5");

    shapelabel.append("appearance").append("material").attr("diffuseColor", function(d, i) {
        if (source === i) {
        	set_HTML_For_Info_Panel(i, "Planet");//update the info panel before returning
            return "green";
        } else {
            return "white";
        }
    });
}

function mouseover(e, i) {
    //alert("test " + i)
}

function mouseout(e, i) {
    //alert("test" + i);
}

function set_Size_Of_Fuzz() {
    document.getElementById("fuzzy_" + current_Planet).setAttribute('scale', '2 2 2');
    if (previous_Planet >= 0) {
        document.getElementById("fuzzy_" + previous_Planet).setAttribute('scale', '1 1 1');
        //calculate pos points for the two planets
        let p1 = planet_Data[current_Planet].pos[0]/miniscale + " " + planet_Data[current_Planet].pos[1]/miniscale + " " + planet_Data[current_Planet].pos[2]/miniscale;
        let p2 = planet_Data[previous_Planet].pos[0]/miniscale + " " + planet_Data[previous_Planet].pos[1]/miniscale + " " + planet_Data[previous_Planet].pos[2]/miniscale;
        document.getElementById("line_Between_Two").setAttribute('point', p1 + ", " + p2);
    }
}

/**
 * @return {string}
 */
function CalculateDistance(loc1, loc2) {
    let dx = loc1.pos[0] - loc2.pos[0];
    let dy = loc1.pos[1] - loc2.pos[1];
    let dz = loc1.pos[2] - loc2.pos[2];
    return (Math.sqrt(dx * dx + dy * dy + dz * dz)/200000).toFixed(3);
}

function findPlanet(arr, propName, propValue) {
    for (let i=0; i < arr.length; i++) {
        if (arr[i][propName] === propValue) {
            return arr[i];	// will return undefined if not found; you could return a default instead
        }
    }
}

function getDistanceBetween(name1, name2) {
    let p1 = findPlanet(planet_Data, "name", name1);
    let p2 = findPlanet(planet_Data, "name", name2);

    return CalculateDistance(p1,p2);
}

function getTimeFromDistance(distance) {
    if (distance <= 0) {
        return 0;
    }
    distance = distance * 200; // Scaling
    return (distance/30000) * 3600; // Seconds scaling
}

// Helper functions for initializeAxis() and drawAxis()
// -- ? --
// Initialize the axes lines and labels.
function initializePlot() {
    initializeAxis(0);
    initializeAxis(1);
    initializeAxis(2);
}

function initializeAxis(axisIndex) {
    let key = axisKeys[axisIndex];
    drawAxis(axisIndex, key, initialDuration);
}

// Assign key to axis, creating or updating its ticks, grid lines, and labels.
function drawAxis(axisIndex) {

    let scale = d3.scale.linear();
    scale.domain([-1000,1000]); // demo data range
    scale.range(axisRange);

    scales[axisIndex] = scale;
}

// Function for generating planet datapoints based on scaling
function planetDatapoints() {
    datapoints = scene.selectAll("datapoint").data(rows_Planet);
    datapoints.exit().remove();
    newDatapoints = datapoints.enter().append("transform").attr("id", function(d,i) { return "planet_" + i;}).attr("class", "datapoint").attr("scale", function(d,i) {
        pRadius = planet_Data[i].radius/planetScaling;
        return [pRadius, pRadius, pRadius];
    }).append("shape");
    newDatapoints.append("appearance").append("material").attr("diffuseColor", planetsDiffuse).attr("emissiveColor", planetsEmissive);
    newDatapoints.append("sphere");
    return newDatapoints
}

// Generate our fuzzy sphere datapoints (clickable spheres)
function fuzzySphereDatapoints() {
    datatours = scene.selectAll("datatour").data(rows_Planet);
    datatours.exit().remove();
    newDataTours = datatours.enter().append("transform").attr("id", function(d,i) { return "fuzzy_" + i;}).attr("class", "datatour").attr("scale", function(d,i) {
        if (planet_Data[i].type === "Planet") {
            return [tourRadius, tourRadius, tourRadius];
        } else {
            return [0, 0, 0]; //0 radius, or nothing basically
        }
    }).append("shape").attr("onclick", function(d,i) { return "updateDistances(event,"+i+");"});
    newDataTours.append("appearance").append("material").attr("diffuseColor", fuzzySpheresDiffuse).attr("emissiveColor", fuzzySpheresEmissive).attr("transparency", fuzzySpheresTransparency);
    newDataTours.append("sphere");
    return newDataTours
}

// Generate the moon datapoints
function moonDatapoints() {
    datapoints_Moon = scene.selectAll("datapoint_Moon").data(rows_Moon);
    datapoints_Moon.exit().remove();
    newDatapoints_Moon = datapoints_Moon.enter().append("transform").attr("id", function(d,i) { return "moon_" + i;}).attr("class", "datapoint_Moon").attr("scale", function(d,i) {
        mRadius = moon_Data[i].radius/moonScaling;
        return [mRadius, mRadius, mRadius];
    }).append("shape");
    newDatapoints_Moon.append("appearance").append("material").attr("diffuseColor", moonDiffuse).attr("emissiveColor", moonEmissive);
    newDatapoints_Moon.append("sphere");
    return newDatapoints_Moon
}

// Generate the orbit datapoints
function orbitDatapoints() {
    datapoints_Orbit = scene.selectAll("datapoint_Orbit").data(rows_Orbit);
    datapoints_Orbit.exit().remove();
    newDatapoints_Orbit = datapoints_Orbit.enter().append("transform").attr("id", function(d,i) { return "orbit_" + i;}).attr("scale", function(d,i) {
        let oDistance = (orbit_Data[i].radius/ringScaling);
        return [oDistance, oDistance, oDistance];
    }).attr("rotation", function(d,i) {
        return [1,1,0,orbit_Data[i].rotate];
    }).attr("class", "datapoint_Orbit").append("shape");
    /*attr("rotation", function(d,i) {
        return [1,0,0,orbit_Data[i].rotate[0]]
    }).attr("rotation", function(d,i) {
        return [0,1,0,orbit_Data[i].rotate[1]]
    }).attr("rotation", function(d,i) {
        return [0,0,1,orbit_Data[i].rotate[2]]
    })*/
    newDatapoints_Orbit.append("appearance").append("material").attr("diffuseColor", ringDiffuse).attr("emissiveColor", ringEmmissive).attr("transparency", ringTransparency);
    newDatapoints_Orbit.append("circle2d");
    return newDatapoints_Orbit
}

// Generate our star datapoint
function starDatapoint() {
    datapoints_Star = scene.selectAll("datapoint_Star").data(rows_Star);
    datapoints_Star.exit().remove();
    newDatapoints_Star = datapoints_Star.enter().append("transform").attr("id", function(d,i) { return "star_" + i;}).attr("class", "datapoint_Star").attr("scale", [star_Data[0].radius/starScaling, star_Data[0].radius/starScaling, star_Data[0].radius/starScaling]).append("shape");
    newDatapoints_Star.append("appearance").append("material").attr("diffuseColor", starDiffuse).attr("emissiveColor", starEmissive);
    newDatapoints_Star.append("sphere");
    return newDatapoints_Star
}

// Generate the polyline datapoints
function polylineDatapoints() {
    datapoints_Polyline = scene.selectAll("datapoint_Polyline").data("0 40 0, 0 0 0");
    datapoints_Polyline.exit().remove();
    newDatapoints_Polyline = datapoints_Polyline.enter().append("transform").attr("class", "datapoint_Polyline").attr("id", "datapoint_Polyline_Coord").append("shape")
    newDatapoints_Polyline.append("appearance").append("material").attr("diffuseColor", polylineDiffuse).attr("emissiveColor", polylineEmissive)
    newDatapoints_Polyline.append("IndexedLineSet").attr("coordIndex", "0 1 -1").append("Coordinate").attr("id", function(d,i) { return "line_Between_Two";}).attr("point", "0 8 0, 0 8 0")
    return newDatapoints_Polyline;
}

// Generate initial labels for planets
function generateLabels(){
    let datalabels = scene.selectAll("datalabel").data(rows_Planet);

    datalabels.exit().remove();

    let shapelabel = datalabels.enter().append("transform")
        .attr("class", "datalabel")
        .attr("scale", [sphereRadius*labelscale, sphereRadius*labelscale, sphereRadius*labelscale])
        .append("billboard")
        .attr("render", 'true')
        .attr("axisOfRotation", '0,0,0')
        .append("shape")
        .attr("class", 'dynshape');

    shapelabel.append("Text")
        .attr("string", function(d,i) {
            if (planet_Data[i].type === "Moon") {
                return "";
            } else if (planet_Data[i].type === "Planet") {
                return '"' + planet_Data[i].name + '"' + '""' + '""' + '""';
            }
        })
        .attr("class", 'dynlabel')
        .append("fontstyle")
        .attr("family", "arial")
        .attr("quality", "3")
        .attr("size", "1.5");

    return datalabels;
}

// Plot Translations
function plotTranslation(duration, planets, fuzzy, moons, orbits, star, labels, polyline) {
    let tranpoints = planets.transition();
    let trantours =	fuzzy.transition();
    let tranpoints_Moon = moons.transition();
    let tranpoints_Orbit = orbits.transition();
    let tranpoints_Star = star.transition();
    let tranlabels = labels.transition();
    let tranpoints_Polyline = polyline.transition();

    tranpoints.ease(ease).duration(duration).attr("translation", function(row) {
        return row[0] + ", " + row[1] + ", " + row[2]});

    trantours.ease(ease).duration(duration).attr("translation", function(row) {
        return row[0] + ", " + row[1] + ", " + row[2]});

    tranpoints_Moon.ease(ease).duration(duration).attr("translation", function(row) {
        return row[0] + ", " + row[1] + ", " + row[2]});

    tranpoints_Orbit.ease(ease).duration(duration).attr("translation", function(row) {
        return row[0] + ", " + row[1] + ", " + row[2]});

    tranpoints_Star.ease(ease).duration(duration).attr("translation", function() {
        return 0 + ", " + 8 + ", " + 0});	//not sure why this wasn't working with row[0] &ect, was just undefined.
    tranlabels.ease(ease).duration(duration).attr("translation", function(row) {
        return row[0] + ", " + row[1] + ", " + row[2]});

    tranpoints_Polyline.ease(ease).duration(duration).attr("translation", function(row) {
        return row[0] + ", " + row[1] + ", " + row[2]});
}

// Update the data points (spheres) and stems.
function plotData(duration) {

    if (!rows_Planet) {
        console.log("no planets to plot.");
        return;
    }

    //planets
    newDatapoints = planetDatapoints();

    //transparent spheres around planets
    newDataTours = fuzzySphereDatapoints();

    //moons
    newDatapoints_Moon = moonDatapoints();

    //orbit
    newDatapoints_Orbit = orbitDatapoints();

    //the star
    newDatapoints_Star = starDatapoint();

    //polyline
    newDatapoints_Polyline = polylineDatapoints();

    //labels and other stuff like that
    datalabels = generateLabels();

    // Translation
    plotTranslation(duration, datapoints, datatours, datapoints_Moon, datapoints_Orbit, datapoints_Star, datalabels, datapoints_Polyline);
}

function initializeDataGrid_Planet() {
    let coords_Planet = [];
    for (let aa = 0; aa < planet_Data.length; aa++) {
        let x=planet_Data[aa].pos[0]/miniscale;
        let y=planet_Data[aa].pos[1]/miniscale;
        let z=planet_Data[aa].pos[2]/miniscale;
        let little_Planet = [x,y,z,"Planet"];
        coords_Planet.push(little_Planet);
    }
    return coords_Planet;
}

function initializeDataGrid_Moon() {
    let coords_Moon = [];
    for (let ab = 0; ab < moon_Data.length; ab++) {
        let x=moon_Data[ab].pos[0]/miniscale;
        let y=moon_Data[ab].pos[1]/miniscale;
        let z=moon_Data[ab].pos[2]/miniscale;
        let little_Moon = [x,y,z,"Moon"];
        coords_Moon.push(little_Moon);
    }
    return coords_Moon;
}

function initializeDataGrid_Orbit() {
    let coords_Orbit = [];
    for (let ac = 0; ac < orbit_Data.length; ac++) {
        let little_Orbit = [0,8,0,"Orbit"];	//24,000,000 / 3,000,000. this will be the center location
        coords_Orbit.push(little_Orbit);
    }
    return coords_Orbit;
}

function initializeDataGrid_Star() {
    return [star_Data[0].pos[0],star_Data[0].pos[1]/miniscale,star_Data[0].pos[2],"Star"];	//center location for the star
}

function scatterPlot3d(parent) {
    let x3d = parent.append("x3d");
    x3d.style('width', '100%');
    x3d.style('height', '100%');
    x3d.style("border", "inset");

    scene = x3d.append("scene");

    scene.append("Background")
        .attr("crossOrigin","anonymous")
        .attr("leftUrl", "../images/bg.png")
        .attr("rightUrl", "../images/bg.png")
        .attr("bottomUrl", "../images/bg.png")
        .attr("topUrl", "../images/bg.png")
        .attr("frontUrl", "../images/bg.png")
        .attr("backUrl", "../images/bg.png");

    // Camera
    let view = scene.append("viewpoint");
    view.attr("fieldOfView", 0.7);
    view.attr("centerOfRotation", cameraCenterOfRotation);
    view.attr("orientation", cameraOrientation);
    view.attr("position", cameraPosition); // <-> || ^ down || forward back

    move_Moons_Further_Away();

    rows_Planet = initializeDataGrid_Planet(); //planet data
    rows_Moon = initializeDataGrid_Moon(); //moon data
    rows_Orbit = initializeDataGrid_Orbit(); //orbit data
    rows_Star = initializeDataGrid_Star(); //star data

    initializePlot();
    plotData(1000);
}

function open_Options() {
    let temp_id = document.getElementById("menu");
    if (temp_id.style.display === "none") {
        temp_id.style.display = "initial";
    } else {
        temp_id.style.display = "none";
    }
}

function start_Up() {

    loadJSON("../data/planets.json",function(response) {
        planet_Data = JSON.parse(response)
    });

    loadJSON("../data/moons.json",function(response) {
        moon_Data = JSON.parse(response)
    });

    loadJSON("../data/orbits.json",function(response) {
        orbit_Data = JSON.parse(response)
    });

    loadJSON("../data/stars.json",function(response) {
        star_Data = JSON.parse(response)
    });

    scatterPlot3d(d3.select('#plot'));
}

function orbitals_Check() {
    let temp_Checkbox_Value = document.getElementById("orbitals_Checkbox");
    if (temp_Checkbox_Value.checked === true) {
        hide_Orbitals = true;
    }
    if (temp_Checkbox_Value.checked === false) {
        hide_Orbitals = false;
    }
    show_Hide_Orbitals(hide_Orbitals);
}

function show_Hide_Orbitals(boo) {
    if (boo === true) {
        newDatapoints_Orbit.selectAll("material").attr("transparency", 1);
    } else
    if (boo === false) {
        newDatapoints_Orbit.selectAll("material").attr("transparency", ringTransparency);
    }
}

function set_HTML_For_Info_Panel(i, body, home) {
    //if coming from a planet, i = index of array and body = "Planet", home is not sent
    //if coming from a moon then body is "Moon", i is the moon name, and home is the moons home planet
    if (body === "Moon") {
        //get got a moon so need to find its index
        for (an = 0; an < moon_Data.length; an++) {
            if (moon_Data[an].home === home && moon_Data[an].name === i) {
                i = an; //set new index
                break;
            }
        }
    }
    let temp_List_Of_Moons = [];
    if (body === "Planet") {
        for (let af = 0; af < moon_Data.length; af++) {
            // noinspection JSUnresolvedVariable
            if (moon_Data[af].home === planet_Data[i].name) {
                temp_List_Of_Moons.push(moon_Data[af].name);
            }
        }
    }
    let temp_HTML_Text = "";
    // noinspection JSUnresolvedVariable
    if (body === "Planet") {
        temp_HTML_Text = '<!--suppress ALL --><table width="300"><tr><th>' + planet_Data[i].name + '<span id="Exit_Button" onclick="hide_Info_Panel()">X</span></th></tr>';
        temp_HTML_Text = temp_HTML_Text + '<tr><td>Class: ' + planet_Data[i].class + '</td></tr>';
        temp_HTML_Text = temp_HTML_Text + '<tr><td>Orbit distance: ' + orbit_Data[i].radius + '</td></tr>';
    } else
    if (body === "Moon") {
        let planetid = 0;
        for (let ao = 0; ao < planet_Data.length; ao++) {
            if (planet_Data[ao].name === home) {
                planetid = ao;
                break;
            }
        }
        temp_HTML_Text = '<!--suppress ALL --><table width="300"><tr><th>' + moon_Data[i].name + ' of <span onclick="set_HTML_For_Info_Panel(' + planetid + ', ' + "'Planet'" + ')">' + home + '</span><span id="Exit_Button" onclick="hide_Info_Panel()">X</span></th></tr>';
    }
    temp_HTML_Text = temp_HTML_Text + '<tr><td><hr></td></tr>';
    if (body === "Moon") {
        temp_HTML_Text = temp_HTML_Text + Create_Ore_HTML_For_Info_Panal(i, "Moon");//adds ore html
    } else {
        temp_HTML_Text = temp_HTML_Text + Create_Ore_HTML_For_Info_Panal(i, "Planet");//adds ore html
    }
    if (body === "Planet") {
        if (temp_List_Of_Moons.length === 0) {
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Moons: none</td></tr>';
        } else {
            for (let ag = 0; ag < temp_List_Of_Moons.length; ag++) {
                if (ag === 0) {
                    temp_HTML_Text = temp_HTML_Text + '<tr><td onclick="set_HTML_For_Info_Panel(' + "'" + temp_List_Of_Moons[ag] + "'" + ", 'Moon', " + "'" + planet_Data[i].name + "'" + ')">Moons: ' + temp_List_Of_Moons[ag] + '</td></tr>';
                } else {
                    temp_HTML_Text = temp_HTML_Text + '<tr><td onclick="set_HTML_For_Info_Panel(' + "'" + temp_List_Of_Moons[ag] + "'" + ", 'Moon', " + "'" + planet_Data[i].name + "'" + ')">&emsp;&emsp;&emsp; ' + temp_List_Of_Moons[ag] + '</td></tr>';
                }
            }
        }
    }
    temp_HTML_Text = temp_HTML_Text + '</table>';
    document.getElementById("info_Panel").innerHTML = temp_HTML_Text;
    document.getElementById("info_Panel").style.display = "initial";
}

function Create_Ore_HTML_For_Info_Panal(i, body) {
    let t1o = [];
    let t2o = [];
    let t3o = [];
    let t4o = [];
    let t5o = [];
    if (body === "Moon") {
        t1o = moon_Data[i].t1ore;
        t2o = moon_Data[i].t2ore;
        t3o = moon_Data[i].t3ore;
        t4o = moon_Data[i].t4ore;
        t5o = moon_Data[i].t5ore;
    } else
    if (body === "Planet") {
        t1o = planet_Data[i].t1ore;
        t2o = planet_Data[i].t2ore;
        t3o = planet_Data[i].t3ore;
        t4o = planet_Data[i].t4ore;
        t5o = planet_Data[i].t5ore;
    }
    let temp_Ore_Text = "";
    let tier1ore = "";
    let tier2ore = "";
    let tier3ore = "";
    let tier4ore = "";
    let tier5ore = "";
    temp_Ore_Text = '<tr><td align="center">Ores:</td></tr>';
    for (let ah = 0; ah < t1o.length; ah++) {
        tier1ore = tier1ore +  t1o[ah] + ", ";
    }
    if (tier1ore.length > 2) {
        tier1ore = tier1ore.slice(0, -2);
    } else
    if (tier1ore.length === 0) {
        tier1ore = "none";
    }
    for (let aj = 0; aj < t2o.length; aj++) {
        tier2ore = tier2ore +  t2o[aj] + ", ";
    }
    if (tier2ore.length > 2) {
        tier2ore = tier2ore.slice(0, -2);
    } else
    if (tier2ore.length === 0) {
        tier2ore = "none";
    }
    for (let ak = 0; ak < t3o.length; ak++) {
        tier3ore = tier3ore +  t3o[ak] + ", ";
    }
    if (tier3ore.length > 2) {
        tier3ore = tier3ore.slice(0, -2);
    } else
    if (tier3ore.length === 0) {
        tier3ore = "none";
    }
    for (let al = 0; al < t4o.length; al++) {
        tier4ore = tier4ore +  t4o[al] + ", ";
    }
    if (tier4ore.length > 2) {
        tier4ore = tier4ore.slice(0, -2);
    } else
    if (tier4ore.length === 0) {
        tier4ore = "none";
    }
    for (let am = 0; am < t5o.length; am++) {
        tier5ore = tier5ore +  t5o[am] + ", ";
    }
    if (tier5ore.length > 2) {
        tier5ore = tier5ore.slice(0, -2);
    } else
    if (tier5ore.length === 0) {
        tier5ore = "none";
    }
    temp_Ore_Text = temp_Ore_Text + '<tr><td>t1: ' + tier1ore + '</td></tr>';
    temp_Ore_Text = temp_Ore_Text + '<tr><td>t2: ' + tier2ore + '</td></tr>';
    temp_Ore_Text = temp_Ore_Text + '<tr><td>t3: ' + tier3ore + '</td></tr>';
    temp_Ore_Text = temp_Ore_Text + '<tr><td>t4: ' + tier4ore + '</td></tr>';
    temp_Ore_Text = temp_Ore_Text + '<tr><td>t5: ' + tier5ore + '</td></tr>';
    temp_Ore_Text = temp_Ore_Text + '<tr><td><hr></td></tr>';
    return temp_Ore_Text;
}

function hide_Info_Panel() {
    document.getElementById("info_Panel").style.display = "none";
}

function orbitals_Visibility() {
    let temp_orbitDarkness_Value = document.getElementById("orbitals_Visibility");
    set_orbitVisibility(temp_orbitDarkness_Value.value);
}

function set_orbitVisibility(value) {
    ringTransparency = value * 0.01;
    newDatapoints_Orbit.selectAll("material").attr("transparency", ringTransparency);
}