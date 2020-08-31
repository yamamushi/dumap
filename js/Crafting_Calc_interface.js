

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
	//console.log(path);
    xobj.send(null);
}

var tierNames=["Basic","Uncommon","Advanced","Rare","Exotic"];

var itemsAccordion,skillsAccordion,industryPrices,prices,recipes;

loadJSON("../data/itemsAccordion.json",function(json){itemsAccordion=JSON.parse(json);})
loadJSON("../data/skillsAccordion.json",function(json){skillsAccordion=JSON.parse(json);})
loadJSON("../data/industryTimePrices.json",function(json){industryPrices=JSON.parse(json);})
loadJSON("../data/orePrices.json",function(json){prices=JSON.parse(json);})
loadJSON("../data/recipes.json",function(json){recipes=json;})



//console.log(JSON.stringify(skills,null,2));


function formatNum(num,places)
{
	if (typeof num !="number"){
		num=parseFloat(num);
	}
	//console.log(num)
	var nStr=num.toFixed(places).toString();
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	//console.log(x1+" "+x2);
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
    return days+' d : '+hours+' h : '+minutes+' m : '+formatNum(seconds,0)+' s';
}




//-----------------------------------------------------------------------------------
// crafting calculator variables and calculation
var inv=[];
var craft=[];
var industrySelection={};
var itemLists=[];
var skills={};
//populate skills
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

//console.log(recipes);
//console.log(typeof recipes);
var cc=new recipeCalc(recipes);
//console.log(JSON.stringify(cc.db));

var invListCols=invList.children.length;
var craftListCols=cftList.children.length;
var oreListCols=oreList.children.length;
var queueListCols=queueList.children.length;
var queueListDetailedCols=queueListDetailed.children.length;

//run crafting calculations and update output lists oreList and queueList
function calculate()
{
	//console.log("calculating...")
	//console.log("craft "+JSON.stringify(craft));
	//console.log("inv "+JSON.stringify(inv));
	
	while (oreList.children.length>oreListCols)
	{
		oreList.removeChild(oreList.children[oreListCols])
	}
	while (queueList.children.length>queueListCols)
	{
		queueList.removeChild(queueList.children[queueListCols])
	}
	while (queueListDetailed.children.length>queueListDetailedCols)
	{
		queueListDetailed.removeChild(queueListDetailed.children[queueListDetailedCols])
	}
	if(craft.length===0)
	{
		totalTime.innerHTML="0".toHHMMSS();
		totalOre.innerHTML=0;
		totalPrice.innerHTML=0;
		trySaveState();
		return;
	}
	
	//console.log("calculating the craft");
	itemLists=cc.calcList(craft,inv,skills);
	//console.log("got the craft list");
	var list=itemLists.normal;
	
	//console.log("result of craftcalc is");
	//console.log(JSON.stringify(list,null,2));
	
	//console.log("start of calc prices");
	//console.log(JSON.stringify(prices));
	
	var totOre=0;
	var totTime=0;
	var totPrice=0;
	
	var striped=false;
	
	for (var i=0;i<list.length;i++)
	{
		//console.log("creating elements for "+JSON.stringify(list[i]));
		if (list[i].type=="Ore")
		{
			var item=document.createElement("div");
			item.classList.add("ore-item");
			item.innerHTML=list[i].name;
			item.style.padding="0 0 0 5px";
			item.style["border-radius"]="3px";
			
			var qty=document.createElement("div");
			qty.classList.add("ore-quantity");
			qty.innerHTML=formatNum(list[i].quantity,0);
			totOre+=list[i].quantity;
			
			var price=document.createElement("div");
			price.classList.add("ore-quantity");
			price.innerHTML=formatNum(list[i].quantity*prices[list[i].name],0);
			totPrice+=list[i].quantity*prices[list[i].name];
			
			var check=document.createElement("button");
			check.classList.add("ore-done");
			check.onclick=finishOreItem;
			check.innerHTML="&#x2714;"
			
			
			oreList.appendChild(item);
			oreList.appendChild(qty);
			oreList.appendChild(price);
			oreList.appendChild(check);
			
		}else{
			// detailed window list
			var bgcolor="#005380";
			if(striped){
				bgcolor="#00324d"
			}
			var line=[];
			var item2=document.createElement("div");
			item2.classList.add("queue-item");
			item2.innerHTML=list[i].name;
			line.push(item2);
			
			var qty2=document.createElement("div");
			qty2.classList.add("queue-quantity");
			qty2.innerHTML=formatNum(list[i].quantity,0);
			line.push(qty2);
			
			var bp=document.createElement("div");
			bp.classList.add("queue-quantity");
			bp.innerHTML=formatNum(list[i].bpquantity,0);
			line.push(bp);
				
			var qtySkill=document.createElement("div");
			qtySkill.classList.add("queue-quantity");
			qtySkill.innerHTML=list[i].skillQ;
			line.push(qtySkill);
			
			var qtyEff=document.createElement("div");
			qtyEff.classList.add("queue-quantity");
			qtyEff.innerHTML=list[i].effectivenessQ;
			line.push(qtyEff);
				
			var time2=document.createElement("div");
			time2.classList.add("queue-time");
			time2.innerHTML=formatNum(list[i].time,0);
			line.push(time2);
				
			var timeSkill=document.createElement("div");
			timeSkill.classList.add("queue-time");
			timeSkill.innerHTML=list[i].skillT;
			line.push(timeSkill);
			
			var timeEff=document.createElement("div");
			timeEff.classList.add("queue-time");
			timeEff.innerHTML=list[i].effectivenessT;
			line.push(timeEff);
			
			var indSel=document.createElement("SELECT");
			indSel.style.color="white";
			for(var j=list[i].industries.length-1;j>=0;j--){
				var ind=document.createElement("option");
				ind.text=list[i].industries[j];
				ind.style.color="white";
				indSel.add(ind)
			}
			if(industrySelection[list[i].name]!=null){
				indSel.value=industrySelection[list[i].name];
			}else{
				//console.log(list[i].name+" didn't have an industrySelection");
				industrySelection[list[i].name]=indSel.options[indSel.selectedIndex].text;
				//console.log(indSel.options[indSel.selectedIndex].text);
				
			}
			indSel.onchange=updateIndSel;
			line.push(indSel);
			var indPrice=list[i].time*industryPrices[indSel.options[indSel.selectedIndex].text];
			//console.log(list[i].name+" has ind price of "+industryPrices[indSel.options[indSel.selectedIndex].text]);
			if (isNaN(indPrice)){
				console.log(list[i].name+" is nan price");
			}
			else{
				totPrice+=indPrice;
			}
			
			var price=document.createElement("div");
			price.innerHTML=formatNum(indPrice);
			price.classList.add("queue-time");
			line.push(price);
			
			line.forEach(function(it,k){
				if(k%queueListDetailedCols!=0){
				it.style.backgroundColor=bgcolor;
				}
				queueListDetailed.appendChild(it);
			});
			striped=!striped;
			
			item2.classList.add(tierNames[list[i].tier-1].toLowerCase());
			
			
			
			
			
			//main window queue list
			
			var item=document.createElement("div");
			item.classList.add("queue-item");
			item.innerHTML=list[i].name;
			
			
			var qty=document.createElement("div");
			qty.classList.add("queue-quantity");
			//qty.innerHTML="<span class='queue-quantity-total'>"+formatNum(list[i].quantity,0)+"</span> (<span class='queue-quantity-byproduct'>"+formatNum(list[i].bpquantity,0)+"</span>)";
			qty.innerHTML=formatNum(list[i].quantity,0);
			
			var time=document.createElement("div");
			time.classList.add("queue-time");
			time.innerHTML=formatNum(list[i].time,0);
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
		//console.log("list[i] "+JSON.stringify(list[i],null,2));
		//console.log(list[i].tier);
		item.classList.add(tierNames[list[i].tier-1].toLowerCase());
		item.style.padding="0 0 0 5px";
		item.style["border-radius"]="3px";
			
	}
	totalTime.innerHTML=totTime.toString().toHHMMSS();
	totalOre.innerHTML=formatNum(totOre,0);
	
	totalPrice.innerHTML=formatNum(totPrice,0);
	
	//console.log("end of calc prices");
	//console.log(JSON.stringify(prices));

	trySaveState();
}


//-----------------------------------------------------------------------------
// Modals for item selection and skill selection

//function to create the accordion for the item list in the modal
//cause i sure as hell won't write all that
function createItemsAcc(list,depth,filter="",override=false)
{
	if (filter==undefined){filter="";}
	//console.log("ca "+depth);
	var output=[];
	var tab=""
	var found=false;
	for (var j=0;j<=depth;j++){tab+=" ";}
	
	for (var i=0;i<list.length;i++)
	{
		//console.log("list i "+list[i]);
		if (typeof list[i]=="object")
		{
			var or=override;
			if (filter!="" && list[i].name.toLowerCase().search(filter.toLowerCase())!=-1){ or=true; }
			var deeperOutput=createItemsAcc(list[i].data,depth+1,filter,or);
			//console.log("list i "+list[i].name);
			//console.log("found item on deeper list? "+deeperOutput[1]);
			//console.log("override? "+or);
			if(deeperOutput[1] || override){
				found=true;
				output.push(tab+'<div class="accordion unselectable"><span>+</span><span class="accordion-title">');
				output.push(list[i].name);
				output.push('</span></div>\n'+tab+'\t<div class="accordion-panel unselectable">\n');
				output.push(deeperOutput[0].join(''));
				output.push(tab+'\t</div>\n');
			}
			
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
			if (filter=="" || list[i].toLowerCase().search(filter.toLowerCase())!=-1 || override){
				output.push(tab+"\t<div class='accordion-item unselectable "+cn+"'>");
				output.push(list[i]);
				output.push("</div>\n");
			}
		}
	}
	if (output.length>0){
		found=true;
	}
	if (!found && depth==0){output=['<span style="color:#fff">No results</span>'];}
	return [output,found];
}

var itemsAccList=createItemsAcc(itemsAccordion,0,"")[0];
var itemsAccStr=itemsAccList.join('')
itemAccordion.innerHTML=itemsAccStr;

var keyHit=(new Date()).getTime();

async function setFilter(){
	/*
	var t=(new Date()).getTime();
	if (t-filterTime>3000){
		itemsAccList=createItemsAcc(itemsAccordion,0,itemFilter.value)[0];
		itemsAccStr=itemsAccList.join('')
		itemAccordion.innerHTML=itemsAccStr;
		filterTime=t;
	}
	*/
	//console.log('key hit');
	var t=(new Date()).getTime();
	if (t-keyHit>=2000){
		//console.log("waiting");
		let promise = new Promise((resolve, reject) => {
			setTimeout(() => resolve(), 2000)
		});
		let result = await promise;
		
		//console.log("filtering");
		//console.log(itemFilter.value);
		itemsAccList=createItemsAcc(itemsAccordion,0,itemFilter.value)[0];
		itemsAccStr=itemsAccList.join('')
		itemAccordion.innerHTML=itemsAccStr;
		setupCallbacks();
	}
	
	
	
}
var itemFilter=document.getElementById("itemFilter");
itemFilter.onkeydown=setFilter;

document.body.addEventListener("keydown",function(){
	keyHit=(new Date()).getTime();
});


function createSkillsAcc(){
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
	numStr=numStr.replace(/,/g,"");
	//console.log(numStr);
	var num=numStr.match(/[0-9]+.*[0-9]*/g);
	//console.log(num);
	return parseFloat(num[0]);
}
//callback for clicking check on ore item. removes row from oreList and places it in invList
function finishOreItem(event)
{
	var qty=newParse(event.target.previousSibling.previousSibling.innerHTML);
	var name=event.target.previousSibling.previousSibling.previousSibling.innerHTML;
	
	var ast=name.search(/\*/);
	if (ast!=-1){
		name=name.substring(0,ast-1);
	}
	addInvItem(name,qty);
}
//callback for clicking check on queue item. removes row from oreList and places it in invList
function finishCraftItem(event)
{
	var qty=newParse(event.target.previousSibling.previousSibling.innerHTML);
	var name=event.target.previousSibling.previousSibling.previousSibling.innerHTML;
	
	//console.log("finish ore item "+name+" "+qty);
	//console.log(typeof name)
	
	var ast=name.search(/\*/);
	if (ast!=-1){
		name=name.substring(0,ast-1);
	}
	
	addInvItem(name,qty);
}


// modal accordion callbacks
function setupCallbacks(){
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

	for (var i = 0; i < accItems.length; i++) {
		accItems[i].addEventListener("click",addItem)
	}
}

setupCallbacks();
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
	hideProfileModal();
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



function displayProfileModal(input){
	profileModal.style.display = "block";
}
function hideProfileModal(){
	profileModal.style.display = "none";
}
// When the user clicks on <span> (x), close the modal
profileModalClose.onclick = hideProfileModal;


function displayQueueModal(input){
	craftQueueModal.style.display = "block";
}
function hideQueueModal(){
	craftQueueModal.style.display = "none";
}
// When the user clicks on <span> (x), close the modal
craftQueueModalClose.onclick = hideQueueModal;


function displayPriceModal(input){
	priceModal.style.display = "block";
}
function hidePriceModal(){
	priceModal.style.display = "none";
}
// When the user clicks on <span> (x), close the modal
priceModalClose.onclick = hidePriceModal;


priceButton.onclick=displayPriceModal;
detailedCraftQueueButton.onclick=displayQueueModal;
profileButton.onclick=displayProfileModal;
skillsButton.onclick=displaySkillsModal;
clearButton.onclick=clearLists;

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
			updateInvList();
			calculate();
			return;
		}
	}
	inv.push({name:name,quantity:quantity});
	updateInvList();
	calculate();
}
function updateInvList(){
	while(invList.children.length>invListCols){
		invList.removeChild(invList.children[invListCols]);
	}
	for(var i=0;i<inv.length;i++){
		var name=inv[i].name;
		var type=cc.db[name].type;
		var quantity=inv[i].quantity.toString()
		
		var minus=document.createElement("button");
		minus.classList.add("inv-remove");
		minus.innerHTML="&minus;"
		minus.onclick=removeItem;
		var item=document.createElement("div");
		item.classList.add("inv-item");
		item.innerHTML=name;
		console.log(name+" "+type);
		if (type=="Ore" || type=="Pure")
		{
			item.classList.add(name);
			item.style.padding="0 0 0 5px";
			item.style["border-radius"]="3px";
		}
		item.classList.add(tierNames[cc.db[name].tier-1].toLowerCase());
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
}

function addCraftItem(name, quantity) {
	craft.push({name:name,quantity:quantity});
	updateCraftList();
	calculate();
}
function updateCraftList(){
	while(cftList.children.length>craftListCols){
		cftList.removeChild(cftList.children[craftListCols]);
	}
	for(var i=0;i<craft.length;i++){
		var name=craft[i].name;
		var minus=document.createElement("button");
		minus.classList.add("cft-remove");
		minus.innerHTML="&minus;"
		minus.onclick=removeItem;
		var item=document.createElement("div");
		item.classList.add("cft-item");
		item.innerHTML=name;
		var type=cc.db[name].type;
		if (type=="Pure")
		{
			var cn=name.split(" ")[0].toLowerCase();
			item.classList.add(cn);
			item.style.padding="0 0 0 5px";
			item.style["border-radius"]="3px";
		}
		item.classList.add(tierNames[cc.db[name].tier-1].toLowerCase());
		var qty=document.createElement("input");
		qty.type="number";
		qty.classList.add("cft-quantity");
		qty.min="0";
		qty.value=craft[i].quantity.toString();
		qty.oninput=updateCft;
		cftList.appendChild(minus);
		cftList.appendChild(item);
		cftList.appendChild(qty);
	}
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
	//console.log(skills[index].name)
	//console.log(skills[index].data[type].name)
	
	//console.log(type);
	//console.log(index);
	//console.log(skill);
	//console.log(value);
	//console.log(skills[type][skill][index]);
	skills[type][skill][index]=value;
	updateSkills();
	calculate();

}
function updateSkills(){
	Object.keys(skills).forEach(function(type,i){
		Object.keys(skills[type]).forEach(function(skill,j){
			Object.keys(skills[type][skill]).forEach(function(index,k){
				var value=skills[type][skill][index];
				var input = document.querySelector && document.querySelector('input[data-skill="' + type + "_" + skill + "_" + index + '"');
				if (input && input.value.toString() !== value.toString()) {
					input.value = value.toString();
				}
			});
		});
	});
}

var priceHeader1=document.createElement("h3");
priceHeader1.innerText="Price per L of ore";
priceDialog.appendChild(priceHeader1);
Object.keys(prices).forEach(function(ore,i){
	
	var label=document.createElement("div");
	label.classList.add("accordion-item2");
	label.classList.add("unselectable");
	label.classList.add(tierNames[cc.db[ore].tier-1].toLowerCase());
	label.innerHTML=ore;
	
	var qty=document.createElement("INPUT");
	qty.setAttribute("type","text");
	qty.setAttribute("value",prices[ore].toFixed(2).toString());
	qty.style.width="25%";
	qty.style.float="right";
	qty.classList.add("accordion-item2");
	qty.classList.add("price-ore");
	qty.onblur=updatePrice;
	
	label.appendChild(qty);
	
	priceDialog.appendChild(label);
	
});

var priceHeader2=document.createElement("h3");
priceHeader2.innerText="Price per second of industry crafting time";
priceDialog.appendChild(priceHeader2);

Object.keys(industryPrices).forEach(function(ind,i){
	
	var label=document.createElement("div");
	label.classList.add("accordion-item2");
	label.classList.add("unselectable");
	label.innerHTML=ind;
	
	
	var qty=document.createElement("INPUT");
	qty.setAttribute("type","text");
	qty.setAttribute("value",industryPrices[ind].toFixed(2).toString());
	qty.style.width="25%";
	qty.style.float="right";
	qty.classList.add("accordion-item2");
	qty.classList.add("price-ind");
	qty.onblur=updatePrice;
	
	label.appendChild(qty);
	
	priceDialog.appendChild(label);
});

function updatePrice(event){
	var name=event.target.parentElement.innerText;
	//console.log(event.target.value);
	//console.log(parseFloat("lol"));
	if(isNaN(parseFloat(event.target.value))){
		alert(event.target.value+" is not a valid number");
		for (var n of Object.keys(prices)){
			if (n==name){
				event.target.value=prices[n];
				return;
			}
		}
		for (var n of Object.keys(industryPrices)){
			if (n==name){
				event.target.value=prices[n];
				return;
			}
		}
	}
	for (var n of Object.keys(prices)){
		if (n==name){
			//console.log(newParse(event.target.value))
			prices[n]=newParse(event.target.value);
			updatePrices();
			calculate();
			return;
		}
	}
	for (var n of Object.keys(industryPrices)){
		if (n==name){
			industryPrices[n]=newParse(event.target.value);
			updatePrices();
			calculate();
			return;
		}
	}
}

function updatePrices(){
	//console.log("update prices");
	//console.log(JSON.stringify(prices));
	for(var i=0;i<priceDialog.children.length;i++){
		var ore=priceDialog.children[i].innerText;
		//console.log(ore);
		//console.log(priceDialog.children[i].children.length);
		if (priceDialog.children[i].children.length<1){continue;}
		//console.log(priceDialog.children[i].children[0].value);
		
		var inp=priceDialog.children[i].children[0];
		
		
		for (var j=0;j<inp.classList.length;j++){
			if (inp.classList[j]=="price-ore"){
				inp.value=prices[ore].toFixed(2).toString();
				//console.log("updating ore price "+ore);
			}else if(inp.classList[j]=="price-ind"){
				inp.value=industryPrices[ore].toFixed(2).toString();
				//console.log("updating ind price "+ore);
			}
		}
	}
}

function updateIndSel(event){
	var indSel=event.target;
	var item=indSel.previousSibling;
	
	while(true){
		var classes=item.classList;
		var flag=false;
		for(var c of classes){
			if(c=="queue-item"){
				flag=true;
				break;
			}
		}
		if (flag){ break; }
		item=item.previousSibling;
	}
	
	industrySelection[item.innerText]=event.target.value;
	updateIndSelections();
	calculate();
}
function updateIndSelections(){
	Object.keys(industrySelection).forEach(function(name,i){
		for(var el of queueListDetailed.children){
			if (el.innerText==name){
				var indSel=el;
				var tagname=indSel.tagName;
				while (tagname.toLowerCase()!="select"){
					indSel=indSel.nextSibling;
					tagname=indSel.tagName;
				}
				indSel.value=industrySelection[name];
				break;
			}
		}
	});
}

function clearLists(){
	craft=[];
	updateCraftList();
	inv=[];
	updateInvList();
	
	loadJSON("../data/industryTimePrices.json",function(json){industryPrices=JSON.parse(json);})
	loadJSON("../data/orePrices.json",function(json){prices=JSON.parse(json);})
	updatePrices();
	
	industrySelection={};
	
	
	calculate();
	
}

function getState(){
	// inv, craft, skills, prices, factory selection for parts
	var state={
		inv:inv,
		craft:craft,
		skills:skills,
		prices:prices,
		industryPrices:industryPrices,
		industrySelection:industrySelection
	};
	//console.log("get state: prices:");
	//console.log(JSON.stringify(state.skills.Pure.Time,null,2));
	return JSON.stringify(state);
}


// profile saving/loading

function saveProfile(){
	var name=profileSaveInput.value;
	if (name==""){
		return;
	}
	var state=getState();
	//console.log(state);
	window.localStorage.setItem("profile_"+name,state);
	var profiles=window.localStorage.getItem("profiles");
	
	if (!profiles){
		profiles=JSON.stringify([name]);
	} else{
		profiles=JSON.parse(profiles);
		var free=true;
		for(var i=0;i<profiles.length;i++){
			if(profiles[i]==name){
				free=false;
				break;
			}
		}
		if(free){
			profiles.push(name);
		}
	}
	window.localStorage.setItem("profiles",JSON.stringify(profiles));
	updateProfiles();
}
profileSaveButton.onclick=saveProfile;

function loadProfile(){
	var name=profileList.options[profileList.selectedIndex].text;
	var profile=window.localStorage.getItem("profile_"+name);
	if (!profile){
		alert("Profile not available");
		updateProfiles();
		return;
	}
	
	profileSaveInput.value=name;
	tryRestoreState(profile);
	calculate();
}
profileLoadButton.onclick=loadProfile;

function deleteProfile(){
	var name=profileDeleteList.options[profileDeleteList.selectedIndex].text;
	window.localStorage.setItem("profile_"+name,null);
	var profiles=JSON.parse(window.localStorage.getItem("profiles"));
	
	//console.log(JSON.stringify(profiles));
	
	for(var i=0;i<profiles.length;i++){
		if(profiles[i]==name){
			profiles.splice(i,1);
			break;
		}
	}
	//console.log('after delete');
	//console.log(JSON.stringify(profiles));
	window.localStorage.setItem('profiles',JSON.stringify(profiles));
	updateProfiles();
}
profileDeleteButton.onclick=deleteProfile;

function updateProfiles(){
	//console.log("update prof");
	var profileDropdowns=[profileList,profileDeleteList];
	var profiles=window.localStorage.getItem("profiles");
	//console.log(profiles);
	profileDropdowns.forEach(function(dd,i){
		while(dd.options.length>0){
			dd.remove(0);
		}
		//console.log(JSON.stringify(dd.options));
	});
	
	if (profiles){
		//console.log(profiles);
		profiles=JSON.parse(profiles);
		profileDropdowns.forEach(function(dd,i){
			profiles.forEach(function(item,i){
				var option = document.createElement("option");
				option.text=item;
				dd.add(option)
			});
		});
	}
	else{
		window.localStorage.setItem("profiles","[]");
	}
}

clearProfiles.onclick=function(){
	var profiles=window.localStorage.getItem("profiles");
	if (profiles){
		profiles=JSON.parse(profiles);
		for(var profile in profiles){
			window.localStorage.setItem("profile_"+profile,null);
		}
		window.localStorage.setItem("profiles",null);
		updateProfiles();
	}
	
};

updateProfiles();

// calculator state saving/loading

function tryRestoreState(profile) {
	if (profile==null){
		profile=window.localStorage.getItem("crafting_state");
	}
	try {
		if (!profile) {
			return;
		}

		var state = JSON.parse(profile);
		console.log("restoring...");
		
		// restore skils
		/*
		console.log(JSON.stringify(state.skills.Pure.Time,null,2))
		if (state.skills && state.skills.length > 0) {
			for (var i = 0; i < state.skills.length; i++) {
				var type = state.skills[i].type;
				var skill = state.skills[i].skill;
				var index = state.skills[i].index;
				var value = parseInt(state.skills[i].value);

				setSkill(type, skill, index, value);
			}
		}
		*/
		skills=state.skills;
		updateSkills()
		
		//console.log(JSON.stringify(state.skills.Pure.Time,null,2))
		
		// restore inventory
		/*
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
		*/
		inv=state.inv;
		updateInvList();
		
		// restore items to craft
		/*
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
		*/
		craft=state.craft;
		updateCraftList();
		
		//restore prices
		prices=state.prices
		industryPrices=state.industryPrices;
		updatePrices();
		
		industrySelection=state.industrySelection;
		updateIndSelections();
		
		
		
	} catch (e) {
		console.log('Could not restore the previous crafting calculator state.', e);
	}
}

function trySaveState() {
	try {
		if (!window.localStorage) {
			return;
		}
		console.log("saving...");
		window.localStorage.setItem('crafting_state',getState());
	} catch (e) {
		console.log('Could not save crafting calculator state.', e);
	}
	/*
	var profile=window.localStorage.getItem("crafting_state");
	
	var state = JSON.parse(profile);
	console.log("checking save...");
	// restore skils
	//console.log(JSON.stringify(state.skills.Pure.Material,null,2))
	*/
	
}

//window.localStorage.clear();
tryRestoreState();

calculate();
