// GLOBAL

// Global Scene view
// noinspection ES6ConvertVarToLetConst
let scene;

// Options (Do not edit these by hand!)
let hide_Orbitals = false;
let hide_Polyline = false;
let hide_Star = false;
let hide_Text = false;
let hide_Text_Time = false;
let hide_Text_Distance = false;
let hide_Text_Names = false;
let hide_Menu_Ores = true;
let hide_Menu_FlightInfo = true;
let hide_Menu_GeneralInfo = true;
let hide_Info_Panel = false;
let lock_Selection = false;

// Scaling
let scales = [];
const miniscale = 3000000;
const moonScaling = 100000;
const starScaling = 50000;
const planetScaling = 200000;	//was 1 million for all 3 scaling
const moon_Distance_Scale = 5; //how much the distance between the moon and planet is multiplied by
const centerLocation = [0/miniscale, 24000000/miniscale, 0/miniscale];
let mRadius;
let pRadius;

// Colors
const planetsDiffuse = "0 0 1";
const planetsEmissive = "0 0 0";

const moonDiffuse = "1 0 1";
const moonEmissive = "0 0 0";

const fuzzySpheresDiffuse = "0 0 0";
const fuzzySpheresEmissive = "0 1 0";
const fuzzySpheresTransparency = 0.95; // The transparency of those spheres

const ringDiffuse = "0 0 0";
let ringEmmissive = "0.05 0.05 0.05";
let ringTransparency = 0.4;

const starDiffuse = "0 0 0";
const starEmissive = "1 1 0";

const moonRingDiffuse = "0 0 0";
let moonRingEmmissive = "0.05 0.05 0.05";
let moonRingTransparency = 0.4;

const polylineDiffuse = "0 0 0";
const polylineEmissive = "1 0 0";
let polylineTransparency = 0.2;

// Camera
let cameraCenterOfRotation = [centerLocation[0], centerLocation[1], centerLocation[2]];
let cameraOrientation = [0.75363, -0.48068, -0.44833, 1.15527];
let cameraPosition = [-67.29499, -52.52143, 52.12010];

// Data
let planet_Data;
let moon_Data;
let orbit_Data;
let star_Data;
let ore_Selection_Data = [];

// Datapoints
let datapoints_Planet;
let newDatapoints_Planet;
let datapoints_PlanetSphere;
let newDatapoints_PlanetSphere;
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
let rows_MoonOrbit;
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
	if (event === "options adjust" && current_Planet === -1) {
		return "not set up";//just to prevent finishing function before id is assigned to current_Planet
	}
    let source = i;
    if (lock_Selection === false) {
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
    } else
    if (lock_Selection === true) {
    	if (current_Planet === -1) {
    	    //first selection
    	    current_Planet = i;
    	    set_Size_Of_Fuzz();
    	} else 
    	if (i != current_Planet) {
    	    //already had a selection
    	    previous_Planet = i;
    	    set_Size_Of_Fuzz();
    	}
    }

    let datalabels = scene.selectAll(".dynlabel").remove();

    let shapelabel = scene.selectAll(".dynshape");

    shapelabel.append("Text").attr("string", function(d,i) {
        let destination = i;
        if (planet_Data[destination].type === "Moon") {
            return;
        }
        if (planet_Data[destination].type === "Orbit") {
            return;
        }

        let distance = getDistanceBetween(planet_Data[current_Planet].name, planet_Data[destination].name);
        let seconds = getTimeFromDistance(distance);
        let estTime = new Date(seconds * 1000).toISOString().substr(11, 8);
        let labeldist = "";

        if (hide_Text_Names === false) {
        	labeldist = labeldist + '"' + planet_Data[i].name + '"';
        }
        if (hide_Text_Distance === false || hide_Text_Time === false || hide_Text_Names === false) {
        	labeldist = labeldist + '""' + '""';
    	}
        if (distance > 0) {
        	if (hide_Text_Distance === false) {
        		labeldist = labeldist + '"' + distance + ' SU"';
        	}
        	if (hide_Text_Time === false) {
        		labeldist = labeldist + '"Est: ' + estTime + '"';
        	}
        } else {
        	if (hide_Text_Distance === false || hide_Text_Time === false) {
            	labeldist = labeldist + '" You are HERE "';
            }
        }
        return labeldist;
    }).append("fontstyle").attr("family", "arial").attr("quality", "3").attr("size", "1.5");

    shapelabel.append("appearance").append("material").attr("diffuseColor", function(d, i) {
        if (current_Planet === i) {
        	set_HTML_For_Info_Panel(i, "Planet");//update the info panel before returning
            return "green";
        } else {
            return "white";
        }
    });
}

function mouseover(e, i) {
    document.getElementById("fuzzy_color_" + i).setAttribute('emissiveColor', '0 0 1');
    document.getElementById("orbit_Mats_" + i).setAttribute('emissiveColor', '0 0 1');
    //document.getElementById("dynlabel_color_" + i).setAttribute('diffuseColor', '0 0 1');
}

function mouseout(e, i) {
    document.getElementById("fuzzy_color_" + i).setAttribute('emissiveColor', fuzzySpheresEmissive);
    if (i === current_Planet) {
    	document.getElementById("orbit_Mats_" + i).setAttribute('emissiveColor', "0 1 0");
    } else {
    	document.getElementById("orbit_Mats_" + i).setAttribute('emissiveColor', ringEmmissive);
    }
    //document.getElementById("dynlabel_color_" + i).setAttribute('diffuseColor', '1 1 1');
}

function set_Size_Of_Fuzz() {
    document.getElementById("fuzzy_" + current_Planet).setAttribute('scale', '2 2 2');
    if (previous_Planet >= 0) {
        document.getElementById("fuzzy_" + previous_Planet).setAttribute('scale', '1 1 1');
        //calculate pos points for the two planets
        let p1 = planet_Data[current_Planet].pos[0]/miniscale + " " + planet_Data[current_Planet].pos[1]/miniscale + " " + planet_Data[current_Planet].pos[2]/miniscale;
        let p2 = planet_Data[previous_Planet].pos[0]/miniscale + " " + planet_Data[previous_Planet].pos[1]/miniscale + " " + planet_Data[previous_Planet].pos[2]/miniscale;
        document.getElementById("line_Between_Two").setAttribute('point', p1 + ", " + p2);
    	document.getElementById("orbit_Mats_" + previous_Planet).setAttribute('emissiveColor', ringEmmissive);
    }
    document.getElementById("orbit_Mats_" + current_Planet).setAttribute('emissiveColor', '0 1 0');
}

function highlight_ore(ore) {
	//unhighlight_ore();
	ore_Selection_Data.length = 0;
	for (let bb = 0; bb < planet_Data.length; bb++) {
		if (eval(planet_Data[bb].ore).hasOwnProperty(ore)) {
			ore_Selection_Data.push(bb);//push index value into array
		}
	}
	ore_Selection_Data.push("|");//seperate planets and moons
	for (let bc = 0; bc < moon_Data.length; bc++) {
		if (eval(moon_Data[bc].ore).hasOwnProperty(ore)) {
			ore_Selection_Data.push(bc);//push index value into array
		}
	}
	for (let be = 0; be < ore_Selection_Data.length; be++) {
		if (ore_Selection_Data[be] != "|") {
			document.getElementById("fuzzy_color_" + ore_Selection_Data[be]).setAttribute('emissiveColor', '1 1 0');
			document.getElementById("fuzzy_" + ore_Selection_Data[be]).setAttribute('scale', '3 3 3');
    		document.getElementById("orbit_Mats_" + ore_Selection_Data[be]).setAttribute('emissiveColor', '1 1 0');
		} else
		if (ore_Selection_Data[be] === "|") {
			break;//do moons later
		}
	}
}

function unhighlight_ore() {
	for (let bd = 0; bd < ore_Selection_Data.length; bd++) {
		if (ore_Selection_Data[bd] != "|") {
			document.getElementById("fuzzy_color_" + ore_Selection_Data[bd]).setAttribute('emissiveColor', fuzzySpheresEmissive);
			document.getElementById("fuzzy_" + ore_Selection_Data[bd]).setAttribute('scale', '1 1 1');
    		document.getElementById("orbit_Mats_" + ore_Selection_Data[bd]).setAttribute('emissiveColor', ringEmmissive);
		} else
		if (ore_Selection_Data[bd] === "|") {
			break;//do moons later
		}
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
    datapoints_Planet = scene.selectAll("datapoint_Planet").data(rows_Planet);
    datapoints_Planet.exit().remove();
    newDatapoints_Planet = datapoints_Planet.enter().append("transform").attr("id", function(d,i) { return "planet_" + i;}).attr("class", "datapoint").attr("scale", function(d,i) {
        pRadius = planet_Data[i].radius/planetScaling;
        return [pRadius, pRadius, pRadius];
    }).append("shape");
    newDatapoints_Planet.append("appearance").append("material").attr("diffuseColor", planetsDiffuse).attr("emissiveColor", planetsEmissive);
    newDatapoints_Planet.append("sphere");
    return newDatapoints_Planet;
}

// Generate our fuzzy sphere datapoints (clickable spheres)
function fuzzySphereDatapoints() {
    datapoints_PlanetSphere = scene.selectAll("datapoint_PlanetSphere").data(rows_Planet);
    datapoints_PlanetSphere.exit().remove();
    newDatapoints_PlanetSphere = datapoints_PlanetSphere.enter().append("transform").attr("id", function(d,i) { return "fuzzy_" + i;}).attr("class", "datatour").attr("scale", "1 1 1")
    	.append("shape").attr("onclick", function(d,i) { return "updateDistances(event,"+i+");"}).attr("onmouseover", function(d,i) { return "mouseover(event,"+i+");"})
    	.attr("onmouseout", function(d,i) { return "mouseout(event,"+i+");"});
    newDatapoints_PlanetSphere.append("appearance").append("material").attr("id", function(d,i) { return "fuzzy_color_" + i;})
    	.attr("diffuseColor", fuzzySpheresDiffuse).attr("emissiveColor", fuzzySpheresEmissive).attr("transparency", fuzzySpheresTransparency);
    newDatapoints_PlanetSphere.append("sphere");
    return newDatapoints_PlanetSphere;
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
    return newDatapoints_Moon;
}

// Generate the orbit datapoints
function orbitDatapoints() {
    datapoints_Orbit = scene.selectAll("datapoint_Orbit").data(rows_Orbit);
    datapoints_Orbit.exit().remove();
    newDatapoints_Orbit = datapoints_Orbit.enter().append("transform").attr("id", function(d,i) { return "orbit_" + i;}).attr("scale", function(d,i) {
        let oDistance = (orbit_Data[i].radius/miniscale);
        return [oDistance, oDistance, oDistance];
    }).attr("rotation", function(d,i) {
    	let rotate_Value = Math.atan(((planet_Data[i].pos[1] - centerLocation[1]) / (planet_Data[i].pos[0] - centerLocation[0])) / miniscale);
    	return ["0 0 1 " + rotate_Value];
    }).attr("class", "datapoint_Orbit").append("transform").attr("rotation", function(d,i) {
        let xmin = planet_Data[i].pos[0] / miniscale;
        let ymin = planet_Data[i].pos[1] / miniscale;
        let zmin = planet_Data[i].pos[2] / miniscale;
        let distance_Temp_Calc = Math.sqrt((xmin - centerLocation[0]) * (xmin - centerLocation[0]) + (ymin - centerLocation[1]) * (ymin - centerLocation[1]) + (zmin - centerLocation[2]) * (zmin - centerLocation[2]));
    	let temp_orbitMath = Math.asin((zmin - centerLocation[2]) / (distance_Temp_Calc));
    	if (planet_Data[i].pos[0] >= 0) {
    		temp_orbitMath = temp_orbitMath * -1;
    	} 
    	return ["0 1 0 " + temp_orbitMath];
    }).append("shape");
    newDatapoints_Orbit.append("appearance").append("material").attr("id", function(d,i) { return "orbit_Mats_" + i;}).attr("diffuseColor", ringDiffuse).attr("emissiveColor", ringEmmissive).attr("transparency", ringTransparency);
    newDatapoints_Orbit.append("circle2d");
    return newDatapoints_Orbit;
}

// Generate the orbit datapoints for moons
function moonOrbitDatapoints() {
    datapoints_MoonOrbit = scene.selectAll("datapoint_MoonOrbit").data(rows_MoonOrbit);
    datapoints_MoonOrbit.exit().remove();
    newDatapoints_MoonOrbit = datapoints_MoonOrbit.enter().append("transform").attr("id", function(d,i) { return "moonOrbit_" + i;}).attr("scale", function(d,i) {
    	let temp_Planet_ID;
    	for (let ar = 0; ar < planet_Data.length; ar++) {
    		if (planet_Data[ar].name === moon_Data[i].home) {
    			temp_Planet_ID = ar;
    			break;
    		}
    	}
        let oDistanceX = (moon_Data[i].pos[0] - planet_Data[temp_Planet_ID].pos[0]) / miniscale;
        let oDistanceY = (moon_Data[i].pos[1] - planet_Data[temp_Planet_ID].pos[1]) / miniscale;
        let oDistanceZ = (moon_Data[i].pos[2] - planet_Data[temp_Planet_ID].pos[2]) / miniscale;
        let temp_Distance_To_Planet = (Math.sqrt((oDistanceX)*(oDistanceX)+(oDistanceY)*(oDistanceY)+(oDistanceZ)*(oDistanceZ)));
        return [temp_Distance_To_Planet, temp_Distance_To_Planet, temp_Distance_To_Planet];
    }).attr("rotation", function(d,i) {
    	let temp_Planet_ID;
    	for (let ar = 0; ar < planet_Data.length; ar++) {
    		if (planet_Data[ar].name === moon_Data[i].home) {
    			temp_Planet_ID = ar;
    			break;
    		}
    	}
        let oDistanceX = (moon_Data[i].pos[0] - planet_Data[temp_Planet_ID].pos[0]) / miniscale;
        let oDistanceY = (moon_Data[i].pos[1] - planet_Data[temp_Planet_ID].pos[1]) / miniscale;
    	return ["0 0 1 " + Math.atan(oDistanceY/oDistanceX)]
    }).attr("class", "datapoint_MoonOrbit").append("transform").attr("rotation", function(d,i) {
    	let temp_Planet_ID;
    	for (let ar = 0; ar < planet_Data.length; ar++) {
    		if (planet_Data[ar].name === moon_Data[i].home) {
    			temp_Planet_ID = ar;
    			break;
    		}
    	}
        let oDistanceX = (moon_Data[i].pos[0] - planet_Data[temp_Planet_ID].pos[0]) / miniscale;
        let oDistanceY = (moon_Data[i].pos[1] - planet_Data[temp_Planet_ID].pos[1]) / miniscale;
        let oDistanceZ = (moon_Data[i].pos[2] - planet_Data[temp_Planet_ID].pos[2]) / miniscale;
        let temp_Distance_To_Planet = (Math.sqrt((oDistanceX)*(oDistanceX)+(oDistanceY)*(oDistanceY)+(oDistanceZ)*(oDistanceZ)));
    	let temp_orbitMath = Math.asin((oDistanceZ / (temp_Distance_To_Planet)));
    	if (moon_Data[i].pos[0] >= 0) {
    		temp_orbitMath = temp_orbitMath * -1;
    	} 
    	return ["0 1 0 " + temp_orbitMath];
    }).append("shape");
    newDatapoints_MoonOrbit.append("appearance").append("material").attr("id", function(d,i) { return "moonOrbit_Mats_" + i;})
    	.attr("diffuseColor", moonRingDiffuse).attr("emissiveColor", moonRingEmmissive).attr("transparency", 1);
    newDatapoints_MoonOrbit.append("circle2d");
    return newDatapoints_MoonOrbit;
}

// Generate our star datapoint
function starDatapoint() {
    datapoints_Star = scene.selectAll("datapoint_Star").data(rows_Star);
    datapoints_Star.exit().remove();
    newDatapoints_Star = datapoints_Star.enter().append("transform").attr("id", "star_0").attr("class", "datapoint_Star")
    	.attr("scale", [star_Data[0].radius/starScaling, star_Data[0].radius/starScaling, star_Data[0].radius/starScaling]).append("shape");
    newDatapoints_Star.append("appearance").append("material").attr("diffuseColor", starDiffuse).attr("emissiveColor", starEmissive);
    newDatapoints_Star.append("sphere");
    return newDatapoints_Star
}

// Generate the polyline datapoints
function polylineDatapoints() {
    datapoints_Polyline = scene.selectAll("datapoint_Polyline").data("0");
    datapoints_Polyline.exit().remove();
    newDatapoints_Polyline = datapoints_Polyline.enter().append("transform").attr("class", "datapoint_Polyline").attr("id", "datapoint_Polyline_Coord").append("shape");
    newDatapoints_Polyline.append("appearance").append("material").attr("diffuseColor", polylineDiffuse).attr("emissiveColor", polylineEmissive).attr("transparency", polylineTransparency);
    newDatapoints_Polyline.append("IndexedLineSet").attr("coordIndex", "0 1 -1").append("Coordinate").attr("id", "line_Between_Two").attr("point", "0 8 0, 0 8 0");
    return newDatapoints_Polyline;
}

// Generate initial labels for planets
function generateLabels(){
    let datalabels = scene.selectAll("datalabel").data(rows_Planet);

    datalabels.exit().remove();

    let shapelabel = datalabels.enter().append("transform").attr("class", "datalabel").attr("scale", "0.75 0.75 0.75")
        .append("billboard").attr("render", 'true').attr("axisOfRotation", '0,0,0')
        .append("shape") .attr("class", 'dynshape');

    shapelabel.append("Text")
        .attr("string", function(d,i) {
            if (planet_Data[i].type === "Moon") {
                return "";
            } else if (planet_Data[i].type === "Planet") {
                return '"' + planet_Data[i].name + '"' + '""' + '""' + '""';
            }
        })
        .attr("id", function(d,i) { return 'dynlabel_' + i}).attr("class", 'dynlabel')
        .append("fontstyle").attr("family", "arial").attr("quality", "3").attr("size", "1.5");
    shapelabel.append("appearance").attr("id", function(d,i) { return 'dynlabel_color_' + i}).append("material").attr("diffuseColor", "1 1 1");

    return datalabels;
}

// Plot Translations
function plotTranslation(duration, planets, fuzzy, moons, orbits, star, labels, polyline, moonOrbits) {
    let tranpoints = planets.transition();
    let trantours =	fuzzy.transition();
    let tranpoints_Moon = moons.transition();
    let tranpoints_Orbit = orbits.transition();
    let tranpoints_Star = star.transition();
    let tranpoints_Polyline = polyline.transition();
    let tranpoints_MoonOrbits = moonOrbits.transition();
    let tranlabels = labels.transition();

    tranpoints.ease(ease).duration(duration).attr("translation", function(row) {
        return row[0] + ", " + row[1] + ", " + row[2]});

    trantours.ease(ease).duration(duration).attr("translation", function(row) {
        return row[0] + ", " + row[1] + ", " + row[2]});

    tranpoints_Moon.ease(ease).duration(duration).attr("translation", function(row) {
        return row[0] + ", " + row[1] + ", " + row[2]});

    tranpoints_Orbit.ease(ease).duration(duration).attr("translation", function(row) {
        return row[0] + ", " + row[1] + ", " + row[2]});

    tranpoints_Star.ease(ease).duration(duration).attr("translation", function(row) {
        return row[0] + ", " + row[1] + ", " + row[2]});

    tranlabels.ease(ease).duration(duration).attr("translation", function(row) {
        return row[0] + ", " + row[1] + ", " + row[2]});

    tranpoints_Polyline.ease(ease).duration(duration).attr("translation", function(row) {
        return row[0] + ", " + row[1] + ", " + row[2]});

    tranpoints_MoonOrbits.ease(ease).duration(duration).attr("translation", function(row) {
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

    //moon orbits
    newDatapoints_MoonOrbit = moonOrbitDatapoints();

    //labels and other stuff like that
    datalabels = generateLabels();

    // Translation
    plotTranslation(duration, datapoints_Planet, datapoints_PlanetSphere, datapoints_Moon, datapoints_Orbit, datapoints_Star, datalabels, datapoints_Polyline, datapoints_MoonOrbit);
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
        let little_Orbit = [centerLocation[0], centerLocation[1], centerLocation[2], "Orbit"];
        coords_Orbit.push(little_Orbit);
    }
    return coords_Orbit;
}

function initializeDataGrid_MoonOrbit() {
    let coords_MoonOrbit = [];
    for (let ac = 0; ac < moon_Data.length; ac++) {
    	//get coords of home planet
    	for (let aq = 0; aq < planet_Data.length; aq++) {
    		if (planet_Data[aq].name === moon_Data[ac].home) {
    			//match
                let little_Orbit = [(planet_Data[aq].pos[0] / miniscale), (planet_Data[aq].pos[1] / miniscale), (planet_Data[aq].pos[2] / miniscale), "MoonOrbit"];
                coords_MoonOrbit.push(little_Orbit);
                break;
    		}
    	}
    }
    return coords_MoonOrbit;
}

function initializeDataGrid_Star() {
    return [[centerLocation[0], centerLocation[1], centerLocation[2], "Star"]];
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
    rows_MoonOrbit = initializeDataGrid_MoonOrbit(); //moon orbit data
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
        newDatapoints_Orbit.selectAll("material").attr("transparency", 1);
    }
    if (temp_Checkbox_Value.checked === false) {
        hide_Orbitals = false;
        newDatapoints_Orbit.selectAll("material").attr("transparency", ringTransparency);
    }
}

function polyline_Check() {
    let temp_Checkbox_Value = document.getElementById("polyline_Checkbox");
    if (temp_Checkbox_Value.checked === true) {
        hide_Polyline = true;
        newDatapoints_Polyline.selectAll("material").attr("transparency", 1);
    }
    if (temp_Checkbox_Value.checked === false) {
        hide_Polyline = false;
        newDatapoints_Polyline.selectAll("material").attr("transparency", polylineTransparency);
    }
}

function star_Check() {
    let temp_Checkbox_Value = document.getElementById("star_Checkbox");
    if (temp_Checkbox_Value.checked === true) {
        hide_Star = true;
        newDatapoints_Star.selectAll("material").attr("transparency", 1);
    }
    if (temp_Checkbox_Value.checked === false) {
        hide_Star = false;
        newDatapoints_Star.selectAll("material").attr("transparency", 0);
    }
}

function text_Check() {
    let temp_Checkbox_Value = document.getElementById("text_Checkbox");
    if (temp_Checkbox_Value.checked === true) {
        hide_Text = true;
        datalabels.selectAll("billboard").attr("render", false);
    	hide_Text_Names = true;
    	hide_Text_Distance = true;
    	hide_Text_Time = true;
    	document.getElementById("text_Names_Checkbox").checked = true;
    	document.getElementById("text_Distance_Checkbox").checked = true;
    	document.getElementById("text_Time_Checkbox").checked = true;
    }
    if (temp_Checkbox_Value.checked === false) {
        hide_Text = false;
        datalabels.selectAll("billboard").attr("render", true);
    }
    updateDistances("options adjust", current_Planet);
}

function text_Names_Check() {
    let temp_Checkbox_Value = document.getElementById("text_Names_Checkbox");
    if (temp_Checkbox_Value.checked === true) {
        hide_Text_Names = true;
    }
    if (temp_Checkbox_Value.checked === false) {
        if (document.getElementById("text_Checkbox").checked === true) {
        	//hide all is checked so deny unchecking.
        	document.getElementById("text_Names_Checkbox").checked = true;
        } else {
        	hide_Text_Names = false;
        }
    }
    updateDistances("options adjust", current_Planet);
}

function text_Distance_Check() {
    let temp_Checkbox_Value = document.getElementById("text_Distance_Checkbox");
    if (temp_Checkbox_Value.checked === true) {
        hide_Text_Distance = true;
    }
    if (temp_Checkbox_Value.checked === false) {
        if (document.getElementById("text_Checkbox").checked === true) {
        	//hide all is checked so deny unchecking.
        	document.getElementById("text_Distance_Checkbox").checked = true;
        } else {
        	hide_Text_Distance = false;
        }
    }
    updateDistances("options adjust", current_Planet);
}

function text_Time_Check() {
    let temp_Checkbox_Value = document.getElementById("text_Time_Checkbox");
    if (temp_Checkbox_Value.checked === true) {
        hide_Text_Time = true;
    }
    if (temp_Checkbox_Value.checked === false) {
        if (document.getElementById("text_Checkbox").checked === true) {
        	//hide all is checked so deny unchecking.
        	document.getElementById("text_Time_Checkbox").checked = true;
        } else {
        	hide_Text_Time = false;
        }
    }
    updateDistances("options adjust", current_Planet);
}

function lock_Selection_Check() {
    let temp_Checkbox_Value = document.getElementById("lock_Planet_Checkbox");
    if (temp_Checkbox_Value.checked === true) {
        lock_Selection = true;
    }
    if (temp_Checkbox_Value.checked === false) {
        lock_Selection = false;
    }
}

function info_Panel_Check() {
    let temp_Checkbox_Value = document.getElementById("hide_Info_Panel_Checkbox");
    if (temp_Checkbox_Value.checked === true) {
        hide_Info_Panel = true;
        document.getElementById("info_Panel").style.display = "none";
    }
    if (temp_Checkbox_Value.checked === false) {
        hide_Info_Panel = false;
        document.getElementById("info_Panel").style.display = "initial";
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
        temp_HTML_Text = '<!--suppress ALL --><table width="300"><tr><th>' + planet_Data[i].name + '<span id="Exit_Button" onclick="minimize_Info_Panel()">X</span></th></tr>';
        temp_HTML_Text = temp_HTML_Text + '<tr><td><hr></td></tr>';
        temp_HTML_Text = temp_HTML_Text + '<tr><td>' + planet_Data[i].description + '</td></tr>';
        temp_HTML_Text = temp_HTML_Text + '<tr><td><hr></td></tr>';
        if (hide_Menu_FlightInfo === false) {
            temp_HTML_Text = temp_HTML_Text + '<tr><td align="center">Flight Information<span id="Exit_Button" onclick="hide_Menu_Flight(' + i + ', ' + "'" + body + "'" + ', ' + "'" + home + "'" + ')">▲</span></td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Atmosphere: ' + planet_Data[i].atmosphere + '</td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Atmos Engine Max: ' + planet_Data[i].atmosEngineMax + '</td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Space Engine Min: ' + planet_Data[i].spaceEngineMin + '</td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Engine Buffer Zone: ' + (planet_Data[i].spaceEngineMin-planet_Data[i].atmosEngineMax) + '</td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Surface Altitude: ' + planet_Data[i].generalSurfaceAltitude + '</td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Gravity: ' + planet_Data[i].gravity + '</td></tr>';
            if (previous_Planet >= 0) {
                let tempDistance =  getDistanceBetween(planet_Data[previous_Planet].name, planet_Data[i].name);
                temp_HTML_Text = temp_HTML_Text + '<tr><td>Distance to <span class="link" onclick="updateDistances(event, ' + previous_Planet + ');">';
                temp_HTML_Text = temp_HTML_Text + planet_Data[previous_Planet].name + '</span>: ' + tempDistance + ' SU</td></tr>';
            }
            temp_HTML_Text = temp_HTML_Text + '<tr><td><hr></td></tr>';
        } else {
            temp_HTML_Text = temp_HTML_Text + '<tr><td align="center">Flight Information<span id="Exit_Button" onclick="hide_Menu_Flight(' + i + ', ' + "'" + body + "'" + ', ' + "'" + home + "'" + ')">▼</span></td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td><hr></td></tr>';
        }

        if (hide_Menu_GeneralInfo === false) {
            temp_HTML_Text = temp_HTML_Text + '<tr><td align="center">General Information<span id="Exit_Button" onclick="hide_Menu_General(' + i + ', ' + "'" + body + "'" + ', ' + "'" + home + "'" + ')">▲</span></td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Class: ' + planet_Data[i].class + '</td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>System/Zone: ' + planet_Data[i].system_zone + '</td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Surface Area: ' + planet_Data[i].surface_area + '</td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Satellites: ' + planet_Data[i].satellites + '</td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Biosphere: ' + planet_Data[i].biosphere + '</td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Territories: ' + planet_Data[i].territories + '</td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Territories Claimed: ' + planet_Data[i].territories_claimed + '</td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Terra Nullius: ' + planet_Data[i].terra_nullius + '</td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td><hr></td></tr>';

        } else {
            temp_HTML_Text = temp_HTML_Text + '<tr><td align="center">General Information<span id="Exit_Button" onclick="hide_Menu_General(' + i + ', ' + "'" + body + "'" + ', ' + "'" + home + "'" + ')">▼</span></td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td><hr></td></tr>';
        }

        //temp_HTML_Text = temp_HTML_Text + '<tr><td>Orbit distance: ' + orbit_Data[i].radius + '</td></tr>';

    } else
    if (body === "Moon") {
        let planetid = 0;
        for (let ao = 0; ao < planet_Data.length; ao++) {
            if (planet_Data[ao].name === home) {
                planetid = ao;
                break;
            }
        }
        temp_HTML_Text = '<!--suppress ALL --><table width="300"><tr><th>' + moon_Data[i].name + ' of <span class="link" onclick="set_HTML_For_Info_Panel(' + planetid;
        temp_HTML_Text = temp_HTML_Text + ', ' + "'Planet'" + ')">' + home + '</span><span id="Exit_Button" onclick="minimize_Info_Panel()">X</span></th></tr>';
        temp_HTML_Text = temp_HTML_Text + '<tr><td><hr></td></tr>';
        if (hide_Menu_FlightInfo === false) {
            temp_HTML_Text = temp_HTML_Text + '<tr><td align="center">Flight Information<span id="Exit_Button" onclick="hide_Menu_Flight(' + i + ', ' + "'" + body + "'" + ', ' + "'" + home + "'" + ')">▲</span></td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Atmosphere: ' + moon_Data[i].atmosphere + '</td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Gravity: ' + moon_Data[i].gravity + '</td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td><hr></td></tr>';

        } else {
            temp_HTML_Text = temp_HTML_Text + '<tr><td align="center">Flight Information<span id="Exit_Button" onclick="hide_Menu_Flight(' + i + ', ' + "'" + body + "'" + ', ' + "'" + home + "'" + ')">▼</span></td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td><hr></td></tr>';
        }
        if (hide_Menu_GeneralInfo === false) {
            temp_HTML_Text = temp_HTML_Text + '<tr><td align="center">General Information<span id="Exit_Button" onclick="hide_Menu_General(' + i + ', ' + "'" + body + "'" + ', ' + "'" + home + "'" + ')">▲</span></td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Surface Area: ' + moon_Data[i].surface_area + '</td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Biosphere: ' + moon_Data[i].biosphere + '</td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Territories: ' + moon_Data[i].territories + '</td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Territories Claimed: ' + moon_Data[i].territories_claimed + '</td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Terra Nullius: ' + moon_Data[i].terra_nullius + '</td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td><hr></td></tr>';

        }
        else {
            temp_HTML_Text = temp_HTML_Text + '<tr><td align="center">General Information<span id="Exit_Button" onclick="hide_Menu_General(' + i + ', ' + "'" + body + "'" + ', ' + "'" + home + "'" + ')">▼</span></td></tr>';
            temp_HTML_Text = temp_HTML_Text + '<tr><td><hr></td></tr>';
        }
    }
    //temp_HTML_Text = temp_HTML_Text + '<tr><td><hr></td></tr>';
    if (body === "Moon") {
        temp_HTML_Text = temp_HTML_Text + Create_Ore_HTML_For_Info_Panel(i, "Moon", home);//adds ore html
    } else {
        temp_HTML_Text = temp_HTML_Text + Create_Ore_HTML_For_Info_Panel(i, "Planet", home);//adds ore html
    }
    if (body === "Planet") {
        if (temp_List_Of_Moons.length === 0) {
            temp_HTML_Text = temp_HTML_Text + '<tr><td>Moons: none</td></tr>';
        } else {
            for (let ag = 0; ag < temp_List_Of_Moons.length; ag++) {
                if (ag === 0) {
                    temp_HTML_Text = temp_HTML_Text + '<tr><td onclick="set_HTML_For_Info_Panel(' + "'" + temp_List_Of_Moons[ag] + "'" + ", 'Moon', " + "'" + planet_Data[i].name;
                    temp_HTML_Text = temp_HTML_Text + "'" + ')">Moons: <span class="link">' + temp_List_Of_Moons[ag] + '</span></td></tr>';
                } else {
                    temp_HTML_Text = temp_HTML_Text + '<tr><td onclick="set_HTML_For_Info_Panel(' + "'" + temp_List_Of_Moons[ag] + "'" + ", 'Moon', " + "'" + planet_Data[i].name;
                    temp_HTML_Text = temp_HTML_Text + "'" + ')">&emsp;&emsp;&emsp; <span class="link">' + temp_List_Of_Moons[ag] + '</span></td></tr>';
                }
            }
        }
    }
    temp_HTML_Text = temp_HTML_Text + '</table>';
    document.getElementById("info_Panel").innerHTML = temp_HTML_Text;
    if (hide_Info_Panel === false) {
    	document.getElementById("info_Panel").style.display = "initial";
	}
}

function Create_Ore_HTML_For_Info_Panel(i, body, home) {
    let temp_Ore_Text = "";
	if (hide_Menu_Ores === false) {
    	let oreobj;
    	if (body === "Moon") {
    		oreobj = moon_Data[i].ore;
    	} else
    	if (body === "Planet") {
    		oreobj = planet_Data[i].ore;
    	}
    	temp_Ore_Text = '<tr><td align="center">Ores<span id="Exit_Button" onclick="hide_Menu_Ore(' + i + ', ' + "'" + body + "'" + ', ' + "'" + home + "'" + ')">▲</span></td></tr>';
    	if (eval(oreobj).hasOwnProperty("Sodium")) {
    		temp_Ore_Text = temp_Ore_Text + '<tr><td>t1:Sodium ' + oreobj.Sodium + '</td></tr>';
    	}
    	if (eval(oreobj).hasOwnProperty("Carbon")) {
    		temp_Ore_Text = temp_Ore_Text + '<tr><td>t1:Carbon ' + oreobj.Carbon + '</td></tr>';
    	}
    	if (eval(oreobj).hasOwnProperty("Silicon")) {
    		temp_Ore_Text = temp_Ore_Text + '<tr><td>t1:Silicon ' + oreobj.Silicon + '</td></tr>';
    	}
    	if (eval(oreobj).hasOwnProperty("Iron")) {
    		temp_Ore_Text = temp_Ore_Text + '<tr><td>t1:Iron ' + oreobj.Iron + '</td></tr>';
    	}

    	if (eval(oreobj).hasOwnProperty("Aluminium")) {
    		temp_Ore_Text = temp_Ore_Text + '<tr><td>t2:Aluminium ' + oreobj.Aluminium + '</td></tr>';
    	}
    	if (eval(oreobj).hasOwnProperty("Nickel")) {
    		temp_Ore_Text = temp_Ore_Text + '<tr><td>t2:Nickel ' + oreobj.Nickel + '</td></tr>';
    	}
    	if (eval(oreobj).hasOwnProperty("Lead")) {
    		temp_Ore_Text = temp_Ore_Text + '<tr><td>t2:Lead ' + oreobj.Lead + '</td></tr>';
    	}
    	if (eval(oreobj).hasOwnProperty("Tungsten")) {
    		temp_Ore_Text = temp_Ore_Text + '<tr><td>t2:Tungsten ' + oreobj.Tungsten + '</td></tr>';
    	}

    	if (eval(oreobj).hasOwnProperty("Scandium")) {
    		temp_Ore_Text = temp_Ore_Text + '<tr><td>t3:Scandium ' + oreobj.Scandium + '</td></tr>';
    	}
    	if (eval(oreobj).hasOwnProperty("Chromium")) {
    		temp_Ore_Text = temp_Ore_Text + '<tr><td>t3:Chromium ' + oreobj.Chromium + '</td></tr>';
    	}
    	if (eval(oreobj).hasOwnProperty("Copper")) {
    		temp_Ore_Text = temp_Ore_Text + '<tr><td>t3:Copper ' + oreobj.Copper + '</td></tr>';
    	}
    	if (eval(oreobj).hasOwnProperty("Platinum")) {
    		temp_Ore_Text = temp_Ore_Text + '<tr><td>t3:Platinum ' + oreobj.Platinum + '</td></tr>';
    	}

    	if (eval(oreobj).hasOwnProperty("Zirconium")) {
    		temp_Ore_Text = temp_Ore_Text + '<tr><td>t4:Zirconium ' + oreobj.Zirconium + '</td></tr>';
    	}
    	if (eval(oreobj).hasOwnProperty("Manganese")) {
    		temp_Ore_Text = temp_Ore_Text + '<tr><td>t4:Manganese ' + oreobj.Manganese + '</td></tr>';
    	}
    	if (eval(oreobj).hasOwnProperty("Molybdenum")) {
    		temp_Ore_Text = temp_Ore_Text + '<tr><td>t4:Molybdenum ' + oreobj.Molybdenum + '</td></tr>';
    	}
    	if (eval(oreobj).hasOwnProperty("Gold")) {
    		temp_Ore_Text = temp_Ore_Text + '<tr><td>t4:Gold ' + oreobj.Gold + '</td></tr>';
    	}

    	if (eval(oreobj).hasOwnProperty("Titanium")) {
    		temp_Ore_Text = temp_Ore_Text + '<tr><td>t5:Titanium ' + oreobj.Titanium + '</td></tr>';
    	}
    	if (eval(oreobj).hasOwnProperty("Vanadium")) {
    		temp_Ore_Text = temp_Ore_Text + '<tr><td>t5:Vanadium ' + oreobj.Vanadium + '</td></tr>';
    	}
    	if (eval(oreobj).hasOwnProperty("Niobium")) {
    		temp_Ore_Text = temp_Ore_Text + '<tr><td>t5:Niobium ' + oreobj.Niobium + '</td></tr>';
    	}
    	if (eval(oreobj).hasOwnProperty("Rhenium")) {
    		temp_Ore_Text = temp_Ore_Text + '<tr><td>t5:Rhenium ' + oreobj.Rhenium + '</td></tr>';
    	}
    	temp_Ore_Text = temp_Ore_Text + '<tr><td><hr></td></tr>';
    } else {
    	temp_Ore_Text = temp_Ore_Text + '<tr><td align="center">Ores<span id="Exit_Button" onclick="hide_Menu_Ore(' + i + ', ' + "'" + body + "'" + ', ' + "'" + home + "'" + ')">▼</span></td></tr>';
    	temp_Ore_Text = temp_Ore_Text + '<tr><td><hr></td></tr>';
    }
    return temp_Ore_Text;
}

function hide_Menu_Ore(i, body, home) {
	if (hide_Menu_Ores === false) {
		hide_Menu_Ores = true;
	} else {
		hide_Menu_Ores = false;
	}
	if (body === "Moon") {
		i = moon_Data[i].name;
	}
	set_HTML_For_Info_Panel(i, body, home);
}


function hide_Menu_Flight(i, body, home) {
    if (hide_Menu_FlightInfo === false) {
        hide_Menu_FlightInfo = true;
    } else {
        hide_Menu_FlightInfo = false;
    }
    if (body === "Moon") {
        i = moon_Data[i].name;
    }
    set_HTML_For_Info_Panel(i, body, home);
}

function hide_Menu_General(i, body, home) {
    if (hide_Menu_GeneralInfo === false) {
        hide_Menu_GeneralInfo = true;
    } else {
        hide_Menu_GeneralInfo = false;
    }
    if (body === "Moon") {
        i = moon_Data[i].name;
    }
    set_HTML_For_Info_Panel(i, body, home);
}

function minimize_Info_Panel() {
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