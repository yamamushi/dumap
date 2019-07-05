
/*	██████╗ ██████╗ ██╗   ██╗███████╗████████╗██╗ ██████╗ ███╗   ██╗
	██╔══██╗██╔══██╗╚██╗ ██╔╝██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
	██║  ██║██████╔╝ ╚████╔╝ ███████╗   ██║   ██║██║   ██║██╔██╗ ██║
	██║  ██║██╔══██╗  ╚██╔╝  ╚════██║   ██║   ██║██║   ██║██║╚██╗██║
	██████╔╝██║  ██║   ██║   ███████║   ██║   ██║╚██████╔╝██║ ╚████║
	╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
	██╗    ██╗ █████╗ ███████╗    ██╗  ██╗███████╗██████╗ ███████╗██╗
	██║    ██║██╔══██╗██╔════╝    ██║  ██║██╔════╝██╔══██╗██╔════╝██║
	██║ █╗ ██║███████║███████╗    ███████║█████╗  ██████╔╝█████╗  ██║
	██║███╗██║██╔══██║╚════██║    ██╔══██║██╔══╝  ██╔══██╗██╔══╝  ╚═╝
	╚███╔███╔╝██║  ██║███████║    ██║  ██║███████╗██║  ██║███████╗██╗
	 ╚══╝╚══╝ ╚═╝  ╚═╝╚══════╝    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝
	 ANSAI shadow font by http://patorjk.com/software/taag/			*/

var selected_Part = "";

var empty_Inventory_String = "Nothing in inventory";
var empty_Que_String = "Nothing in que";
var empty_BP_String = "You currently have no blueprints";

var que_Array = [];
que_Array[0] = empty_Que_String;

var inventory_Array = [];
inventory_Array[0] = empty_Inventory_String;

var BP_Array = [];
BP_Array[0] = empty_BP_String;
//for now will use single array, first value will be a name, 2nd value will be a condensed string of all materials added togather with their values
//will need to encode when made and decode when used.

var item_Selection_Location = 0;
var item_Selection_Back_Forward = [];
var item_Selection_Back_Forward_BP = [];
var item_Selection_Back_Forward_Index = [];

var use_Local_Storage = true;	//change to false to not use local storage
var shift_Que_Instead_Of_Swap = false;
var text_Overwrite_Append = false;	// true to overwrite, false to append
var show_Only_Craftable = false;
var inventory_Only_Que = false;
var prerequisites_Que = false;
var prerequisites_Rounded_Que = false;
var is_BP_Selected = false;
var do_Not_Add_Pures_Que = false;
var use_Ores = false;

var inventory_Size = 4000;

var drag_Loc_From = -1;
var drag_Loc_To = -1;

var error_Code = "Error: none";
var error_Code_Array = [];

var text_Red = "255";
var text_Green = "255";
var text_Blue = "255";

var text_BG_Red = "255";
var text_BG_Green = "255";
var text_BG_Blue = "255";

var SVGminus_Partial = ' WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right"><line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:2" /></SVG>';
var SVGplus_Partial = ' WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right"><line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:2" /><line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:2" /></SVG>';

var SVGminus = '<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right"><line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:2" /></SVG>';
var SVGplus = '<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right"><line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:2" /><line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:2" /></SVG>';
var SVGgear = '<SVG WIDTH="12" HEIGHT="12"><line x1="2" y1="2" x2="10" y2="10" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:2" /><line x1="10" y1="2" x2="2" y2="10" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:2" /><line x1="1" y1="6" x2="11" y2="6" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:2" /><line x1="6" y1="1" x2="6" y2="11" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:2" /><circle cx="6" cy="6" r="3" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+')" /></SVG>';
var SVGdrag = ' WIDTH="16" HEIGHT="24"><polygon points="3,5 7,1 8,1 12,5" shape-rendering="crispEdges" style="fill:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:0" /><polygon points="3,18 7,22 8,22 12,18" shape-rendering="crispEdges" style="fill:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:0" /><circle cx="8" cy="12" r="3" style="fill:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:0" /></SVG>';

var search_Terms = ["Functional Part 1 XS", "Functional Part 1 S", "Functional Part 1 M", "Functional Part 1 L", "Functional Part 1 XL", "Functional Part 2 XS", "Functional Part 2 S", "Functional Part 2 M", "Functional Part 2 L", "Functional Part 2 XL", "Functional Part 3 XS", "Functional Part 3 S", "Functional Part 3 M", "Functional Part 3 L", "Functional Part 3 XL", "Functional Part 4 XS", "Functional Part 4 S", "Functional Part 4 M", "Functional Part 4 L", "Functional Part 4 XL", "Functional Part 5 XS", "Functional Part 5 S", "Functional Part 5 M", "Functional Part 5 L", "Functional Part 5 XL", "Execptional Part 3", "Execptional Part 4", "Execptional Part 5", "Complex Part 1", "Complex Part 2", "Complex Part 3", "Complex Part 4", "Complex Part 5", "Structural Part 1 XS", "Structural Part 1 S", "Structural Part 1 M", "Structural Part 1 L", "Structural Part 1 XL", "Structural Part 2 XS", "Structural Part 2 S", "Structural Part 2 M", "Structural Part 2 L", "Structural Part 2 XL", "Structural Part 3 XS", "Structural Part 3 S", "Structural Part 3 M", "Structural Part 3 L", "Structural Part 3 XL", "Structural Part 4 XS", "Structural Part 4 S", "Structural Part 4 M", "Structural Part 4 L", "Structural Part 4 XL", "Structural Part 5 XS", "Structural Part 5 S", "Structural Part 5 M", "Structural Part 5 L", "Structural Part 5 XL", "Intermediary Part 1", "Intermediary Part 2", "Intermediary Part 3", "Dynamic Core XS", "Dynamic Core S", "Dynamic Core M", "Dynamic Core L", "Static Core XS", "Static Core S", "Static Core M", "Static Core L", "Deployable Light Orb", "Resurrection Node", "Office Chair", "Navigator Chair", "Encampment Chair", "Stabilizer S", "Stabilizer M", "Stabilizer L", "Long Light XS", "Long Light S", "Long Light M M", "Long Light L L", "Square Light XS", "Square Light S", "Square Light M", "Square Light L", "Headlight", "Vertical Light XS", "Vertical Light S", "Vertical Light L", "Vertical Light M M", "AntiGravity Pulsor", "Retro Rocket Brake S", "Retro Rocket Brake M", "Retro Rocket Brake L", "Atmospheric Airbrake S", "Atmospheric Airbrake M", "Atmospheric Airbrake L", "Compact Aileron S", "Compact Aileron M", "Compact Aileron L", "Aileron S", "Aileron M", "Aileron L", "Atmospheric Engine XS", "Atmospheric Engine S", "Atmospheric Engine M", "Atmospheric Engine L", "Space Engine XS", "Space Engine S", "Space Engine M", "Space Engine L", "Space Engine XL", "Hover Engine S", "Hover Engine M", "Hover Engine L", "Flat Hover Engine L", "Adjustor XS", "Adjustor S", "Adjustor M", "Adjustor L", "Rocket Engine S", "Rocket Engine M", "Rocket Engine L", "Vertical Booster XS", "Vertical Booster S", "Vertical Booster M", "Vertical Booster L", "Territory Scanner", "Gyroscope", "Telemeter", "Anti Gravity Generator S", "Anti Gravity Generator M", "Anti Gravity Generator L", "AND Operator", "Receiver XS", "Receiver S", "Receiver M", "OR Operator", "Relay", "Databank", "Infra Red Laser Emitter", "Laser Emitter", "Counter 2", "Counter 3", "Counter 5", "Counter 7", "Counter 10", "Delay Line", "Emitter XS", "Emitter S", "Emitter M", "NOT Operator", "Radar S", "Radar M", "Radar L", "Manual Switch", "Pressure Tile", "Manual Button XS", "Manual Button S", "Laser Receiver", "Infra Red Laser Receiver", "Detection Zone XS", "Detection Zone S", "Detection Zone M", "Detection Zone L", "Steel Column", "Steel Panel", "Hull Decorative Element A", "Hull Decorative Element B", "Hull Decorative Element C", "Barrier Corner", "Barrier S", "Barrier M", "Wing XS", "Wing S", "Wing M", "Wing L", "Wing Tip S", "Wing Tip M", "Wing Tip L", "Vertical Wing", "Keyboard Unit", "Spaceship Hologram S", "Spaceship Hologram M", "Spaceship Hologram L", "Planet Hologram", "Planet Hologram L", "Window XS", "Window S", "Window M", "Window L", "Armored Window XS", "Armored Window S", "Armored Window M", "Armored Window L", "Bay Window XL", "Glass Panel S", "Glass Panel M", "Glass Panel L", "Cable Model A M", "Cable Model B M", "Cable Model C M", "Cable Model A S", "Cable Model B S", "Cable Model C S", "Corner Cable Model A", "Corner Cable Model B", "Corner Cable Model C", "Antenna S", "Antenna M", "Antenna L", "Plant", "Plant Case A", "Plant Case B", "Plant Case C", "Plant Case D", "Plant Case E", "Suspended Fruit Plant", "Suspended Plant A", "Suspended Plant B", "Bagged Plant A", "Bagged Plant B", "Bonsai", "Eggplant Plant Case", "Salad Plant Case", "Plant Case M", "Squash Plant Case", "Plant Case S", "Ficus Plant A", "Ficus Plant B", "Foliage Plant Case A", "Foliage Plant Case B", "Dresser", "Bench", "Wooden Low Table", "Sofa", "Wooden Wardrobe", "Table", "Trash", "Wooden Sofa", "Nightstand", "Wardrobe", "Wooden Chair", "HMS Ajax33 Artist Unknown", "Parrotos Sanctuary Artist Unknown", "Eye Dolls Workshop Artist Unkown", "Wooden Armchair", "Round Carpet", "Square Carpet", "Wooden Dresser", "Wooden Table M", "Wooden Table L", "Shelf Empty", "Shelf Half Full", "Shelf Full", "Bed", "Pipe D M", "Pipe Corner M", "Pipe B M", "Pipe A M", "Pipe Connector M", "Pipe C M", "Sink Unit", "Shower Unit", "Urinal Unit", "Toilet Unit B", "Toilet Unit A", "Programming Board", "Command Seat Controller", "Hovercraft Seat Controller", "Remote Controller", "Cockpit Controller", "Container Hub", "Container XS", "Container S", "Container M", "Container L", "Rocket Tank XS", "Rocket Tank S", "Rocket Tank M", "Rocket Tank L", "Atmospheric Tank XS", "Atmospheric Tank S", "Atmospheric Tank M", "Atmospheric Tank L", "Space Tank S", "Space Tank M", "Space Tank L", "Dispenser", "Landing Gear XS", "Landing Gear S", "Landing Gear M", "Landing Gear L", "Force Field XS", "Force Field S", "Force Field M", "Force Field L", "Elevator XS", "Sliding Door S", "Sliding Door M", "Expanded Gate S", "Expanded Gate L", "Gate XS", "Gate M", "Gate XL", "Reinforced Sliding Door", "Interior Door", "Airlock", "Screen XS", "Screen S", "Screen M", "Screen XL", "Transparant Screen XS", "Transparant Screen S", "Transparant Screen M", "Transparant Screen L", "Sign XS", "Sign S", "Sign M", "Sign L", "Sign Vertical XS", "Sign Vertical M", "Sign Vertical L", "Carbon Pure", "Iron Pure", "Titanium Pure", "Tungsten Pure", "Niobium Pure", "Rhenium Pure", "Copper Pure", "Molybdenum Pure", "Vanadium Pure", "Chromium Pure", "Aluminium Pure", "Manganese Pure", "Silicon Pure", "Nickel Pure", "Scandium Pure", "Zirconium Pure", "Lead Pure", "Sodium Pure", "Gold Pure", "Platinum Pure", "Xeron Fuel", "Nitron Fuel", "Kergon Fuel", "Duralumin Product", "Marble Product", "Concrete Product", "Wood Product", "Titanium 21 Product", "Polycarbonate Plastic Product", "Carbon Fiber Product", "Zircaloy Product", "Brick Product", "Maraging Steel Product", "Catalyst 3", "Catalyst 4", "Catalyst 5", "Iron Homeycomb Material", "Plastic Homeycomb Material", "Copper Homeycomb Material", "Gold Homeycomb Material", "Wood Homeycomb Material", "Titanium Homeycomb Material", "Brick Homeycomb Material", "Steel Homeycomb Material", "Concrete Homeycomb Material", "Marble Homeycomb Material", "Chromium Homeycomb Material", "Aluminium Homeycomb Material", "Carbonfiber Homeycomb Material", "Scandium Scrap", "Chromium Scrap", "Nickel Scrap", "Gold Scrap", "Platinum Scrap", "Manganese Scrap", "Tungsten Scrap", "Lead Scrap", "Sodium Scrap", "Aluminium Scrap", "Iron Scrap", "Copper Scrap", "Molybdenum Scrap", "Carbon Scrap", "Zirconium Scrap", "Silicon Scrap"];

var search_Terms_Extra = ["Carbon Ore", "Iron Ore", "Titanium Ore", "Tungsten Ore", "Niobium Ore", "Rhenium Ore", "Copper Ore", "Molybdenum Ore", "Vanadium Ore", "Chromium Ore", "Aluminium Ore", "Manganese Ore", "Silicon Ore", "Nickel Ore", "Scandium Ore", "Zirconium Ore", "Lead Ore", "Sodium Ore", "Gold Ore", "Platinum Ore"];

//{volume: # in liters, time: # in seconds, mass: # in kg, produce: # (batch size), tier: #, catalyst: [], mats: [arry containing all need items to craft formatted: 'name', #, 'name', #]}
//maybe add id #'s to each object also

var Functional_Part_1_XS = {volume: 15, time: 4, mass: 17.7, produce: 1, tier: 1, catalyst: [], mats: ['Carbon_Pure', 5, 'Complex_Part_1', 1]}
var Functional_Part_1_S = {volume: 50, time: 8, mass: 64.44, produce: 1, tier: 1, catalyst: [], mats: ['Carbon_Pure', 20, 'Complex_Part_1', 3]}
var Functional_Part_1_M = {volume: 170, time: 16, mass: 238.65, produce: 1, tier: 1, catalyst: [], mats: ['Carbon_Pure', 80, 'Complex_Part_1', 9]}
var Functional_Part_1_L = {volume: 590, time: 32, mass: 897.22, produce: 1, tier: 1, catalyst: [], mats: ['Carbon_Pure', 320, 'Complex_Part_1', 27]}
var Functional_Part_1_XL = {volume: 2090, time: 64, mass: 3420, produce: 1, tier: 1, catalyst: [], mats: ['Carbon_Pure', 1280, 'Complex_Part_1', 81]}

var Functional_Part_2_XS = {volume: 25, time: 16, mass: 70.1, produce: 1, tier: 2, catalyst: [], mats: ['Nickel_Pure', 5, 'Complex_Part_1', 1, 'Complex_Part_2', 1]}
var Functional_Part_2_S = {volume: 50, time: 32, mass: 222.91, produce: 1, tier: 2, catalyst: [], mats: ['Nickel_Pure', 20, 'Complex_Part_1', 1, 'Complex_Part_2', 2]}
var Functional_Part_2_M = {volume: 170, time: 64, mass: 846.9, produce: 1, tier: 2, catalyst: [], mats: ['Nickel_Pure', 80, 'Complex_Part_1', 3, 'Complex_Part_2', 6]}
var Functional_Part_2_L = {volume: 590, time: 128, mass: 3250, produce: 1, tier: 2, catalyst: [], mats: ['Nickel_Pure', 320, 'Complex_Part_1', 9, 'Complex_Part_2', 18]}
var Functional_Part_2_XL = {volume: 2090, time: 256, mass: 12610, produce: 1, tier: 2, catalyst: [], mats: ['Nickel_Pure', 1280, 'Complex_Part_1', 27, 'Complex_Part_2', 54]}

var Functional_Part_3_XS = {volume: 35, time: 64, mass: 147.06, produce: 1, tier: 3, catalyst: [], mats: ['Platinum_Pure', 5, 'Complex_Part_1', 1, 'Complex_Part_2', 1, 'Complex_Part_3', 1]}
var Functional_Part_3_S = {volume: 50, time: 128, mass: 468.81, produce: 1, tier: 3, catalyst: [], mats: ['Platinum_Pure', 20, 'Complex_Part_1', 1, 'Complex_Part_2', 1, 'Complex_Part_3', 1]}
var Functional_Part_3_M = {volume: 170, time: 256, mass: 1840, produce: 1, tier: 3, catalyst: [], mats: ['Platinum_Pure', 80, 'Complex_Part_1', 3, 'Complex_Part_2', 3, 'Complex_Part_3', 3]}
var Functional_Part_3_L = {volume: 590, time: 512, mass: 7220, produce: 1, tier: 3, catalyst: [], mats: ['Platinum_Pure', 320, 'Complex_Part_1', 9, 'Complex_Part_2', 9, 'Complex_Part_3', 9]}
var Functional_Part_3_XL = {volume: 2090, time: 1024, mass: 28530, produce: 1, tier: 3, catalyst: [], mats: ['Platinum_Pure', 1280, 'Complex_Part_1', 27, 'Complex_Part_2', 27, 'Complex_Part_3', 27]}

var Functional_Part_4_XS = {volume: 35, time: 256, mass: 104.87, produce: 1, tier: 4, catalyst: [], mats: ['Molybdenum_Pure', 5, 'Complex_Part_2', 1, 'Complex_Part_3', 1, 'Complex_Part_4', 1]}
var Functional_Part_4_S = {volume: 50, time: 512, mass: 259.07, produce: 1, tier: 4, catalyst: [], mats: ['Molybdenum_Pure', 20, 'Complex_Part_2', 1, 'Complex_Part_3', 1, 'Complex_Part_4', 1]}
var Functional_Part_4_M = {volume: 170, time: 1024, mass: 982.81, produce: 1, tier: 4, catalyst: [], mats: ['Molybdenum_Pure', 80, 'Complex_Part_2', 3, 'Complex_Part_3', 3, 'Complex_Part_4', 3]}
var Functional_Part_4_L = {volume: 590, time: 2048, mass: 3770, produce: 1, tier: 4, catalyst: [], mats: ['Molybdenum_Pure', 320, 'Complex_Part_2', 9, 'Complex_Part_3', 9, 'Complex_Part_4', 9]}
var Functional_Part_4_XL = {volume: 2090, time: 4096, mass: 14600, produce: 1, tier: 4, catalyst: [], mats: ['Molybdenum_Pure', 1280, 'Complex_Part_2', 27, 'Complex_Part_3', 27, 'Complex_Part_4', 27]}

var Functional_Part_5_XS = {volume: 35, time: 1024, mass: 157.02, produce: 1, tier: 5, catalyst: [], mats: ['Rhenium_Pure', 5, 'Complex_Part_3', 1, 'Complex_Part_4', 1, 'Complex_Part_5', 1]}
var Functional_Part_5_S = {volume: 50, time: 2048, mass: 472.32, produce: 1, tier: 5, catalyst: [], mats: ['Rhenium_Pure', 20, 'Complex_Part_3', 1, 'Complex_Part_4', 1, 'Complex_Part_5', 1]}
var Functional_Part_5_M = {volume: 170, time: 4096, mass: 1840, produce: 1, tier: 5, catalyst: [], mats: ['Rhenium_Pure', 80, 'Complex_Part_3', 3, 'Complex_Part_4', 3, 'Complex_Part_5', 3]}
var Functional_Part_5_L = {volume: 590, time: 8192, mass: 7190, produce: 1, tier: 5, catalyst: [], mats: ['Rhenium_Pure', 320, 'Complex_Part_3', 9, 'Complex_Part_4', 9, 'Complex_Part_5', 9]}
var Functional_Part_5_XL = {volume: 2090, time: 16384, mass: 28310, produce: 1, tier: 5, catalyst: [], mats: ['Rhenium_Pure', 1280, 'Complex_Part_3', 27, 'Complex_Part_4', 27, 'Complex_Part_5', 27]}

var Execptional_Part_3 = {volume: 75, time: 500, mass: 35.87, produce: 1, tier: 3, catalyst: [], mats: ['Complex_Part_1', 3, 'Complex_Part_2', 1, 'Complex_Part_3', 1, 'Intermediary_Part_1', 10, 'Polycarbonate_Plastic_Product', 5, 'Maraging_Steel_Product', 5, 'Duralumin_Product', 5]}
var Execptional_Part_4 = {volume: 80, time: 2500, mass: 45.72, produce: 1, tier: 4, catalyst: [], mats: ['Complex_Part_1', 2, 'Complex_Part_2', 1, 'Complex_Part_3', 1, 'Complex_Part_4', 1, 'Intermediary_Part_1', 5, 'Intermediary_Part_2', 5, 'Polycarbonate_Plastic_Product', 5, 'Maraging_Steel_Product', 5, 'Duralumin_Product', 5, 'Zircaloy_Product', 5]}
var Execptional_Part_5 = {volume: 85, time: 12480, mass: 56.36, produce: 1, tier: 5, catalyst: [], mats: ['Complex_Part_1', 1, 'Complex_Part_2', 1, 'Complex_Part_3', 1, 'Complex_Part_4', 1, 'Complex_Part_5', 1, 'Intermediary_Part_2', 5, 'Intermediary_Part_3', 5, 'Polycarbonate_Plastic_Product', 5, 'Maraging_Steel_Product', 5, 'Duralumin_Product', 5, 'Zircaloy_Product', 5, 'Titanium_21_Product', 5]}

var Complex_Part_1 = {volume: 10, time: 10, mass: 6.37, produce: 1, tier: 1, catalyst: [], mats: ['Sodium_Pure', 3, 'Polycarbonate_Plastic_Product', 3, 'Intermediary_Part_1', 4]}
var Complex_Part_2 = {volume: 10, time: 40, mass: 19.19, produce: 1, tier: 2, catalyst: [], mats: ['Sodium_Pure', 1, 'Tungsten_Pure', 2, 'Polycarbonate_Plastic_Product', 1, 'Maraging_Steel_Product', 2, 'Intermediary_Part_1', 4]}
var Complex_Part_3 = {volume: 10, time: 160, mass: 14.25, produce: 1, tier: 3, catalyst: [], mats: ['Sodium_Pure', 1, 'Tungsten_Pure', 1, 'Scandium_Pure', 1, 'Polycarbonate_Plastic_Product', 1, 'Maraging_Steel_Product', 1, 'Duralumin_Product', 1, 'Intermediary_Part_1', 2, 'Intermediary_Part_2', 2]}
var Complex_Part_4 = {volume: 10, time: 640, mass: 20.04, produce: 1, tier: 4, catalyst: [], mats: ['Tungsten_Pure', 1, 'Scandium_Pure', 1, 'Gold_Pure', 1, 'Maraging_Steel_Product', 1, 'Duralumin_Product', 1, 'Zircaloy_Product', 1, 'Intermediary_Part_1', 1, 'Intermediary_Part_2', 3]}
var Complex_Part_5 = {volume: 10, time: 2560, mass: 17.64, produce: 1, tier: 5, catalyst: [], mats: ['Scandium_Pure', 1, 'Gold_Pure', 1, 'Niobium_Pure', 1, 'Duralumin_Product', 1, 'Zircaloy_Product', 1, 'Titanium_21_Product', 1, 'Intermediary_Part_1', 1, 'Intermediary_Part_2', 1, 'Intermediary_Part_3', 2]}

var Structural_Part_1_XS = {volume: 5, time: 3, mass: 11.65, produce: 1, tier: 1, catalyst: [], mats: ['Silicon_Pure', 5]}
var Structural_Part_1_S = {volume: 20, time: 6, mass: 46.58, produce: 1, tier: 1, catalyst: [], mats: ['Silicon_Pure', 20]}
var Structural_Part_1_M = {volume: 80, time: 12, mass: 186.32, produce: 1, tier: 1, catalyst: [], mats: ['Silicon_Pure', 80]}
var Structural_Part_1_L = {volume: 320, time: 24, mass: 745.28, produce: 1, tier: 1, catalyst: [], mats: ['Silicon_Pure', 320]}
var Structural_Part_1_XL = {volume: 1280, time: 48, mass: 2980, produce: 1, tier: 1, catalyst: [], mats: ['Silicon_Pure', 1280]}

var Structural_Part_2_XS = {volume: 5, time: 12, mass: 11.39, produce: 1, tier: 2, catalyst: [], mats: ['Silicon_Pure', 1, 'Aluminium_Pure', 4]}
var Structural_Part_2_S = {volume: 20, time: 24, mass: 45.57, produce: 1, tier: 2, catalyst: [], mats: ['Silicon_Pure', 4, 'Aluminium_Pure', 16]}
var Structural_Part_2_M = {volume: 80, time: 48, mass: 182.29, produce: 1, tier: 2, catalyst: [], mats: ['Silicon_Pure', 16, 'Aluminium_Pure', 64]}
var Structural_Part_2_L = {volume: 320, time: 96, mass: 729.15, produce: 1, tier: 2, catalyst: [], mats: ['Silicon_Pure', 64, 'Aluminium_Pure', 256]}
var Structural_Part_2_XL = {volume: 1280, time: 192, mass: 2920, produce: 1, tier: 2, catalyst: [], mats: ['Silicon_Pure', 256, 'Aluminium_Pure', 1024]}

var Structural_Part_3_XS = {volume: 5, time: 48, mass: 31.09, produce: 1, tier: 3, catalyst: [], mats: ['Silicon_Pure', 1, 'Chromium_Pure', 4]}
var Structural_Part_3_S = {volume: 20, time: 96, mass: 124.36, produce: 1, tier: 3, catalyst: [], mats: ['Silicon_Pure', 4, 'Chromium_Pure', 16]}
var Structural_Part_3_M = {volume: 80, time: 192, mass: 497.42, produce: 1, tier: 3, catalyst: [], mats: ['Silicon_Pure', 16, 'Chromium_Pure', 64]}
var Structural_Part_3_L = {volume: 320, time: 384, mass: 1990, produce: 1, tier: 3, catalyst: [], mats: ['Silicon_Pure', 64, 'Chromium_Pure', 256]}
var Structural_Part_3_XL = {volume: 1280, time: 768, mass: 7960, produce: 1, tier: 3, catalyst: [], mats: ['Silicon_Pure', 256, 'Chromium_Pure', 1024]}

var Structural_Part_4_XS = {volume: 5, time: 192, mass: 31.17, produce: 1, tier: 4, catalyst: [], mats: ['Silicon_Pure', 1, 'Manganese_Pure', 4]}
var Structural_Part_4_S = {volume: 20, time: 384, mass: 124.68, produce: 1, tier: 4, catalyst: [], mats: ['Silicon_Pure', 4, 'Manganese_Pure', 16]}
var Structural_Part_4_M = {volume: 80, time: 768, mass: 498.7, produce: 1, tier: 4, catalyst: [], mats: ['Silicon_Pure', 16, 'Manganese_Pure', 64]}
var Structural_Part_4_L = {volume: 320, time: 1536, mass: 1990, produce: 1, tier: 4, catalyst: [], mats: ['Silicon_Pure', 64, 'Manganese_Pure', 256]}
var Structural_Part_4_XL = {volume: 1280, time: 3072, mass: 7980, produce: 1, tier: 4, catalyst: [], mats: ['Silicon_Pure', 256, 'Manganese_Pure', 1024]}

var Structural_Part_5_XS = {volume: 5, time: 768, mass: 26.33, produce: 1, tier: 5, catalyst: [], mats: ['Silicon_Pure', 1, 'Vanadium_Pure', 4]}
var Structural_Part_5_S = {volume: 20, time: 1536, mass: 105.32, produce: 1, tier: 5, catalyst: [], mats: ['Silicon_Pure', 4, 'Vanadium_Pure', 16]}
var Structural_Part_5_M = {volume: 80, time: 3072, mass: 421.26, produce: 1, tier: 5, catalyst: [], mats: ['Silicon_Pure', 16, 'Vanadium_Pure', 64]}
var Structural_Part_5_L = {volume: 320, time: 6144, mass: 1690, produce: 1, tier: 5, catalyst: [], mats: ['Silicon_Pure', 64, 'Vanadium_Pure', 256]}
var Structural_Part_5_XL = {volume: 1280, time: 12288, mass: 6740, produce: 1, tier: 5, catalyst: [], mats: ['Silicon_Pure', 256, 'Vanadium_Pure', 1024]}

var Intermediary_Part_1 = {volume: 1, time: 30, mass: 3.92, produce: 10, tier: 1, catalyst: [], mats: ['Iron_Pure', 10]}
var Intermediary_Part_2 = {volume: 1, time: 120, mass: 4.19, produce: 10, tier: 2, catalyst: [], mats: ['Iron_Pure', 5, 'Nickel_Pure', 5]}
var Intermediary_Part_3 = {volume: 1, time: 480, mass: 6.8, produce: 10, tier: 3, catalyst: [], mats: ['Iron_Pure', 3, 'Nickel_Pure', 3, 'Platinum_Pure', 4]}

var Dynamic_Core_XS = {volume: 35, time: 40, mass: 47.21, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Structural_Part_1_XS', 1, 'Polycarbonate_Plastic_Product', 5]}
var Dynamic_Core_S = {volume: 120, time: 360, mass: 459.57, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_S', 1, 'Complex_Part_2', 3, 'Structural_Part_2_S', 1, 'Polycarbonate_Plastic_Product', 8, 'Maraging_Steel_Product', 12]}
var Dynamic_Core_M = {volume: 420, time: 3240, mass: 3040, produce: 1, tier: 3, catalyst: [], mats: ['Functional_Part_3_M', 1, 'Complex_Part_3', 9, 'Structural_Part_3_M', 1, 'Maraging_Steel_Product', 32, 'Duralumin_Product', 48]}
var Dynamic_Core_L = {volume: 1383, time: 29160, mass: 7680, produce: 1, tier: 4, catalyst: [], mats: ['Functional_Part_4_L', 1, 'Complex_Part_4', 27, 'Structural_Part_4_L', 1, 'Duralumin_Product', 11, 'Zircaloy_Product', 192]}

var Static_Core_XS = {volume: 14, time: 30, mass: 38.99, produce: 1, tier: 1, catalyst: [], mats: ['Structural_Part_1_XS', 1, 'Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Static_Core_S = {volume: 52, time: 315, mass: 248.97, produce: 1, tier: 1, catalyst: [], mats: ['Structural_Part_2_S', 1, 'Intermediary_Part_1', 6, 'Intermediary_Part_2', 6, 'Silicon_Pure', 8, 'Lead_Pure', 12]}
var Static_Core_M = {volume: 196, time: 1103, mass: 947.2, produce: 1, tier: 2, catalyst: [], mats: ['Structural_Part_2_M', 1, 'Intermediary_Part_1', 18, 'Intermediary_Part_2', 18, 'Silicon_Pure', 32, 'Lead_Pure', 48]}
var Static_Core_L = {volume: 748, time: 3859, mass: 3640, produce: 1, tier: 2, catalyst: [], mats: ['Structural_Part_2_L', 1, 'Intermediary_Part_1', 54, 'Intermediary_Part_2', 54, 'Silicon_Pure', 128, 'Lead_Pure', 192]}

var Deployable_Light_Orb = {volume: 52, time: 315, mass: 248.97, produce: 1, tier: 2, catalyst: [], mats: ['Structural_Part_2_S', 1, 'Intermediary_Part_1', 6, 'Intermediary_Part_2', 6, 'Silicon_Pure', 8, 'Lead_Pure', 12]}

var Resurrection_Node = {volume: 120, time: 120, mass: 176.09, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_S', 1, 'Complex_Part_1', 3, 'Structural_Part_1_S', 1, 'Polycarbonate_Plastic_Product', 20]}

var Container_Hub = {volume: 55, time: 360, mass: 228.42, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_3_XS', 1, 'Complex_Part_3', 1, 'Structural_Part_3_XS', 1, 'Maraging_Steel_Product', 2, 'Duralumin_Product', 3]}
var Container_XS = {volume: 52, time: 105, mass: 140.26, produce: 1, tier: 1, catalyst: [], mats: ['Structural_Part_1_S', 1, 'Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Container_S = {volume: 196, time: 368, mass: 513.94, produce: 1, tier: 1, catalyst: [], mats: ['Structural_Part_1_M', 1, 'Intermediary_Part_1', 36, 'Silicon_Pure', 80]}
var Container_M = {volume: 748, time: 1287, mass: 1910, produce: 1, tier: 1, catalyst: [], mats: ['Structural_Part_1_L', 1, 'Intermediary_Part_1', 108, 'Silicon_Pure', 320]}
var Container_L = {volume: 1496, time: 1287, mass: 3830, produce: 1, tier: 1, catalyst: [], mats: ['Structural_Part_1_L', 2, 'Intermediary_Part_1', 216, 'Silicon_Pure', 640]}

var Rocket_Tank_XS = {volume: 120, time: 1080, mass: 780.02, produce: 1, tier: 3, catalyst: [], mats: ['Functional_Part_3_S', 1, 'Complex_Part_3', 3, 'Structural_Part_3_S', 1, 'Maraging_Steel_Product', 8, 'Duralumin_Product', 12]}
var Rocket_Tank_S = {volume: 420, time: 3240, mass: 3040, produce: 1, tier: 3, catalyst: [], mats: ['Functional_Part_3_M', 1, 'Complex_Part_3', 9, 'Structural_Part_3_M', 1, 'Maraging_Steel_Product', 32, 'Duralumin_Product', 48]}
var Rocket_Tank_M = {volume: 1500, time: 9720, mass: 11900, produce: 1, tier: 3, catalyst: [], mats: ['Functional_Part_3_L', 1, 'Complex_Part_3', 27, 'Structural_Part_3_L', 1, 'Maraging_Steel_Product', 128, 'Duralumin_Product', 192]}
var Rocket_Tank_L = {volume: 5460, time: 29160, mass: 46870, produce: 1, tier: 3, catalyst: [], mats: ['Functional_Part_3_XL', 1, 'Complex_Part_3', 81, 'Structural_Part_3_XL', 1, 'Maraging_Steel_Product', 512, 'Duralumin_Product', 768]}

var Atmospheric_Tank_XS = {volume: 14, time: 30, mass: 38.99, produce: 1, tier: 1, catalyst: [], mats: ['Structural_Part_1_XS', 1, 'Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Atmospheric_Tank_S = {volume: 52, time: 105, mass: 140.26, produce: 1, tier: 1, catalyst: [], mats: ['Structural_Part_1_S', 1, 'Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Atmospheric_Tank_M = {volume: 196, time: 368, mass: 513.94, produce: 1, tier: 1, catalyst: [], mats: ['Structural_Part_1_M', 1, 'Intermediary_Part_1', 36, 'Silicon_Pure', 80]}
var Atmospheric_Tank_L = {volume: 748, time: 1287, mass: 1910, produce: 1, tier: 1, catalyst: [], mats: ['Structural_Part_1_L', 1, 'Intermediary_Part_1', 108, 'Silicon_Pure', 320]}

var Space_Tank_S = {volume: 52, time: 105, mass: 140.26, produce: 1, tier: 2, catalyst: [], mats: ['Structural_Part_1_S', 1, 'Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Space_Tank_M = {volume: 196, time: 368, mass: 513.94, produce: 1, tier: 2, catalyst: [], mats: ['Structural_Part_1_M', 1, 'Intermediary_Part_1', 36, 'Silicon_Pure', 80]}
var Space_Tank_L = {volume: 748, time: 1287, mass: 1910, produce: 1, tier: 2, catalyst: [], mats: ['Structural_Part_1_L', 1, 'Intermediary_Part_1', 108, 'Silicon_Pure', 320]}

var Dispenser = {volume: 196, time: 368, mass: 513.94, produce: 1, tier: 1, catalyst: [], mats: ['Structural_Part_1_M', 1, 'Intermediary_Part_1', 36, 'Silicon_Pure', 80]}

var Landing_Gear_XS = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Landing_Gear_S = {volume: 32, time: 105, mass: 434.69, produce: 1, tier: 2, catalyst: [], mats: ['Intermediary_Part_1', 6, 'Intermediary_Part_2', 6, 'Tungsten_Pure', 20]}
var Landing_Gear_M = {volume: 116, time: 368, mass: 1690, produce: 1, tier: 2, catalyst: [], mats: ['Intermediary_Part_1', 18, 'Intermediary_Part_2', 18, 'Tungsten_Pure', 80]}
var Landing_Gear_L = {volume: 428, time: 1287, mass: 6610, produce: 1, tier: 2, catalyst: [], mats: ['Intermediary_Part_1', 54, 'Intermediary_Part_2', 54, 'Tungsten_Pure', 320]}

var Force_Field_XS = {volume: 122, time: 150, mass: 212.38, produce: 1, tier: 3, catalyst: [], mats: ['Functional_Part_3_XS', 1, 'Execptional_Part_3', 1, 'Complex_Part_3', 1, 'Maraging_Steel_Product', 1, 'Duralumin_Product', 1]}
var Force_Field_S = {volume: 122, time: 150, mass: 212.38, produce: 1, tier: 3, catalyst: [], mats: ['Functional_Part_3_XS', 1, 'Execptional_Part_3', 1, 'Complex_Part_3', 1, 'Maraging_Steel_Product', 1, 'Duralumin_Product', 1]}
var Force_Field_M = {volume: 122, time: 150, mass: 212.38, produce: 1, tier: 3, catalyst: [], mats: ['Functional_Part_3_XS', 1, 'Execptional_Part_3', 1, 'Complex_Part_3', 1, 'Maraging_Steel_Product', 1, 'Duralumin_Product', 1]}
var Force_Field_L = {volume: 122, time: 150, mass: 212.38, produce: 1, tier: 3, catalyst: [], mats: ['Functional_Part_3_XS', 1, 'Execptional_Part_3', 1, 'Complex_Part_3', 1, 'Maraging_Steel_Product', 1, 'Duralumin_Product', 1]}

var Elevator_XS = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}

var Sliding_Door_S = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Sliding_Door_M = {volume: 116, time: 123, mass: 327.62, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 36, 'Silicon_Pure', 80]}
var Expanded_Gate_S = {volume: 1604, time: 4502, mass: 26020, produce: 1, tier: 2, catalyst: [], mats: ['Intermediary_Part_1', 162, 'Intermediary_Part_2', 162, 'Tungsten_Pure', 1280]}
var Expanded_Gate_L = {volume: 1604, time: 4502, mass: 26020, produce: 1, tier: 2, catalyst: [], mats: ['Intermediary_Part_1', 162, 'Intermediary_Part_2', 162, 'Tungsten_Pure', 1280]}
var Gate_XS = {volume: 1604, time: 4502, mass: 26020, produce: 1, tier: 2, catalyst: [], mats: ['Intermediary_Part_1', 162, 'Intermediary_Part_2', 162, 'Tungsten_Pure', 1280]}
var Gate_M = {volume: 1604, time: 4502, mass: 26020, produce: 1, tier: 2, catalyst: [], mats: ['Intermediary_Part_1', 162, 'Intermediary_Part_2', 162, 'Tungsten_Pure', 1280]}
var Gate_XL = {volume: 1604, time: 4502, mass: 26020, produce: 1, tier: 2, catalyst: [], mats: ['Intermediary_Part_1', 162, 'Intermediary_Part_2', 162, 'Tungsten_Pure', 1280]}
var Reinforced_Sliding_Door = {volume: 116, time: 123, mass: 327.62, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 36, 'Silicon_Pure', 80]}
var Interior_Door = {volume: 1.29, time: 123, mass: 200.54, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 36, 'Silicon_Pure', 80, 'Structural_Part_1_M', 1, 'Polycarbonate_Plastic_Product', 0.258]}
var Airlock = {volume: 116, time: 1500, mass: 327.62, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 36, 'Silicon_Pure', 80]}

var Sign_XS = {volume: 45, time: 120, mass: 134.06, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Structural_Part_2_XS', 1, 'Polycarbonate_Plastic_Product', 2, 'Maraging_Steel_Product', 3]}
var Sign_S = {volume: 45, time: 120, mass: 134.06, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Structural_Part_2_XS', 1, 'Polycarbonate_Plastic_Product', 2, 'Maraging_Steel_Product', 3]}
var Sign_M = {volume: 45, time: 120, mass: 134.06, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Structural_Part_2_XS', 1, 'Polycarbonate_Plastic_Product', 2, 'Maraging_Steel_Product', 3]}
var Sign_L = {volume: 45, time: 120, mass: 134.06, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Structural_Part_2_XS', 1, 'Polycarbonate_Plastic_Product', 2, 'Maraging_Steel_Product', 3]}
var Sign_Vertical_XS = {volume: 45, time: 120, mass: 134.06, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Structural_Part_2_XS', 1, 'Polycarbonate_Plastic_Product', 2, 'Maraging_Steel_Product', 3]}
var Sign_Vertical_M = {volume: 45, time: 120, mass: 134.06, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Structural_Part_2_XS', 1, 'Polycarbonate_Plastic_Product', 2, 'Maraging_Steel_Product', 3]}
var Sign_Vertical_L = {volume: 45, time: 120, mass: 134.06, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Structural_Part_2_XS', 1, 'Polycarbonate_Plastic_Product', 2, 'Maraging_Steel_Product', 3]}

var Screen_XS = {volume: 45, time: 120, mass: 134.06, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Structural_Part_2_XS', 1, 'Polycarbonate_Plastic_Product', 2, 'Maraging_Steel_Product', 3]}
var Screen_S = {volume: 45, time: 120, mass: 134.06, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Structural_Part_2_XS', 1, 'Polycarbonate_Plastic_Product', 2, 'Maraging_Steel_Product', 3]}
var Screen_M = {volume: 45, time: 120, mass: 134.06, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Structural_Part_2_XS', 1, 'Polycarbonate_Plastic_Product', 2, 'Maraging_Steel_Product', 3]}
var Screen_XL = {volume: 5460, time: 9720, mass: 25630, produce: 1, tier: 3, catalyst: [], mats: ['Functional_Part_2_XL', 1, 'Complex_Part_2', 81, 'Structural_Part_2_XL', 1, 'Polycarbonate_Plastic_Product', 512, 'Maraging_Steel_Product', 768]}
var Transparant_Screen_XS = {volume: 45, time: 120, mass: 134.06, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Structural_Part_2_XS', 1, 'Polycarbonate_Plastic_Product', 2, 'Maraging_Steel_Product', 3]}
var Transparant_Screen_S = {volume: 45, time: 120, mass: 134.06, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Structural_Part_2_XS', 1, 'Polycarbonate_Plastic_Product', 2, 'Maraging_Steel_Product', 3]}
var Transparant_Screen_M = {volume: 45, time: 120, mass: 134.06, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Structural_Part_2_XS', 1, 'Polycarbonate_Plastic_Product', 2, 'Maraging_Steel_Product', 3]}
var Transparant_Screen_L = {volume: 45, time: 120, mass: 134.06, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Structural_Part_2_XS', 1, 'Polycarbonate_Plastic_Product', 2, 'Maraging_Steel_Product', 3]}

var Office_Chair = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Navigator_Chair = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Encampment_Chair = {volume: 0.1, time: 10, mass: 38.17, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}

var Stabilizer_S = {volume: 120, time: 120, mass: 176.09, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_S', 1, 'Complex_Part_1', 3, 'Structural_Part_1_S', 1, 'Polycarbonate_Plastic_Product', 20]}
var Stabilizer_M = {volume: 1500, time: 1080, mass: 2550, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_L', 1, 'Complex_Part_1', 27, 'Structural_Part_1_L', 1, 'Polycarbonate_Plastic_Product', 320]}
var Stabilizer_L = {volume: 5460, time: 3240, mass: 9860, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XL', 1, 'Complex_Part_1', 81, 'Structural_Part_1_XL', 1, 'Polycarbonate_Plastic_Product', 1280]}

var Retro_Rocket_Brake_S = {volume: 35, time: 40, mass: 47.21, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Structural_Part_1_XS', 1, 'Polycarbonate_Plastic_Product', 5]}
var Retro_Rocket_Brake_M = {volume: 120, time: 120, mass: 176.09, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_S', 1, 'Complex_Part_1', 3, 'Structural_Part_1_S', 1, 'Polycarbonate_Plastic_Product', 20]}
var Retro_Rocket_Brake_L = {volume: 420, time: 360, mass: 666.13, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_M', 1, 'Complex_Part_1', 9, 'Structural_Part_1_M', 1, 'Polycarbonate_Plastic_Product', 80]}

var Atmospheric_Airbrake_S = {volume: 35, time: 40, mass: 47.21, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Structural_Part_1_XS', 1, 'Polycarbonate_Plastic_Product', 5]}
var Atmospheric_Airbrake_M = {volume: 120, time: 120, mass: 176.09, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_S', 1, 'Complex_Part_1', 3, 'Structural_Part_1_S', 1, 'Polycarbonate_Plastic_Product', 20]}
var Atmospheric_Airbrake_L = {volume: 420, time: 360, mass: 666.13, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_M', 1, 'Complex_Part_1', 9, 'Structural_Part_1_M', 1, 'Polycarbonate_Plastic_Product', 80]}

var Compact_Aileron_S = {volume: 10, time: 30, mass: 26.48, produce: 1, tier: 1, catalyst: [], mats: ['Structural_Part_1_XS', 1, 'Intermediary_Part_1', 2, 'Silicon_Pure', 3]}
var Compact_Aileron_M = {volume: 36, time: 105, mass: 93.42, produce: 1, tier: 1, catalyst: [], mats: ['Structural_Part_1_S', 1, 'Intermediary_Part_1', 6, 'Silicon_Pure', 10]}
var Compact_Aileron_L = {volume: 138, time: 368, mass: 350.13, produce: 1, tier: 1, catalyst: [], mats: ['Structural_Part_1_M', 1, 'Intermediary_Part_1', 18, 'Silicon_Pure', 40]}
var Aileron_S = {volume: 14, time: 30, mass: 38.99, produce: 1, tier: 1, catalyst: [], mats: ['Structural_Part_1_XS', 1, 'Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Aileron_M = {volume: 52, time: 105, mass: 140.26, produce: 1, tier: 1, catalyst: [], mats: ['Structural_Part_1_S', 1, 'Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Aileron_L = {volume: 196, time: 368, mass: 513.94, produce: 1, tier: 1, catalyst: [], mats: ['Structural_Part_1_M', 1, 'Intermediary_Part_1', 36, 'Silicon_Pure', 80]}

var Atmospheric_Engine_XS = {volume: 35, time: 40, mass: 47.21, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Structural_Part_1_XS', 1, 'Polycarbonate_Plastic_Product', 5]}
var Atmospheric_Engine_S = {volume: 120, time: 120, mass: 176.09, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_1_S', 1, 'Complex_Part_1', 3, 'Structural_Part_1_S', 1, 'Polycarbonate_Plastic_Product', 20]}
var Atmospheric_Engine_M = {volume: 420, time: 360, mass: 666.13, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_1_M', 1, 'Complex_Part_1', 9, 'Structural_Part_1_M', 1, 'Polycarbonate_Plastic_Product', 80]}
var Atmospheric_Engine_L = {volume: 1500, time: 1080, mass: 2550, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_1_L', 1, 'Complex_Part_1', 27, 'Structural_Part_1_L', 1, 'Polycarbonate_Plastic_Product', 320]}

var Space_Engine_XS = {volume: 35, time: 40, mass: 47.21, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Structural_Part_1_XS', 1, 'Polycarbonate_Plastic_Product', 5]}
var Space_Engine_S = {volume: 120, time: 120, mass: 176.09, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_S', 1, 'Complex_Part_1', 3, 'Structural_Part_1_S', 1, 'Polycarbonate_Plastic_Product', 20]}
var Space_Engine_M = {volume: 420, time: 360, mass: 666.13, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_M', 1, 'Complex_Part_1', 9, 'Structural_Part_1_M', 1, 'Polycarbonate_Plastic_Product', 80]}
var Space_Engine_L = {volume: 1500, time: 1080, mass: 2550, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_L', 1, 'Complex_Part_1', 27, 'Structural_Part_1_L', 1, 'Polycarbonate_Plastic_Product', 320]}
var Space_Engine_XL = {volume: 5460, time: 3240, mass: 9860, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XL', 1, 'Complex_Part_1', 81, 'Structural_Part_1_XL', 1, 'Polycarbonate_Plastic_Product', 1280]}

var Hover_Engine_S = {volume: 35, time: 40, mass: 47.21, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Structural_Part_1_XS', 1, 'Polycarbonate_Plastic_Product', 5]}
var Hover_Engine_M = {volume: 120, time: 120, mass: 176.09, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_1_S', 1, 'Complex_Part_1', 3, 'Structural_Part_1_S', 1, 'Polycarbonate_Plastic_Product', 20]}
var Hover_Engine_L = {volume: 420, time: 360, mass: 666.13, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_1_M', 1, 'Complex_Part_1', 9, 'Structural_Part_1_M', 1, 'Polycarbonate_Plastic_Product', 80]}
var Flat_Hover_Engine_L = {volume: 420, time: 360, mass: 666.13, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_1_M', 1, 'Complex_Part_1', 9, 'Structural_Part_1_M', 1, 'Polycarbonate_Plastic_Product', 80]}

var Adjustor_XS = {volume: 4, time: 9, mass: 12.51, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 2, 'Silicon_Pure', 2]}
var Adjustor_S = {volume: 14, time: 30, mass: 38.99, produce: 1, tier: 1, catalyst: [], mats: ['Structural_Part_1_XS', 1, 'Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Adjustor_M = {volume: 52, time: 105, mass: 140.26, produce: 1, tier: 1, catalyst: [], mats: ['Structural_Part_1_S', 1, 'Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Adjustor_L = {volume: 196, time: 368, mass: 513.94, produce: 1, tier: 1, catalyst: [], mats: ['Structural_Part_1_M', 1, 'Intermediary_Part_1', 36, 'Silicon_Pure', 80]}

var Rocket_Engine_S = {volume: 55, time: 360, mass: 228.42, produce: 1, tier: 3, catalyst: [], mats: ['Functional_Part_3_XS', 1, 'Complex_Part_3', 1, 'Structural_Part_3_XS', 1, 'Maraging_Steel_Product', 2, 'Duralumin_Product', 3]}
var Rocket_Engine_M = {volume: 120, time: 1080, mass: 780.02, produce: 1, tier: 3, catalyst: [], mats: ['Functional_Part_3_S', 1, 'Complex_Part_3', 3, 'Structural_Part_3_S', 1, 'Maraging_Steel_Product', 8, 'Duralumin_Product', 12]}
var Rocket_Engine_L = {volume: 420, time: 3240, mass: 3040, produce: 1, tier: 4, catalyst: [], mats: ['Functional_Part_3_M', 1, 'Complex_Part_3', 9, 'Structural_Part_3_M', 1, 'Maraging_Steel_Product', 32, 'Duralumin_Product', 48]}

var Vertical_Booster_XS = {volume: 27, time: 14, mass: 28.67, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Polycarbonate_Plastic_Product', 2]}
var Vertical_Booster_S = {volume: 35, time: 40, mass: 47.21, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Structural_Part_1_XS', 1, 'Polycarbonate_Plastic_Product', 5]}
var Vertical_Booster_M = {volume: 120, time: 120, mass: 176.09, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_S', 1, 'Complex_Part_1', 3, 'Structural_Part_1_S', 1, 'Polycarbonate_Plastic_Product', 20]}
var Vertical_Booster_L = {volume: 420, time: 360, mass: 666.13, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_M', 1, 'Complex_Part_1', 9, 'Structural_Part_1_M', 1, 'Polycarbonate_Plastic_Product', 80]}

var Territory_Scanner = {volume: 5460, time: 9720, mass: 25630, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XL', 1, 'Complex_Part_2', 81, 'Structural_Part_2_XL', 1, 'Polycarbonate_Plastic_Product', 512, 'Maraging_Steel_Product', 768]}

var Gyroscope = {volume: 35, time: 40, mass: 47.21, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Structural_Part_1_XS', 1, 'Polycarbonate_Plastic_Product', 5]}

var Telemeter = {volume: 45, time: 120, mass: 134.06, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Structural_Part_2_XS', 1, 'Polycarbonate_Plastic_Product', 2, 'Maraging_Steel_Product', 3]}

var Long_Light_XS = {volume: 4, time: 26, mass: 21.78, produce: 1, tier: 2, catalyst: [], mats: ['Intermediary_Part_1', 1, 'Intermediary_Part_2', 1, 'Silicon_Pure', 1, 'Lead_Pure', 1]}
var Long_Light_S = {volume: 14, time: 90, mass: 66.30, produce: 1, tier: 2, catalyst: [], mats: ['Structural_Part_2_XS', 1, 'Intermediary_Part_1', 2, 'Intermediary_Part_2', 2, 'Silicon_Pure', 2, 'Lead_Pure', 3]}
var Long_Light_M_M = {volume: 14, time: 90, mass: 66.30, produce: 1, tier: 2, catalyst: [], mats: ['Structural_Part_2_XS', 1, 'Intermediary_Part_1', 2, 'Intermediary_Part_2', 2, 'Silicon_Pure', 2, 'Lead_Pure', 3]}
var Long_Light_L_L = {volume: 14, time: 90, mass: 66.30, produce: 1, tier: 2, catalyst: [], mats: ['Structural_Part_2_XS', 1, 'Intermediary_Part_1', 2, 'Intermediary_Part_2', 2, 'Silicon_Pure', 2, 'Lead_Pure', 3]}
var Square_Light_XS = {volume: 4, time: 26, mass: 21.78, produce: 1, tier: 2, catalyst: [], mats: ['Intermediary_Part_1', 1, 'Intermediary_Part_2', 1, 'Silicon_Pure', 1, 'Lead_Pure', 1]}
var Square_Light_S = {volume: 14, time: 90, mass: 66.30, produce: 1, tier: 2, catalyst: [], mats: ['Structural_Part_2_XS', 1, 'Intermediary_Part_1', 2, 'Intermediary_Part_2', 2, 'Silicon_Pure', 2, 'Lead_Pure', 3]}
var Square_Light_M = {volume: 14, time: 90, mass: 66.30, produce: 1, tier: 2, catalyst: [], mats: ['Structural_Part_2_XS', 1, 'Intermediary_Part_1', 2, 'Intermediary_Part_2', 2, 'Silicon_Pure', 2, 'Lead_Pure', 3]}
var Square_Light_L = {volume: 14, time: 90, mass: 66.30, produce: 1, tier: 2, catalyst: [], mats: ['Structural_Part_2_XS', 1, 'Intermediary_Part_1', 2, 'Intermediary_Part_2', 2, 'Silicon_Pure', 2, 'Lead_Pure', 3]}
var Headlight = {volume: 14, time: 90, mass: 66.30, produce: 1, tier: 2, catalyst: [], mats: ['Structural_Part_2_XS', 1, 'Intermediary_Part_1', 2, 'Intermediary_Part_2', 2, 'Silicon_Pure', 2, 'Lead_Pure', 3]}
var Vertical_Light_XS = {volume: 4, time: 26, mass: 21.78, produce: 1, tier: 2, catalyst: [], mats: ['Intermediary_Part_1', 1, 'Intermediary_Part_2', 1, 'Silicon_Pure', 1, 'Lead_Pure', 1]}
var Vertical_Light_S = {volume: 14, time: 90, mass: 66.30, produce: 1, tier: 2, catalyst: [], mats: ['Structural_Part_2_XS', 1, 'Intermediary_Part_1', 2, 'Intermediary_Part_2', 2, 'Silicon_Pure', 2, 'Lead_Pure', 3]}
var Vertical_Light_L = {volume: 52, time: 315, mass: 248.97, produce: 1, tier: 2, catalyst: [], mats: ['Structural_Part_2_S', 1, 'Intermediary_Part_1', 6, 'Intermediary_Part_2', 6, 'Silicon_Pure', 8, 'Lead_Pure', 12]}
var Vertical_Light_M_M = {volume: 14, time: 90, mass: 66.30, produce: 1, tier: 2, catalyst: [], mats: ['Structural_Part_2_XS', 1, 'Intermediary_Part_1', 2, 'Intermediary_Part_2', 2, 'Silicon_Pure', 2, 'Lead_Pure', 3]}

var AntiGravity_Pulsor = {volume: 420, time: 3240, mass: 3040, produce: 1, tier: 3, catalyst: [], mats: ['Functional_Part_3_M', 1, 'Complex_Part_3', 9, 'Structural_Part_3_M', 1, 'Maraging_Steel_Product', 32, 'Duralumin_Product', 48]}

var AND_Operator = {volume: 27, time: 14, mass: 28.67, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Polycarbonate_Plastic_Product', 2]}

var Receiver_XS = {volume: 27, time: 14, mass: 28.67, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Polycarbonate_Plastic_Product', 2]}
var Receiver_S = {volume: 120, time: 360, mass: 459.57, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_S', 1, 'Complex_Part_2', 3, 'Structural_Part_2_S', 1, 'Polycarbonate_Plastic_Product', 8, 'Maraging_Steel_Product', 12]}
var Receiver_M = {volume: 1500, time: 3240, mass: 6640, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_L', 1, 'Complex_Part_2', 27, 'Structural_Part_2_L', 1, 'Polycarbonate_Plastic_Product', 128, 'Maraging_Steel_Product', 192]}

var OR_Operator = {volume: 27, time: 14, mass: 28.67, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Polycarbonate_Plastic_Product', 2]}

var Relay = {volume: 35, time: 40, mass: 47.21, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Structural_Part_1_XS', 1, 'Polycarbonate_Plastic_Product', 5]}

var Databank = {volume: 27, time: 14, mass: 28.67, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Polycarbonate_Plastic_Product', 2]}

var Infra_Red_Laser_Emitter = {volume: 37, time: 40, mass: 101.18, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Polycarbonate_Plastic_Product', 1, 'Maraging_Steel_Product', 1]}
var Laser_Emitter = {volume: 27, time: 14, mass: 28.67, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Polycarbonate_Plastic_Product', 2]}

var Counter_2 = {volume: 37, time: 40, mass: 101.18, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Polycarbonate_Plastic_Product', 1, 'Maraging_Steel_Product', 1]}
var Counter_3 = {volume: 37, time: 40, mass: 101.18, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Polycarbonate_Plastic_Product', 1, 'Maraging_Steel_Product', 1]}
var Counter_5 = {volume: 37, time: 40, mass: 101.18, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Polycarbonate_Plastic_Product', 1, 'Maraging_Steel_Product', 1]}
var Counter_7 = {volume: 37, time: 40, mass: 101.18, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Polycarbonate_Plastic_Product', 1, 'Maraging_Steel_Product', 1]}
var Counter_10 = {volume: 37, time: 40, mass: 101.18, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Polycarbonate_Plastic_Product', 1, 'Maraging_Steel_Product', 1]}

var Delay_Line = {volume: 27, time: 14, mass: 28.67, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Polycarbonate_Plastic_Product', 2]}

var Emitter_XS = {volume: 35, time: 40, mass: 47.21, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Structural_Part_1_XS', 1, 'Polycarbonate_Plastic_Product', 5]}
var Emitter_S = {volume: 120, time: 360, mass: 459.57, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_S', 1, 'Complex_Part_2', 3, 'Structural_Part_2_S', 1, 'Polycarbonate_Plastic_Product', 8, 'Maraging_Steel_Product', 12]}
var Emitter_M = {volume: 420, time: 1080, mass: 1740, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_M', 1, 'Complex_Part_2', 9, 'Structural_Part_2_M', 1, 'Polycarbonate_Plastic_Product', 32, 'Maraging_Steel_Product', 48]}

var NOT_Operator = {volume: 27, time: 14, mass: 28.67, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Polycarbonate_Plastic_Product', 2]}

var Radar_S = {volume: 120, time: 120, mass: 176.09, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_S', 1, 'Complex_Part_1', 3, 'Structural_Part_1_S', 1, 'Polycarbonate_Plastic_Product', 20]}
var Radar_M = {volume: 420, time: 1080, mass: 1740, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_M', 1, 'Complex_Part_2', 9, 'Structural_Part_2_M', 1, 'Polycarbonate_Plastic_Product', 32, 'Maraging_Steel_Product', 48]}
var Radar_L = {volume: 1500, time: 3240, mass: 6640, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_L', 1, 'Complex_Part_2', 27, 'Structural_Part_2_L', 1, 'Polycarbonate_Plastic_Product', 128, 'Maraging_Steel_Product', 192]}

var Manual_Switch = {volume: 27, time: 14, mass: 28.67, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Polycarbonate_Plastic_Product', 2]}

var Pressure_Tile = {volume: 35, time: 40, mass: 47.21, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Structural_Part_1_XS', 1, 'Polycarbonate_Plastic_Product', 5]}

var Manual_Button_XS = {volume: 27, time: 14, mass: 28.67, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Polycarbonate_Plastic_Product', 2]}
var Manual_Button_S = {volume: 27, time: 14, mass: 28.67, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Polycarbonate_Plastic_Product', 2]}

var Laser_Receiver = {volume: 37, time: 40, mass: 101.18, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Polycarbonate_Plastic_Product', 1, 'Maraging_Steel_Product', 1]}
var Infra_Red_Laser_Receiver = {volume: 37, time: 40, mass: 101.18, produce: 1, tier: 2, catalyst: [], mats: ['Functional_Part_2_XS', 1, 'Complex_Part_2', 1, 'Polycarbonate_Plastic_Product', 1, 'Maraging_Steel_Product', 1]}

var Detection_Zone_XS = {volume: 47, time: 120, mass: 176.51, produce: 1, tier: 3, catalyst: [], mats: ['Functional_Part_3_XS', 1, 'Complex_Part_3', 1, 'Maraging_Steel_Product', 1, 'Duralumin_Product', 1]}
var Detection_Zone_S = {volume: 47, time: 120, mass: 176.51, produce: 1, tier: 3, catalyst: [], mats: ['Functional_Part_3_XS', 1, 'Complex_Part_3', 1, 'Maraging_Steel_Product', 1, 'Duralumin_Product', 1]}
var Detection_Zone_M = {volume: 47, time: 120, mass: 176.51, produce: 1, tier: 3, catalyst: [], mats: ['Functional_Part_3_XS', 1, 'Complex_Part_3', 1, 'Maraging_Steel_Product', 1, 'Duralumin_Product', 1]}
var Detection_Zone_L = {volume: 47, time: 120, mass: 176.51, produce: 1, tier: 3, catalyst: [], mats: ['Functional_Part_3_XS', 1, 'Complex_Part_3', 1, 'Maraging_Steel_Product', 1, 'Duralumin_Product', 1]}

var Anti_Gravity_Generator_S = {volume: 1580, time: 36480, mass: 8390, produce: 1, tier: 4, catalyst: [], mats: ['Functional_Part_4_L', 1, 'Execptional_Part_4', 1, 'Complex_Part_4', 27, 'Structural_Part_4_L', 1, 'Duralumin_Product', 128, 'Zircaloy_Product', 192]}
var Anti_Gravity_Generator_M = {volume: 5540, time: 109380, mass: 32390, produce: 1, tier: 4, catalyst: [], mats: ['Functional_Part_4_XL', 1, 'Execptional_Part_4', 1, 'Complex_Part_4', 81, 'Structural_Part_4_XL', 1, 'Duralumin_Product', 512, 'Zircaloy_Product', 768]}
var Anti_Gravity_Generator_L = {volume: 18790, time: 109380, mass: 111970, produce: 1, tier: 4, catalyst: [], mats: ['Functional_Part_4_XL', 4, 'Execptional_Part_4', 4, 'Complex_Part_4', 243, 'Structural_Part_4_XL', 2, 'Duralumin_Product', 2048, 'Zircaloy_Product', 3072]}

var Steel_Column = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Steel_Panel = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Hull_Decorative_Element_A = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Hull_Decorative_Element_B = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Hull_Decorative_Element_C = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}

var Barrier_Corner = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Barrier_S = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Barrier_M = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}

//first listed wing is M, 2nd is S, 3rd is L, 4th is XS
var Wing_XS = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Wing_S = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Wing_M = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Wing_L = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Wing_Tip_S = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Wing_Tip_M = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Wing_Tip_L = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Vertical_Wing = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}

var Keyboard_Unit = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}

var Spaceship_Hologram_S = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Spaceship_Hologram_M = {volume: 9, time: 30, mass: 112.73, produce: 1, tier: 2, catalyst: [], mats: ['Intermediary_Part_2', 2, 'Intermediary_Part_1', 2, 'Tungsten_Pure', 5]}
var Spaceship_Hologram_L = {volume: 9, time: 90, mass: 124.01, produce: 1, tier: 3, catalyst: [], mats: ['Intermediary_Part_2', 4, 'Platinum_Pure', 5]}
var Planet_Hologram = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Planet_Hologram_L = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}

var Window_XS = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Window_S = {volume: 16, time: 35, mass: 46.84, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 6, 'Silicon_Pure', 10]}
var Window_M = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Window_L = {volume: 64, time: 35, mass: 187.36, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 24, 'Silicon_Pure', 40]}
var Armored_Window_XS = {volume: 9, time: 30, mass: 112.73, produce: 1, tier: 2, catalyst: [], mats: ['Intermediary_Part_2', 2, 'Intermediary_Part_1', 2, 'Tungsten_Pure', 5]}
var Armored_Window_S = {volume: 32, time: 105, mass: 434.69, produce: 1, tier: 2, catalyst: [], mats: ['Intermediary_Part_2', 6, 'Intermediary_Part_1', 6, 'Tungsten_Pure', 20]}
var Armored_Window_M = {volume: 32, time: 105, mass: 434.69, produce: 1, tier: 2, catalyst: [], mats: ['Intermediary_Part_2', 6, 'Intermediary_Part_1', 6, 'Tungsten_Pure', 20]}
var Armored_Window_L = {volume: 32, time: 105, mass: 434.69, produce: 1, tier: 2, catalyst: [], mats: ['Intermediary_Part_2', 6, 'Intermediary_Part_1', 6, 'Tungsten_Pure', 20]}
var Bay_Window_XL = {volume: 116, time: 123, mass: 327.62, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 36, 'Silicon_Pure', 80]}
var Glass_Panel_S = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Glass_Panel_M = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Glass_Panel_L = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}

var Cable_Model_A_M = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Cable_Model_B_M = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Cable_Model_C_M = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Cable_Model_A_S = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Cable_Model_B_S = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Cable_Model_C_S = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Corner_Cable_Model_A = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Corner_Cable_Model_B = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Corner_Cable_Model_C = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}

var Antenna_S = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Antenna_M = {volume: 116, time: 368, mass: 1690, produce: 1, tier: 2, catalyst: [], mats: ['Intermediary_Part_2', 18, 'Intermediary_Part_1', 18, 'Tungsten_Pure', 80]}
var Antenna_L = {volume: 428, time: 3859, mass: 7320, produce: 1, tier: 3, catalyst: [], mats: ['Intermediary_Part_2', 108, 'Platinum_Pure', 320]}

var Plant = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Plant_Case_A = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Plant_Case_B = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Plant_Case_C = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Plant_Case_D = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Plant_Case_E = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Suspended_Fruit_Plant = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Suspended_Plant_A = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Suspended_Plant_B = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Bagged_Plant_A = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Bagged_Plant_B = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Bonsai = {volume: 205, time: 12180, mass: 807.92, produce: 1, tier: 5, catalyst: [], mats: ['Functional_Part_5_S', 1, 'Execptional_Part_5', 1, 'Complex_Part_5', 3, 'Structural_Part_5_S', 1, 'Zircaloy_Product', 8, 'Titanium_21_Product', 12]}
var Eggplant_Plant_Case = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Salad_Plant_Case = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Plant_Case_M = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Squash_Plant_Case = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Plant_Case_S = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Ficus_Plant_A = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Ficus_Plant_B = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Foliage_Plant_Case_A = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Foliage_Plant_Case_B = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}

var Dresser = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Bench = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Wooden_Low_Table = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Sofa = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Wooden_Wardrobe = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Table = {volume: 116, time: 123, mass: 327.62, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 36, 'Silicon_Pure', 80]}
var Trash = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Wooden_Sofa = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Nightstand = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Wardrobe = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Wooden_Chair = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var HMS_Ajax33_Artist_Unknown = {volume: 9, time: 270, mass: 54.59, produce: 1, tier: 4, catalyst: [], mats: ['Intermediary_Part_3', 2, 'Intermediary_Part_2', 2, 'Zirconium_Pure', 5]}
var Parrotos_Sanctuary_Artist_Unknown = {volume: 9, time: 270, mass: 54.59, produce: 1, tier: 4, catalyst: [], mats: ['Intermediary_Part_3', 2, 'Intermediary_Part_2', 2, 'Zirconium_Pure', 5]}
var Eye_Dolls_Workshop_Artist_Unkown = {volume: 9, time: 270, mass: 54.59, produce: 1, tier: 4, catalyst: [], mats: ['Intermediary_Part_3', 2, 'Intermediary_Part_2', 2, 'Zirconium_Pure', 5]}
var Wooden_Armchair = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Round_Carpet = {volume: 9, time: 810, mass: 70.06, produce: 1, tier: 5, catalyst: [], mats: ['Intermediary_Part_3', 4, 'Niobium_Pure', 5]}
var Square_Carpet = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Wooden_Dresser = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Wooden_Table_M = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Wooden_Table_L = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}
var Shelf_Empty = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Shelf_Half_Full = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Shelf_Full = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Bed = {volume: 32, time: 35, mass: 93.68, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 12, 'Silicon_Pure', 20]}

var Pipe_D_M = {volume: 428, time: 429, mass: 1170, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 108, 'Silicon_Pure', 320]}
var Pipe_Corner_M = {volume: 428, time: 429, mass: 1170, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 108, 'Silicon_Pure', 320]}
var Pipe_B_M = {volume: 428, time: 429, mass: 1170, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 108, 'Silicon_Pure', 320]}
var Pipe_A_M = {volume: 428, time: 429, mass: 1170, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 108, 'Silicon_Pure', 320]}
var Pipe_Connector_M = {volume: 428, time: 429, mass: 1170, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 108, 'Silicon_Pure', 320]}
var Pipe_C_M = {volume: 428, time: 429, mass: 1170, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 108, 'Silicon_Pure', 320]}

var Sink_Unit = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Shower_Unit = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Urinal_Unit = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Toilet_Unit_B = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}
var Toilet_Unit_A = {volume: 9, time: 10, mass: 27.34, produce: 1, tier: 1, catalyst: [], mats: ['Intermediary_Part_1', 4, 'Silicon_Pure', 5]}

var Command_Seat_Controller = {volume: 120, time: 120, mass: 176.09, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_S', 1, 'Complex_Part_1', 3, 'Structural_Part_1_S', 1, 'Polycarbonate_Plastic_Product', 20]}

var Hovercraft_Seat_Controller = {volume: 120, time: 120, mass: 176.09, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_S', 1, 'Complex_Part_1', 3, 'Structural_Part_1_S', 1, 'Polycarbonate_Plastic_Product', 20]}

var Remote_Controller = {volume: 47, time: 120, mass: 176.51, produce: 1, tier: 3, catalyst: [], mats: ['Functional_Part_3_XS', 1, 'Complex_Part_3', 1, 'Maraging_Steel_Product', 1, 'Duralumin_Product', 1]}

var Cockpit_Controller = {volume: 420, time: 360, mass: 666.13, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_M', 1, 'Complex_Part_1', 9, 'Structural_Part_1_M', 1, 'Polycarbonate_Plastic_Product', 80]}

var Programming_Board = {volume: 35, time: 40, mass: 47.21, produce: 1, tier: 1, catalyst: [], mats: ['Functional_Part_1_XS', 1, 'Complex_Part_1', 1, 'Structural_Part_1_XS', 1, 'Polycarbonate_Plastic_Product', 5]}

var Carbon_Pure = {volume: 1, time: 5, mass: 2.27, produce: 50, tier: 1, catalyst: [], mats: ['Carbon_Ore', 60]}
var Iron_Pure = {volume: 1, time: 5, mass: 7.85, produce: 50, tier: 1, catalyst: [], mats: ['Iron_Ore', 60]}
var Titanium_Pure = {volume: 1, time: 3125, mass: 4.51, produce: 50, tier: 5, catalyst: [], mats: ['Titanium_Ore', 60]}
var Tungsten_Pure = {volume: 1, time: 25, mass: 19.3, produce: 50, tier: 2, catalyst: [], mats: ['Tungsten_Ore', 60]}
var Niobium_Pure = {volume: 1, time: 3125, mass: 8.57, produce: 50, tier: 5, catalyst: [], mats: ['Niobium_Ore', 60]}
var Rhenium_Pure = {volume: 1, time: 3125, mass: 21.02, produce: 50, tier: 5, catalyst: [], mats: ['Rhenium_Ore', 60]}
var Copper_Pure = {volume: 1, time: 125, mass: 8.96, produce: 50, tier: 3, catalyst: [], mats: ['Copper_Ore', 60]}
var Molybdenum_Pure = {volume: 1, time: 625, mass: 10.28, produce: 50, tier: 4, catalyst: [], mats: ['Molybdenum_Ore', 60]}
var Vanadium_Pure = {volume: 1, time: 3125, mass: 6, produce: 50, tier: 5, catalyst: [], mats: ['Vanadium_Ore', 60]}
var Chromium_Pure = {volume: 1, time: 125, mass: 7.19, produce: 50, tier: 3, catalyst: [], mats: ['Chromium_Ore', 60]}
var Aluminium_Pure = {volume: 1, time: 25, mass: 2.27, produce: 50, tier: 2, catalyst: [], mats: ['Aluminium_Ore', 60]}
var Manganese_Pure = {volume: 1, time: 625, mass: 7.21, produce: 50, tier: 4, catalyst: [], mats: ['Manganese_Ore', 60]}
var Silicon_Pure = {volume: 1, time: 5, mass: 2.33, produce: 50, tier: 1, catalyst: [], mats: ['Silicon_Ore', 60]}
var Nickel_Pure = {volume: 1, time: 25, mass: 8.91, produce: 50, tier: 2, catalyst: [], mats: ['Nickel_Ore', 60]}
var Scandium_Pure = {volume: 1, time: 125, mass: 2.98, produce: 50, tier: 3, catalyst: [], mats: ['Scandium_Ore', 60]}
var Zirconium_Pure = {volume: 1, time: 625, mass: 6.52, produce: 50, tier: 4, catalyst: [], mats: ['Zirconium_Ore', 60]}
var Lead_Pure = {volume: 1, time: 25, mass: 11.34, produce: 50, tier: 2, catalyst: [], mats: ['Lead_Ore', 60]}
var Sodium_Pure = {volume: 1, time: 5, mass: 0.97, produce: 50, tier: 1, catalyst: [], mats: ['Sodium_Ore', 60]}
var Gold_Pure = {volume: 1, time: 625, mass: 19.3, produce: 50, tier: 4, catalyst: [], mats: ['Gold_Ore', 60]}
var Platinum_Pure = {volume: 1, time: 125, mass: 21.45, produce: 50, tier: 3, catalyst: [], mats: ['Platinum_Ore', 60]}

var Xeron_Fuel = {volume: 1, time: 125, mass: 6, produce: 100, tier: 2, catalyst: [], mats: ['Tungsten_Ore', 30, 'Platinum_Ore', 70]}

var Nitron_Fuel = {volume: 1, time: 5, mass: 4, produce: 100, tier: 1, catalyst: [], mats: ['Iron_Ore', 50, 'Sodium_Ore', 50]}

var Kergon_Fuel = {volume: 1, time: 25, mass: 6, produce: 100, tier: 1, catalyst: [], mats: ['Tungsten_Ore', 40, 'Sodium_Ore', 60]}

var Duralumin_Product = {volume: 1, time: 125, mass: 5.61, produce: 50, tier: 3, catalyst: ['Catalyst_3', 1], mats: ['Aluminium_Pure', 50, 'Copper_Pure', 50, 'Catalyst_3', 1]}
var Marble_Product = {volume: 1, time: 25, mass: 10.78, produce: 100, tier: 2, catalyst: [], mats: ['Carbon_Pure', 50, 'Tungsten_Pure', 50]}
var Concrete_Product = {volume: 1, time: 5, mass: 2.3, produce: 100, tier: 1, catalyst: [], mats: ['Silicon_Pure', 50, 'Carbon_Pure', 50]}
var Wood_Product = {volume: 1, time: 5, mass: 2.27, produce: 100, tier: 1, catalyst: [], mats: ['Carbon_Pure', 100]}
var Titanium_21_Product = {volume: 1, time: 3125, mass: 5.51, produce: 50, tier: 5, catalyst: ['Catalyst_4', 1, 'Catalyst_5', 1], mats: ['Titanium_Pure', 50, 'Zirconium_Pure', 50, 'Catalyst_4', 1, 'Catalyst_5', 1]}
var Polycarbonate_Plastic_Product = {volume: 1, time: 5, mass: 2.3, produce: 50, tier: 1, catalyst: [], mats: ['Silicon_Pure', 50, 'Carbon_Pure', 50]}
var Carbon_Fiber_Product = {volume: 1, time: 5, mass: 2.28, produce: 100, tier: 1, catalyst: [], mats: ['Polycarbonate_Plastic_Product', 50, 'Carbon_Pure', 50]}
var Zircaloy_Product = {volume: 1, time: 625, mass: 6.86, produce: 50, tier: 4, catalyst: ['Catalyst_3', 1, 'Catalyst_4', 1], mats: ['Chromium_Pure', 50, 'Zirconium_Pure', 50, 'Catalyst_3', 1, 'Catalyst_4', 1]}
var Brick_Product = {volume: 1, time: 25, mass: 2.3, produce: 100, tier: 2, catalyst: [], mats: ['Aluminium_Pure', 50, 'Silicon_Pure', 50]}
var Maraging_Steel_Product = {volume: 1, time: 25, mass: 9.6, produce: 50, tier: 2, catalyst: [], mats: ['Iron_Pure', 50, 'Nickel_Pure', 50]}

var Catalyst_3 = {volume: 100, time: 2500, mass: 649.39, produce: 1, tier: 3, catalyst: [], mats: ['Sodium_Pure', 200, 'Tungsten_Pure', 100, 'Scandium_Pure', 50]}
var Catalyst_4 = {volume: 100, time: 12480, mass: 606.65, produce: 1, tier: 4, catalyst: [], mats: ['Sodium_Pure', 500, 'Tungsten_Pure', 200, 'Scandium_Pure', 100, 'Molybdenum_Pure', 50]}
var Catalyst_5 = {volume: 100, time: 62520, mass: 657.68, produce: 1, tier: 5, catalyst: [], mats: ['Sodium_Pure', 1000, 'Tungsten_Pure', 500, 'Scandium_Pure', 200, 'Zirconium_Pure', 100, 'Vanadium_Pure', 50]}

var Iron_Homeycomb_Material = {volume: 1, time: 1, mass: 94.2, produce: 1, tier: 1, catalyst: [], mats: ['Iron_Pure', 10]}
var Plastic_Homeycomb_Material = {volume: 1, time: 1, mass: 27.57, produce: 1, tier: 1, catalyst: [], mats: ['Polycarbonate_Plastic_Product', 10]}
var Copper_Homeycomb_Material = {volume: 1, time: 1, mass: 107.52, produce: 1, tier: 3, catalyst: [], mats: ['Copper_Pure', 10]}
var Gold_Homeycomb_Material = {volume: 1, time: 1, mass: 231.6, produce: 1, tier: 4, catalyst: [], mats: ['Gold_Pure', 10]}
var Wood_Homeycomb_Material = {volume: 1, time: 1, mass: 27.91, produce: 1, tier: 1, catalyst: [], mats: ['Wood_Product', 10]}
var Titanium_Homeycomb_Material = {volume: 1, time: 1, mass: 54.07, produce: 1, tier: 5, catalyst: [], mats: ['Titanium_Pure', 10]}
var Brick_Homeycomb_Material = {volume: 1, time: 1, mass: 27.57, produce: 1, tier: 1, catalyst: [], mats: ['Brick_Product', 10]}
var Steel_Homeycomb_Material = {volume: 1, time: 1, mass: 115.14, produce: 1, tier: 2, catalyst: [], mats: ['Maraging_Steel_Product', 10]}
var Concrete_Homeycomb_Material = {volume: 1, time: 1, mass: 27.57, produce: 1, tier: 1, catalyst: [], mats: ['Concrete_Product', 10]}
var Marble_Homeycomb_Material = {volume: 1, time: 1, mass: 129.4, produce: 1, tier: 2, catalyst: [], mats: ['Marble_Product', 10]}
var Chromium_Homeycomb_Material = {volume: 1, time: 1, mass: 86.28, produce: 1, tier: 3, catalyst: [], mats: ['Chromium_Pure', 10]}
var Aluminium_Homeycomb_Material = {volume: 1, time: 1, mass: 27.19, produce: 1, tier: 2, catalyst: [], mats: ['Aluminium_Pure', 10]}
var Carbonfiber_Homeycomb_Material = {volume: 1, time: 1, mass: 27.38, produce: 1, tier: 1, catalyst: [], mats: ['Carbon_Fiber_Product', 10]}

/*	This section is outdated and no longer used
var Enhanced_Scrap = {name: 'Enhanced_Scrap', volume: 1, time: 50, mass: 1, produce: 1, tier: 1, catalyst: [], mats: ['Nickel_Ore', 1.2]}
var Advanced_Scrap = {name: 'Advanced_Scrap', volume: 1, time: 240, mass: 1, produce: 1, tier: 1, catalyst: [], mats: ['Copper_Ore', 1.2]}
var Basic_Scrap = {name: 'Basic_Scrap', volume: 1, time: 10, mass: 1, produce: 1, tier: 1, catalyst: [], mats: ['Iron_Ore', 1.2]}
var Boosted_Scrap = {name: 'Boosted_Scrap', volume: 1, time: 1260, mass: 1, produce: 1, tier: 1, catalyst: [], mats: ['Zirconium_Ore', 1.2]}
*/

var Scandium_Scrap = {volume: 1, time: 48, mass: 2.98, produce: 50, tier: 3, catalyst: [], mats: ['Scandium_Pure', 50]}
var Chromium_Scrap = {volume: 1, time: 48, mass: 7.19, produce: 50, tier: 3, catalyst: [], mats: ['Chromium_Pure', 50]}
var Nickel_Scrap = {volume: 1, time: 12, mass: 8.91, produce: 50, tier: 2, catalyst: [], mats: ['Nickel_Pure', 50]}
var Gold_Scrap = {volume: 1, time: 192, mass: 19.3, produce: 50, tier: 4, catalyst: [], mats: ['Gold_Pure', 50]}
var Platinum_Scrap = {volume: 1, time: 48, mass: 21.45, produce: 50, tier: 3, catalyst: [], mats: ['Platinum_Pure', 50]}
var Manganese_Scrap = {volume: 1, time: 192, mass: 7.21, produce: 50, tier: 4, catalyst: [], mats: ['Manganese_Pure', 50]}
var Tungsten_Scrap = {volume: 1, time: 12, mass: 19.3, produce: 50, tier: 2, catalyst: [], mats: ['Tungsten_Pure', 50]}
var Lead_Scrap = {volume: 1, time: 12, mass: 11.34, produce: 50, tier: 2, catalyst: [], mats: ['Lead_Pure', 50]}
var Sodium_Scrap = {volume: 1, time: 3, mass: 0.97, produce: 50, tier: 1, catalyst: [], mats: ['Sodium_Pure', 50]}
var Aluminium_Scrap = {volume: 1, time: 12, mass: 2.27, produce: 50, tier: 2, catalyst: [], mats: ['Aluminium_Pure', 50]}
var Iron_Scrap = {volume: 1, time: 3, mass: 7.85, produce: 50, tier: 1, catalyst: [], mats: ['Iron_Pure', 50]}
var Copper_Scrap = {volume: 1, time: 48, mass: 8.96, produce: 50, tier: 3, catalyst: [], mats: ['Copper_Pure', 50]}
var Molybdenum_Scrap = {volume: 1, time: 192, mass: 10.28, produce: 50, tier: 4, catalyst: [], mats: ['Molybdenum_Pure', 50]}
var Carbon_Scrap = {volume: 1, time: 3, mass: 7.85, produce: 50, tier: 1, catalyst: [], mats: ['Carbon_Pure', 50]}
var Zirconium_Scrap = {volume: 1, time: 192, mass: 6.52, produce: 50, tier: 4, catalyst: [], mats: ['Zirconium_Pure', 50]}
var Silicon_Scrap = {volume: 1, time: 3, mass: 2.33, produce: 50, tier: 1, catalyst: [], mats: ['Silicon_Pure', 50]}

var Carbon_Ore = {volume: 1, time: 0, mass: 2.27, produce: 1, tier: 1, catalyst: [], mats: []}
var Iron_Ore = {volume: 1, time: 0, mass: 7.85, produce: 1, tier: 1, catalyst: [], mats: []}
var Titanium_Ore = {volume: 1, time: 0, mass: 4.51, produce: 1, tier: 5, catalyst: [], mats: []}
var Tungsten_Ore = {volume: 1, time: 0, mass: 19.3, produce: 1, tier: 2, catalyst: [], mats: []}
var Niobium_Ore = {volume: 1, time: 0, mass: 8.57, produce: 1, tier: 5, catalyst: [], mats: []}
var Rhenium_Ore = {volume: 1, time: 0, mass: 21.02, produce: 1, tier: 5, catalyst: [], mats: []}
var Copper_Ore = {volume: 1, time: 0, mass: 8.96, produce: 1, tier: 3, catalyst: [], mats: []}
var Molybdenum_Ore = {volume: 1, time: 0, mass: 10.28, produce: 1, tier: 4, catalyst: [], mats: []}
var Vanadium_Ore = {volume: 1, time: 0, mass: 6, produce: 1, tier: 5, catalyst: [], mats: []}
var Chromium_Ore = {volume: 1, time: 0, mass: 7.19, produce: 1, tier: 3, catalyst: [], mats: []}
var Aluminium_Ore = {volume: 1, time: 0, mass: 2.27, produce: 1, tier: 2, catalyst: [], mats: []}
var Manganese_Ore = {volume: 1, time: 0, mass: 7.21, produce: 1, tier: 4, catalyst: [], mats: []}
var Silicon_Ore = {volume: 1, time: 0, mass: 2.33, produce: 1, tier: 1, catalyst: [], mats: []}
var Nickel_Ore = {volume: 1, time: 0, mass: 8.91, produce: 1, tier: 2, catalyst: [], mats: []}
var Scandium_Ore = {volume: 1, time: 0, mass: 2.98, produce: 1, tier: 3, catalyst: [], mats: []}
var Zirconium_Ore = {volume: 1, time: 0, mass: 6.52, produce: 1, tier: 4, catalyst: [], mats: []}
var Lead_Ore = {volume: 1, time: 0, mass: 11.34, produce: 1, tier: 2, catalyst: [], mats: []}
var Sodium_Ore = {volume: 1, time: 0, mass: 0.97, produce: 1, tier: 1, catalyst: [], mats: []}
var Gold_Ore = {volume: 1, time: 0, mass: 19.3, produce: 1, tier: 4, catalyst: [], mats: []}
var Platinum_Ore = {volume: 1, time: 0, mass: 21.45, produce: 1, tier: 3, catalyst: [], mats: []}

/*	███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
	██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
	█████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗
	██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║
	██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║
	╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝ */

function todo() {
    //someone has work to do!
}

function update_Error(txt) {
    document.getElementById("error_Place").innerHTML = txt;
}

function clear_Error() {
    document.getElementById("error_Place").innerHTML = "<P>Error: none</P>";
}

function get_Data(strA, strB) {
    var test_Var;
    try {
        test_Var = eval(strA);
    } catch(e) {
        if (e instanceof ReferenceError) {
            error_Code = "<P OnClick='clear_Error()'>Error: eval() failed for " + strA + "</P>";
            update_Error(error_Code);
            return null;
        } else {
            throw e;
        }
    }
    if (!test_Var.hasOwnProperty(strB)) {
        error_Code = "<P OnClick='clear_Error()'>" + strA + " does not have property of " + strB;
        update_Error(error_Code);
    } else {
        return eval(strA + "." + strB);
    }
}

function check_Data_Completeness() {	//loops through both arrays containing names of all items and verifys that they all exist as objects and that they all have the properties each object needs
    var temp_Name = "";					//will be a alert if there is a problem
    var temp_Property = "";
    for (x = 0; x < search_Terms.length; x++) {
        temp_Name = search_Terms[x].split(' ').join('_');
        for (y = 0; y < 7; y++) {
            if (y == 0) {temp_Property = ".volume"}
            if (y == 1) {temp_Property = ".time"}
            if (y == 2) {temp_Property = ".mass"}
            if (y == 3) {temp_Property = ".produce"}
            if (y == 4) {temp_Property = ".tier"}
            if (y == 5) {temp_Property = ".catalyst"}
            if (y == 6) {temp_Property = ".mats"}
            try {
                eval(temp_Name + temp_Property);
            } catch(e) {
                if (e instanceof ReferenceError) {
                    alert("We have a reference error with: " + temp_Name + temp_Property);
                    return null;
                } else {
                    throw e;
                }
            }
            temp_Property = temp_Property.slice(1);
            if (!eval(temp_Name).hasOwnProperty(temp_Property)) {
                alert(temp_Name + " does not have property of " + temp_Property);
            }
        }
    }
    for (a = 0; a < search_Terms_Extra.length; a++) {
        temp_Name = search_Terms_Extra[a].split(' ').join('_');
        for (b = 0; b < 7; b++) {
            if (b == 0) {temp_Property = ".volume"}
            if (b == 1) {temp_Property = ".time"}
            if (b == 2) {temp_Property = ".mass"}
            if (b == 3) {temp_Property = ".produce"}
            if (b == 4) {temp_Property = ".tier"}
            if (b == 5) {temp_Property = ".catalyst"}
            if (b == 6) {temp_Property = ".mats"}
            try {
                eval(temp_Name + temp_Property);
            } catch(e) {
                if (e instanceof ReferenceError) {
                    alert("We have a reference error with: " + temp_Name + temp_Property);
                    return null;
                } else {
                    throw e;
                }
            }
            temp_Property = temp_Property.slice(1);
            if (!eval(temp_Name).hasOwnProperty(temp_Property)) {
                alert(temp_Name + " does not have property of " + temp_Property);
            }
        }
    }
    alert("Both arrays checked, if there was no alerts you are good. Main length= " + search_Terms.length + " Extra length= " + search_Terms_Extra.length);
}

function change_Selected_Search(str, event) {
    if (event.keyCode == 13 || event.which == 13) {
        change_Selected(str.split(' ').join('_'));
    }
}

function change_Selected(str, is_Back_Forward, is_BP, index_Loc) {
    if (is_BP === true) {
        change_Selected_BP(index_Loc, str, is_Back_Forward);
    } else {
        var temp_Array = get_Data(str, "mats");
        if (is_Back_Forward === false || is_Back_Forward === undefined) {
            if (item_Selection_Back_Forward.length > item_Selection_Location+1) {
                //trim everything past selection
                item_Selection_Back_Forward.length = item_Selection_Location+1;
                item_Selection_Back_Forward_BP.length = item_Selection_Location+1;
                item_Selection_Back_Forward_Index.length = item_Selection_Location+1;
            }
            item_Selection_Back_Forward.push(str);
            item_Selection_Back_Forward_BP.push(false);
            item_Selection_Back_Forward_Index.push(-1);
            item_Selection_Location = item_Selection_Location + 1;
        }
        var temp_String_Name = str.split('_').join(' ');
        selected_Part = str;
        is_BP_Selected = false;
        var temp_String_HTML = "";
        temp_String_HTML = "<TABLE WIDTH=100%><TR><TD COLSPAN=2><TABLE WIDTH=100%><TR><TD OnClick='change_Selected_Back()'><SPAN CLASS='go_Left'><H3>⇐</H3></SPAN></TD><TD><CENTER><H3>" + temp_String_Name + "</H3></CENTER></TD><TD OnClick='change_Selected_Forward()'><SPAN CLASS='go_Right'><H3>⇒</H3></SPAN></TD></TR></TABLE></TD></TR><TR><TD>Material</TD><TD>#</TD></TR>";
        for (x = 0; x < temp_Array.length; x=x+2) {
            var temp_String_Name_X = temp_Array[x].split('_').join(' ');
            temp_String_HTML = temp_String_HTML + '<TR><TD OnClick="change_Selected(' + "'" + temp_Array[x] + "'" + ')">' + temp_String_Name_X + "</TD><TD>" + temp_Array[x+1] + "</TD></TR>";
        }
        temp_String_HTML = temp_String_HTML + "</TABLE><BR><BR><CENTER><P OnClick='generate_Price_Report()'>Report</P></CENTER>";
        document.getElementById("part_Selected").innerHTML = temp_String_HTML;
        var temp_Number_Produce = get_Data(str, "produce");
        var temp_Number_Volume = get_Data(str, "volume");
        var temp_Number_Tier = get_Data(str, "tier");
        if (temp_Number_Produce == 1) {
            document.getElementById("part_Selected_Volume").innerHTML = "Volume: " + temp_Number_Volume + "L";
        }
        if (temp_Number_Produce > 1) {
            document.getElementById("part_Selected_Volume").innerHTML = "Volume: " + temp_Number_Volume + "L.    Makes: " + temp_Number_Produce + " units/items";
        }
        var temp_Number_Time = get_Data(str, "time");
        temp_Number_Time = convert_Seconds_To_Days(temp_Number_Time);
        document.getElementById("part_Selected_Time").innerHTML = "Time: " + temp_Number_Time;
        document.getElementById("part_Selected_Tier").innerHTML = "Tier: " + temp_Number_Tier;
    }
}

function change_Selected_BP(index_Loc, str, is_Back_Forward) {
    if (is_Back_Forward === false || is_Back_Forward === undefined) {
        if (item_Selection_Back_Forward.length > item_Selection_Location+1) {
            //trim everything past selection
            item_Selection_Back_Forward.length = item_Selection_Location+1;
            item_Selection_Back_Forward_BP.length = item_Selection_Location+1;
            item_Selection_Back_Forward_Index.length = item_Selection_Location+1;
        }
        item_Selection_Back_Forward.push(str);
        item_Selection_Back_Forward_BP.push(true);
        item_Selection_Back_Forward_Index.push(index_Loc);
        item_Selection_Location = item_Selection_Location + 1;
    }
    var temp_String_Name = str.split('_').join(' ');
    selected_Part = str;
    is_BP_Selected = true;
    var temp_String_HTML = "";
    temp_String_HTML = "<TABLE WIDTH=100%><TR><TD COLSPAN=2><TABLE WIDTH=100%><TR><TD OnClick='change_Selected_Back()'><SPAN CLASS='go_Left'><H3>⇐</H3></SPAN></TD><TD><CENTER><H3>BP: " + temp_String_Name + "</H3></CENTER></TD><TD OnClick='change_Selected_Forward()'><SPAN CLASS='go_Right'><H3>⇒</H3></SPAN></TD></TR></TABLE></TD></TR><TR><TD>Material</TD><TD>#</TD></TR>";
    var temp_BP_Array = BP_Array[index_Loc+1].split(',');
    for (x = 1; x < temp_BP_Array.length; x=x+2) {
        temp_BP_Array[x] = parseFloat(temp_BP_Array[x]);
    }
    for (x = 0; x < temp_BP_Array.length; x=x+2) {
        var temp_String_Name_X = temp_BP_Array[x].split('_').join(' ');
        temp_String_HTML = temp_String_HTML + '<TR><TD OnClick="change_Selected(' + "'" + temp_BP_Array[x] + "'" + ')">' + temp_String_Name_X + "</TD><TD>" + temp_BP_Array[x+1] + "</TD></TR>";
    }
    temp_String_HTML = temp_String_HTML + "</TABLE><BR><BR><CENTER><P OnClick='generate_Price_Report()'>Report</P></CENTER><BR><BR><CENTER><P OnClick='delete_BP_Selected(" + index_Loc + ")' style='color:red';>Delete BP</P></CENTER>";
    document.getElementById("part_Selected").innerHTML = temp_String_HTML;
    document.getElementById("part_Selected_Volume").innerHTML = "Volume: Unknown";
    document.getElementById("part_Selected_Time").innerHTML = "Time: Unknown";
}

function change_Selected_Back() {
    if (item_Selection_Location < 1) {
        error_Code = "<P OnClick='clear_Error()'>Error: Nothing to go back to!</P>";
        update_Error(error_Code);
    } else {
        item_Selection_Location = item_Selection_Location - 1;
        change_Selected(item_Selection_Back_Forward[item_Selection_Location],true,item_Selection_Back_Forward_BP[item_Selection_Location],item_Selection_Back_Forward_Index[item_Selection_Location]);
    }
}

function change_Selected_Forward() {
    if (item_Selection_Location >= item_Selection_Back_Forward.length-1) {
        error_Code = "<P OnClick='clear_Error()'>Error: Nothing to go forward to!</P>";
        update_Error(error_Code);
    } else {
        item_Selection_Location = item_Selection_Location + 1;
        change_Selected(item_Selection_Back_Forward[item_Selection_Location],true,item_Selection_Back_Forward_BP[item_Selection_Location],item_Selection_Back_Forward_Index[item_Selection_Location]);
    }
}

function generate_Price_Report() {
    if (is_BP_Selected === true) {
        //alert("BP mode is not currently supported for the secret price report, check back in a future version.");
        //figure out what part of BP_Array we are searching for
        for (bpa = 0; bpa < BP_Array.length; bpa=bpa+2) {
            if (BP_Array[bpa] === selected_Part) {
                //found match
                var temp_Index_Loc = bpa + 1;
                break;
            }
        }
        var temp_BP_Item_List = BP_Array[temp_Index_Loc].split(',');
        var temp_Pure_Array = [];
        var temp_Number_Produce;
        var temp_Ore_Checker_Pure = "";
        var temp_Ore_Checker_Ore = "";
        var temp_Price_Calc_Array = [];
        var temp_Price_Calc_Array_Old = [];
        var temp_Price_Calc_Array_New = [];
        var temp_Price_Calc_Array_New_Temp = [];
        var temp_Time_Total_Tracker = 0;
        var temp_Price_Calc_Time_Value = [];
        for (bpb = 0; bpb < temp_BP_Item_List.length; bpb=bpb+2) {
            var temp_Price_Calc_Array_Old = get_Data(temp_BP_Item_List[bpb], "mats");
            for (by = 0; by < temp_Price_Calc_Array_Old.length; by=by+2) {
                temp_Ore_Checker_Ore = temp_Price_Calc_Array_Old[by].slice(-4);
                if ((temp_Ore_Checker_Ore == "_Ore" && use_Ores === true) || (temp_Ore_Checker_Ore != "_Ore")) {	//if it is ore, and you want to use ore, then run it. Otherwise if it isnt ore just run it.
                    temp_Number_Produce = get_Data(temp_BP_Item_List[bpb], "produce");
                    temp_Price_Calc_Array.push(temp_Price_Calc_Array_Old[by], (temp_Price_Calc_Array_Old[by+1] * temp_BP_Item_List[bpb+1] / temp_Number_Produce));
                }
            }
            for (bb = 0; bb < temp_Price_Calc_Array.length; bb=bb+2) {
                temp_Price_Calc_Time_Value = get_Data(temp_Price_Calc_Array[bb], "time");
                temp_Time_Total_Tracker = parseFloat((temp_Time_Total_Tracker + temp_Price_Calc_Time_Value * temp_Price_Calc_Array[bb+1]).toFixed(6));//this value is short
                temp_Ore_Checker_Ore = temp_Price_Calc_Array[bb].slice(-4);
                if ((temp_Ore_Checker_Ore == "_Ore" && use_Ores === true) || (temp_Ore_Checker_Ore != "_Ore")) {
                    temp_Price_Calc_Array_New_Temp = get_Data(temp_Price_Calc_Array[bb], "mats");
                    for (bl = 0; bl < temp_Price_Calc_Array_New_Temp.length; bl=bl+2) {
                        temp_Price_Calc_Array_New.push(temp_Price_Calc_Array_New_Temp[bl], (temp_Price_Calc_Array_New_Temp[bl+1]));
                    }	//we transfer values into a new array so that we dont modify values in old array when we multiply
                    for (bk = 0; bk < temp_Price_Calc_Array_New.length; bk=bk+2) {
                        temp_Price_Calc_Array_New[bk+1] = (temp_Price_Calc_Array_New_Temp[bk+1] * temp_Price_Calc_Array[bb+1]);
                    }
                    for (bc = 0; bc < temp_Price_Calc_Array_New.length; bc=bc+2) {
                        temp_Ore_Checker_Ore = temp_Price_Calc_Array_New[bc].slice(-4);
                        if ((temp_Ore_Checker_Ore == "_Ore" && use_Ores === true) || (temp_Ore_Checker_Ore != "_Ore")) {
                            temp_Number_Produce = get_Data(temp_Price_Calc_Array[bb], "produce");
                            temp_Price_Calc_Array.push(temp_Price_Calc_Array_New[bc], parseFloat((temp_Price_Calc_Array_New[bc+1] / temp_Number_Produce).toFixed(6)));
                        }
                    }
                    temp_Price_Calc_Array_New.length = 0;
                }
            }
            temp_Price_Calc_Time_Value = get_Data(temp_BP_Item_List[bpb], "time");
            temp_Time_Total_Tracker = temp_Time_Total_Tracker + temp_Price_Calc_Time_Value;//add time of the item we are crafting also
            for (ab = 0; ab < temp_Price_Calc_Array.length; ab=ab+2) {//combine values to only one of each
                for (ac = temp_Price_Calc_Array.length-2; ac > ab; ac=ac-2) {
                    if (temp_Price_Calc_Array[ab] == temp_Price_Calc_Array[ac] && temp_Price_Calc_Array[ac+1] != -1) {
                        temp_Price_Calc_Array[ab+1] = parseFloat((temp_Price_Calc_Array[ab+1] + temp_Price_Calc_Array[ac+1]).toFixed(6));
                        temp_Price_Calc_Array[ac+1] = -1;
                    }
                }
            }
            //filter out pures to new array here
            for (bz = 0; bz < temp_Price_Calc_Array.length; bz=bz+2) {
                temp_Ore_Checker_Pure = temp_Price_Calc_Array[bz].slice(-5);
                temp_Ore_Checker_Ore = temp_Price_Calc_Array[bz].slice(-4);
                if ((temp_Ore_Checker_Pure == "_Pure" && temp_Price_Calc_Array[bz+1] != -1 && use_Ores != true) || (temp_Ore_Checker_Ore == "_Ore" && temp_Price_Calc_Array[bz+1] != -1 && use_Ores === true)) {
                    temp_Pure_Array.push(temp_Price_Calc_Array[bz],temp_Price_Calc_Array[bz+1]);
                }
            }
            //reset arrays that need reset here
            temp_Price_Calc_Array = [];
            temp_Price_Calc_Array_Old = [];
            temp_Price_Calc_Array_New = [];
            temp_Price_Calc_Array_New_Temp = [];
            temp_Price_Calc_Time_Value = [];
        }
        //condense the pure array
        for (bpc = 0; bpc < temp_Pure_Array.length; bpc=bpc+2) {//combine values to only one of each
            for (bpd = temp_Pure_Array.length-2; bpd > bpc; bpd=bpd-2) {
                if (temp_Pure_Array[bpc] == temp_Pure_Array[bpd] && temp_Pure_Array[bpd+1] != -1) {
                    temp_Pure_Array[bpc+1] = parseFloat((temp_Pure_Array[bpc+1] + temp_Pure_Array[bpd+1]).toFixed(6));
                    temp_Pure_Array[bpd+1] = -1;
                }
            }
        }
        //create a new array for pures
        var temp_Pure_Array_New = [];
        for (bpe = 1; bpe < temp_Pure_Array.length; bpe=bpe+2) {
            if (temp_Pure_Array[bpe] != -1) {
                temp_Pure_Array_New.push(temp_Pure_Array[bpe-1],temp_Pure_Array[bpe]);
            }
        }
        var temp_Pure_String = "";
        var temp_Pure_Full_Report = "";
        var temp_Pure_Price = 0;
        var temp_Pure_Price_Total = 0;
        var temp_Pure_Price_Running_Total = 0;
        var temp_Markup_Value = parseFloat((1+(document.getElementById("markup_Price_Input").value/100)).toFixed(6));
        var temp_Markup_Value_String = parseFloat((100 * temp_Markup_Value).toFixed(6)) + "%";
        var temp_Pure_Time_Price = document.getElementById("time_Price_Input").value;
        for (ca = 0; ca < temp_Pure_Array_New.length; ca=ca+2) {
            if (use_Ores === true) {
                temp_Pure_String = temp_Pure_Array_New[ca].slice(0,-4);
            } else
            if (use_Ores === false) {
                temp_Pure_String = temp_Pure_Array_New[ca].slice(0,-5);
            }
            temp_Pure_Price = document.getElementById(temp_Pure_String + "_Price_Input").value;
            temp_Pure_Price_Total = parseFloat((temp_Pure_Array_New[ca+1] * temp_Pure_Price * temp_Markup_Value).toFixed(6));
            temp_Pure_Full_Report = temp_Pure_Full_Report + temp_Pure_String + ": " + temp_Pure_Array_New[ca+1] + " * " + temp_Pure_Price + " * " + temp_Markup_Value_String + " = " + temp_Pure_Price_Total + "\n";
            temp_Pure_Price_Running_Total = parseFloat((temp_Pure_Price_Running_Total + temp_Pure_Price_Total).toFixed(6));
        }
        var temp_Pure_Time_Price_Total = parseFloat((temp_Time_Total_Tracker * temp_Pure_Time_Price).toFixed(6));
        temp_Pure_Price_Running_Total = parseFloat((temp_Pure_Price_Running_Total + temp_Pure_Time_Price_Total).toFixed(6));
        temp_Pure_Full_Report = temp_Pure_Full_Report + "Total time: " + temp_Time_Total_Tracker + " * " + temp_Pure_Time_Price + " = " + temp_Pure_Time_Price_Total + "\n";
        temp_Pure_Full_Report = temp_Pure_Full_Report + "Total = " + temp_Pure_Price_Running_Total;
        if (use_Ores === true) {
            temp_Pure_Full_Report = temp_Pure_Full_Report + "\nThis is a ORE report";
        } else
        if (use_Ores === false) {
            temp_Pure_Full_Report = temp_Pure_Full_Report + "\nThis is a PURE report";
        }
        alert("Here is your report:\n" + temp_Pure_Full_Report + "\nHave a nice day!");
    } else {	//not a BP, regular report code here
        try {
            if (selected_Part == "") {
                throw new Error("no part");
            }
        }
        catch(e) {
            if (e.message == "no part") {
                error_Code = "<P OnClick='clear_Error()'>Error: nothing selected to calculate</P>";
                update_Error(error_Code);
                return null;
            }
        }
        var temp_Number_Produce;
        var temp_Price_Calc_Array_Old = get_Data(selected_Part, "mats");
        var temp_Ore_Checker_Pure = "";
        var temp_Ore_Checker_Ore = "";
        var temp_Price_Calc_Array = [];
        for (by = 0; by < temp_Price_Calc_Array_Old.length; by=by+2) {
            temp_Ore_Checker_Ore = temp_Price_Calc_Array_Old[by].slice(-4);
            if ((temp_Ore_Checker_Ore == "_Ore" && use_Ores === true) || (temp_Ore_Checker_Ore != "_Ore")) {	//if it is ore, and you want to use ore, then run it. Otherwise if it isnt ore just run it.
                temp_Number_Produce = get_Data(selected_Part, "produce");
                temp_Price_Calc_Array.push(temp_Price_Calc_Array_Old[by], (temp_Price_Calc_Array_Old[by+1] / temp_Number_Produce)); //testing no divide
            }
        }
        var temp_Price_Calc_Array_New = [];
        var temp_Price_Calc_Array_New_Temp = [];
        var temp_Time_Total_Tracker = 0;
        for (bb = 0; bb < temp_Price_Calc_Array.length; bb=bb+2) {
            var temp_Price_Calc_Time_Value = get_Data(temp_Price_Calc_Array[bb], "time");
            temp_Time_Total_Tracker = parseFloat((temp_Time_Total_Tracker + temp_Price_Calc_Time_Value * temp_Price_Calc_Array[bb+1]).toFixed(6));//this value is short
            temp_Ore_Checker_Ore = temp_Price_Calc_Array[bb].slice(-4);
            if ((temp_Ore_Checker_Ore == "_Ore" && use_Ores === true) || (temp_Ore_Checker_Ore != "_Ore")) {
                temp_Price_Calc_Array_New_Temp = get_Data(temp_Price_Calc_Array[bb], "mats");
                for (bl = 0; bl < temp_Price_Calc_Array_New_Temp.length; bl=bl+2) {
                    temp_Price_Calc_Array_New.push(temp_Price_Calc_Array_New_Temp[bl], (temp_Price_Calc_Array_New_Temp[bl+1]));
                }	//we transfer values into a new array so that we dont modify values in old array when we multiply
                for (bk = 0; bk < temp_Price_Calc_Array_New.length; bk=bk+2) {
                    temp_Price_Calc_Array_New[bk+1] = (temp_Price_Calc_Array_New_Temp[bk+1] * temp_Price_Calc_Array[bb+1]);
                }
                for (bc = 0; bc < temp_Price_Calc_Array_New.length; bc=bc+2) {
                    temp_Ore_Checker_Ore = temp_Price_Calc_Array_New[bc].slice(-4);
                    if ((temp_Ore_Checker_Ore == "_Ore" && use_Ores === true) || (temp_Ore_Checker_Ore != "_Ore")) {
                        temp_Number_Produce = get_Data(temp_Price_Calc_Array[bb], "produce");
                        temp_Price_Calc_Array.push(temp_Price_Calc_Array_New[bc], parseFloat((temp_Price_Calc_Array_New[bc+1] / temp_Number_Produce).toFixed(6)));
                    }
                }
                temp_Price_Calc_Array_New.length = 0;
            }
        }
        temp_Price_Calc_Time_Value = get_Data(selected_Part, "time");
        temp_Time_Total_Tracker = temp_Time_Total_Tracker + temp_Price_Calc_Time_Value;//add time of the item we are crafting also
        for (ab = 0; ab < temp_Price_Calc_Array.length; ab=ab+2) {//combine values to only one of each
            for (ac = temp_Price_Calc_Array.length-2; ac > ab; ac=ac-2) {
                if (temp_Price_Calc_Array[ab] == temp_Price_Calc_Array[ac] && temp_Price_Calc_Array[ac+1] != -1) {
                    temp_Price_Calc_Array[ab+1] = parseFloat((temp_Price_Calc_Array[ab+1] + temp_Price_Calc_Array[ac+1]).toFixed(6));
                    temp_Price_Calc_Array[ac+1] = -1;
                }
            }
        }
        //filter out pures to new array here
        var temp_Pure_Array = [];
        for (bz = 0; bz < temp_Price_Calc_Array.length; bz=bz+2) {
            temp_Ore_Checker_Pure = temp_Price_Calc_Array[bz].slice(-5);
            temp_Ore_Checker_Ore = temp_Price_Calc_Array[bz].slice(-4);
            if ((temp_Ore_Checker_Pure == "_Pure" && temp_Price_Calc_Array[bz+1] != -1 && use_Ores != true) || (temp_Ore_Checker_Ore == "_Ore" && temp_Price_Calc_Array[bz+1] != -1 && use_Ores === true)) {
                temp_Pure_Array.push(temp_Price_Calc_Array[bz],temp_Price_Calc_Array[bz+1]);
            }
        }
        var temp_Pure_String = "";
        var temp_Pure_Full_Report = "";
        var temp_Pure_Price = 0;
        var temp_Pure_Price_Total = 0;
        var temp_Pure_Price_Running_Total = 0;
        var temp_Markup_Value = parseFloat((1+(document.getElementById("markup_Price_Input").value/100)).toFixed(6));
        var temp_Markup_Value_String = parseFloat((100 * temp_Markup_Value).toFixed(6)) + "%";
        var temp_Pure_Time_Price = document.getElementById("time_Price_Input").value;
        for (ca = 0; ca < temp_Pure_Array.length; ca=ca+2) {
            if (use_Ores === true) {
                temp_Pure_String = temp_Pure_Array[ca].slice(0,-4);
            } else
            if (use_Ores === false) {
                temp_Pure_String = temp_Pure_Array[ca].slice(0,-5);
            }
            temp_Pure_Price = document.getElementById(temp_Pure_String + "_Price_Input").value;
            temp_Pure_Price_Total = parseFloat((temp_Pure_Array[ca+1] * temp_Pure_Price * temp_Markup_Value).toFixed(6));
            temp_Pure_Full_Report = temp_Pure_Full_Report + temp_Pure_String + ": " + temp_Pure_Array[ca+1] + " * " + temp_Pure_Price + " * " + temp_Markup_Value_String + " = " + temp_Pure_Price_Total + "\n";
            temp_Pure_Price_Running_Total = parseFloat((temp_Pure_Price_Running_Total + temp_Pure_Price_Total).toFixed(6));
        }
        var temp_Pure_Time_Price_Total = parseFloat((temp_Time_Total_Tracker * temp_Pure_Time_Price).toFixed(6));
        temp_Pure_Price_Running_Total = parseFloat((temp_Pure_Price_Running_Total + temp_Pure_Time_Price_Total).toFixed(6));
        temp_Pure_Full_Report = temp_Pure_Full_Report + "Total time: " + temp_Time_Total_Tracker + " * " + temp_Pure_Time_Price + " = " + temp_Pure_Time_Price_Total + "\n";
        temp_Pure_Full_Report = temp_Pure_Full_Report + "Total = " + temp_Pure_Price_Running_Total;
        if (use_Ores === true) {
            temp_Pure_Full_Report = temp_Pure_Full_Report + "\nThis is a ORE report";
        } else
        if (use_Ores === false) {
            temp_Pure_Full_Report = temp_Pure_Full_Report + "\nThis is a PURE report";
        }
        alert("Here is your report:\n" + temp_Pure_Full_Report + "\nHave a nice day!");
    }
}

function use_Ores_Check() {
    var temp_Checkbox_Value = document.getElementById("use_Ores_Checkbox");
    if (temp_Checkbox_Value.checked == true) {
        use_Ores = true;
    }
    if (temp_Checkbox_Value.checked == false) {
        use_Ores = false;
    }
}

function change_Menu_Listing_Class() {
    for (x = 0; x < search_Terms.length; x++) {
        var temp_String_Name = search_Terms[x].split(' ').join('_');
        var temp_Array = get_Data(temp_String_Name, "mats");
        document.getElementById(temp_String_Name).className = "b";
        for (y = 0; y < temp_Array.length; y=y+2) {
            var temp_Is_It_In_Inventory = false;
            for (z = 0; z < inventory_Array.length; z=z+2) {
                if (inventory_Array[z] == temp_Array[y]) {
                    //we found a match, now check if the values are enough
                    if (inventory_Array[z+1] >= temp_Array[y+1]) {
                        //there is enough in inventory for this material
                        temp_Is_It_In_Inventory = true;
                        break
                    } else {
                        //not enough to craft so set class to gray and break.
                        if (show_Only_Craftable == false) {
                            document.getElementById(temp_String_Name).className = "c";
                        }
                        if (show_Only_Craftable == true) {
                            document.getElementById(temp_String_Name).className = "d";
                        }
                        break
                    }
                }
            }
            if (temp_Is_It_In_Inventory == false) {
                if (show_Only_Craftable == false) {
                    document.getElementById(temp_String_Name).className = "c";
                }
                if (show_Only_Craftable == true) {
                    document.getElementById(temp_String_Name).className = "d";
                }
                break
            }
        }
    }
}

function craftable_Check() {
    var temp_Checkbox_Value = document.getElementById("craftable_Checkbox");
    if (temp_Checkbox_Value.checked === true) {
        show_Only_Craftable = true;
        hide_All_Menus(4);
    }
    if (temp_Checkbox_Value.checked === false) {
        show_Only_Craftable = false;
        hide_All_Menus(3);
    }
    change_Menu_Listing_Class();
}

function convert_Seconds_To_Days(number_Of_Seconds) {
    //take in a number in seconds, return a string in Days: ,H:M:S format
    var temp_Time_String = "";
    var num_Of_Days = Math.floor(number_Of_Seconds/86400);
    number_Of_Seconds = parseFloat((number_Of_Seconds%86400).toFixed(6));
    var num_Of_Hours = Math.floor(number_Of_Seconds/3600);
    number_Of_Seconds = parseFloat((number_Of_Seconds%3600).toFixed(6));
    var num_Of_Minutes = Math.floor(number_Of_Seconds/60);
    number_Of_Seconds = Math.floor(parseFloat((number_Of_Seconds%60).toFixed(6)));
    if (num_Of_Days >  0) {
        temp_Time_String = num_Of_Days + " Days, ";
    }
    if (num_Of_Hours == 0 && num_Of_Days == 0) {
        //do nothing
    } else {
        temp_Time_String = temp_Time_String + " " + num_Of_Hours + ":";
    }
    if (num_Of_Hours == 0 && num_Of_Days == 0 && num_Of_Minutes == 0) {
        //do nothing
    } else {
        if (num_Of_Hours > 0 || num_Of_Days > 0) {
            if (num_Of_Minutes < 10) {
                temp_Time_String = temp_Time_String + "0";
            }
        }
        temp_Time_String = temp_Time_String + num_Of_Minutes + ":";
    }
    if (num_Of_Minutes > 0 || num_Of_Hours > 0 || num_Of_Days > 0) {
        if (number_Of_Seconds < 10) {
            temp_Time_String = temp_Time_String + "0";
        }
    }
    temp_Time_String = temp_Time_String + number_Of_Seconds;
    return temp_Time_String;
}

function text_Data_Import(name) {
    //text_Import_Export id of text field
    var temp_Data_Array = [];
    if (text_Overwrite_Append === true) {
        //orverwrite
        if (name == "que") {
            if (document.getElementById("text_Import_Export").value == "") {
                error_Code = "<P OnClick='clear_Error()'>Error: Text field is empty, nothing to import</P>";
                update_Error(error_Code);
            }
            que_Array.length = 0;
            temp_Data_Array = document.getElementById("text_Import_Export").value.split('|');
            for (x = 0; x < temp_Data_Array.length; x=x+2) {
                update_Que_Input(temp_Data_Array[x], parseFloat(temp_Data_Array[x+1]));		//make sure numbers are floats
            }
            redraw_Que();
        } else
        if (name == "inv") {
            if (document.getElementById("text_Import_Export").value == "") {
                error_Code = "<P OnClick='clear_Error()'>Error: Text field is empty, nothing to import</P>";
                update_Error(error_Code);
            }
            inventory_Array.length = 0;
            temp_Data_Array = document.getElementById("text_Import_Export").value.split('|');
            for (x = 0; x < temp_Data_Array.length; x=x+2) {
                update_Inventory_Input(temp_Data_Array[x], parseFloat(temp_Data_Array[x+1]));
            }
            redraw_Inventory();
        } else {
            //error
        }
    } else
    if (text_Overwrite_Append === false) {
        //append
        if (name == "que") {
            if (document.getElementById("text_Import_Export").value == "") {
                error_Code = "<P OnClick='clear_Error()'>Error: Text field is empty, nothing to import</P>";
                update_Error(error_Code);
            } else {
                if (que_Array[0] == empty_Que_String) {
                    que_Array.length = 0;
                }
                temp_Data_Array = document.getElementById("text_Import_Export").value.split('|');
                for (x = 0; x < temp_Data_Array.length; x=x+2) {
                    update_Que_Input(temp_Data_Array[x], parseFloat(temp_Data_Array[x+1]));		//make sure numbers are floats
                }
                redraw_Que();
            }
        } else
        if (name == "inv") {
            if (document.getElementById("text_Import_Export").value == "") {
                error_Code = "<P OnClick='clear_Error()'>Error: Text field is empty, nothing to import</P>";
                update_Error(error_Code);
            } else {
                if (inventory_Array[0] == empty_Inventory_String) {
                    inventory_Array.length = 0;
                }
                temp_Data_Array = document.getElementById("text_Import_Export").value.split('|');
                for (x = 0; x < temp_Data_Array.length; x=x+2) {
                    update_Inventory_Input(temp_Data_Array[x], parseFloat(temp_Data_Array[x+1]));		//make sure numbers are floats
                }
                redraw_Inventory();
            }
        }
    }
}

function text_Data_Export(name) {
    var temp_Data_String = "";
    if (name == "que") {
        if (que_Array[0] == empty_Que_String) {
            error_Code = "<P OnClick='clear_Error()'>Error: Que is empty, nothing to export</P>";
            update_Error(error_Code);
        } else {
            for (x = 0; x < que_Array.length; x++) {
                temp_Data_String = temp_Data_String + que_Array[x] + "|";
            }
            if (que_Array.length > 0) {
                temp_Data_String = temp_Data_String.slice(0, -1);
            }
            document.getElementById("text_Import_Export").value = temp_Data_String;
        }
    } else
    if (name == "inv") {
        if (inventory_Array[0] == empty_Inventory_String) {
            error_Code = "<P OnClick='clear_Error()'>Error: Inventory is empty, nothing to export</P>";
            update_Error(error_Code);
        } else {
            for (y = 0; y < inventory_Array.length; y++) {
                temp_Data_String = temp_Data_String + inventory_Array[y] + "|";
            }
            if (inventory_Array.length > 0) {
                temp_Data_String = temp_Data_String.slice(0, -1);
            }
            document.getElementById("text_Import_Export").value = temp_Data_String;
        }
    }
}

function text_Import_Export_Check() {
    var temp_Checkbox_Value = document.getElementById("text_Import_Export_Checkbox");
    if (temp_Checkbox_Value.checked === true) {
        text_Overwrite_Append = true;
    }
    if (temp_Checkbox_Value.checked === false) {
        text_Overwrite_Append = false;
    }
    set_Local_Options_Storage();
}

function allow_Drop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    var temp_String = ev.target.id;
    temp_String = temp_String.slice(4);
    drag_Loc_From = parseInt(temp_String);
}

function drop(num) {
    //removing ev input in favor of just the number, as the event does not always relay information, this is actually reliable
    //instead will ignore the event and just use the number thrown in for the to location
    //ev.preventDefault();
    //var temp_String = ev.target.id;
    //temp_String = temp_String.slice(7);
    drag_Loc_To = parseInt(num);
    swap_Que_Locations(drag_Loc_From, drag_Loc_To);
    drag_Loc_To = -1;
    drag_Loc_From = -1;
}

/*	██╗███╗   ██╗██╗   ██╗███████╗███╗   ██╗████████╗ ██████╗ ██████╗ ██╗   ██╗
	██║████╗  ██║██║   ██║██╔════╝████╗  ██║╚══██╔══╝██╔═══██╗██╔══██╗╚██╗ ██╔╝
	██║██╔██╗ ██║██║   ██║█████╗  ██╔██╗ ██║   ██║   ██║   ██║██████╔╝ ╚████╔╝
	██║██║╚██╗██║╚██╗ ██╔╝██╔══╝  ██║╚██╗██║   ██║   ██║   ██║██╔══██╗  ╚██╔╝
	██║██║ ╚████║ ╚████╔╝ ███████╗██║ ╚████║   ██║   ╚██████╔╝██║  ██║   ██║
	╚═╝╚═╝  ╚═══╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝    */

function update_Inventory() {
    if (is_BP_Selected == true) {
        //error_Code = "<P OnClick='clear_Error()'>Error: Can not add BP to inventory!</P>";
        //update_Error(error_Code);
        //if its a blueprint, run for loop, and pass all values into inventory via other function
        var temp_Index_Loc = 0;
        for (bm = 0; bm < BP_Array.length; bm=bm+2) {
            if (BP_Array[bm] == selected_Part) {
                temp_Index_Loc = bm;
                break;
            }
        }
        var temp_BP_Array = BP_Array[temp_Index_Loc+1].split(',');
        for (bo = 0; bo < temp_BP_Array.length; bo=bo+2) {
            update_Inventory_Input(temp_BP_Array[bo], parseFloat(temp_BP_Array[bo+1]));	//make sure all numbers are floats and not strings.
        }
        redraw_Inventory();
    } else {
        var temp_Number_To_Add = parseFloat(document.getElementById("amount_To_Add_User_Input").value);
        try {
            if (selected_Part == "") {
                throw new Error("no part");
            }
            if (temp_Number_To_Add == 0) {
                throw new Error("zero");
            }
            if (temp_Number_To_Add < 0) {
                throw new Error("negative");
            }
            if (temp_Number_To_Add > 999999) {
                throw new Error("too big");
            }
        }
        catch(e) {
            if (e.message == "no part") {
                error_Code = "<P OnClick='clear_Error()'>Error: nothing selected to add</P>";
                update_Error(error_Code);
                return null;
            }
            if (e.message == "zero") {
                error_Code = "<P OnClick='clear_Error()'>Error: negative number</P>";
                update_Error(error_Code);
                return null;
            }
            if (e.message == "negative") {
                error_Code = "<P OnClick='clear_Error()'>Error: negative number</P>";
                update_Error(error_Code);
                return null;
            }
            if (e.message == "too big") {
                error_Code = "<P OnClick='clear_Error()'>Error: lets not try to add that much at once</P>";
                update_Error(error_Code);
                return null;
            }
        }
        var temp_Does_It_Finish = false;
        for (x = 0; x < inventory_Array.length; x=x+2) {
            if (inventory_Array[x] == selected_Part) {
                inventory_Array[x+1] = inventory_Array[x+1] + temp_Number_To_Add;
                temp_Does_It_Finish = true;
                break;
            }
        }
        if (temp_Does_It_Finish === false) {
            if (inventory_Array[0] == empty_Inventory_String) {
                inventory_Array.length = 0;
            }
            inventory_Array.push(selected_Part, temp_Number_To_Add);
        }
        redraw_Inventory();
    }
}

function update_Inventory_Input(name, num) {
    // this function does not redraw, must redraw from function calling this one
    //this function will be used for BP adding also
    try {
        if (name == "") {
            throw new Error("no part");
        }
        if (num == 0) {
            throw new Error("zero");
        }
        if (num < 0) {
            throw new Error("negative");
        }
        if (num > 999999) {
            throw new Error("too big");
        }
    }
    catch(e) {
        if (e.message == "no part") {
            error_Code = "<P OnClick='clear_Error()'>Error: nothing selected to add</P>";
            update_Error(error_Code);
            return null;
        }
        if (e.message == "zero") {
            error_Code = "<P OnClick='clear_Error()'>Error: negative number</P>";
            update_Error(error_Code);
            return null;
        }
        if (e.message == "negative") {
            error_Code = "<P OnClick='clear_Error()'>Error: negative number</P>";
            update_Error(error_Code);
            return null;
        }
        if (e.message == "too big") {
            error_Code = "<P OnClick='clear_Error()'>Error: lets not try to add that much at once</P>";
            update_Error(error_Code);
            return null;
        }
    }
    var temp_Does_It_Finish = false;
    for (x = 0; x < inventory_Array.length; x=x+2) {
        if (inventory_Array[x] == name) {
            inventory_Array[x+1] = inventory_Array[x+1] + num;
            temp_Does_It_Finish = true;
            break;
        }
    }
    if (temp_Does_It_Finish === false) {
        if (inventory_Array[0] == empty_Inventory_String) {
            inventory_Array.length = 0;
        }
        inventory_Array.push(name, num);
    }
}

function add_Everything_To_Inv() {
    var temp_String_Temp = "";
    for (z = 0; z < search_Terms.length; z++) {
        temp_String_Temp = search_Terms[z].split(' ').join('_');
        update_Inventory_Input(temp_String_Temp, 1000);
    }
    for (y = 0; y < search_Terms_Extra.length; y++) {
        update_Inventory_Input(search_Terms_Extra[y].split(' ').join('_'), 1000);
    }
    redraw_Inventory();
}

function delete_Inventory() {
    inventory_Array.length = 0;
    inventory_Array[0] = empty_Inventory_String;
    redraw_Inventory();
}

function delete_Item_From_Inventory(Loc) {
    inventory_Array.splice(Loc, 2);
    if (inventory_Array.length == 0) {
        inventory_Array[0] = empty_Inventory_String;
    }
    redraw_Inventory();
}

function reduce_Item_From_Inventory(Loc) {
    var temp_String_Index = "inv" + Loc;
    var temp_String_Number = document.getElementById(temp_String_Index).value;
    try {
        if (temp_String_Number == 0) {
            throw new Error("zero");
        }
        if (temp_String_Number < 0) {
            throw new Error("negative");
        }
    }
    catch(e) {
        if (e.message == "zero") {
            error_Code = "<P OnClick='clear_Error()'>Error: 0, so nothing changes?</P>";
            update_Error(error_Code);
            return null;
        }
        if (e.message == "negative") {
            error_Code = "<P OnClick='clear_Error()'>Error: negative number</P>";
            update_Error(error_Code);
            return null;
        }
    }
    if (temp_String_Number > inventory_Array[Loc+1]) {
        error_Code = "<P OnClick='clear_Error()'>Error: You just tried to remove more then you actually had to possibly remove!</P>";
        update_Error(error_Code);
    }
    if (temp_String_Number >= inventory_Array[Loc+1]) {
        delete_Item_From_Inventory(Loc);
    } else {
        inventory_Array[Loc+1] = inventory_Array[Loc+1] - temp_String_Number;
    }
    redraw_Inventory();
}

function redraw_Inventory() {
    change_Iventory_Used();
    if (use_Local_Storage === true) {
        set_Local_Inventory_Storage();
    }
    change_Menu_Listing_Class();
    var temp_String_HTML = "<FORM NAME='inventory_List_Form' METHOD=POST><TABLE><TR><TD>Item</TD><TD>#</TD><TD></TD></TR>";
    if (inventory_Array[0] == empty_Inventory_String) {
        temp_String_HTML = temp_String_HTML + '<TR><TD COLSPAN=2>' + empty_Inventory_String + '</TD></TR>';
    } else {
        for (x = 0; x < inventory_Array.length; x=x+2) {
            var temp_String_Name_X = inventory_Array[x].split('_').join(' ');
            temp_String_HTML = temp_String_HTML + '<TR><TD OnClick="change_Selected(' + "'" + inventory_Array[x] + "'" + ')">' + temp_String_Name_X + "</TD><TD>" + inventory_Array[x+1] + '</TD><TD><INPUT CLASS="number_Input" TYPE=NUMBER ID="inv' + x + '" VALUE="0" SIZE=1 /><INPUT TYPE="button" VALUE="Remove" OnClick="reduce_Item_From_Inventory(' + x + ')" /></TD></TR>';
        }
    }
    temp_String_HTML = temp_String_HTML + "</TABLE></FORM>";
    document.getElementById("inventory_list").innerHTML = temp_String_HTML;
    if (inventory_Only_Que === true) {
        redraw_Que();
    }
}

function set_Local_Inventory_Storage() {
    if (use_Local_Storage === true) {
        var temp_Data_String = "";
        for (x = 0; x < inventory_Array.length; x++) {
            temp_Data_String = temp_Data_String + inventory_Array[x] + "|";
        }
        if (inventory_Array.length > 0) {
            temp_Data_String = temp_Data_String.slice(0, -1);
        }
        localStorage.inventory_Storage = temp_Data_String;
        if (inventory_Array.length == 0) {
            localStorage.inventory_Storage = empty_Inventory_String;
        }
    }
}

function change_Inventory_Size() {
    try {
        if (document.getElementById("amount_To_Add_User_Input").value == 0) {
            throw new Error("zero");
        }
        if (document.getElementById("amount_To_Add_User_Input").value < 0) {
            throw new Error("negative");
        }
        if (Math.trunc(document.getElementById("amount_To_Add_User_Input").value) != document.getElementById("amount_To_Add_User_Input").value) {
            throw new Error("not whole");
        }
    }
    catch(e) {
        if (e.message == "zero") {
            error_Code = "<P OnClick='clear_Error()'>Error: 0, do you just not want a inventory or something?</P>";
            update_Error(error_Code);
            return null;
        }
        if (e.message == "negative") {
            error_Code = "<P OnClick='clear_Error()'>Error: negative number! No black holes allowed</P>";
            update_Error(error_Code);
            return null;
        }
        if (e.message == "not whole") {
            error_Code = "<P OnClick='clear_Error()'>Error: no fractions, please</P>";
            update_Error(error_Code);
            return null;
        }
    }
    inventory_Size = document.getElementById("amount_To_Add_User_Input").value;
    document.getElementById("inventory_Size_Text").innerHTML = "Max inventory: " + inventory_Size + " L";
    if (inventory_Size > 1280000) {
        error_Code = "<P OnClick='clear_Error()'>Error: I don't know how you have more then 1,280,000 L, but ok I'll allow it!</P>";
        update_Error(error_Code);
    }
    set_Local_Options_Storage();
    if (inventory_Only_Que === true) {
        redraw_Que();
    }
}

function change_Iventory_Used() {
    var temp_Inventory_Size_Used = 0;
    if (inventory_Array.length > 1) {
        for (x = 0; x < inventory_Array.length; x=x+2) {
            var temp_Number_Volume = get_Data(inventory_Array[x], "volume");
            temp_Inventory_Size_Used = parseFloat((temp_Inventory_Size_Used + parseFloat((temp_Number_Volume * inventory_Array[x+1]).toFixed(6))).toFixed(6));
            //this gives name of product, figure out its volume, multiply by amount you have, add to running total
        }
        document.getElementById("inventory_Used_Text").innerHTML = "Inventory used: " + temp_Inventory_Size_Used + " L";
        if (temp_Inventory_Size_Used > inventory_Size) {
            error_Code = "<P OnClick='clear_Error()'>Error: You realize you have more in your inventory then you say you are able to, right?</P>";
            update_Error(error_Code);
        }
    }
    if (inventory_Array[0] == empty_Inventory_String) {
        document.getElementById("inventory_Used_Text").innerHTML = "Inventory used: " + temp_Inventory_Size_Used + " L";
    }
}

/*	 ██████╗ ██╗   ██╗███████╗		 ██████╗ ██╗   ██╗███████╗
	██╔═══██╗██║   ██║██╔════╝		██╔═══██╗██║   ██║██╔════╝
	██║   ██║██║   ██║█████╗  		██║   ██║██║   ██║█████╗
	██║▄▄ ██║██║   ██║██╔══╝  		██║▄▄ ██║██║   ██║██╔══╝
	╚██████╔╝╚██████╔╝███████╗		╚██████╔╝╚██████╔╝███████╗
	 ╚══▀▀═╝  ╚═════╝ ╚══════╝		 ╚══▀▀═╝  ╚═════╝ ╚══════╝ */

function update_Que() {
    var temp_Number_To_Add = parseInt(document.getElementById("amount_To_Add_User_Input").value);
    try {
        if (selected_Part == "") {
            throw new Error("no part");
        }
        if (temp_Number_To_Add == 0) {
            throw new Error("zero");
        }
        if (temp_Number_To_Add < 0) {
            throw new Error("negative");
        }
        if (Math.trunc(temp_Number_To_Add) != temp_Number_To_Add) {
            throw new Error("not whole");
        }
    }
    catch(e) {
        if (e.message == "no part") {
            error_Code = "<P OnClick='clear_Error()'>Error: nothing selected to add</P>";
            update_Error(error_Code);
            return null;
        }
        if (e.message == "zero") {
            error_Code = "<P OnClick='clear_Error()'>Error: 0, so nothing changes?</P>";
            update_Error(error_Code);
            return null;
        }
        if (e.message == "negative") {
            error_Code = "<P OnClick='clear_Error()'>Error: negative number</P>";
            update_Error(error_Code);
            return null;
        }
        if (e.message == "not whole") {
            error_Code = "<P OnClick='clear_Error()'>Error: no fractions</P>";
            update_Error(error_Code);
            return null;
        }
    }
    if (que_Array[0] == empty_Que_String) {
        que_Array.length = 0;
    }
    if (is_BP_Selected === true) {
        update_Que_From_BP();
    } else {
        if (prerequisites_Que === false) {
            que_Array.push(selected_Part, temp_Number_To_Add);
        }
        if (prerequisites_Que === true) {
            var temp_Number_Produce = get_Data(selected_Part, "produce");
            var temp_Que_Array_Old = get_Data(selected_Part, "mats");
            var temp_Ore_Checker = "";
            var temp_Que_Array = [];
            for (ba = 0; ba < temp_Que_Array_Old.length; ba=ba+2) {
                temp_Ore_Checker = temp_Que_Array_Old[ba].slice(-4);
                if (temp_Ore_Checker != "_Ore") {
                    temp_Number_Produce = get_Data(temp_Que_Array_Old[ba], "produce");
                    temp_Que_Array.push(temp_Que_Array_Old[ba], (temp_Que_Array_Old[ba+1] * temp_Number_To_Add / temp_Number_Produce));
                }
            }
            var temp_Mulitplier = 0;
            var temp_Number_Holder = 0;
            var temp_Que_Array_Extra = [];
            var temp_Match_Found = false;
            var temp_Number_Before_Add = 0;
            var temp_Que_Array_Y = [];
            var temp_Que_Array_Y_Old = [];
            var temp_Hold_Que_Shift_Info = [];
            var temp_Pure_Checker = "";
            if (prerequisites_Rounded_Que === true) {
                for (bj = 0; bj < temp_Que_Array.length; bj=bj+2) {
                    if (temp_Que_Array[bj+1] == Math.ceil(temp_Que_Array[bj+1])) {
                    } else {
                        temp_Que_Array_Extra.push(temp_Que_Array[bj], temp_Que_Array[bj+1]);
                        temp_Que_Array[bj+1] = Math.ceil(temp_Que_Array[bj+1]);
                    }
                }
                for (bb = 0; bb < temp_Que_Array.length; bb=bb+2) {
                    temp_Ore_Checker = temp_Que_Array[bb].slice(-4);
                    if (temp_Ore_Checker != "_Ore") {
                        temp_Que_Array_Y_Old = get_Data(temp_Que_Array[bb], "mats");
                        for (bl = 0; bl < temp_Que_Array_Y_Old.length; bl=bl+2) {
                            temp_Que_Array_Y.push(temp_Que_Array_Y_Old[bl], temp_Que_Array_Y_Old[bl+1]);
                        }	//we transfer values into a new array so that we dont modify values in old array when we multiply
                        for (bk = 0; bk < temp_Que_Array_Y.length; bk=bk+2) {
                            temp_Number_Produce = get_Data(temp_Que_Array_Y_Old[bk], "produce");
                            temp_Que_Array_Y[bk+1] = parseFloat((temp_Que_Array_Y_Old[bk+1] * temp_Que_Array[bb+1] / temp_Number_Produce).toFixed(6));
                        }
                        for (bc = 0; bc < temp_Que_Array_Y.length; bc=bc+2) {
                            temp_Ore_Checker = temp_Que_Array_Y[bc].slice(-4);
                            if (temp_Ore_Checker != "_Ore") {
                                if (temp_Que_Array_Y[bc+1] == Math.ceil(temp_Que_Array_Y[bc+1])) {
                                    temp_Que_Array.push(temp_Que_Array_Y[bc], parseFloat((temp_Que_Array_Y[bc+1]).toFixed(6)));
                                } else {
                                    temp_Match_Found = false;
                                    for (bh = 0; bh < temp_Que_Array_Extra.length; bh=bh+2) {
                                        if (temp_Que_Array_Extra[bh] == temp_Que_Array_Y[bc]) {
                                            if (Math.ceil(temp_Que_Array_Extra[bh+1]) < (temp_Que_Array_Extra[bh+1] + temp_Que_Array_Y[bc+1])) {
                                                temp_Number_Before_Add = temp_Que_Array_Extra[bh+1];
                                                temp_Que_Array_Extra[bh+1] = temp_Que_Array_Extra[bh+1] + temp_Que_Array_Y[bc+1];
                                                temp_Que_Array.push(temp_Que_Array_Y[bc], (Math.ceil(temp_Que_Array_Extra[bh+1])-Math.ceil(temp_Number_Before_Add)));
                                            } else {
                                                temp_Que_Array_Extra[bh+1] = temp_Que_Array_Extra[bh+1] + temp_Que_Array_Y[bc+1];
                                            }
                                            temp_Match_Found = true;
                                            break;
                                        }
                                    }
                                    if (temp_Match_Found === false) {
                                        temp_Que_Array_Extra.push(temp_Que_Array_Y[bc], temp_Que_Array_Y[bc+1]);
                                        temp_Que_Array.push(temp_Que_Array_Y[bc], Math.ceil(temp_Que_Array_Y[bc+1]));
                                    }
                                }
                            }
                        }
                        temp_Que_Array_Y.length = 0;
                    }
                }
            } else
            if (prerequisites_Rounded_Que === false) {
                for (bb = 0; bb < temp_Que_Array.length; bb=bb+2) {
                    temp_Ore_Checker = temp_Que_Array[bb].slice(-4);
                    if (temp_Ore_Checker != "_Ore") {
                        temp_Que_Array_Y_Old = get_Data(temp_Que_Array[bb], "mats");
                        for (bl = 0; bl < temp_Que_Array_Y_Old.length; bl=bl+2) {
                            temp_Que_Array_Y.push(temp_Que_Array_Y_Old[bl], temp_Que_Array_Y_Old[bl+1]);
                        }	//we transfer values into a new array so that we dont modify values in old array when we multiply
                        for (bk = 0; bk < temp_Que_Array_Y.length; bk=bk+2) {
                            temp_Number_Produce = get_Data(temp_Que_Array_Y_Old[bk], "produce");
                            temp_Que_Array_Y[bk+1] = (temp_Que_Array_Y_Old[bk+1] * temp_Que_Array[bb+1] / temp_Number_Produce);
                        }
                        for (bc = 0; bc < temp_Que_Array_Y.length; bc=bc+2) {
                            temp_Ore_Checker = temp_Que_Array_Y[bc].slice(-4);
                            if (temp_Ore_Checker != "_Ore") {
                                temp_Que_Array.push(temp_Que_Array_Y[bc], parseFloat((temp_Que_Array_Y[bc+1]).toFixed(6)));
                            }
                        }
                        temp_Que_Array_Y.length = 0;
                    }
                }
            }
            for (ab = 0; ab < temp_Que_Array.length; ab=ab+2) {		//combines all same items into a single value, and changes duplicates to -1
                for (ac = temp_Que_Array.length-2; ac > ab; ac=ac-2) {
                    if (temp_Que_Array[ab] == temp_Que_Array[ac] && temp_Que_Array[ac+1] != -1) {
                        temp_Que_Array[ab+1] = parseFloat((temp_Que_Array[ab+1] + temp_Que_Array[ac+1]).toFixed(6));
                        temp_Que_Array[ac+1] = -1;
                    }
                }
            }
            var temp_Que_Array_New = [];		//creates new array containing only one of each item, not adding the duplicates that was set to -1 before
            for (bg = 0; bg < temp_Que_Array.length; bg=bg+2) {
                if (temp_Que_Array[bg+1] != -1) {
                    temp_Que_Array_New.push(temp_Que_Array[bg], temp_Que_Array[bg+1]);
                }
            }
            //sort out pures to put at top
            var temp_Loop_Counter = temp_Que_Array_New.length;
            var temp_Name_Holder = "";
            var temp_Number_Hold = 0;
            for (bs = 0; bs < temp_Loop_Counter; bs=bs+2) {
                temp_Pure_Checker = temp_Que_Array_New[bs].slice(-5);
                if (temp_Pure_Checker == "_Pure") {
                    if (do_Not_Add_Pures_Que === false) {
                        temp_Name_Holder = temp_Que_Array_New[bs];
                        temp_Number_Hold = temp_Que_Array_New[bs+1];
                        temp_Que_Array_New.splice(bs, 2);
                        temp_Que_Array_New.push(temp_Name_Holder, temp_Number_Hold);
                        bs = bs - 2;
                        temp_Loop_Counter = temp_Loop_Counter - 2;
                    } else
                    if (do_Not_Add_Pures_Que === true) {
                        temp_Que_Array_New.splice(bs, 2);
                        bs = bs - 2;
                        temp_Loop_Counter = temp_Loop_Counter - 2;
                    }
                }
            }
            //add to main array in reverse order... for... reasons....
            for (x = 0; x < temp_Que_Array_New.length; x=x+2) {
                que_Array.push(temp_Que_Array_New[temp_Que_Array_New.length-2-x], temp_Que_Array_New[temp_Que_Array_New.length-1-x]);
            }
            que_Array.push(selected_Part, parseFloat(temp_Number_To_Add));
        }
    }
    redraw_Que();
}

function update_Que_Input(name, num) {
    try {
        if (name == "") {
            throw new Error("no part");
        }
        if (num == 0) {
            throw new Error("zero");
        }
        if (num < 0) {
            throw new Error("negative");
        }
        if (Math.trunc(num) != num) {
            throw new Error("not whole");
        }
    }
    catch(e) {
        if (e.message == "no part") {
            error_Code = "<P OnClick='clear_Error()'>Error: nothing selected to add</P>";
            update_Error(error_Code);
            return null;
        }
        if (e.message == "zero") {
            error_Code = "<P OnClick='clear_Error()'>Error: 0, so nothing changes?</P>";
            update_Error(error_Code);
            return null;
        }
        if (e.message == "negative") {
            error_Code = "<P OnClick='clear_Error()'>Error: negative number</P>";
            update_Error(error_Code);
            return null;
        }
        if (e.message == "not whole") {
            error_Code = "<P OnClick='clear_Error()'>Error: no fractions</P>";
            update_Error(error_Code);
            return null;
        }
    }
    if (que_Array[0] == empty_Que_String) {
        que_Array.length = 0;
    }
    que_Array.push(name, num);
}

function update_Que_From_BP() {
    var temp_Number_To_Add = parseInt(document.getElementById("amount_To_Add_User_Input").value);
    var temp_Index_Loc = 0;
    for (bm = 0; bm < BP_Array.length; bm=bm+2) {
        if (BP_Array[bm] == selected_Part) {
            temp_Index_Loc = bm;
            break;
        }
    }
    var temp_BP_Array = BP_Array[temp_Index_Loc+1].split(',');
    for (bo = 0; bo < temp_BP_Array.length; bo=bo+2) {
        parseFloat(temp_BP_Array[bo+1]);	//make sure all numbers are floats and not strings.
    }
    var temp_Number_Produce = 1;
    if (prerequisites_Que === false) {
        for (bn = 0; bn < temp_BP_Array.length; bn=bn+2) {
            temp_Number_Produce = get_Data(temp_BP_Array[bn], "produce");
            que_Array.push(temp_BP_Array[bn], parseFloat(temp_BP_Array[bn+1] * temp_Number_To_Add / temp_Number_Produce)); //this must convert to float or causes errors
        }
    }
    if (prerequisites_Que === true) {
        var temp_Ore_Checker = "";
        var temp_Que_Array = [];
        for (ba = 0; ba < temp_BP_Array.length; ba=ba+2) {
            temp_Ore_Checker = temp_BP_Array[ba].slice(-4);
            if (temp_Ore_Checker != "_Ore") {
                temp_Number_Produce = get_Data(temp_BP_Array[ba], "produce");
                temp_Que_Array.push(temp_BP_Array[ba], (parseFloat(temp_BP_Array[ba+1] * temp_Number_To_Add / temp_Number_Produce))); //assume everything in this array is whole?
            }
        }
        var temp_Mulitplier = 0;
        var temp_Number_Holder = 0;
        var temp_Que_Array_Extra = [];
        var temp_Match_Found = false;
        var temp_Number_Before_Add = 0;
        var temp_Que_Array_Y = [];
        var temp_Que_Array_Y_Old = [];
        if (prerequisites_Rounded_Que === true) {
            for (bj = 0; bj < temp_Que_Array.length; bj=bj+2) {
                if (temp_Que_Array[bj+1] == Math.ceil(temp_Que_Array[bj+1])) {
                } else {
                    temp_Que_Array_Extra.push(temp_Que_Array[bj], temp_Que_Array[bj+1]);
                    temp_Que_Array[bj+1] = Math.ceil(temp_Que_Array[bj+1]);
                }
            }
            for (bb = 0; bb < temp_Que_Array.length; bb=bb+2) {
                temp_Ore_Checker = temp_Que_Array[bb].slice(-4);
                if (temp_Ore_Checker != "_Ore") {
                    temp_Que_Array_Y_Old = get_Data(temp_Que_Array[bb], "mats");
                    for (bl = 0; bl < temp_Que_Array_Y_Old.length; bl=bl+2) {
                        temp_Que_Array_Y.push(temp_Que_Array_Y_Old[bl], temp_Que_Array_Y_Old[bl+1]);
                    }	//we transfer values into a new array so that we dont modify values in old array when we multiply
                    for (bk = 0; bk < temp_Que_Array_Y.length; bk=bk+2) {
                        temp_Number_Produce = get_Data(temp_Que_Array_Y_Old[bk], "produce");
                        temp_Que_Array_Y[bk+1] = (temp_Que_Array_Y_Old[bk+1] * temp_Que_Array[bb+1] / temp_Number_Produce);
                    }
                    for (bc = 0; bc < temp_Que_Array_Y.length; bc=bc+2) {
                        temp_Ore_Checker = temp_Que_Array_Y[bc].slice(-4);
                        if (temp_Ore_Checker != "_Ore") {
                            if (temp_Que_Array_Y[bc+1] == Math.ceil(temp_Que_Array_Y[bc+1])) {
                                temp_Que_Array.push(temp_Que_Array_Y[bc], parseFloat((temp_Que_Array_Y[bc+1]).toFixed(6)));
                            } else {
                                temp_Match_Found = false;
                                for (bh = 0; bh < temp_Que_Array_Extra.length; bh=bh+2) {
                                    if (temp_Que_Array_Extra[bh] == temp_Que_Array_Y[bc]) {
                                        if (Math.ceil(temp_Que_Array_Extra[bh+1]) < (temp_Que_Array_Extra[bh+1] + temp_Que_Array_Y[bc+1])) {
                                            temp_Number_Before_Add = temp_Que_Array_Extra[bh+1];
                                            temp_Que_Array_Extra[bh+1] = temp_Que_Array_Extra[bh+1] + temp_Que_Array_Y[bc+1];
                                            temp_Que_Array.push(temp_Que_Array_Y[bc], (Math.ceil(temp_Que_Array_Extra[bh+1])-Math.ceil(temp_Number_Before_Add)));
                                        } else {
                                            temp_Que_Array_Extra[bh+1] = temp_Que_Array_Extra[bh+1] + temp_Que_Array_Y[bc+1];
                                        }
                                        temp_Match_Found = true;
                                        break;
                                    }
                                }
                                if (temp_Match_Found === false) {
                                    temp_Que_Array_Extra.push(temp_Que_Array_Y[bc], temp_Que_Array_Y[bc+1]);
                                    temp_Que_Array.push(temp_Que_Array_Y[bc], Math.ceil(temp_Que_Array_Y[bc+1]));
                                }
                            }
                        }
                    }
                    temp_Que_Array_Y.length = 0;
                }
            }
        } else
        if (prerequisites_Rounded_Que === false) {
            for (bb = 0; bb < temp_Que_Array.length; bb=bb+2) {
                temp_Ore_Checker = temp_Que_Array[bb].slice(-4);
                if (temp_Ore_Checker != "_Ore") {
                    temp_Que_Array_Y_Old = get_Data(temp_Que_Array[bb], "mats");
                    for (bl = 0; bl < temp_Que_Array_Y_Old.length; bl=bl+2) {
                        temp_Que_Array_Y.push(temp_Que_Array_Y_Old[bl], temp_Que_Array_Y_Old[bl+1]);
                    }	//we transfer values into a new array so that we dont modify values in old array when we multiply
                    for (bk = 0; bk < temp_Que_Array_Y.length; bk=bk+2) {
                        temp_Number_Produce = get_Data(temp_Que_Array_Y_Old[bk], "produce");
                        temp_Que_Array_Y[bk+1] = parseFloat((temp_Que_Array_Y_Old[bk+1] * temp_Que_Array[bb+1] / temp_Number_Produce).toFixed(6));
                    }
                    for (bc = 0; bc < temp_Que_Array_Y.length; bc=bc+2) {
                        temp_Ore_Checker = temp_Que_Array_Y[bc].slice(-4);
                        if (temp_Ore_Checker != "_Ore") {
                            temp_Que_Array.push(temp_Que_Array_Y[bc], parseFloat((temp_Que_Array_Y[bc+1]).toFixed(6)));
                        }
                    }
                    temp_Que_Array_Y.length = 0;
                }
            }
        }
        for (ab = 0; ab < temp_Que_Array.length; ab=ab+2) {
            for (ac = temp_Que_Array.length-2; ac > ab; ac=ac-2) {
                if (temp_Que_Array[ab] == temp_Que_Array[ac] && temp_Que_Array[ac+1] != -1) {
                    temp_Que_Array[ab+1] = parseFloat((temp_Que_Array[ab+1] + temp_Que_Array[ac+1]).toFixed(6));
                    temp_Que_Array[ac+1] = -1;
                }
            }
        }
        var temp_Que_Array_New = [];
        for (bg = 0; bg < temp_Que_Array.length; bg=bg+2) {
            if (temp_Que_Array[bg+1] != -1) {
                temp_Que_Array_New.push(temp_Que_Array[bg], temp_Que_Array[bg+1]);
            }
        }
        //push pures to top of array before adding
        var temp_Loop_Counter = temp_Que_Array_New.length;
        var temp_Name_Holder = "";
        var temp_Number_Hold = 0;
        for (bs = 0; bs < temp_Loop_Counter; bs=bs+2) {
            temp_Pure_Checker = temp_Que_Array_New[bs].slice(-5);
            if (temp_Pure_Checker == "_Pure") {
                temp_Name_Holder = temp_Que_Array_New[bs];
                temp_Number_Hold = temp_Que_Array_New[bs+1];
                temp_Que_Array_New.splice(bs, 2);
                temp_Que_Array_New.push(temp_Name_Holder, temp_Number_Hold);
                bs = bs - 2;
                temp_Loop_Counter = temp_Loop_Counter - 2;
            }
        }
        //add to main array in reverse order
        for (x = 0; x < temp_Que_Array_New.length; x=x+2) {
            que_Array.push(temp_Que_Array_New[temp_Que_Array_New.length-2-x], temp_Que_Array_New[temp_Que_Array_New.length-1-x]);
        }
    }
}

function delete_Que() {
    que_Array.length = 0;
    que_Array[0] = empty_Que_String;
    redraw_Que();
}

function delete_Item_From_Que(Loc) {
    que_Array.splice(Loc, 2);
    if (que_Array.length == 0) {
        que_Array[0] = empty_Que_String;
    }
    redraw_Que();
}

function reduce_Item_From_Que(Loc) {
    var temp_String = "que" + Loc;
    var temp_String_Number = document.getElementById(temp_String).value;
    try {
        if (temp_String_Number == 0) {
            throw new Error("zero");
        }
        if (temp_String_Number < 0) {
            throw new Error("negative");
        }
        if (Math.trunc(temp_String_Number) != temp_String_Number) {
            throw new Error("not whole");
        }
    }
    catch(e) {
        if (e.message == "zero") {
            error_Code = "<P OnClick='clear_Error()'>Error: 0, so nothing changes?</P>";
            update_Error(error_Code);
            return null;
        }
        if (e.message == "negative") {
            error_Code = "<P OnClick='clear_Error()'>Error: negative number</P>";
            update_Error(error_Code);
            return null;
        }
        if (e.message == "not whole") {
            error_Code = "<P OnClick='clear_Error()'>Error: no fractions</P>";
            update_Error(error_Code);
            return null;
        }
    }
    if (temp_String_Number > que_Array[Loc+1]) {
        error_Code = "<P OnClick='clear_Error()'>Error: You just tried to remove more then you actually had to possibly remove!</P>";
        update_Error(error_Code);
    }
    if (temp_String_Number >= que_Array[Loc+1]) {
        delete_Item_From_Que(Loc);
    } else {
        que_Array[Loc+1] = que_Array[Loc+1] - temp_String_Number;
    }
    redraw_Que();
}

function add_Item_To_Que(Loc) {
    var temp_String = "que" + Loc;
    var temp_String_Number = parseInt(document.getElementById(temp_String).value);
    try {
        if (temp_String_Number == 0) {
            throw new Error("zero");
        }
        if (temp_String_Number < 0) {
            throw new Error("negative");
        }
        if (Math.trunc(temp_String_Number) != temp_String_Number) {
            throw new Error("not whole");
        }
    }
    catch(e) {
        if (e.message == "zero") {
            error_Code = "<P OnClick='clear_Error()'>Error: 0, so nothing changes?</P>";
            update_Error(error_Code);
            return null;
        }
        if (e.message == "negative") {
            error_Code = "<P OnClick='clear_Error()'>Error: negative number</P>";
            update_Error(error_Code);
            return null;
        }
        if (e.message == "not whole") {
            error_Code = "<P OnClick='clear_Error()'>Error: no fractions</P>";
            update_Error(error_Code);
            return null;
        }
    }
    que_Array[Loc+1] = que_Array[Loc+1] + temp_String_Number;
    redraw_Que();
}

function redraw_Que() {
    if (use_Local_Storage === true) {
        set_Local_Que_Storage();
    }
    var temp_String_HTML = "<FORM NAME='que_List_Form' METHOD=POST><CENTER><TABLE><TR><TD></TD><TD></TD><TD></TD><TD></TD><TD OnClick='craft_Item()'>(Craft)</TD><TD><SPAN ID='display_Total_Craft_Time' CLASS='craftable_Box'></SPAN></TD><TD></TD><TD></TD></TR><TR><TD CLASS='q'>#</TD><TD CLASS='q'>#</TD><TD CLASS='q'>Remove/Add</TD><TD CLASS='q'>Move</TD><TD CLASS='q'>Name</TD><TD CLASS='q'>Needed Materials</TD><TD CLASS='q'>Time</TD><TD CLASS='q'>Volume</TD><TD CLASS='q'>Total time</TD><TD CLASS='qw'>New inventory L</TD></TR>";
    if (que_Array[0] == empty_Que_String) {
        document.getElementById("que_List").innerHTML = temp_String_HTML + "<TR><TD COLSPAN=10 CLASS='q'>" + empty_Que_String + "</TD></TR></TABLE></CENTER></FORM>";
    }
    if (que_Array.length > 1) {
        var inv_Crafting_Failed = false;
        var temp_Number_Time_Total = 0;
        var temp_Number_Time_Total_String = "";
        var temp_Inventory_Array = [];
        var temp_New_Inventory_Volume = 0;
        var temp_New_Inventory_Volume_Total = 0;
        var temp_Does_It_Finish = false;
        var temp_Number_Produce = 1;
        for (bv = 0; bv < inventory_Array.length; bv++) {
            temp_Inventory_Array.push(inventory_Array[bv]);		//build a new array with inventory values to modify as we go
        }
        if (temp_Inventory_Array[0] == empty_Inventory_String) {
            temp_Inventory_Array.length = 0;
        }
        for (x = 0; x < que_Array.length; x=x+2) {
            var temp_Array = get_Data(que_Array[x], "mats");
            temp_Number_Produce = get_Data(que_Array[x], "produce");
            var temp_String_Produce_Extra = "";
            if (temp_Number_Produce > 1) {
                temp_String_Produce_Extra = " * " + temp_Number_Produce;
            }
            var temp_Number_Time = get_Data(que_Array[x], "time");
            var temp_Number_Volume = (get_Data(que_Array[x], "volume")) * temp_Number_Produce;
            var temp_String_Name = que_Array[x].split('_').join(' ');
            temp_Number_Time = parseFloat((temp_Number_Time * que_Array[x+1]).toFixed(6));//time
            temp_Number_Time_Total =  parseFloat((temp_Number_Time_Total + temp_Number_Time).toFixed(6));//total time
            temp_Number_Volume = parseFloat((temp_Number_Volume * que_Array[x+1]).toFixed(6));//volume
            var temp_String_HTML_Sub = "";
            //check if you can craft from inv start
            var temp_Is_Anything_Not_In_Que = true;
            for (y = 0; y < temp_Array.length; y++) {
                if (y%2 === 0) {
                    //determine class here
                    var temp_Is_It_In_Que = false;
                    for (z = 0; z < temp_Inventory_Array.length; z=z+2) {
                        if (temp_Array[y] == temp_Inventory_Array[z]) {
                            if (temp_Inventory_Array[z+1] >= (temp_Array[y+1] * que_Array[x+1])) {
                                temp_Is_It_In_Que = true;
                            } else {
                                inv_Crafting_Failed = true;
                                temp_Is_It_In_Que = false;
                            }
                        }
                    }
                    temp_String_HTML_Sub = temp_String_HTML_Sub + '<SPAN ';
                    var temp_Ore_Checker = temp_Array[y].slice(-4);
                    if (temp_Ore_Checker == "_Ore" && temp_Is_It_In_Que === true) {
                        temp_String_HTML_Sub = temp_String_HTML_Sub + "CLASS='td_ore'";
                    } else
                    if (temp_Is_It_In_Que === false) {
                        inv_Crafting_Failed = true;
                        temp_Is_Anything_Not_In_Que = false;
                        temp_String_HTML_Sub = temp_String_HTML_Sub + "CLASS='td_red'";
                    } else {
                        temp_String_HTML_Sub = temp_String_HTML_Sub + "CLASS='td_normal'";
                    }
                    temp_String_HTML_Sub = temp_String_HTML_Sub + 'OnClick="change_Selected(' + "'" + temp_Array[y] + "'" + ')">' + temp_Array[y].split('_').join(' ') + " * ";
                } else {
                    temp_String_HTML_Sub = temp_String_HTML_Sub + parseFloat((temp_Array[y] * que_Array[x+1]).toFixed(6)) + "</SPAN>, ";
                }
            }
            temp_String_HTML_Sub = temp_String_HTML_Sub.slice(0, -2);
            //end check if can craft from inv
            //do inv mod
            for (bw = 0; bw < temp_Array.length; bw=bw+2) {
                temp_Check_If_Inside_Loop_Finish = false;
                for (bx = 0; bx < temp_Inventory_Array.length; bx=bx+2) {
                    if (temp_Inventory_Array[bx] == temp_Array[bw]) {
                        //match
                        if (temp_Inventory_Array[bx+1] >= temp_Array[bw+1]) {
                            temp_Inventory_Array[bx+1] = parseFloat((temp_Inventory_Array[bx+1] - (temp_Array[bw+1]*que_Array[x+1])).toFixed(6));
                            if (temp_Inventory_Array[bx+1] == 0) {
                                temp_Inventory_Array.splice(bx, 2);
                            }
                            if (temp_Inventory_Array[bx+1] < 0) {
                                temp_Inventory_Array.splice(bx, 2);
                                //set to fail because we didnt have enough to craft it
                                inv_Crafting_Failed = true;
                            }
                        }
                    }
                }
            }
            var temp_Does_Cat_Finish = false;
            if (inv_Crafting_Failed === false) {
                temp_Does_It_Finish = false;
                for (by = 0; by < temp_Inventory_Array.length; by=by+2) {
                    if (temp_Inventory_Array[by] == que_Array[x]) {
                        temp_Number_Produce = get_Data(que_Array[x], "produce");
                        temp_Inventory_Array[by+1] = temp_Inventory_Array[by+1] + (que_Array[x+1] * temp_Number_Produce);
                        temp_Does_It_Finish = true;
                        //checking for catalyst to also add
                        var temp_Catalyst_Array = get_Data(que_Array[x], "catalyst");
                        if (temp_Catalyst_Array.length > 1) {
                            for (bv = 0; bv < temp_Catalyst_Array.length; bv=bv+2) {
                                temp_Does_Cat_Finish = false;
                                for (bw = 0; bw < temp_Inventory_Array.length; bw=bw+2) {
                                    if (temp_Inventory_Array[bw] == temp_Catalyst_Array[bv]) {
                                        temp_Number_Produce = get_Data(temp_Catalyst_Array[bv], "produce");
                                        temp_Inventory_Array[bw+1] = temp_Inventory_Array[bw+1] + (temp_Catalyst_Array[bv+1] * temp_Number_Produce);
                                        temp_Does_Cat_Finish = true;
                                        break;
                                    }
                                }
                                if (temp_Does_Cat_Finish === false) {
                                    //it wasnt in inventory already so add it.
                                    temp_Inventory_Array.push(temp_Catalyst_Array[bv], temp_Catalyst_Array[bv+1]);
                                }
                            }
                        }
                        break;
                    }
                }
                if (temp_Does_It_Finish === false) {
                    temp_Number_Produce = get_Data(que_Array[x], "produce");
                    temp_Inventory_Array.push(que_Array[x], (que_Array[x+1] * temp_Number_Produce));
                    //checking for catalyst to also add
                    var temp_Catalyst_Array = get_Data(que_Array[x], "catalyst");
                    if (temp_Catalyst_Array.length > 1) {
                        for (bv = 0; bv < temp_Catalyst_Array.length; bv=bv+2) {
                            temp_Does_Cat_Finish = false;
                            for (bw = 0; bw < temp_Inventory_Array.length; bw=bw+2) {
                                if (temp_Inventory_Array[bw] == temp_Catalyst_Array[bv]) {
                                    temp_Number_Produce = get_Data(temp_Catalyst_Array[bv], "produce");
                                    temp_Inventory_Array[bw+1] = temp_Inventory_Array[bw+1] + (temp_Catalyst_Array[bv+1] * temp_Number_Produce);
                                    temp_Does_Cat_Finish = true;
                                    break;
                                }
                            }
                            if (temp_Does_Cat_Finish === false) {
                                //it wasnt in inventory already so add it.
                                temp_Inventory_Array.push(temp_Catalyst_Array[bv], temp_Catalyst_Array[bv+1]);
                            }
                        }
                    }
                }
            }
            //end inv mod
            temp_New_Inventory_Volume = 0;
            temp_New_Inventory_Volume_Total = 0;
            for (by = 0; by < temp_Inventory_Array.length; by=by+2) {
                if (temp_Inventory_Array.length > 0) {
                    temp_New_Inventory_Volume = get_Data(temp_Inventory_Array[by], "volume");
                    temp_New_Inventory_Volume_Total = parseFloat((temp_New_Inventory_Volume_Total + (temp_New_Inventory_Volume * temp_Inventory_Array[by+1])).toFixed(6));
                }
            }
            if (temp_New_Inventory_Volume_Total > inventory_Size) {
                inv_Crafting_Failed = true;
            }
            temp_String_HTML = temp_String_HTML + "<TR><TD CLASS='q'>" + (x/2+1) + "</TD><TD CLASS='q'>" + parseFloat((que_Array[x+1]).toFixed(6)) + temp_String_Produce_Extra + '</TD><TD CLASS="q"><SVG style="text-align:center"; OnClick="reduce_Item_From_Que(' + x + ')"' + SVGminus_Partial + '<INPUT CLASS="number_Input" TYPE=NUMBER ID="que' + x + '" VALUE="' + Math.ceil(que_Array[x+1]) + '" SIZE=1 /><SVG style="text-align:center"; OnClick="add_Item_To_Que(' + x + ')"' + SVGplus_Partial + '</TD><TD CLASS="q"><TABLE><TR><TD align="center" ROWSPAN=2><SPAN ondragover="allow_Drop(event)" ID="drag' + x + '" draggable="true" ondragstart="drag(event)" ondrop="drop(' + x + ')"><SVG ondragstart="drag(event)" ondragover="allow_Drop(event)" ID="dragged' + x + '" draggable="true"' + SVGdrag + '</SPAN></TD><TD OnClick="swap_Que_Locations(' + x + ',' + (x-2) + ')">↑</TD><TD OnClick="shift_Que_Locations(' + x + ',' + 0 + ')">⇑</TD></TR><TR><TD OnClick="swap_Que_Locations(' + x + ',' + (x+2) + ')">↓</TD><TD OnClick="shift_Que_Locations(' + x + ',' + 1 + ')">⇓</TD></TR></TABLE></TD><TD OnClick="change_Selected(' + "'" + que_Array[x] + "'" + ')"" CLASS="q">' + temp_String_Name + "</TD>";
            if (inv_Crafting_Failed === true) {
                temp_String_HTML = temp_String_HTML + "<TD CLASS='td_q_red'>";
            } else {
                temp_String_HTML = temp_String_HTML + "<TD CLASS='q'>";
            }
            var temp_String_Time_Temp = convert_Seconds_To_Days(temp_Number_Time);
            temp_String_HTML = temp_String_HTML + temp_String_HTML_Sub + "</TD><TD CLASS='q'>" + temp_String_Time_Temp + "</TD><TD CLASS='q'>" + temp_Number_Volume + "L</TD><TD CLASS='q'>";
            temp_Number_Time_Total_String = convert_Seconds_To_Days(temp_Number_Time_Total);
            temp_String_HTML = temp_String_HTML + temp_Number_Time_Total_String + "</TD>";
            if (temp_New_Inventory_Volume_Total > inventory_Size) {
                temp_String_HTML = temp_String_HTML + "<TD CLASS='td_q_red'>" + temp_New_Inventory_Volume_Total + "L";
            } else {
                temp_String_HTML = temp_String_HTML + "<TD CLASS='qw'>" + temp_New_Inventory_Volume_Total + "L";
            }
            temp_String_HTML = temp_String_HTML + "</TD></TR>";
        }
        temp_String_HTML = temp_String_HTML + "</TABLE></CENTER></FORM>";
        document.getElementById("que_List").innerHTML = temp_String_HTML;
        var temp_Time_String_Value = convert_Seconds_To_Days(temp_Number_Time_Total);
        document.getElementById("display_Total_Craft_Time").innerHTML = temp_Time_String_Value;
    }
}

/*	td1		td2				td3 				td4		td5			td6				td7 				td8										td9				td10
    #		num you 		inputfield+button 	move	NAME 		list of craft 	time 				show total time taken?					total time		new inventory l
    order	are crafting	to change num 		object	of part 	materials 		how long 			show inventory when finished?
    of crafting																		this part takes
*/

function craft_Item() {
    if (que_Array[0] == empty_Que_String) {
        error_Code = "<P OnClick='clear_Error()'>Error: There is nothing in que to try to craft</P>";
        update_Error(error_Code);
    } else
    if (que_Array.length > 0) {
        var temp_Check_If_Loop_Finish = true;
        var temp_Check_If_Inside_Loop_Finish = false;
        var temp_Array_For_Crafting = [];
        var temp_Array = get_Data(que_Array[0], "mats");
        for (bp = 0; bp < temp_Array.length; bp=bp+2) {
            temp_Array_For_Crafting.push(temp_Array[bp], parseFloat((temp_Array[bp+1]*que_Array[1]).toFixed(6)));
        } //this will be the array of item names and quantity we have to remove from inventory
        for (br = 0; br < temp_Array_For_Crafting.length; br=br+2) {
            temp_Check_If_Inside_Loop_Finish = false;
            for (bq = 0; bq < inventory_Array.length; bq=bq+2) {
                if (inventory_Array[bq] == temp_Array_For_Crafting[br]) {
                    //match
                    if (inventory_Array[bq+1] >= temp_Array_For_Crafting[br+1]) {
                        //we have enough
                        temp_Check_If_Inside_Loop_Finish = true;
                    }
                    else {
                        break;
                    }
                }
            }
            if (temp_Check_If_Inside_Loop_Finish === false) {
                //failed to find or did not have enough
                temp_Check_If_Loop_Finish = false;
                error_Code = "<P OnClick='clear_Error()'>Error: Unable to craft!</P>";
                update_Error(error_Code);
                break;
            }
        }
        if (temp_Check_If_Loop_Finish === true) {
            //we have enough so do it all again and change values
            for (bu = 0; bu < temp_Array_For_Crafting.length; bu=bu+2) {
                temp_Check_If_Inside_Loop_Finish = false;
                for (bt = 0; bt < inventory_Array.length; bt=bt+2) {
                    if (inventory_Array[bt] == temp_Array_For_Crafting[bu]) {
                        //match
                        if (inventory_Array[bt+1] >= temp_Array_For_Crafting[bu+1]) {
                            inventory_Array[bt+1] = parseFloat((inventory_Array[bt+1] - temp_Array_For_Crafting[bu+1]).toFixed(6));
                            if (inventory_Array[bt+1] <= 0) {
                                delete_Item_From_Inventory(bt);
                            }
                        }
                    }
                }
            }
            //removed items in inventory, now remove from que and add the new item to inventory
            var temp_Number_Produce = get_Data(que_Array[0], "produce");
            update_Inventory_Input(que_Array[0], (que_Array[1] * temp_Number_Produce));
            //check for catalyst to see if we need to add more items to inventory
            var temp_Catalyst_Array = get_Data(que_Array[0], "catalyst");
            if (temp_Catalyst_Array.length > 1) {
                for (bv = 0; bv < temp_Catalyst_Array.length; bv=bv+2) {
                    update_Inventory_Input(temp_Catalyst_Array[bv], temp_Catalyst_Array[bv+1]);
                }
            }
            que_Array.splice(0, 2);
            if (que_Array.length == 0) {
                que_Array[0] = empty_Que_String;
            }
            redraw_Que();
            redraw_Inventory();
        }
    }
}

function shift_Que_Locations(from, to) {
    if (from < 0 || to < 0 || from >= que_Array.length || to >= que_Array.length) {
        error_Code = "<P OnClick='clear_Error()'>Error: There was a problem moving the table rows, please try again</P>";
        update_Error(error_Code);
    } else
    if (Number.isNaN(from) || Number.isNaN(to)) {
        error_Code = "<P OnClick='clear_Error()'>Error: There was a problem (NaN) moving the table rows, please try again</P>";
        update_Error(error_Code);
    } else {
        var temp_Name = que_Array[from];
        var temp_Number = parseFloat(que_Array[from+1]);
        que_Array.splice(from, 2);
        if (to == 0) {
            que_Array.unshift(temp_Name, temp_Number);
        } else
        if (to == 1) {
            que_Array.push(temp_Name, temp_Number);
        }
        redraw_Que();
    }
}

function swap_Que_Locations(from, to) {
    if (from < 0 || to < 0 || from >= que_Array.length || to >= que_Array.length) {
        //prevent values below 0 or at length or higher
        error_Code = "<P OnClick='clear_Error()'>Error: There was a problem moving the table rows, please try again</P>";
        update_Error(error_Code);
    } else
    if (Number.isNaN(from) || Number.isNaN(to)) {
        error_Code = "<P OnClick='clear_Error()'>Error: There was a problem (NaN) moving the table rows, please try again</P>";
        update_Error(error_Code);
    } else {
        if (shift_Que_Instead_Of_Swap === true) {
            //run shift
            var temp_Name = que_Array[from];
            var temp_Number = parseFloat(que_Array[from+1]);
            que_Array.splice(from, 2);
            que_Array.splice(to, 0, temp_Name, temp_Number);
        } else
        if (shift_Que_Instead_Of_Swap === false){
            //run swap
            var temp_Name = que_Array[from];
            var temp_Number = parseFloat(que_Array[from+1]);
            que_Array[from] = que_Array[to];
            que_Array[from+1] = que_Array[to+1];
            que_Array[to] = temp_Name;
            que_Array[to+1] = temp_Number;
        }
        redraw_Que();
    }
}

function set_Local_Que_Storage() {
    if (use_Local_Storage === true) {
        var temp_Data_String = "";
        for (x = 0; x < que_Array.length; x++) {
            temp_Data_String = temp_Data_String + que_Array[x] + "|";
        }
        if (que_Array.length > 0) {
            temp_Data_String = temp_Data_String.slice(0, -1);
        }
        localStorage.que_Storage = temp_Data_String;
        if (que_Array.length == 0) {
            localStorage.que_Storage = empty_Que_String;
        }
    }
}

function inventory_Only_Check() {
    var temp_Checkbox_Value = document.getElementById("inventory_Only_Checkbox");
    if (temp_Checkbox_Value.checked == true) {
        inventory_Only_Que = true;
    }
    if (temp_Checkbox_Value.checked == false) {
        inventory_Only_Que = false;
    }
    set_Local_Options_Storage();
    redraw_Que();
}

function shift_Que_Instead_Of_Swap_Check() {
    var temp_Checkbox_Value = document.getElementById("shift_Que_Instead_Of_Swap_Checkbox");
    if (temp_Checkbox_Value.checked == true) {
        shift_Que_Instead_Of_Swap = true;
    }
    if (temp_Checkbox_Value.checked == false) {
        shift_Que_Instead_Of_Swap = false;
    }
    set_Local_Options_Storage();
}

function prerequisites_Check(is_Startup) {
    var temp_Checkbox_Value = document.getElementById("prerequisites_Checkbox");
    if (temp_Checkbox_Value.checked == true) {
        prerequisites_Que = true;
        document.getElementById("prerequisites_Checkbox_Hide").style.display = "initial";
        document.getElementById("prerequisites_Checkbox_BR_Hide").style.display = "none";
    }
    if (temp_Checkbox_Value.checked == false) {
        prerequisites_Que = false;
        prerequisites_Rounded_Que = false;
        do_Not_Add_Pures_Que = false;
        document.getElementById("prerequisites_Rounded_Checkbox").checked = false;
        document.getElementById("do_Not_Add_Pures_Checkbox").checked = false;
        document.getElementById("prerequisites_Checkbox_Hide").style.display = "none";
        document.getElementById("prerequisites_Checkbox_BR_Hide").style.display = "initial";
    }
    set_Local_Options_Storage();
    if (is_Startup != true) {
        redraw_Que();
    }
}

function prerequisites_Rounded_Check() {
    var temp_Checkbox_Value = document.getElementById("prerequisites_Rounded_Checkbox");
    if (temp_Checkbox_Value.checked === true && prerequisites_Que === true) {
        prerequisites_Rounded_Que = true;
    } else
    if (temp_Checkbox_Value.checked === true && prerequisites_Que === false) {
        prerequisites_Rounded_Que = false;
        document.getElementById("prerequisites_Rounded_Checkbox").checked = false;
    }
    if (temp_Checkbox_Value.checked === false) {
        prerequisites_Rounded_Que = false;
    }
    set_Local_Options_Storage();
    redraw_Que();
}

function do_Not_Add_Pures_Check() {
    var temp_Checkbox_Value = document.getElementById("do_Not_Add_Pures_Checkbox");
    if (temp_Checkbox_Value.checked === true && prerequisites_Que === true) {
        do_Not_Add_Pures_Que = true;
    } else
    if (temp_Checkbox_Value.checked === true && prerequisites_Que === false) {
        do_Not_Add_Pures_Que = false;
        document.getElementById("do_Not_Add_Pures_Checkbox").checked = false;
    }
    if (temp_Checkbox_Value.checked === false) {
        do_Not_Add_Pures_Que = false;
    }
    set_Local_Options_Storage();
    redraw_Que();
}

/*	██████╗ ██████╗  															██████╗ ██████╗
	██╔══██╗██╔══██╗ 															██╔══██╗██╔══██╗
	██████╔╝██████╔╝ 															██████╔╝██████╔╝
	██╔══██╗██╔═══╝  															██╔══██╗██╔═══╝
	██████╔╝██║      															██████╔╝██║
	╚═════╝ ╚═╝      															╚═════╝ ╚═╝     */

function update_BP() {
    var temp_Name = document.getElementById("BP_Name").value;
    try {
        if (temp_Name == "") {
            throw new Error("no part");
        }
        if (temp_Number_To_Add == 0) {
            throw new Error("zero");
        }
        if (temp_Number_To_Add < 0) {
            throw new Error("negative");
        }
        if (temp_Number_To_Add > 999999) {
            throw new Error("too big");
        }
    }
    catch(e) {
        if (e.message == "no part") {
            error_Code = "<P OnClick='clear_Error()'>Error: nothing selected to add</P>";
            update_Error(error_Code);
            return null;
        }
        if (e.message == "zero") {
            error_Code = "<P OnClick='clear_Error()'>Error: negative number</P>";
            update_Error(error_Code);
            return null;
        }
        if (e.message == "negative") {
            error_Code = "<P OnClick='clear_Error()'>Error: negative number</P>";
            update_Error(error_Code);
            return null;
        }
        if (e.message == "too big") {
            error_Code = "<P OnClick='clear_Error()'>Error: lets not try to add that much at once</P>";
            update_Error(error_Code);
            return null;
        }
    }
    var temp_Does_It_Finish = false;
    for (x = 0; x < BP_Array.length; x=x+2) {
        if (BP_Array[x] == temp_Name) {	//change selected part to the name field, and if they are equal make creating it fail, throw error, name exists already.
            temp_Does_It_Finish = true;
            error_Code = "<P OnClick='clear_Error()'>Error: BP of that name already exists, try again with a new name!</P>";
            update_Error(error_Code);
            break;
        }
    }
    if (temp_Does_It_Finish === false) {
        if (BP_Array[0] == empty_BP_String) {
            BP_Array.length = 0;
        }
        var temp_Data_String = document.getElementById("BP_Materials").value;
        BP_Array.push(temp_Name, temp_Data_String);
        redraw_BP();
    }
}

function add_Item_To_BP_Field() {
    var temp_Number_To_Add = parseFloat(document.getElementById("BP_Add_Num").value);
    if (document.getElementById("BP_Materials").value.length > 2) {
        document.getElementById("BP_Materials").value = document.getElementById("BP_Materials").value + ",";
    }
    document.getElementById("BP_Materials").value = document.getElementById("BP_Materials").value + selected_Part + ',' + temp_Number_To_Add;
}

function redraw_BP() {
    if (use_Local_Storage === true) {
        set_Local_BP_Storage();
    }
    if (BP_Array[0] == empty_BP_String) {
        document.getElementById("BP_List").innerHTML = "<TABLE WIDTH=100%><TR><TD CLASS='b'>" + empty_BP_String + "</TD></TR></TABLE>";
    } else {
        var temp_String_HTML = "";
        temp_String_HTML = temp_String_HTML + "<TABLE WIDTH=100%>";
        for (x = 0; x < BP_Array.length; x=x+2) {
            temp_String_HTML = temp_String_HTML + "<TR><TD CLASS='b' OnClick='change_Selected(" + '"' + BP_Array[x] + '",false,true,' + x + ")'>" + BP_Array[x] + "</TD></TR>";
        }
        temp_String_HTML = temp_String_HTML + "</TABLE>";
        document.getElementById("BP_List").innerHTML = temp_String_HTML;
    }
}

function show_BP_Menu() {
    que_Hide();
    BP_Menu_Hide();
}

function delete_BP_Selected(BP_Loc) {
    BP_Array.splice(BP_Loc, 2);
    redraw_BP();
}

function delete_BP() {
    BP_Array.length = 0;
    BP_Array[0] = empty_BP_String;
    redraw_BP();
}

function set_Local_BP_Storage() {
    if (use_Local_Storage === true) {
        var temp_Data_String = "";
        for (x = 0; x < BP_Array.length; x++) {
            temp_Data_String = temp_Data_String + BP_Array[x] + "|";
        }
        if (BP_Array.length > 0) {
            temp_Data_String = temp_Data_String.slice(0, -1);
        }
        localStorage.BP_Storage = temp_Data_String;
        if (BP_Array.length == 0) {
            localStorage.BP_Storage = empty_BP_String;
        }
    }
}

/*	███████╗████████╗ █████╗ ██████╗ ████████╗   ██╗   ██╗██████╗
	██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝   ██║   ██║██╔══██╗
	███████╗   ██║   ███████║██████╔╝   ██║█████╗██║   ██║██████╔╝
	╚════██║   ██║   ██╔══██║██╔══██╗   ██║╚════╝██║   ██║██╔═══╝
	███████║   ██║   ██║  ██║██║  ██║   ██║      ╚██████╔╝██║
	╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       ╚═════╝ ╚═╝      */

function up_Date_Search() {
    var temp_String_HTML = "";
    for (x = 0; x < search_Terms.length; x++) {
        temp_String_HTML = temp_String_HTML + '<OPTION VALUE="' + search_Terms[x] + '">';
    }
    for (x = 0; x < search_Terms_Extra.length; x++) {
        temp_String_HTML = temp_String_HTML + '<OPTION VALUE="' + search_Terms_Extra[x] + '">';
    }
    document.getElementById("search_Options").innerHTML = temp_String_HTML;
}

function run_First() {
    up_Date_Search();//populate search field

    //load data
    if (use_Local_Storage === true) {
        get_Local_Storage();
    }

    //set color
    set_Text_Background_Color_Startup();

    //set inventory size
    document.getElementById("inventory_Size_Text").innerHTML = "Max inventory: " + inventory_Size + " L";

    //hide things
    options_Hide();
    hide_All_Menus(1);
    hide_Content(1, 'BP_Hide', 'BP_Content_Hide', 'Blueprints:');//blueprints are seperate
    BP_Menu_Hide();//hide the create BP menu area
    color_Change_Content();

    //draw stuff
    redraw_Inventory();
    if (inventory_Only_Que === false) {
        redraw_Que();	//if this is true then it will be called in the inventory draw function
    }
    redraw_BP();
    change_Menu_Listing_Class();

    //checkboxs
    set_Checkboxs_Startup();

    if (use_Local_Storage != true) {
        default_Colors();
    }
}

function set_Checkboxs_Startup() {
    document.getElementById("inventory_Only_Checkbox").checked = inventory_Only_Que;
    document.getElementById("shift_Que_Instead_Of_Swap_Checkbox").checked = shift_Que_Instead_Of_Swap;
    document.getElementById("prerequisites_Checkbox").checked = prerequisites_Que;
    document.getElementById("prerequisites_Rounded_Checkbox").checked = prerequisites_Rounded_Que;
    document.getElementById("text_Import_Export_Checkbox").checked = text_Overwrite_Append;
    document.getElementById("do_Not_Add_Pures_Checkbox").checked = do_Not_Add_Pures_Que;
    prerequisites_Check(true);//run this just in case we need to hide the 2nd checkbox
}

function get_Local_Storage() {
    if (use_Local_Storage === true) {
        if (localStorage.getItem("inventory_Storage") === null) {
            localStorage.inventory_Storage = empty_Inventory_String;
        } else {
            inventory_Array = localStorage.inventory_Storage.split('|');
            for (x = 1; x < inventory_Array.length; x=x+2) {
                inventory_Array[x] = parseFloat(inventory_Array[x]);
            }
        }
        if (localStorage.getItem("que_Storage") === null) {
            localStorage.que_Storage = empty_Que_String;
        } else {
            que_Array = localStorage.que_Storage.split('|');
            for (x = 1; x < que_Array.length; x=x+2) {
                que_Array[x] = parseFloat(que_Array[x]);
            }
        }
        if (localStorage.getItem("BP_Storage") === null) {
            localStorage.BP_Storage = empty_BP_String;
        } else {
            BP_Array = localStorage.BP_Storage.split('|');
        }
        if (localStorage.getItem("options_Que_Calc") === null) {
            localStorage.options_Que_Calc = "255|255|255|0|11|25|64|1|0|0|0|1|0";
        }
        //set values
        var temp_Options_Array = localStorage.options_Que_Calc.split('|');
        //first 3 RGB of text, then the RGB of BG then inv size, then checkboxs
        text_Red = parseInt(temp_Options_Array[0]);
        text_Green = parseInt(temp_Options_Array[1]);
        text_Blue = parseInt(temp_Options_Array[2]);
        text_BG_Red = parseInt(temp_Options_Array[3]);
        text_BG_Green = parseInt(temp_Options_Array[4]);
        text_BG_Blue = parseInt(temp_Options_Array[5]);
        inventory_Size = parseInt(temp_Options_Array[6]);
        if (temp_Options_Array[7] == 1) {
            inventory_Only_Que = true;
        } else {
            inventory_Only_Que = false;
        }
        if (temp_Options_Array[8] == 1) {
            prerequisites_Que = true;
        } else {
            prerequisites_Que = false;
        }
        if (temp_Options_Array[9] == 1) {
            prerequisites_Rounded_Que = true;
        } else {
            prerequisites_Rounded_Que = false;
        }
        if (temp_Options_Array[10] == 1) {
            shift_Que_Instead_Of_Swap = true;
        } else {
            shift_Que_Instead_Of_Swap = false;
        }
        if (temp_Options_Array[11] == 1) {
            text_Overwrite_Append = true;
        } else {
            text_Overwrite_Append = false;
        }
        if (temp_Options_Array[12] == 1) {
            do_Not_Add_Pures_Que = true;
        } else {
            do_Not_Add_Pures_Que = false;
        }
        if (localStorage.getItem("pure_Price_Values") === null) {
            localStorage.pure_Price_Values = "0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0|0";
        } else {
            var temp_Options_Price_Array = localStorage.pure_Price_Values.split('|');
            document.getElementById("Sodium_Price_Input").value = parseInt(temp_Options_Price_Array[0]);
            document.getElementById("Carbon_Price_Input").value = parseInt(temp_Options_Price_Array[1]);
            document.getElementById("Silicon_Price_Input").value = parseInt(temp_Options_Price_Array[2]);
            document.getElementById("Iron_Price_Input").value = parseInt(temp_Options_Price_Array[3]);
            document.getElementById("Aluminium_Price_Input").value = parseInt(temp_Options_Price_Array[4]);
            document.getElementById("Nickel_Price_Input").value = parseInt(temp_Options_Price_Array[5]);
            document.getElementById("Lead_Price_Input").value = parseInt(temp_Options_Price_Array[6]);
            document.getElementById("Tungsten_Price_Input").value = parseInt(temp_Options_Price_Array[7]);
            document.getElementById("Scandium_Price_Input").value = parseInt(temp_Options_Price_Array[8]);
            document.getElementById("Chromium_Price_Input").value = parseInt(temp_Options_Price_Array[9]);
            document.getElementById("Copper_Price_Input").value = parseInt(temp_Options_Price_Array[10]);
            document.getElementById("Platinum_Price_Input").value = parseInt(temp_Options_Price_Array[11]);
            document.getElementById("Zirconium_Price_Input").value = parseInt(temp_Options_Price_Array[12]);
            document.getElementById("Manganese_Price_Input").value = parseInt(temp_Options_Price_Array[13]);
            document.getElementById("Molybdenum_Price_Input").value = parseInt(temp_Options_Price_Array[14]);
            document.getElementById("Gold_Price_Input").value = parseInt(temp_Options_Price_Array[15]);
            document.getElementById("Vanadium_Price_Input").value = parseInt(temp_Options_Price_Array[16]);
            document.getElementById("Titanium_Price_Input").value = parseInt(temp_Options_Price_Array[17]);
            document.getElementById("Niobium_Price_Input").value = parseInt(temp_Options_Price_Array[18]);
            document.getElementById("Rhenium_Price_Input").value = parseInt(temp_Options_Price_Array[19]);
            document.getElementById("time_Price_Input").value = parseInt(temp_Options_Price_Array[20]);
            document.getElementById("markup_Price_Input").value = parseInt(temp_Options_Price_Array[21]);
        }
    }
}

function set_Local_Options_Storage() {
    if (use_Local_Storage === true) {
        var temp_Data_String = "";
        //first 3 RGB of text, then the RGB of BG then inv size, then checkboxs-inv only,prerequisite-rerequisite rounded-shift instead of swap-overwrite-no pures
        temp_Data_String = temp_Data_String + text_Red + "|" + text_Green + "|" + text_Blue + "|" + text_BG_Red + "|" + text_BG_Green + "|" + text_BG_Blue + "|";
        temp_Data_String = temp_Data_String + inventory_Size + "|";
        if (inventory_Only_Que === true) {
            temp_Data_String = temp_Data_String + 1 + "|";
        } else {
            temp_Data_String = temp_Data_String + 0 + "|";
        }
        if (prerequisites_Que === true) {
            temp_Data_String = temp_Data_String + 1 + "|";
        } else {
            temp_Data_String = temp_Data_String + 0 + "|";
        }
        if (prerequisites_Rounded_Que === true) {
            temp_Data_String = temp_Data_String + 1 + "|";
        } else {
            temp_Data_String = temp_Data_String + 0 + "|";
        }
        if (shift_Que_Instead_Of_Swap === true) {
            temp_Data_String = temp_Data_String + 1 + "|";
        } else {
            temp_Data_String = temp_Data_String + 0 + "|";
        }
        if (text_Overwrite_Append === true) {
            temp_Data_String = temp_Data_String + 1 + "|";
        } else {
            temp_Data_String = temp_Data_String + 0 + "|";
        }
        if (do_Not_Add_Pures_Que === true) {
            temp_Data_String = temp_Data_String + 1;
        } else {
            temp_Data_String = temp_Data_String + 0;
        }
        localStorage.options_Que_Calc = temp_Data_String;
    }
}

function set_Local_Price_Values_Storage() {
    var temp_Data_Price_String = "";
    temp_Data_Price_String = temp_Data_Price_String + document.getElementById("Sodium_Price_Input").value + "|" + document.getElementById("Carbon_Price_Input").value + "|" + document.getElementById("Silicon_Price_Input").value + "|" + document.getElementById("Iron_Price_Input").value + "|" + document.getElementById("Aluminium_Price_Input").value + "|" + document.getElementById("Nickel_Price_Input").value + "|" + document.getElementById("Lead_Price_Input").value + "|" + document.getElementById("Tungsten_Price_Input").value + "|" + document.getElementById("Scandium_Price_Input").value + "|" + document.getElementById("Chromium_Price_Input").value + "|" + document.getElementById("Copper_Price_Input").value + "|" + document.getElementById("Platinum_Price_Input").value + "|" + document.getElementById("Zirconium_Price_Input").value + "|" + document.getElementById("Manganese_Price_Input").value + "|" + document.getElementById("Molybdenum_Price_Input").value + "|" + document.getElementById("Gold_Price_Input").value + "|" + document.getElementById("Vanadium_Price_Input").value + "|" + document.getElementById("Titanium_Price_Input").value + "|" + document.getElementById("Niobium_Price_Input").value + "|" + document.getElementById("Rhenium_Price_Input").value + "|" + document.getElementById("time_Price_Input").value + "|" + document.getElementById("markup_Price_Input").value;
    localStorage.pure_Price_Values = temp_Data_Price_String;
}

/*	 ██████╗ ██████╗ ██╗      ██████╗ ██████╗
	██╔════╝██╔═══██╗██║     ██╔═══██╗██╔══██╗
	██║     ██║   ██║██║     ██║   ██║██████╔╝
	██║     ██║   ██║██║     ██║   ██║██╔══██╗
	╚██████╗╚██████╔╝███████╗╚██████╔╝██║  ██║
	 ╚═════╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝ */

function set_Text_Background_Color_Startup() {
    if (text_Red < 0 || text_Green < 0 || text_Blue < 0) {
        error_Code = "<P OnClick='clear_Error()'>Error: invalid input, negative number</P>";
        update_Error(error_Code);
    } else
    if (text_Red > 255 || text_Green > 255 || text_Blue > 255) {
        error_Code = "<P OnClick='clear_Error()'>Error: invalid input, over 255</P>";
        update_Error(error_Code);
    } else {
        var temp_New_Color = "rgb(" + text_Red + ", " + text_Green + ", " + text_Blue + ")";
        document.body.style.color = temp_New_Color;
        SVGColor_Change(true);
    }
    if (text_BG_Red < 0 || text_BG_Green < 0 || text_BG_Blue < 0) {
        error_Code = "<P OnClick='clear_Error()'>Error: invalid input, negative number</P>";
        update_Error(error_Code);
    } else
    if (text_BG_Red > 255 || text_BG_Green > 255 || text_BG_Blue > 255) {
        error_Code = "<P OnClick='clear_Error()'>Error: invalid input, over 255</P>";
        update_Error(error_Code);
    } else {
        var temp_New_Color = "rgb(" + text_BG_Red + ", " + text_BG_Green + ", " + text_BG_Blue + ")";
        document.body.style.backgroundColor = temp_New_Color;
    }
}

function text_Color_Change() {
    text_Red = parseInt(document.getElementById("colorR").value);
    text_Green = parseInt(document.getElementById("colorG").value);
    text_Blue = parseInt(document.getElementById("colorB").value);
    if (text_Red < 0 || text_Green < 0 || text_Blue < 0) {
        error_Code = "<P OnClick='clear_Error()'>Error: invalid input, negative number</P>";
        update_Error(error_Code);
    } else
    if (text_Red > 255 || text_Green > 255 || text_Blue > 255) {
        error_Code = "<P OnClick='clear_Error()'>Error: invalid input, over 255</P>";
        update_Error(error_Code);
    } else {
        var temp_New_Color = "rgb(" + text_Red + ", " + text_Green + ", " + text_Blue + ")";
        document.body.style.color = temp_New_Color;
        SVGColor_Change();
        set_Local_Options_Storage();
    }
}

function background_Color_Change() {
    text_BG_Red = parseInt(document.getElementById("colorR").value);
    text_BG_Green = parseInt(document.getElementById("colorG").value);
    text_BG_Blue = parseInt(document.getElementById("colorB").value);
    if (text_BG_Red < 0 || text_BG_Green < 0 || text_BG_Blue < 0) {
        error_Code = "<P OnClick='clear_Error()'>Error: invalid input, negative number</P>";
        update_Error(error_Code);
    } else
    if (text_BG_Red > 255 || text_BG_Green > 255 || text_BG_Blue > 255) {
        error_Code = "<P OnClick='clear_Error()'>Error: invalid input, over 255</P>";
        update_Error(error_Code);
    } else {
        var temp_New_Color = "rgb(" + text_BG_Red + ", " + text_BG_Green + ", " + text_BG_Blue + ")";
        document.body.style.backgroundColor = temp_New_Color;
        set_Local_Options_Storage();
    }
}

function SVGColor_Change(is_Startup) {
    SVGminus_Partial = ' WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right"><line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:2" /></SVG>';
    SVGplus_Partial = ' WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right"><line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:2" /><line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:2" /></SVG>';
    SVGgear = '<SVG WIDTH="12" HEIGHT="12"><line x1="2" y1="2" x2="10" y2="10" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:2" /><line x1="10" y1="2" x2="2" y2="10" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:2" /><line x1="1" y1="6" x2="11" y2="6" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:2" /><line x1="6" y1="1" x2="6" y2="11" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:2" /><circle cx="6" cy="6" r="3" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+')" /></SVG>';
    SVGplus = '<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right"><line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:2" /><line x1="6" y1="0" x2="6" y2="12" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:2" /></SVG>';
    SVGminus = '<SVG WIDTH="12" HEIGHT="12" ALIGN="right" style="float:right"><line x1="0" y1="6" x2="12" y2="6" style="stroke:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:2" /></SVG>';
    SVGdrag = ' WIDTH="16" HEIGHT="24"><polygon points="3,5 7,1 8,1 12,5" shape-rendering="crispEdges" style="fill:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:0" /><polygon points="3,18 7,22 8,22 12,18" shape-rendering="crispEdges" style="fill:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:0" /><circle cx="8" cy="12" r="3" style="fill:rgb('+text_Red+','+text_Green+','+text_Blue+');stroke-width:0" /></SVG>';
    document.getElementById("options_Hide").innerHTML = SVGgear;
    if (is_Startup != true) {
        redraw_Que();
    }
    color_Change_Content();
    color_Change_Content();//run twice to put back into proper mode for now
    hide_Content(1, 'BP_Hide', 'BP_Content_Hide', 'Blueprints:');
    hide_Content(1, 'BP_Hide', 'BP_Content_Hide', 'Blueprints:');//twice to put back into proper mode
    hide_All_Menus(0);
}

function default_Colors() {
    text_Red = 255;
    text_Green = 255;
    text_Blue = 255;
    text_BG_Red = 0;
    text_BG_Green = 11;
    text_BG_Blue = 25;
    set_Text_Background_Color_Startup();
    set_Local_Options_Storage();
}

/*	██╗  ██╗██╗██████╗ ███████╗
	██║  ██║██║██╔══██╗██╔════╝
	███████║██║██║  ██║█████╗
	██╔══██║██║██║  ██║██╔══╝
	██║  ██║██║██████╔╝███████╗
	╚═╝  ╚═╝╚═╝╚═════╝ ╚══════╝ */

function hide_All_Menus(Num) {
    hide_Content(Num, 'Parts_Hide', 'Parts_Content_Hide', 'Parts:');
    hide_Content(Num, 'Functional_Parts_Hide', 'Functional_Parts_Content_Hide', 'Functional Parts:');
    hide_Content(Num, 'Execptional_Parts_Hide', 'Execptional_Parts_Content_Hide', 'Execptional Parts:');
    hide_Content(Num, 'Complex_Parts_Hide', 'Complex_Parts_Content_Hide', 'Complex Parts:');
    hide_Content(Num, 'Structural_Parts_Hide', 'Structural_Parts_Content_Hide', 'Structural Parts:');
    hide_Content(Num, 'Intermediary_Parts_Hide', 'Intermediary_Parts_Content_Hide', 'Intermediary Parts:');
    hide_Content(Num, 'Consumables_Hide', 'Consumables_Content_Hide', 'Consumables:');
    hide_Content(Num, 'Elements_Hide', 'Elements_Content_Hide', 'Elements:');
    hide_Content(Num, 'Materials_Hide', 'Materials_Content_Hide', 'Materials:');
    hide_Content(Num, 'Scraps_Hide', 'Scraps_Content_Hide', 'Scraps:');
    hide_Content(Num, 'Pures_Hide', 'Pures_Content_Hide', 'Pures:');
    hide_Content(Num, 'Fuels_Hide', 'Fuels_Content_Hide', 'Fuels:');
    hide_Content(Num, 'Rocket_Fuels_Hide', 'Rocket_Fuels_Content_Hide', 'Rocket Fuels:');
    hide_Content(Num, 'Atmospheric_Fuels_Hide', 'Atmospheric_Fuels_Content_Hide', 'Atmospheric Fuels:');
    hide_Content(Num, 'Space_Fuels_Hide', 'Space_Fuels_Content_Hide', 'Space Fuels:');
    hide_Content(Num, 'Products_Hide', 'Products_Content_Hide', 'Products:');
    hide_Content(Num, 'Catalysts_Hide', 'Catalysts_Content_Hide', 'Catalysts:');
    hide_Content(Num, 'Planet_Elements_Hide', 'Planet_Elements_Content_Hide', 'Planet Elements:');
    hide_Content(Num, 'Core_Units_Hide', 'Core_Units_Content_Hide', 'Core Units:');
    hide_Content(Num, 'Dynamic_Core_Units_Hide', 'Dynamic_Core_Units_Content_Hide', 'Dynamic Core Units:');
    hide_Content(Num, 'Static_Core_Units_Hide', 'Static_Core_Units_Content_Hide', 'Static Core Units:');
    hide_Content(Num, 'Ground_Lights_Hide', 'Ground_Lights_Content_Hide', 'Ground Lights:')
    hide_Content(Num, 'Construct_Elements_Hide', 'Construct_Elements_Content_Hide', 'Construct Elements:');
    hide_Content(Num, 'Resurrection_Nodes_Hide', 'Resurrection_Nodes_Content_Hide', 'Resurrection Nodes:');
    hide_Content(Num, 'Containers_Hide', 'Containers_Content_Hide', 'Containers:');
    hide_Content(Num, 'Interactive_Elements_Hide', 'Interactive_Elements_Content_Hide', 'Interactive Elements:');
    hide_Content(Num, 'Seats_Hide', 'Seats_Content_Hide', 'Seats:');
    hide_Content(Num, 'Stabilizers_Hide', 'Stabilizers_Content_Hide', 'Stabilizers:');
    hide_Content(Num, 'Item_Containers_Hide', 'Item_Containers_Content_Hide', 'Item Containers:');
    hide_Content(Num, 'Fuel_Tanks_Hide', 'Fuel_Tanks_Content_Hide', 'Fuel Tanks:');
    hide_Content(Num, 'Rocket_Fuel_Containers_Hide', 'Rocket_Fuel_Containers_Content_Hide', 'Rocket Fuel Containers:');
    hide_Content(Num, 'Atmospheric_Fuel_Containers_Hide', 'Atmospheric_Fuel_Containers_Content_Hide', 'Atmospheric Fuel Containers:');
    hide_Content(Num, 'Space_Fuel_Containers_Hide', 'Space_Fuel_Containers_Content_Hide', 'Space Fuel Containers:');
    hide_Content(Num, 'Dispensers_Hide', 'Dispensers_Content_Hide', 'Dispensers:');
    hide_Content(Num, 'Landing_Gears_Hide', 'Landing_Gears_Content_Hide', 'Landing Gears:');
    hide_Content(Num, 'Force_Fields_Hide', 'Force_Fields_Content_Hide', 'Force Fields:');
    hide_Content(Num, 'Interactive_Elements_Elevators_Hide', 'Interactive_Elements_Elevators_Content_Hide', 'Interactive Elements Elevators:');
    hide_Content(Num, 'Doors_Hide', 'Doors_Content_Hide', 'Doors:');
    hide_Content(Num, 'Screens_Hide', 'Screens_Content_Hide', 'Screens:');
    hide_Content(Num, 'Signs_Hide', 'Signs_Content_Hide', 'Signs:');
    hide_Content(Num, 'Space_Brakes_Hide', 'Space_Brakes_Content_Hide', 'Space Brakes:');
    hide_Content(Num, 'Air_Brakes_Hide', 'Air_Brakes_Content_Hide', 'Air Brakes:');
    hide_Content(Num, 'Ailerons_Hide', 'Ailerons_Content_Hide', 'Ailerons:');
    hide_Content(Num, 'Atmospheric_Engines_Hide', 'Atmospheric_Engines_Content_Hide', 'Atmospheric Engines:');
    hide_Content(Num, 'Space_Engines_Hide', 'Space_Engines_Content_Hide', 'Space Engines:');
    hide_Content(Num, 'Hovercraft_Engines_Hide', 'Hovercraft_Engines_Content_Hide', 'Hovercraft Engines:');
    hide_Content(Num, 'Adjustors_Hide', 'Adjustors_Content_Hide', 'Adjustors:');
    hide_Content(Num, 'Rocket_Engines_Hide', 'Rocket_Engines_Content_Hide', 'Rocket Engines:');
    hide_Content(Num, 'Vertical_Boosters_Hide', 'Vertical_Boosters_Content_Hide', 'Vertical Boosters:');
    hide_Content(Num, 'Lights_Hide', 'Lights_Content_Hide', 'Lights:');
    hide_Content(Num, 'AntiGravity_Pulsors_Hide', 'AntiGravity_Pulsors_Content_Hide', 'AntiGravity Pulsors:');
    hide_Content(Num, 'Territory_Scanners_Hide', 'Territory_Scanners_Content_Hide', 'Territory Scanners:');
    hide_Content(Num, 'Gyroscopes_Hide', 'Gyroscopes_Content_Hide', 'Gyroscopes:');
    hide_Content(Num, 'Telemeters_Hide', 'Telemeters_Content_Hide', 'Telemeters:');
    hide_Content(Num, 'Engines_Hide', 'Engines_Content_Hide', 'Engines:');
    hide_Content(Num, 'Instruments_Hide', 'Instruments_Content_Hide', 'Instruments:');
    hide_Content(Num, 'AND_Operators_Hide', 'AND_Operators_Content_Hide', 'AND Operators:');
    hide_Content(Num, 'Receivers_Hide', 'Receivers_Content_Hide', 'Receivers:');
    hide_Content(Num, 'OR_Operators_Hide', 'OR_Operators_Content_Hide', 'OR Operators:');
    hide_Content(Num, 'Relays_Hide', 'Relays_Content_Hide', 'Relays:');
    hide_Content(Num, 'Data_Banks_Hide', 'Data_Banks_Content_Hide', 'Data Banks:');
    hide_Content(Num, 'Laser_Emitters_Hide', 'Laser_Emitters_Content_Hide', 'Laser Emitters:');
    hide_Content(Num, 'Counters_Hide', 'Counters_Content_Hide', 'Counters:');
    hide_Content(Num, 'Delay_Lines_Hide', 'Delay_Lines_Content_Hide', 'Delay Lines:');
    hide_Content(Num, 'Data_Emitters_Hide', 'Data_Emitters_Content_Hide', 'Data Emitters:');
    hide_Content(Num, 'NOT_Operators_Hide', 'NOT_Operators_Content_Hide', 'NOT Operators:');
    hide_Content(Num, 'Electronics_Hide', 'Electronics_Content_Hide', 'Electronics:');
    hide_Content(Num, 'Sensors_Hide', 'Sensors_Content_Hide', 'Sensors:');
    hide_Content(Num, 'Anti_Gravity_Generator_Hide', 'Anti_Gravity_Generator_Content_Hide', 'Anti Gravity Generator:');
    hide_Content(Num, 'Decorative_Element_Hide', 'Decorative_Element_Content_Hide', 'Decorative Element:');
    hide_Content(Num, 'Control_Units_Hide', 'Control_Units_Content_Hide', 'Control Units:');
    hide_Content(Num, 'Radars_Hide', 'Radars_Content_Hide', 'Radars:');
    hide_Content(Num, 'Manual_Switches_Hide', 'Manual_Switches_Content_Hide', 'Manual Switches:');
    hide_Content(Num, 'Pressure_Tiles_Hide', 'Pressure_Tiles_Content_Hide', 'Pressure Tiles:');
    hide_Content(Num, 'Manual_Buttons_Hide', 'Manual_Buttons_Content_Hide', 'Manual Buttons:');
    hide_Content(Num, 'Laser_Detectors_Hide', 'Laser_Detectors_Content_Hide', 'Laser Detectors:');
    hide_Content(Num, 'Zone_Detectors_Hide', 'Zone_Detectors_Content_Hide', 'Zone Detectors:');
    hide_Content(Num, 'Hull_Decoration_Hide', 'Hull_Decoration_Content_Hide', 'Hull Decoration:');
    hide_Content(Num, 'Barriers_Hide', 'Barriers_Content_Hide', 'Barriers:');
    hide_Content(Num, 'Adjuncts_Hide', 'Adjuncts_Content_Hide', 'Adjuncts:');
    hide_Content(Num, 'Holograms_Hide', 'Holograms_Content_Hide', 'Holograms:');
    hide_Content(Num, 'Windows_Hide', 'Windows_Content_Hide', 'Windows:');
    hide_Content(Num, 'Decorative_Cables_Hide', 'Decorative_Cables_Content_Hide', 'Decorative Cables:');
    hide_Content(Num, 'Antennas_Hide', 'Antennas_Content_Hide', 'Antennas:');
    hide_Content(Num, 'Plants_Hide', 'Plants_Content_Hide', 'Plants:');
    hide_Content(Num, 'Furnitures_Hide', 'Furnitures_Content_Hide', 'Furnitures:');
    hide_Content(Num, 'Pipes_Hide', 'Pipes_Content_Hide', 'Pipes:');
    hide_Content(Num, 'Bathroom_Elements_Hide', 'Bathroom_Elements_Content_Hide', 'Bathroom Elements:');
    hide_Content(Num, 'Piloting_Control_Units_Hide', 'Piloting_Control_Units_Content_Hide', 'Piloting Control Units:');
    hide_Content(Num, 'Generic_Control_Units_Hide', 'Generic_Control_Units_Content_Hide', 'Generic Control Units:');
    hide_Content(Num, 'Commandment_Seats_Hide', 'Commandment_Seats_Content_Hide', 'Commandment Seats:');
    hide_Content(Num, 'Hovercraft_Cockpits_Hide', 'Hovercraft_Cockpits_Content_Hide', 'Hovercraft Cockpits:');
    hide_Content(Num, 'Remote_Controllers_Hide', 'Remote_Controllers_Content_Hide', 'Remote Controllers:');
    hide_Content(Num, 'Closed_Cockpits_Hide', 'Closed_Cockpits_Content_Hide', 'Closed Cockpits:');
    hide_Content(Num, 'Honeycomb_Materials_Hide', 'Honeycomb_Materials_Content_Hide', 'Honeycomb Materials:');
    hide_Content(Num, 'Tier_1_Hide', 'Tier_1_Content_Hide', 'Tier 1:');
    hide_Content(Num, 'Tier_2_Hide', 'Tier_2_Content_Hide', 'Tier 2:');
    hide_Content(Num, 'Tier_3_Hide', 'Tier_3_Content_Hide', 'Tier 3:');
    hide_Content(Num, 'Tier_4_Hide', 'Tier_4_Content_Hide', 'Tier 4:');
    hide_Content(Num, 'Tier_5_Hide', 'Tier_5_Content_Hide', 'Tier 5:');
}

function BP_Menu_Hide() {
    var temp_ID = document.getElementById("BP_Menu");
    if (temp_ID.style.display === "none") {
        temp_ID.style.display = "initial";
    } else {
        temp_ID.style.display = "none";
    }
}

function que_Hide() {
    var temp_ID = document.getElementById("que_List");
    if (temp_ID.style.display === "none") {
        temp_ID.style.display = "initial";
    } else {
        temp_ID.style.display = "none";
    }
}

function options_Hide() {
    var temp_ID = document.getElementById("options_Content_Hide");
    if (temp_ID.style.display === "none") {
        temp_ID.style.display = "initial";
        document.getElementById("options_Hide").innerHTML = SVGgear;
    } else {
        temp_ID.style.display = "none";
        document.getElementById("options_Hide").innerHTML = SVGgear;
    }
}

function color_Change_Content() {
    var temp_ID = document.getElementById("color_Change_Content_Hide");
    if (temp_ID.style.display === "none") {
        temp_ID.style.display = "initial";
        document.getElementById("color_Change_Hide").innerHTML = "Color change" + SVGminus;
    } else {
        temp_ID.style.display = "none";
        document.getElementById("color_Change_Hide").innerHTML = "Color change" + SVGplus;
    }
}

function hide_Content(z, link_ID, ID_To_Hide, the_HTML) {
    //z = 0 to not change it, z = 1 to flip it, z = 3 force to force hide/minimize, z = 4 to force show/maximize
    var temp_ID = document.getElementById(ID_To_Hide);
    if (temp_ID.style.display === "none" && z == 1) {
        temp_ID.style.display = "initial";
        document.getElementById(link_ID).innerHTML = the_HTML + SVGminus;
    } else  if (temp_ID.style.display = "initial" && z == 1) {
        temp_ID.style.display = "none";
        document.getElementById(link_ID).innerHTML = the_HTML + SVGplus;
    }
    if (temp_ID.style.display === "none" && z == 0) {
        document.getElementById(link_ID).innerHTML = the_HTML + SVGplus;
    } else  if (temp_ID.style.display = "initial" && z == 0) {
        document.getElementById(link_ID).innerHTML = the_HTML + SVGminus;
    }
    if (z == 3) {
        temp_ID.style.display = "none";
        document.getElementById(link_ID).innerHTML = the_HTML + SVGplus;
    }
    if (z == 4) {
        temp_ID.style.display = "initial";
        document.getElementById(link_ID).innerHTML = the_HTML + SVGminus;
    }
}

window.onload = run_First();

//-->
