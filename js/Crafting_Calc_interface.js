

// helper functions

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
var itemsAccordion,skillsAccordion,overhead,orePrices,recipes;
loadJSON("../data/itemsAccordion.json",function(json){itemsAccordion=JSON.parse(json);})
loadJSON("../data/skillsAccordion.json",function(json){skillsAccordion=JSON.parse(json);})
loadJSON("../data/priceOverhead.json",function(json){overhead=JSON.parse(json);})
loadJSON("../data/orePrices.json",function(json){orePrices=JSON.parse(json);})
loadJSON("../data/recipes.json",function(json){recipes=json;})

var skills={};
for (var i=0;i<skillsAccordion.length;i++)
{
	var type=skillsAccordion[i].name;
	skills[type]={};
	var iData=skillsAccordion[i].data;
	for (var j=0;j<iData.length; j++)
	{
		if (typeof iData[j] =="string"){
			skills[type][iData[j]]=0;
		}else{
			var list=iData[j].data;
			var data={}
			for (var k=0;k<list.length;k++)
			{
				if(list[k]!=null) {data[list[k]]=0;}
			}
			skills[type][iData[j].name]=data;
		}
	}
}

//console.log(JSON.stringify(skills,null,2));


function formatNum(num,places)
{
	var nStr=num.toFixed(places).toString();
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

String.prototype.toHHMMSS = function () {
    var sec_num = parseFloat(this); // don't forget the second param
    var days   = Math.floor( sec_num/ 86400);
    var hours   = Math.floor((sec_num-(days*86400)) / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)-(days*86400)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60)-(days*86400);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+formatNum(seconds,2);}
    return days+' d : '+hours+' h : '+minutes+' m : '+seconds+' s';
}




//-----------------------------------------------------------------------------------
// crafting calculator variables and calculation
var inv=[];
var craft=[];

//console.log(recipes);
//console.log(typeof recipes);
var cc=new recipeCalc(recipes);
//console.log(JSON.stringify(cc.db));

//run crafting calculations and update output lists oreList and queueList
function calculate()
{
	//console.log("calculating...")
	//console.log("craft "+JSON.stringify(craft));
	//console.log("inv "+JSON.stringify(inv));
	
	while (oreList.children.length>3)
	{
		oreList.removeChild(oreList.children[3])
	}
	while (queueList.children.length>4)
	{
		queueList.removeChild(queueList.children[4])
	}
	
	var itemLists=cc.calcList(craft,inv,skills);
	var list=itemLists.normal
	
	//console.log("result of craftcalc is");
	//console.log(JSON.stringify(list,null,2));
	
	var totOre=0;
	var totTime=0;
	
	for (var i=0;i<list.length;i++)
	{
		if (list[i].name.search("Ore")!=-1)
		{
			var item=document.createElement("div");
			item.classList.add("ore-item");
			var oreName=list[i].name.split(" ")[0].toLowerCase();
			item.classList.add(oreName);
			item.innerHTML=list[i].name;
			item.style.padding="0 0 0 5px";
			item.style["border-radius"]="3px";
			var qty=document.createElement("div");
			qty.classList.add("ore-quantity");
			qty.innerHTML=formatNum(list[i].quantity,0);
			totOre+=list[i].quantity;
			var check=document.createElement("button");
			check.classList.add("ore-done");
			check.onclick=finishOreItem;
			check.innerHTML="&#x2714;"
			oreList.appendChild(item);
			oreList.appendChild(qty);
			oreList.appendChild(check);
			
		}else{
			var item=document.createElement("div");
			item.classList.add("queue-item");
			item.innerHTML=list[i].name;
			
			if (list[i].name.search("Pure")!=-1){
				var pureName=list[i].name.split(" ")[0].toLowerCase();
				item.classList.add(pureName);
				item.style.padding="0 0 0 5px";
				item.style["border-radius"]="3px";
			}else{
				item.padding="0 0 0 5px";
			}
			
			var qty=document.createElement("div");
			qty.classList.add("queue-quantity");
			qty.innerHTML=formatNum(list[i].quantity,0);
			var time=document.createElement("div");
			time.classList.add("queue-time");
			time.innerHTML=formatNum(list[i].time,2);
			totTime+=list[i].time;
			var check=document.createElement("button");
			check.classList.add("queue-done");
			check.onclick=finishCraftItem;
			check.innerHTML="&#x2714;"
			queueList.appendChild(item);
			queueList.appendChild(qty);
			queueList.appendChild(time);
			queueList.appendChild(check);
		}
	}
	totalTime.innerHTML=totTime.toString().toHHMMSS();
	totalOre.innerHTML=formatNum(totOre,0);

	trySaveState();
}
//-----------------------------------------------------------------------------
// Modals for item selection and skill selection

//function to create the accordion for the item list in the modal
//cause i sure as hell won't write all that
function createItemsAcc(list,depth)
{
	//console.log("ca "+depth);
	var output=[];
	var tab=""
	for (var j=0;j<=depth;j++){tab+="\t";}
	
	for (var i=0;i<list.length;i++)
	{
		//console.log("list i "+list[i]);
		if (typeof list[i]=="object")
		{
			output.push(tab+'<div class="accordion unselectable"><span>+</span><span class="accordion-title">');
			output.push(list[i].name);
			output.push('</span></div>\n'+tab+'\t<div class="accordion-panel unselectable">\n');
			output.push(createItemsAcc(list[i].data,depth+1).join(''));
			output.push(tab+'\t</div>\n');
		}else{
			if (!cc.db[list[i]]) {
				console.log('Item ' + list[i] + ' has no recipe');
				continue;
			}

			var cn="";
			if (list[i].search("Ore")!=-1 || list[i].search("Pure")!=-1)
			{
				cn=list[i].split(" ")[0].toLowerCase();
			}
			output.push(tab+"\t<div class='accordion-item unselectable "+cn+"'>");
			output.push(list[i]);
			output.push("</div>\n");
		}
	}
	
	return output;
}
var itemsAccList=createItemsAcc(itemsAccordion,0);
var itemsAccStr=itemsAccList.join('')
itemAccordion.innerHTML=itemsAccStr;

var tierNames=["Common","Uncommon","Advanced","Rare","Exotic"];

function createSkillsAcc()
{
	function makeSkillInput(type, skill, index) {
		var typeStr = '"' + type + '"';
		var skillStr = '"' + skill + '"';
		var indexStr = index === null ? "null" : '"' + index + '"';

		return "<input" +
			" oninput='setSkill(" + typeStr + "," + skillStr + "," + indexStr + ",this.value)'" +
			" data-skill='" + (type + "_" + skill + "_" + index) + "'" +
			" class='accordion-input2' type='number' min='0' max='5' value='0'>";
	}

	//console.log("ca "+depth);
	var output=[];
	
	for (var i=0;i<skillsAccordion.length;i++){
		
		output.push('<div class="accordion unselectable"><span>+</span><span class="accordion-title">');
		output.push(skillsAccordion[i].name);
		output.push('</span></div>\n<div class="accordion-panel unselectable">\n');
		var data=skillsAccordion[i].data;
		var type=skillsAccordion[i].name;
		for(var j=0;j<data.length;j++){
			if (typeof data[j] =="string")
			{
				output.push("\t<div class='accordion-item2 unselectable'>Time   " + makeSkillInput(type, data[j], null) + "</div>\n");
			}else{
				output.push('\t<div class="accordion unselectable"><span>+</span><span class="accordion-title">'+data[j].name+'</span></div>\n\t<div class="accordion-panel unselectable">\n');
				for(var k=0;k<data[j].data.length;k++)
				{
					if (data[j].data[k]==null){continue;}
					cn="";
					if (data[j].data[k].search("Pure")!=-1) {cn=data[j].data[k].split(" ")[0].toLowerCase();}
					output.push("\t\t<div class='accordion-item2 unselectable "+cn+"'>"+data[j].data[k]);
					output.push(makeSkillInput(type, data[j].name, data[j].data[k]) + "</div><br>\n");
				}
				output.push('\n\t</div>');
			}
		}
		
		output.push('</div>\n');
	
	}
	
	return output;
}
var skillsAccList=createSkillsAcc();
var skillsAccStr=skillsAccList.join('');
skillAccordion.innerHTML=skillsAccStr;

//-----------------------------------------------------------------------------------
// callbacks

function newParse(numStr)
{
	return parseFloat(numStr.replace(",",""));
}
//callback for clicking check on ore item. removes row from oreList and places it in invList
function finishOreItem(event)
{
	var qty=newParse(event.target.previousSibling.innerHTML);
	var name=event.target.previousSibling.previousSibling.innerHTML;
	//console.log("finish ore item "+
	addInvItem(name,qty);
	calculate();
}
//callback for clicking check on queue item. removes row from oreList and places it in invList
function finishCraftItem(event)
{
	var qty=newParse(event.target.previousSibling.previousSibling.innerHTML);
	var name=event.target.previousSibling.previousSibling.previousSibling.innerHTML;
	addInvItem(name,qty);
	calculate();
}


// modal accordion callbacks
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
	this.classList.toggle("accordion-active");
	var panel = this.nextElementSibling;
	if (panel.style.display === "block") {
	  panel.style.display = "none";
	} else {
	  panel.style.display = "block";
	}
	
	if (this.children[0].innerHTML=="+") {
		this.children[0].innerHTML="-";
	}else{
		this.children[0].innerHTML="+";
	}
  });
}

var accItems=document.getElementsByClassName("accordion-item");

for (i = 0; i < accItems.length; i++) {
	accItems[i].addEventListener("click",addItem)
}


var which="";
//callback for displaying and hiding modal. keeps track of which button opened it with "which"
function displayItemsModal(input){
	which=input.target
	itemsModal.style.display = "block";
}
function hideItemsModal(){
	itemsModal.style.display = "none";
}

// When the user clicks on <span> (x), close the modal
itemsModalClose.onclick = hideItemsModal;

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target.classList.contains("modal")) {
    hideItemsModal();
    hideSkillsModal();
  }
}
invAddBut.onclick=displayItemsModal;
cftAddBut.onclick=displayItemsModal;




function displaySkillsModal(input){
	skillsModal.style.display = "block";
}
function hideSkillsModal(){
	skillsModal.style.display = "none";
}
// When the user clicks on <span> (x), close the modal
skillsModalClose.onclick = hideSkillsModal;


skillsButton.onclick=displaySkillsModal;

// updates the inv variable based on each number input
function updateInv(event)
{
	var name=event.target.previousSibling.innerHTML
	for(var i=0;i<inv.length;i++)
	{
		if (inv[i].name==name)
		{
			inv[i].quantity=newParse(event.target.value);
			break;
		}
	}
	//console.log(JSON.stringify(inv));
	calculate();
}

// updates the craft variable based on each number input
function updateCft(event)
{
	var name=event.target.previousSibling.innerHTML
	//console.log("craft event name "+name);
	for(var i=0;i<craft.length;i++)
	{
		if (craft[i].name==name)
		{
			craft[i].quantity=newParse(event.target.value);
			break;
		}
	}
	//console.log(JSON.stringify(craft));
	calculate();
}

// adds item row to inventory list
function addInvItem(name,quantity)
{
	if (quantity==null) {quantity=1;}
	
	for (var i=0;i<inv.length;i++)
	{
		if (inv[i].name==name)
		{
			inv[i].quantity+=quantity;
			
			var invItems=document.getElementsByClassName("inv-item");
			for (var j=0;j<invItems.length;j++)
			{
				if (invItems[j].innerHTML==name)
				{
					invItems[j].nextSibling.value=newParse(invItems[j].nextSibling.value)+quantity;
					break;
				}
			}
			return;
		}
	}
	inv.push({name:name,quantity:quantity});
	quantity=quantity.toString()
	
	var minus=document.createElement("button");
	minus.classList.add("inv-remove");
	minus.innerHTML="&minus;"
	minus.onclick=removeItem;
	var item=document.createElement("div");
	item.classList.add("inv-item");
	item.innerHTML=name;
	if (name.search("Ore")!=-1 || name.search("Pure")!=-1)
	{
		var cn=name.split(" ")[0].toLowerCase();
		item.classList.add(cn);
		item.style.padding="0 0 0 5px";
		item.style["border-radius"]="3px";
	}
	var qty=document.createElement("input");
	qty.type="number";
	qty.classList.add("inv-quantity");
	qty.min="0";
	qty.value=quantity;
	qty.oninput=updateInv
	invList.appendChild(minus)
	invList.appendChild(item);
	invList.appendChild(qty);
}

function addCraftItem(name, quantity) {
	var minus=document.createElement("button");
	minus.classList.add("cft-remove");
	minus.innerHTML="&minus;"
	minus.onclick=removeItem;
	var item=document.createElement("div");
	item.classList.add("cft-item");
	item.innerHTML=name;
	if (name.search("Pure")!=-1)
	{
		var cn=name.split(" ")[0].toLowerCase();
		item.classList.add(cn);
		item.style.padding="0 0 0 5px";
		item.style["border-radius"]="3px";
	}
	var qty=document.createElement("input");
	qty.type="number";
	qty.classList.add("cft-quantity");
	qty.min="0";
	qty.value=quantity.toString();
	qty.oninput=updateCft
	cftList.appendChild(minus)
	cftList.appendChild(item);
	cftList.appendChild(qty);
	craft.push({name:name,quantity:quantity});
}

//callback to add the modal item clicked on to the appropriate list
function addItem(event)
{
	var name = event.target.innerHTML;
	var quantity = 1;

	if (which==invAddBut)
	{
		var items=document.getElementsByClassName("inv-item")
		for (var i=0;i<items.length;i++)
		{
			if (items[i].innerHTML==name) {alert("You already have that in your inventory list!");return;}
		}
		addInvItem(name);
		
	}else{
		if (name.search("Ore")!=-1){alert("You have to mine ore, not craft it");return;}
		
		var items=document.getElementsByClassName("cft-item")
		for (var i=0;i<items.length;i++)
		{
			if (items[i].innerHTML==name) {alert("You already have that in your craft list!");return;}
		}

		addCraftItem(name, quantity);
	}
	calculate();
}
// callback for the minus buttons to remove row from the appropriate list
function removeItem(event)
{
	var minus=event.target;
	var item=minus.nextSibling;
	var qty=item.nextSibling;
	if (event.target.classList.contains("inv-remove"))
	{
		
		invList.removeChild(minus);
		invList.removeChild(item);
		invList.removeChild(qty);
		for(var i=0;i<inv.length;i++)
		{
			if(inv[i].name==item.innerHTML)
			{
				inv.splice(i,1);
			}
		}
	}else{
		cftList.removeChild(minus);
		cftList.removeChild(item);
		cftList.removeChild(qty);
		for(var i=0;i<craft.length;i++)
		{
			if(craft[i].name==item.innerHTML)
			{
				craft.splice(i,1);
			}
		}
	}
	calculate();
}

// skill modal callback to modify skill variable
function setSkill(type,skill,index,value){
	//console.log("setting")
	//console.log(skills[skillIndex].name)
	//console.log(skills[skillIndex].data[type].name)
	if(index==null)
	{
		skills[type][skill]=value;
	}else{
		//console.log(skills[skillIndex].data[type].data[index].name)
		skills[type][skill][index]=value;
	}

	var input = document.querySelector && document.querySelector('input[data-skill="' + type + "_" + skill + "_" + index + '"');
	if (input && input.value.toString() !== value.toString()) {
		input.value = value.toString();
	}

	calculate();
}

// calculator state saving/loading

function tryRestoreState() {
	try {
		if (!window.localStorage) {
			return;
		}

		var stateStr = window.localStorage.getItem('crafting_state');
		if (!stateStr) {
			return;
		}

		var state = JSON.parse(stateStr);

		// restore skils

		if (state.skills && state.skills.length > 0) {
			for (var i = 0; i < state.skills.length; i++) {
				var type = state.skills[i].type;
				var skill = state.skills[i].skill;
				var index = state.skills[i].index;
				var value = parseFloat(state.skills[i].value);

				if (!isFinite(value)) {
					continue;
				}

				var skillExists =
					typeof skills[type] !== "undefined" &&
					typeof skills[type][skill] !== "undefined" &&
					(index === null || typeof skills[type][skill][index] !== "undefined");

				if (!skillExists) {
					continue;
				}

				setSkill(type, skill, index, value);
			}
		}

		// restore inventory

		if (state.inv && state.inv.length > 0) {
			for (var i = 0; i < state.inv.length; i++) {
				var name = state.inv[i].name;
				var quantity = parseFloat(state.inv[i].quantity);

				if (!(name in cc.db)) {
					continue;
				}
				if (!isFinite(quantity)) {
					continue;
				}

				addInvItem(name, quantity);
			}
		}

		// restore items to craft

		if (state.craft && state.craft.length > 0) {
			for (var i = 0; i < state.craft.length; i++) {
				var name = state.craft[i].name;
				var quantity = parseFloat(state.craft[i].quantity);

				if (!(name in cc.db)) {
					continue;
				}
				if (!isFinite(quantity)) {
					continue;
				}

				addCraftItem(name, quantity);
			}
		}

		calculate();
	} catch (e) {
		console.log('Could not restore the previous crafting calculator state.', e);
	}
}

function trySaveState() {
	try {
		if (!window.localStorage) {
			return;
		}

		var skillArray = [];
		for (var type in skills) {
			var skillsOfType = skills[type];

			for (var skill in skillsOfType) {
				var skillValue = skillsOfType[skill];

				if (typeof skillValue !== "object") {
					skillArray.push({
						type: type,
						skill: skill,
						index: null,
						value: skillValue
					});
				} else {
					for (var index in skillValue) {
						skillArray.push({
							type: type,
							skill: skill,
							index: index,
							value: skillValue[index]
						})
					};
				}
			}
		}

		var state = {
			skills: skillArray,
			inv,
			craft
		};

		window.localStorage.setItem('crafting_state', JSON.stringify(state));
	} catch (e) {
		console.log('Could not save crafting calculator state.', e);
	}
}

tryRestoreState();
