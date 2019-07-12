

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
var itemsAccordion,skills,overhead,orePrices,recipes;
loadJSON("../data/itemsAccordion.json",function(json){itemsAccordion=JSON.parse(json);})
loadJSON("../data/skillsAccordion.json",function(json){skills=JSON.parse(json);})
loadJSON("../data/priceOverhead.json",function(json){overhead=JSON.parse(json);})
loadJSON("../data/orePrices.json",function(json){orePrices=JSON.parse(json);})
loadJSON("../data/recipes.json",function(json){recipes=JSON.parse(json);})


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

var cc=new recipeCalc(recipes);
//console.log(JSON.stringify(cc.db));

//run crafting calculations and update output lists oreList and queueList
function calculate()
{
	console.log("calculating...")
	console.log("craft "+JSON.stringify(craft));
	console.log("inv "+JSON.stringify(inv));
	
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
			output.push(createItemsAcc(list[i].list,depth+1).join(''));
			output.push(tab+'\t</div>\n');
		}else{
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
	//console.log("ca "+depth);
	var output=[];
	
	for (var i=0;i<skills.length;i++){
		
		output.push('<div class="accordion unselectable"><span>+</span><span class="accordion-title">');
		output.push(skills[i].name);
		output.push('</span></div>\n<div class="accordion-panel unselectable">\n');
		var data=skills[i].data;
		for(var j=0;j<data.length;j++){
			if (data[j].name=="Time")
			{
				if (typeof data[j].data == "object")
				{
					output.push('\t<div class="accordion unselectable"><span>+</span><span class="accordion-title">Time</span></div>\n\t<div class="accordion-panel unselectable">\n');
					for(var k=0;k<data[j].data.length;k++)
					{
						if (data[j].name=="Exceptional Part" && k<2){continue;}
						if (data[j].name=="Intermediary Part" && k>3){continue;}
						output.push("\t\t<div class='accordion-item2 unselectable'>Tier ");
						output.push(k+1);
						output.push(" ("+tierNames[k]+")<input oninput='setSkill("+i+","+j+","+k+",this.value)' class='accordion-input2' type='number' min='0' max='5' value='0'></div><br>\n");
					}
					output.push('\n\t</div>');
				}else{
					output.push("\t<div class='accordion-item2 unselectable'>Time    <input oninput='setSkill("+i+","+j+",null,this.value)' class='accordion-input2' type='number' min='0' max='5' value='0'></div>\n");
				}
			}
			if (data[j].name=="Material")
			{
				if(typeof data[j].data[0] =="number")
				{
					output.push('\t<div class="accordion unselectable"><span>+</span><span class="accordion-title">Material</span></div>\n\t<div class="accordion-panel unselectable">\n');
					for(var k=0;k<data[j].data.length;k++)
					{
						if (data[j].name=="Exceptional Part" && k<2){continue;}
						if (data[j].name=="Intermediary Part" && k>3){continue;}
						output.push("\t\t<div class='accordion-item2 unselectable'>Tier ");
						output.push(k+1);
						output.push(" ("+tierNames[k]+")<input oninput='setSkill("+i+","+j+","+k+",this.value)' class='accordion-input2' type='number' min='0' max='5' value='0'></div><br>\n");
					}
					output.push('\t</div>');
					
				}else{
					output.push('\t<div class="accordion unselectable"><span>+</span><span class="accordion-title">Material</span></div>\n\t<div class="accordion-panel unselectable">\n');
					for(var k=0;k<data[j].data.length;k++)
					{
						var cn;
						if (data[j].data[k].name.search("Ore")!=-1 || data[j].data[k].name.search("Pure")!=-1)
						{
							cn=data[j].data[k].name.split(" ")[0].toLowerCase();
						}
						output.push("\t\t<div class='accordion-item2 unselectable "+cn+"'>");
						output.push(data[j].data[k].name);
						output.push("<input class='accordion-input2' oninput='setSkill("+i+","+j+","+k+",this.value)'  type='number' min='0' max='5' value='0'></div><br>\n");
					}
					output.push('\t</div>');
				}
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
//callback to add the modal item clicked on to the appropriate list
function addItem(event)
{
	if (which==invAddBut)
	{
		var items=document.getElementsByClassName("inv-item")
		for (var i=0;i<items.length;i++)
		{
			if (items[i].innerHTML==event.target.innerHTML) {alert("You already have that in your inventory list!");return;}
		}
		addInvItem(event.target.innerHTML);
		
	}else{
		if (event.target.innerHTML.search("Ore")!=-1){alert("You have to mine ore, not craft it");return;}
		
		var items=document.getElementsByClassName("cft-item")
		for (var i=0;i<items.length;i++)
		{
			if (items[i].innerHTML==event.target.innerHTML) {alert("You already have that in your craft list!");return;}
		}
		var minus=document.createElement("button");
		minus.classList.add("cft-remove");
		minus.innerHTML="&minus;"
		minus.onclick=removeItem;
		var item=document.createElement("div");
		item.classList.add("cft-item");
		item.innerHTML=event.target.innerHTML;
		if (event.target.innerHTML.search("Pure")!=-1)
		{
			var cn=event.target.innerHTML.split(" ")[0].toLowerCase();
			item.classList.add(cn);
			item.style.padding="0 0 0 5px";
			item.style["border-radius"]="3px";
		}
		var qty=document.createElement("input");
		qty.type="number";
		qty.classList.add("cft-quantity");
		qty.min="0";
		qty.value="1";
		qty.oninput=updateCft
		cftList.appendChild(minus)
		cftList.appendChild(item);
		cftList.appendChild(qty);
		craft.push({name:event.target.innerHTML,quantity:1});
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
function setSkill(skillIndex,type,index,value){
	//console.log("setting")
	//console.log(skills[skillIndex].name)
	//console.log(skills[skillIndex].data[type].name)
	if(index==null)
	{
		skills[skillIndex].data[type].data=value;
	}else{
		//console.log(skills[skillIndex].data[type].data[index].name)
		if (typeof skills[skillIndex].data[type].data[index]=="object")
		{
			skills[skillIndex].data[type].data[index].data=value;
		}else{
			skills[skillIndex].data[type].data[index]=value;
		}
	}
	calculate();
}

