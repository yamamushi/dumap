//helper functions
function roundUp(num, precision) {
	return Math.ceil(num / precision) * precision
}

function removeInvZeros(inv){
	var newInv={}
	var keys=Object.keys(inv);
	keys.forEach(function(k,i){
		if (inv[k]!=0) {newInv[k]=inv[k];}
	});
	return newInv;
}

// class for defining and item and its recipe
function itemRecipe(data){
	this.name=data.name;
	this.tier=data.tier;
	this.type=data.type;
	this.mass=data.mass;
	this.volume=data.volume;
	this.outputQuantity=data.outputQuantity;
	this.time=data.time;
	this.reusable=data.reusable;
	this.input=data.input
	if (this.input==null){this.input={};}
	
	this.setIngredient=function(name,number){
		
		if (number != 0 && number != null && !isNaN(number) && name.length>0){
			this.input[name]=number;
		}
	};
	
	this.getIngredients=function(){
		var out=[];
		Object.keys(this.input).forEach(function(name,i,a){
			out.push({name:name,quantity:this.input[name]});
		},this);
		return out;
	};
}

// holds recipe database and performs crafting calculations
function recipeCalc(data){
	
	//parse db from js object, JSON, 2d array, or csv string
	this.parseDb=function(db){
		var lines;
		var cols;
		var headers;
		
		var jsonOrObject=false;
		if (typeof db ==="object"){
			jsonOrObject=true;
			this.db={};
			this.types=[];
			Object.keys(db).forEach(function(name,index){
				var item=db[name];
				
				var fnd=false;
				for (var i=0;i<this.types.length;i++)
				{
					if(this.types[i]==item.type)
					{
						fnd=true;
						break;
					}
				}
				if(!fnd){
					this.types.push(item.type);
				}
				this.db[item.name]=new itemRecipe(item);
			},this);
			
		}else if (typeof db === "string"){
			try{ 
				db=JSON.parse(data);
				this.types=[];
				Object.keys(db).forEach(function(name,index){
					var item=db[name];
					var fnd=false;
					for (var i=0;i<this.types.length;i++)
					{
						if(this.types[i]==item.type)
						{
							fnd=true;
							break;
						}
					}
					if(!fnd){
						this.types.push(item.type);
					}
					this.db[item.name]=new itemRecipe(item)
				},this);
				jsonOrObject=true;
			
			}
			catch(e) {
				lines=db.split(/[\r\n]+/);
				cols=db.split(/\r|\n/)[0].split(",");
				
				headers={}
				cols.forEach(function(header,i,array){
					headers[header]=i;
				})
				
				lines.shift();
				
				var newLines=[];
				
				lines.forEach(function(line,i){
					var newLine=line.split(",");
					if (newLine.length==cols.length){
						newLines.push(newLine);
					}
				});
				lines=newLines;
			}
		}
		else {
			//console.log("is array")
			lines=data;
			cols=lines[0];
			data.shift();
			headers={}
			cols.forEach(function(header,i,array){
				headers[header]=i;
			});
		}
		
		if (!jsonOrObject){
			var items={};
			var currentItem="";
			var currentType="";
			this.types=[];
			//console.log("parsing lines")
			lines.forEach(function(line,i,array){
				//console.log(JSON.stringify(line));
				var iItem=line[headers["Item Name"]];
				var iType=line[headers["Item Type"]];
				
				//console.log("iType "+iType)
				//console.log("iItem "+iItem)
				if (typeof iType === "string" && iType.length !=0){
					currentType=iType;
					//console.log("new type "+currentType);
					this.types.push(currentType);
					return;
				}
				
				if (typeof iItem === "string" && iItem.length != 0){
					currentItem=iItem;
					//console.log("  new item "+currentItem);
					
					items[currentItem]=new itemRecipe( {name:currentItem,
						tier:parseInt(line[headers["Tier"]]),
						type:currentType,
						outputQuantity:parseFloat(line[headers["Output Per Batch"]]),
						time:parseFloat(line[headers["Time [s]"]]),
						reusable:currentItem.toLowerCase().search("catalyst") != -1} );
						
					if (this.types.indexOf(currentType)<8) {items[currentItem].mass=parseFloat(line[headers["Mass [kg]"]]);}
					
					if (this.types.indexOf(currentType)<5) {items[currentItem].volume=parseFloat(line[headers["Unit Volume [L]"]]);}
					
					//now fill in the first input
					items[currentItem].setIngredient(line[headers["Input Name"]],parseFloat(line[headers["Input Quantity"]]));
				}
				else 
				{
					//console.log("    "+line[headers["Input Name"]]+" "+parseFloat(line[headers["Input Quantity"]]));
					items[currentItem].setIngredient(line[headers["Input Name"]],parseFloat(line[headers["Input Quantity"]]));
				}
				
				
				this.db=items;
			},this);
		}
		
		Object.keys(this.db).forEach(function(k,i){
			//console.log(JSON.stringify(this.db[k]));
			
			if (this.types.indexOf(this.db[k].type)<5) {return;}
			var ing=this.db[k].getIngredients();
			var vol=0;
			
			ing.forEach(function(j,i2){
				vol+=j.quantity*this.db[j.name].volume
			},this);
			vol/=this.db[k].outputQuantity;
			this.db[k].volume=vol
			
			if (this.types.indexOf(this.db[k].type)<8) {return;}
			var mass=0;
			//console.log("fix mass k="+k);
			ing.forEach(function(j,i2){
				//console.log("    "+j.name)
				//console.log("    "+j.quantity+" "+j.name+" at "+this.db[j.name].mass);
				mass+=j.quantity*this.db[j.name].mass
			},this);
			mass/=this.db[k].outputQuantity;
			this.db[k].mass=mass
		},this);
		
		//console.log("parse db return");
		//console.log(JSON.stringify(this.db));
	};
	
	//console.log("constructor data");
	//console.log(data);
	this.data=data;
	this.parseDb(data);
	
	// eliminate 0 quantity list items and combine repeated ones
	this.reduceItems=function(list)
	{
		//console.log("reduce items");
		//console.log(JSON.stringify(list));
		var newList=[];
		for (var i=0;i<list.length;i++)
		{
			var fnd=false;
			for (var j=0;j<newList.length;j++)
			{
				if (list[i].name===newList[j].name)
				{
					newList[j].quantity+=list[i].quantity;
					fnd=true;
					break;
				}
			}
			if (!fnd && list[i].quantity>0)
			{
				var obj={};
				Object.keys(list[i]).forEach(function(item,index){
					obj[item]=list[i][item];
				});
				newList[newList.length]=obj;
			}
		}
		var t=this;
		newList.sort(function(l,r){ 
			var typeL=t.db[l.name].type;
			var typeR=t.db[r.name].type;
			return t.types.indexOf(typeL)>t.types.indexOf(typeR);
		});
		//console.log(JSON.stringify(newList));
		return newList;
	};
	
	//crafting simulation calculation
	// returns list of required crafting queue for a given input of crafted items
	this.simulate=function(input,inventory,reusables,skills)
	{
		//console.log("");
		//console.log("SIMULATING "+JSON.stringify(input));
		
		var itemSequence=[];
		input.reverse()
		var j=input.length-1;
		
		for (;j>=0;j--){
			var iqPair=input[j];
			//console.log("input: "+iqPair.name);
			var q=iqPair.quantity;
			
			//console.log("checking inventory "+inventory[iqPair.name]);
			if (q<inventory[iqPair.name]){
				//console.log("inventory has enough of input, moving on to next input");
				//inventory[iqPair.name]-=iqPair.quantity;
				input.splice(j,1);
				continue;
			}
			
			
			var ingredients=this.db[iqPair.name].getIngredients()
			var iq=this.db[iqPair.name].outputQuantity;
			
			//console.log("number of "+iqPair.name+" required "+q);
			
			
			var skillReduction=0;
			var skillLevel=0;
			var perLevel=0;
			
			//console.log("check skills")
			if (skills[this.db[iqPair.name].type]!=null &&skills[this.db[iqPair.name].type].material!=null)
			{
				//console.log("is a skill")
				if (this.db[iqPair.name].type=="Pure" )
				{
					perLevel=2;
					skillLevel=skills[this.db[iqPair.name].type].material[iqPair.name]
					skillReduction=skillLevel*perLevel;
				}
				else
				{
					perLevel=5;
					skillLevel=skills[this.db[iqPair.name].type].material[this.db[iqPair.name].tier-1];
					skillReduction=skillLevel*perLevel;
				}
				//console.log("skill level is "+skillLevel);
			}
			
			
			
			var iNecessaryQ=roundUp(q-inventory[iqPair.name],iq);
			//console.log("necessary number of "+iqPair.name+" required "+iNecessaryQ);
			//console.log("----checking ingredients of input");
			//console.log(JSON.stringify(this.db[iqPair.name].input));
			
			iqPair.quantity=iNecessaryQ;
			
			ingredients.forEach(function(ingPair,i){
				//console.log("--"+ingPair.name);
				
				if (this.db[ingPair.name].reusable) {
					//console.log("is reusable")
					if (reusables[ingPair.name]===undefined) {
						//console.log("first entry in reusables list");
						//console.log(ingPair.quantity);
						//ingPair.quantity/=(q/iq);
						//console.log("acutal amount needed: "+ingPair.quantity)
						reusables[ingPair.name]=ingPair.quantity;
					}
					else {
						//console.log(reusables[ingPair.name]);
						//console.log(ingPair.quantity);
						reusables[ingPair.name]=Math.max(reusables[ingPair.name],ingPair.quantity);
						ingPair.quantity=Math.max(0,reusables[ingPair.name]-ingPair.quantity);
					}
				}	
				var oq=this.db[ingPair.name].outputQuantity;
				
				
				ingPair.quantity=ingPair.quantity-skillReduction
					
				//console.log("due to skills, quantity is "+ingPair.quantity);
				
				
				
				
				//console.log(ingPair.name+" makes "+oq+" per batch");
				//console.log("each of input requires "+ingPair.quantity);
				//console.log("so "+iNecessaryQ+" input must be "+ingPair.quantity*iNecessaryQ/iq);
				
				var craftQ=ingPair.quantity*iNecessaryQ/iq;
				//console.log(ingPair.quantity);
				//console.log(iNecessaryQ);
				//console.log(iq);
				if (this.db[ingPair.name].reusable){
					craftQ=ingPair.quantity;
				}
				//console.log("amount we need: "+craftQ);
				//console.log("amount we have "+inventory[ingPair.name]);
				
				if (craftQ>inventory[ingPair.name]){
					//console.log("inventory does not have enough");
					//inventory[ingPair.name]=0;
				}
				else{
					//console.log("inventory has enough of ing, moving on to next input");
					inventory[ingPair.name]+=(-craftQ);
					//console.log("adding "+(-craftQ));
					//console.log(ingPair.name+" now "+inventory[ingPair.name]);
					input.splice(j,1);
					return;
				}
				
				ingPair.quantity=craftQ;
				var ingList=[ingPair]
				
				//console.log("sending request for "+ingPair.name+" q "+ingPair.quantity);
				var simulation=this.simulate(ingList,inventory,reusables,skills)
				
				//the actual simulated craft event
				//console.log("crafted "+ingPair.name+" q "+ingPair.quantity);
				inventory[ingPair.name]-=craftQ;
				//console.log(ingPair.name +" quantity left in inv "+inventory[ingPair.name]);
				itemSequence=itemSequence.concat(simulation);
			},this);
			//console.log("finished iterating through the ingredients of "+iqPair.name);
			itemSequence=itemSequence.concat([iqPair]);
			inventory[iqPair.name]+=(iqPair.quantity);
			//console.log("adding "+iqPair.quantity);
			//console.log(iqPair.name+" now "+inventory[iqPair.name]);
		}
		
		//console.log("returning "+JSON.stringify(itemSequence));
		//console.log("");
		return itemSequence;
	};
	
	// wrapper for the simulate func
	this.calcList=function(input,inv,skills)
	{
		var inputRed=this.reduceItems(input);
		var invRed=this.reduceItems(inv);
		
		for (i=inputRed.length-1;i>=0;i--){
			if (this.db[inputRed[i].name]===undefined) {
				inputRed.splice(i,1);
				continue;
				}
		}
		for (i=invRed.length-1;i>=0;i--){
			if (this.db[invRed[i].name]===undefined) {
				invRed.splice(i,1);
				continue;
				}
		}
		
		var sortFunc=function(l,r){
			return (l.type+l.tier/10)-(r.type+r.tier/10);
		}
		
		
		inputRed.forEach(function(k,i){
			k.type=this.types.indexOf(this.db[k.name].type);
			k.tier=this.db[k.name].tier;
		},this);
		
		inputRed.sort(sortFunc);
		inputRed.reverse();
		
		var inventory={};
		Object.keys(this.db).forEach(function(k,i){
			inventory[k]=0;
		});
		invRed.forEach(function(e,i){
			//console.log(JSON.stringify(e));
			inventory[e.name]=e.quantity;
			//console.log(e.name+" "+inventory[e.name]);
		},this);
		
		//console.log("input");
		//console.log(JSON.stringify(inputRed));
		//console.log("inventory");
		//console.log(JSON.stringify(inventory));
		var reusables={}
		
		//console.log("inv before");
		//console.log(JSON.stringify(removeInvZeros(inventory)));
		var craftList=this.simulate(inputRed,inventory,reusables,skills);
		//console.log("inv after");
		//console.log(JSON.stringify(removeInvZeros(inventory)));
		
		
		craftList.forEach(function(k,i){
			var time=this.db[k.name].time;
			k.tier=this.db[k.name].tier;
			k.typeName=this.db[k.name].type;
			k.type=this.types.indexOf(k.typeName);
			
			//console.log(k.name);
			if (skills[k.typeName]!=null) {
				if (k.typeName=="Pure")
				{
					time=time*(1-skills[k.typeName].time[k.tier-1]*0.05)
					k.time=k.quantity/this.db[k.name].outputQuantity*time;
				}else if (k.typeName.search("Honeycomb")!=-1){
					time=time*(1-skills[k.typeName].time*0.1)
					k.time=k.quantity/this.db[k.name].outputQuantity*time;
				}
				else
				{
					time=time*(1-skills[k.typeName].time[k.tier-1]*0.1)
					k.time=k.quantity/this.db[k.name].outputQuantity*time;
				}
			}else
			{
				k.time=k.quantity/this.db[k.name].outputQuantity*time;
			}
				
			
		},this);
		
		var compressedList=this.reduceItems(JSON.parse(JSON.stringify(craftList)));
		
		
		
		
		//console.log("types");
		//console.log(JSON.stringify(theTypes));
		
		compressedList.sort(sortFunc);
		
		var invList=[];
		Object.keys(inventory).forEach(function(k,i){
			if (inventory[k]===0){return;}
			invList.push({name:k,quantity:inventory[k],type:this.types.indexOf(this.db[k].type),tier:this.db[k].tier});
		},this);
		
		invList.sort(sortFunc);
		
		
		//console.log("calcLists normal");
		//console.log(JSON.stringify(compressedList));
		return {normal:compressedList,expanded:craftList,inventory:invList}
	};
	
	//return masses and volumes
	this.getMassesAndVol=function(){
		//console.log("getMasses start");
		var data=[];
		Object.keys(this.db).forEach(function(k,i){
			data.push({name:k,mass:this.db[k].mass,volume:this.db[k].volume,type:this.types.indexOf(this.db[k].type),tier:this.db[k].tier});
		},this);
		
		data.sort(function(l,r){
			return (l.type+l.tier/10)-(r.type+r.tier/10);
		})
		
		return data;
	}
	
	//calculate price of a list of items
	this.calcPrice=function(priceList,orePrices,itemList,settings,depth)
	{
		var price=0;
		var orePrice=0;
		
		var mass=0;
		var volume=0;
		var time=0;
		
		if (depth==1) {
		//console.log("begin price of list "+JSON.stringify(itemList))
		}
		
		for (var i=0;i<itemList.length;i++)
		{
			//go through each ingredient and gather its:
			//price
			//time to craft mult by the tier setting
			var item=itemList[i];
			var name=item.name;
			var q=item.quantity;
			
			//console.log(i+" list item "+name+" q: "+q);
			
			var ing=this.db[name].getIngredients();
			
			if (name.toLowerCase().indexOf(" ore")!=-1)
			{
				//console.log("ore "+name+" found. q="+q);
				price+=q*orePrices[name];
				orePrice+=q*orePrices[name];
			}
			else if (!this.db[name].reusable)
			{
				var n=q/this.db[name].outputQuantity;
				//console.log("item "+name+" found. n="+n)
				var out=this.calcPrice(priceList,orePrices,ing,settings,depth+1);
				priceList=out[0]
				var ingPrice=n*out[1];
				orePrice+=n*out[2];
				time+=out[3];
				
				var timeCharge=settings.timeSurcharge[this.db[name].tier-1]*this.db[name].time*n;
				ingPrice+=timeCharge;
				
				//console.log("item "+name+" tc "+timeCharge);
				//console.log("item "+name+" price "+ingPrice);
				if (depth==0)
				{
					var itemMass=this.db[name].mass;
					mass+=itemMass;
					var massCharge=settings.massSurcharge[this.db[name].tier-1]*itemMass*n;
					var itemVol=this.db[name].volume;
					volume+=itemVol;
					var volCharge=settings.volSurcharge[this.db[name].tier-1]*itemVol*n;
					ingPrice+=massCharge+volCharge;
					//console.log("item "+name+" fc "+settings.flatCharge[this.db[name].tier-1]*n);
					ingPrice+=settings.flatCharge[this.db[name].tier-1]*n
					priceList[priceList.length]=ingPrice
				}
				price+=ingPrice;
			}
			time+=this.db[name].time
			
		}
		//now taking into account:
		//mass
		//volume
		
		//console.log("end price of list "+JSON.stringify(itemList));
		//console.log(price);
		//console.log("---");
		var abc=[priceList,price,orePrice,time,volume,mass];
		return abc;
	}
	
}


// gsheets helper function
function inRange(range,cell)
{
	return (range.getColumn()<=cell.getColumn()) && (range.getLastColumn()>=cell.getColumn()) && (range.getRow()<=cell.getRow()) && (range.getLastRow()>=cell.getRow())
}
	
// for the database to update each element with its actual mass & volume
function onEdit(e){
	var ss=e.source;
	var rs=ss.getSheetByName("recipes");
	var indicator=rs.getRange("j1");
	
	if (inRange(indicator,e.range))
	{
		indicator.setBackground("#ff0000");
		
		var massRange=rs.getRange("f90:f");
		var nameRange=rs.getRange("b90:b");
		var volumeRange=rs.getRange("d90:d");
		var data=rs.getRange("A:I").getValues();
		
		var names=nameRange.getValues();
		var masses=massRange.getValues();
		var volumes=volumeRange.getValues();
		
			
		
		var calc=new recipeCalc(data);
		
		var newData=calc.getMassesAndVol();
		//console.log("newData output");
		//console.log(JSON.stringify(newData));
		
		var massOutput=[];
		var volOutput=[];
		newData.reverse()
		
		var pcnv=0;
		var pc8=0;
		var pcn=0;
		//console.log(JSON.stringify(names));
		//console.log(names.length)
		names.forEach(function(k,i){
			//console.log((k[0] === ""));
			if (k[0] === "") {
				massOutput.push([""]);
				volOutput.push([""]);
			//console.log("no value push");
				pcnv+=1;
				return;
			}
				var mnf=true;
			for (j=newData.length-1;j>=0;j--)
			{
				//console.log(newData[j].name+" "+k[0])
				if(newData[j].name==k[0])
				{
					if (newData[j].type<8)
					{
						massOutput.push([masses[i][0]]);
						volOutput.push([newData[j].volume]);
						//console.log(k[0]+" "+JSON.stringify(masses[j][0]));
						//console.log(k[0]+" "+JSON.stringify(masses[i][0]));
						pc8+=1;
					} else
					{
						massOutput.push([newData[j].mass]);
						volOutput.push([newData[j].volume]);
						//console.log(k[0]+" "+newData[j].mass);
						pcn+=1;
					}
					//console.log("replacing "+newData[j].name+" "+k[0]+" with "+newData[j].mass);
					mnf=false;
					break;
				}
			}
			newData.splice(j,1)
			//if (mnf) { console.log("match not found for "+k[0])}
		});
		
		console.log(JSON.stringify(massOutput))
		//console.log(volOutput.length)
		//console.log(pcnv+" "+pc8+" "+pcn)
		
		
		massRange.setValues(massOutput);
		volumeRange.setValues(volOutput);
		
		
		SpreadsheetApp.flush();
		
		
		indicator.clear({contentsOnly:true});
		indicator.setBackground("#00ff00");
	}
}

// for the live calculator sheet
function onEdit(e) {
	var ss=e.source;
	var rs=ss.getSheetByName("Recipes");
	var cs=ss.getSheetByName("Crafting Calculator");
	var ps=ss.getSheetByName("Price Calculator");
	
	var nrng=ss.getNamedRanges();
	var namedRanges={}
	nrng.forEach(function(nr,i){
		if (nr.getName() === "CraftingInput") { namedRanges.craftInputRange=nr.getRange();return;}
		if (nr.getName() === "CraftingExists") { namedRanges.craftInvRange=nr.getRange();return;}
		if (nr.getName() === "RawMaterials") { namedRanges.rawMaterialsRange=nr.getRange();return;}
		if (nr.getName() === "CraftList") { namedRanges.craftListRange=nr.getRange();return;}
		if (nr.getName() === "CraftFinish") { namedRanges.finishCraftRange=nr.getRange();return;}
		
		if (nr.getName() === "PriceItems") { namedRanges.priceItemListRange=nr.getRange();return;}
		if (nr.getName() === "PriceOutput") { namedRanges.priceOutputRange=nr.getRange();return;}
		if (nr.getName() === "PriceSettings") { namedRanges.priceSettingsRange=nr.getRange();return;}
		if (nr.getName() === "PriceOverallStat") { namedRanges.overallPriceDataRange=nr.getRange();return;}
		if (nr.getName() === "PriceOres") { namedRanges.orePriceRange=nr.getRange();return;}
		
		if (nr.getName() === "SkillsCPTime") { namedRanges.SkillsCPTimeRange=nr.getRange();return;}
		if (nr.getName() === "SkillsEPTime") { namedRanges.SkillsEPTimeRange=nr.getRange();return;}
		if (nr.getName() === "SkillsFPTime") { namedRanges.SkillsFPTimeRange=nr.getRange();return;}
		if (nr.getName() === "SkillsIPTime") { namedRanges.SkillsIPTimeRange=nr.getRange();return;}
		if (nr.getName() === "SkillsOreRefineMaterial") { namedRanges.SkillsOreRefineMaterialRange=nr.getRange();return;}
		if (nr.getName() === "SkillsOreRefineTime") { namedRanges.SkillsOreRefineTimeRange=nr.getRange();return;}
		if (nr.getName() === "SkillsProductHCMaterial") { namedRanges.SkillsProductHCMaterialRange=nr.getRange();return;}
		if (nr.getName() === "SkillsProductHCTime") { namedRanges.SkillsProductHCTimeRange=nr.getRange();return;}
		if (nr.getName() === "SkillsPureHCMaterial") { namedRanges.SkillsPureHCMaterialRange=nr.getRange();return;}
		if (nr.getName() === "SkillsPureHCTime") { namedRanges.SkillsPureHCTimeRange=nr.getRange();return;}
		if (nr.getName() === "SkillsSPTime") { namedRanges.SkillsSPTimeRange=nr.getRange();return;}
	});
	
	var cell=e.range;
	if (cell.getSheet().getSheetId()==cs.getSheetId())
	{
		var indicator=cs.getRange("N1");
		
		if ( inRange(indicator,cell) || 
		inRange(namedRanges.craftInputRange,cell) || 
		inRange(namedRanges.craftInvRange,cell) ||
		
		inRange(namedRanges.SkillsCPTimeRange,cell) ||
		inRange(namedRanges.SkillsEPTimeRange,cell) ||
		inRange(namedRanges.SkillsFPTimeRange,cell) ||
		inRange(namedRanges.SkillsIPTimeRange,cell) ||
		inRange(namedRanges.SkillsSPTimeRange,cell) ||
		inRange(namedRanges.SkillsOreRefineMaterialRange,cell) ||
		inRange(namedRanges.SkillsOreRefineTimeRange,cell) ||
		inRange(namedRanges.SkillsProductHCMaterialRange,cell) ||
		inRange(namedRanges.SkillsProductHCTimeRange,cell) ||
		inRange(namedRanges.SkillsPureHCTimeRange,cell) ||
		inRange(namedRanges.SkillsSPTimeRange,cell)
		) {
			
			indicator.setBackground("#ff0000");
			SpreadsheetApp.flush();
			gsCalc(ss,namedRanges);
			indicator.setBackground("#00ff00");
			SpreadsheetApp.flush();
		}
		else if (inRange(namedRanges.finishCraftRange,cell) ){
			//take name and quantity, add in available items (add to existing if applicable)
			//recalc list
			
			indicator.setBackground("#ff0000");
			SpreadsheetApp.flush();
			
			var name=cell.offset(0,-3).getValue()
			var quantity=parseFloat(cell.offset(0,-2).getValue())
			
			var craftInv=namedRanges.craftInvRange.getValues();
			var inventoryList=[];
			var inside=false;
			
			for (i=0;i<craftInv.length;i++){
				var ci=craftInv[i];
				if (ci[0] === "" || ci[0] === null || ci[1] === "" || parseFloat(ci[1]) == null){continue};
				if (name===ci[0]){
					inside=true;
					inventoryList.push({name:ci[0],quantity:parseFloat(ci[1])+quantity});
				}
				else{
					inventoryList.push({name:ci[0],quantity:parseFloat(ci[1])});
				}
			}
			
			namedRanges.craftInvRange.clear({contentsOnly:true});
			
			if (!inside){inventoryList.push({name:name,quantity:parseFloat(quantity)});}
			//console.log(JSON.stringify(inventoryList));
			inventoryList.forEach(function(k,i){
				//console.log("setting "+k.name);
				namedRanges.craftInvRange.getCell(1+i,1).setValue(k.name);
				namedRanges.craftInvRange.getCell(1+i,2).setValue(k.quantity);
			});
			
			gsCalc(ss,namedRanges);
			
			cell.clear({contentsOnly:true});
			indicator.setBackground("#00ff00");
			SpreadsheetApp.flush();
		}
		
		indicator.clear({contentsOnly:true});
	}
	else if (cell.getSheet().getSheetId()==ps.getSheetId())
	{
		if (!(inRange(namedRanges.priceSettingsRange,cell) || inRange(namedRanges.orePriceRange,cell) || inRange(namedRanges.priceItemListRange,cell))) {return;}
		// price calculator
		var orePriceR=namedRanges.orePriceRange.getValues();
		var itemListR=namedRanges.priceItemListRange.getValues();
		var settingsR=namedRanges.priceSettingsRange.getValues();
		
		var indicator=ps.getRange("G1");
		indicator.setBackground("#ff0000");
		SpreadsheetApp.flush();
		
		var orePrices={}
		var itemList=[]
		var settings={}
		
		for (var i=0;i<orePriceR.length;i++){
			var r=orePriceR[i];
			orePrices[r[0]]=parseFloat(r[1]);
		}
		
		for (var i=0;i<itemListR.length;i++){
			var ci=itemListR[i];
			if (ci[0] === "" || ci[0] === null || ci[1] === "" || parseFloat(ci[1]) == null){continue};
			itemList.push({name:ci[0],quantity:parseFloat(ci[1])});
		}
		var headers=["timeSurcharge","volSurcharge","massSurcharge","flatCharge"]
		for (var i=0;i<settingsR.length;i++){
			var r=settingsR[i];
			var list=[];
			var mult=1;
			if (i==0) {mult=3600;}
			
			for (var j=0;j<r.length;j++)
			{
				//console.log("settings row "+i+" col "+j+" : "+(parseFloat(r[j])/mult))
				list[list.length]=parseFloat(r[j])/mult;
				
			}
			settings[headers[i]]=list;
		}
		
		
		var rs=ss.getSheetByName("Recipes");
		
		var data=rs.getRange("A:I").getValues();
			
		
		var calc=new recipeCalc(data);
	
		var output=calc.calcPrice([],orePrices,itemList,settings,0)
		
		namedRanges.priceOutputRange.clear({contentsOnly:true});
		namedRanges.overallPriceDataRange.clear({contentsOnly:true});
		
		
		/*
		
		var abc=[priceList,price,orePrice,time,volume,mass];
		if (item.type==0){
			rawMaterialsRange.getCell(row+rowRaw,1).setValue(item.name);
			rawMaterialsRange.getCell(row+rowRaw,2).setValue(item.quantity);
			rowRaw++;
			
		*/
		//console.log("-------------------------------")
		//console.log(JSON.stringify(output[0]))
		var arr=[];
		for (var i=0;i<output[0].length;i++)
		{
			//console.log("write "+output[0][i])
			namedRanges.priceOutputRange.getCell(1+i,1).setValue(output[0][i])
		}
		
		namedRanges.overallPriceDataRange.getCell(1,1).setValue(output[2]);
		namedRanges.overallPriceDataRange.getCell(2,1).setValue(output[3]/3600);
		namedRanges.overallPriceDataRange.getCell(3,1).setValue(output[4]);
		namedRanges.overallPriceDataRange.getCell(4,1).setValue(output[5]);
		
		indicator.setBackground("#00ff00");
		SpreadsheetApp.flush();
	}
}

// gsheets interface
function gsCalc(ss,namedRanges)
{
	var craftInput=namedRanges.craftInputRange.getValues();
	var craftInv=namedRanges.craftInvRange.getValues();
	
	var rs=ss.getSheetByName("Recipes");
	var cs=ss.getSheetByName("Crafting Calculator");
	
	var data=rs.getRange("A:I").getValues();
		
	
	var calc=new recipeCalc(data);
	
	var inputList=[];
	var inventoryList=[];
	
	for (var i=0;i<craftInput.length;i++){
		var ci=craftInput[i];
		if (ci[0] === "" || ci[0] === null || ci[1] === "" || parseFloat(ci[1]) == null){continue};
		inputList.push({name:ci[0],quantity:parseFloat(ci[1])});
	}
	
	for (var i=0;i<craftInv.length;i++){
		var ce=craftInv[i];
		if (ce[0] === "" || ce[0] === null || ce[1] === "" || parseFloat(ce[1]) == null){continue};
		inventoryList.push({name:ce[0],quantity:parseFloat(ce[1])});
	}
	//console.log("inputList");
	//console.log(JSON.stringify(inputList));
	//console.log("inventoryList");
	//console.log(JSON.stringify(inventoryList));
	var skills={
		Pure:{
			time:[0,0,0,0,0],
			material:{"Sodium Pure":0,
				"Iron Pure":0,
				"Carbon Pure":0,
				"Silicon Pure":0,
				"Lead Pure":0,
				"Tungsten Pure":0,
				"Aluminium Pure":0,
				"Nickel Pure":0,
				"Copper Pure":0,
				"Scandium Pure":0,
				"Platinum Pure":0,
				"Chromium Pure":0,
				"Gold Pure":0,
				"Zirconium Pure":0,
				"Molybdenum Pure":0,
				"Manganese Pure":0,
				"Vanadium Pure":0,
				"Titanium Pure":0,
				"Rhenium Pure":0,
				"Niobium Pure":0}
		},
		"Intermediary Part":{
			time:[0,0,0]
		},
		"Complex Part":{
			time:[0,0,0,0,0]
		},
		"Structural Part":{
			time:[0,0,0,0,0]
		},
		"Functional Part":{
			time:[0,0,0,0,0]
		},
		"Exceptional Part":{
			time:[0,0,0,0,0]
		},
		"Pure Honeycomb":{
			time:0,
			material:[2,0,0,0,0]
		},
		"Product Honeycomb":{
			time:0,
			material:[0,0,0,0,0]
		}
	}
	
	var sk=namedRanges.SkillsCPTimeRange.getValues();
	for (var i=0;i<sk.length;i++){
		skills["Complex Part"].time[i]=sk[i][0];
	}
	sk=namedRanges.SkillsEPTimeRange.getValues();
	for (var i=0;i<sk.length;i++){
		skills["Exceptional Part"].time[i+2]=sk[i][0];
	}
	sk=namedRanges.SkillsFPTimeRange.getValues();
	for (var i=0;i<sk.length;i++){
		skills["Functional Part"].time[i]=sk[i][0];
	}
	sk=namedRanges.SkillsIPTimeRange.getValues();
	for (var i=0;i<sk.length;i++){
		skills["Intermediary Part"].time[i]=sk[i][0];
	}
	sk=namedRanges.SkillsSPTimeRange.getValues();
	for (var i=0;i<sk.length;i++){
		skills["Structural Part"].time[i]=sk[i][0];
	}
	
	sk=namedRanges.SkillsOreRefineMaterialRange.getValues();
	for (var i=0;i<sk.length;i++){
		skills["Pure"].material[sk[i][0]]=sk[i][1];
	}
	sk=namedRanges.SkillsOreRefineTimeRange.getValues();
	for (var i=0;i<sk.length;i++){
		skills["Pure"].time[i]=sk[i][0];
	}
	sk=namedRanges.SkillsProductHCMaterialRange.getValues();
	for (var i=0;i<sk.length;i++){
		skills["Product Honeycomb"].material[i]=sk[i][0];
	}
	skills["Product Honeycomb"].time=namedRanges.SkillsProductHCTimeRange.getValues()[0][0];
	sk=namedRanges.SkillsPureHCMaterialRange.getValues();
	for (var i=0;i<sk.length;i++){
		skills["Pure Honeycomb"].material[i]=sk[i][0];
	}
	skills["Pure Honeycomb"].time=namedRanges.SkillsPureHCTimeRange.getValues()[0][0];
	
	
	var output=calc.calcList(inputList,inventoryList,skills);
	
	//console.log("lists");
	//console.log(JSON.stringify(lists));
	//console.log("normal order");
	//console.log(JSON.stringify(lists.normal));
	//console.log("expanded order");
	//console.log(JSON.stringify(lists.expanded));
	
	//now populate ranges RawMaterials and CraftList
	var outputRawMaterials=[];
	var outputCraftList=[];
	
	namedRanges.rawMaterialsRange.clear({contentsOnly:true});
	namedRanges.craftListRange.clear({contentsOnly:true});
	
	
	var row=1;
	var rowRaw=0;
	var rowCraft=0;
	var rowInv=0;
	
	output.normal.forEach(function(item,i)
	{
		if (item.type==0){
			namedRanges.rawMaterialsRange.getCell(row+rowRaw,1).setValue(item.name);
			namedRanges.rawMaterialsRange.getCell(row+rowRaw,2).setValue(item.quantity);
			rowRaw++;
		}
		else
		{
			namedRanges.craftListRange.getCell(row+rowCraft,1).setValue(item.name);
			namedRanges.craftListRange.getCell(row+rowCraft,2).setValue(item.quantity);
			namedRanges.craftListRange.getCell(row+rowCraft,3).setValue(item.time);
			rowCraft++;
		}
	});
	
}

