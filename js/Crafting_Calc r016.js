//helper functions
function roundUp(num, precision) {
	return Math.ceil(num / precision) * precision
}

function removeInvZeros(inv){
	var newInv={}
	var keys=Object.keys(inv);
	keys.forEach(function(k,i){
		if (inv[k].quantity+inv[k].bpquantity!=0) {newInv[k]=inv[k];}
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
	this.byproducts=data.byproducts;
	this.industries=data.industries;
	this.input=data.input
	if (this.input==null){this.input={};}
	
	this.getIngredients=function(){
		var out=[];
		Object.keys(this.input).forEach(function(name,i,a){
			out.push({name:name,quantity:this.input[name]});
		},this);
		return out;
	};
	
	this.getByproducts=function(){
		var out=[];
		Object.keys(this.byproducts).forEach(function(name,i,a){
			out.push({name:name,quantity:this.byproducts[name]});
		},this);
		return out;
	};
}

// holds recipe database and performs crafting calculations
function recipeCalc(data){
	
	//parse db from JSON
	this.parseDb=function(db){
		var lines;
		var cols;
		var headers;
		this.db={};
		
		try{ 
			db=JSON.parse(db);
			this.types=[];
			for (var j=0;j<db.length;j++){
				var item=db[j];
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
			}
		
		}
		catch(e) {
			console.log(e);
		}
		
		
		//console.log("parse db return");
		//console.log(JSON.stringify(this.db));
	};
	
	//console.log("constructor data");
	//console.log(data);
	this.data=data;
	this.parseDb(data);
	//console.log(JSON.stringify(this.db,null,2));
	
	// eliminate 0 quantity list items and combine repeated ones
	this.reduceItems=function(list)
	{
		//console.log("reduce items");
		//console.log(JSON.stringify(list));
		var newList=[];
		for (var i=0;i<list.length;i++)
		{
			if (typeof list[i].bpquantity ==="undefined"){
				list[i].bpquantity=0;
			}
			if (typeof list[i].quantity ==="undefined"){
				list[i].quantity=0;
			}
			var fnd=false;
			for (var j=0;j<newList.length;j++)
			{
				if (list[i].name===newList[j].name)
				{
					newList[j].quantity+=list[i].quantity;
					newList[j].bpquantity+=list[i].bpquantity;
					
					Object.keys(list[i]).forEach(function(item,index){
						if(item=="quantity" || item=="bpquantity"){return;}
						newList[j][item]=list[i][item];
					});
					
					fnd=true;
					break;
				}
			}
			if (!fnd && (list[i].quantity+list[i].bpquantity)>0)
			{
				var obj={};
				Object.keys(list[i]).forEach(function(item,index){
					obj[item]=list[i][item];
				});
				newList[newList.length]=obj;
			}
		}
		//console.log("reduced list: "+JSON.stringify(newList));
		var t=this;
		newList.sort(function(l,r){ 
			//console.log("reduceItems sort");
			//console.log("L: "+l.name);
			//console.log("R: "+r.name);
			//console.log("L: "+JSON.stringify(t.db[l.name]));
			//console.log("R: "+JSON.stringify(t.db[r.name]));
			var typeL=t.db[l.name].type;
			var typeR=t.db[r.name].type;
			return t.types.indexOf(typeL)>t.types.indexOf(typeR);
		});
		//console.log("reduced list: "+JSON.stringify(newList));
		return newList;
	};
	
	//crafting simulation calculation
	// returns list of required crafting queue for a given input of crafted items
	this.simulate=function(input,inventory,skills){
		var filter=["sdfgsdf"];
		
		//console.log("SIMULATING "+JSON.stringify(input));
		var itemSequence=[];
		
		for (var jj=0;jj<input.length;jj++){
			var iqPair=input[jj];
			
			var doConsole=false;
			filter.forEach(function(k,i){
				if(iqPair.name.toLowerCase().search(k.toLowerCase())!=-1){
					doConsole=true;
					return;
				}
			})
			if(doConsole){
				console.log("number of "+iqPair.name+" required "+iqPair.quantity);
				console.log("checking inventory "+JSON.stringify(inventory[iqPair.name]));
			}
			if (iqPair.quantity<=(inventory[iqPair.name].quantity+inventory[iqPair.name].bpquantity)){
				if(doConsole){
					console.log("inventory has enough of input, moving on to next input");
				}
				continue;
			}
			
			
			var ingredients=this.db[iqPair.name].getIngredients();
			var byproducts=this.db[iqPair.name].getByproducts();
			var oq=this.db[iqPair.name].outputQuantity;
			
			
			var skillReduction=0;
			var skillLevel=0;
			var perLevel=0;
			
			if(doConsole){
			console.log("check skills")
			}
			if (skills[this.db[iqPair.name].type]!=null && skills[this.db[iqPair.name].type].Material!=null)
			{
				if(doConsole){
				console.log("is a skill")
				}
				if (this.db[iqPair.name].type=="Pure" || this.db[iqPair.name].type=="Product")
				{
					perLevel=2;
					skillLevel=skills[this.db[iqPair.name].type].Material[iqPair.name]
					skillReduction=skillLevel*perLevel;
					if(doConsole){
						console.log("Skill level: "+skillLevel);
					}
				}
				else
				{
					perLevel=5;
					skillLevel=skills[this.db[iqPair.name].type].Material["Tier "+this.db[iqPair.name].tier];
					skillReduction=skillLevel*perLevel;
				}
				//console.log("skill level is "+skillLevel);
			}
			if(doConsole){
			console.log("skill:");
			console.log(skillReduction);
			}
			
			
			if(doConsole){
				console.log("----checking ingredients of input");
				console.log(JSON.stringify(ingredients));
			}
			if(ingredients.length!=0){
				for(var ingPair of ingredients){
					ingPair.quantity=ingPair.quantity-skillReduction;
				}
				while(inventory[iqPair.name].quantity+inventory[iqPair.name].bpquantity<iqPair.quantity)
				{
					if(doConsole){
					console.log(iqPair.name+": "+inventory[iqPair.name].quantity+" of "+iqPair.quantity);
					console.log("crafting ingredients for "+iqPair.name);
					}
					ingredients.forEach(function(ingPair,i){
						var subSeq=this.simulate([ingPair],inventory,skills)
						
						if(doConsole){
						console.log("ing: "+ingPair.name+" "+ingPair.quantity);
						}
						
						
						if(inventory[ingPair.name].bpquantity>ingPair.quantity){
							inventory[ingPair.name].bpquantity-=ingPair.quantity;
						}else if (inventory[ingPair.name].bpquantity>0){
							var diff=ingPair.quantity-inventory[ingPair.name].bpquantity;
							inventory[ingPair.name].bpquantity=0;
							inventory[ingPair.name].quantity-=diff;
						}else{
							inventory[ingPair.name].quantity-=ingPair.quantity
						}
						itemSequence=itemSequence.concat(subSeq);
					},this);
					inventory[iqPair.name].quantity+=oq;
					
					itemSequence=itemSequence.concat([{name:iqPair.name,quantity:oq,effectivenessQ:skillReduction,skillQ:skillLevel}]);
					
					
					
					
					byproducts.forEach(function(bPair,i){
						inventory[bPair.name].bpquantity+=bPair.quantity;
						itemSequence=itemSequence.concat([{name:bPair.name,bpquantity:bPair.quantity}]);
					},this);
					
				}
			}
			else{
				if(doConsole){
				console.log("this is a base recipe, giving desired amount")
				}
				itemSequence=itemSequence.concat([iqPair]);
				
				inventory[iqPair.name].quantity+=iqPair.quantity;
				if(doConsole){
					console.log("have "+inventory[iqPair.name].quantity+" of "+iqPair.quantity);
				}
				
				byproducts.forEach(function(bPair,i){
					inventory[bPair.name].bpquantity+=iqPair.quantity*bPair.quantity;
					itemSequence=itemSequence.concat([{name:bPair.name,bpquantity:bPair.quantity*iqPair.quantity}]);
				},this);
			}
			//console.log("adding "+JSON.stringify(dict)+" to sequence");
			//console.log("sequence: "+JSON.stringify(itemSequence));
					
			//console.log("adding "+iqPair.quantity);
			//console.log(iqPair.name+" now "+inventory[iqPair.name]);
		}
		
		//console.log("returning "+JSON.stringify(itemSequence));
		//console.log("");
		//console.log("inventory: "+JSON.stringify(removeInvZeros(inventory)));
		return itemSequence;
	};
	
	
	// wrapper for the simulate func
	this.calcList=function(input,inv,skills)
	{
		//console.log("Craft.calcList start");
		var inputRed=this.reduceItems(input);
		var invRed=this.reduceItems(inv);
		
		for (var i=inputRed.length-1;i>=0;i--){
			if (this.db[inputRed[i].name]===undefined) {
				//console.log(JSON.stringify(inputRed[i]));
				inputRed.splice(i,1);
				continue;
				}
		}
		for (var i=invRed.length-1;i>=0;i--){
			if (this.db[invRed[i].name]===undefined) {
				invRed.splice(i,1);
				continue;
				}
		}
		
		var sortFunc=function(l,r){
			return (l.typeid+l.tier/10)-(r.typeid+r.tier/10);
		}
		
		inputRed.forEach(function(k,i){
			k.type=this.db[k.name].type;
			k.typeid=this.types.indexOf(this.db[k.name].type);
			k.tier=this.db[k.name].tier;
		},this);
		
		inputRed.sort(sortFunc);
		inputRed.reverse();
		
		
		var inventory={};
		Object.keys(this.db).forEach(function(k,i){
			inventory[k]={name:k,quantity:0,bpquantity:0};
		});
		invRed.forEach(function(e,i){
			//console.log(JSON.stringify(e));
			inventory[e.name].quantity=e.quantity;
			//console.log(e.name+" "+inventory[e.name]);
		},this);
		
		//console.log("input");
		//console.log(JSON.stringify(inputRed));
		
		//console.log("inv before");
		//console.log(JSON.stringify(removeInvZeros(inventory)));
		var craftList=this.simulate(inputRed,inventory,skills);
		//console.log("inv after");
		//console.log(JSON.stringify(removeInvZeros(inventory)));
		
		//console.log("raw craft list "+JSON.stringify(craftList));
		
		var compressedList=this.reduceItems(JSON.parse(JSON.stringify(craftList)));
		//console.log("compressed craft list "+JSON.stringify(compressedList,null,2));
		
		function populate(k,i){
			var time=this.db[k.name].time;
			k.tier=this.db[k.name].tier;
			k.type=this.db[k.name].type;
			k.typeid=this.types.indexOf(k.type);
			k.industries=this.db[k.name].industries;
			k.skillT=0;
			k.effectivenessT=1;
			
			//console.log(JSON.stringify(k,null,2));
			if (skills[k.type]!=null && k.name.search("Oxygen")==-1 && k.name.search("Hydrogen")==-1) {
				if (k.type=="Pure" || k.type=="Product" )
				{
					//console.log(k.name);
					//console.log(skills[k.type].Time["Tier "+k.tier]);
					k.skillT=skills[k.type].Time["Tier "+k.tier];
					k.effectivenessT=(1+k.skillT*0.05);
					time=time/k.effectivenessT;
					//console.log(time);
					k.time=k.quantity/this.db[k.name].outputQuantity*time;
					//console.log(k.time);
				}else if (k.type.search("Honeycomb")!=-1){
					k.skillT=skills[k.type].Time;
					k.effectivenessT=(1+k.skillT*0.1);
					time=time/k.effectivenessT;
					k.time=k.quantity/this.db[k.name].outputQuantity*time;
				}
				else
				{
					k.skillT=skills[k.type].Time["Tier "+k.tier];
					k.effectivenessT=(1+k.skillT*0.1);
					time=time/k.effectivenessT;
					k.time=k.quantity/this.db[k.name].outputQuantity*time;
				}
			}
			else
			{
				k.time=k.quantity/this.db[k.name].outputQuantity*time;
			}
		}
		/*
		for (var i=compressedList.length-1;i>=0;i--){
			if (compressedList[i].quantity<=compressedList[i].bpquantity){
				compressedList.splice(i,1);
			}
		}
		*/
		compressedList.forEach(populate,this);
		compressedList.sort(sortFunc);
		
		
		
		//console.log("calcLists normal");
		//console.log(JSON.stringify(compressedList,null,2));
		return {normal:compressedList,expanded:craftList,inventory:inventory}
	};
	
}
