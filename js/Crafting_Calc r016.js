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
		//console.log("");
		//console.log("SIMULATING "+JSON.stringify(input));
		var itemSequence=[];
		//input.reverse()
		
		
		for (var jj=0;jj<input.length;jj++){
			var iqPair=input[jj];
			
			//console.log("number of "+iqPair.name+" required "+iqPair.quantity);
			
			
			//console.log("checking inventory "+inventory[iqPair.name]);
			if (iqPair.quantity<inventory[iqPair.name]){
				//console.log("inventory has enough of input, moving on to next input");
				//inventory[iqPair.name]-=iqPair.quantity;
				//input.splice(jj,1);
				continue;
			}
			
			
			var ingredients=this.db[iqPair.name].getIngredients();
			var byproducts=this.db[iqPair.name].getByproducts();
			var oq=this.db[iqPair.name].outputQuantity;
			
			
			var skillReduction=0;
			var skillLevel=0;
			var perLevel=0;
			
			//console.log("check skills")
			if (skills[this.db[iqPair.name].type]!=null && skills[this.db[iqPair.name].type].Material!=null)
			{
				//console.log("is a skill")
				if (this.db[iqPair.name].type=="Pure" )
				{
					perLevel=2;
					skillLevel=skills[this.db[iqPair.name].type].Material[iqPair.name]
					skillReduction=skillLevel*perLevel;
				}
				else
				{
					perLevel=5;
					skillLevel=skills[this.db[iqPair.name].type].Material["Tier "+this.db[iqPair.name].tier];
					skillReduction=skillLevel*perLevel;
				}
				//console.log("skill level is "+skillLevel);
			}
			//console.log("skill:");
			//console.log(skillReduction);
			
			
			//console.log("necessary number of "+iqPair.name+" required "+iNecessaryQ);
			//console.log("----checking ingredients of input");
			//console.log(JSON.stringify(this.db[iqPair.name].input));
			if(ingredients.length!=0){
				while(inventory[iqPair.name]<iqPair.quantity)
				{
					//console.log("have "+inventory[iqPair.name]+" of "+iqPair.quantity);
					//console.log("crafting ingredients for "+iqPair.name);
					var subSeq=this.simulate(ingredients,inventory,skills)
					ingredients.forEach(function(ingPair,i){
						ingPair.quantity=ingPair.quantity-skillReduction
						inventory[ingPair.name]-=ingPair.quantity
					},this);
					inventory[iqPair.name]+=oq;
					
					itemSequence=itemSequence.concat(subSeq);
					itemSequence=itemSequence.concat([{name:iqPair.name,quantity:oq}]);
					
					
					
					
					byproducts.forEach(function(bPair,i){
						inventory[bPair.name]+=bPair.quantity;
					},this);
					
				}
			}
			else{
				//console.log("this is a base recipe, giving desired amount")
				itemSequence=itemSequence.concat([iqPair]);
				
				inventory[iqPair.name]+=iqPair.quantity;
				
				byproducts.forEach(function(bPair,i){
					inventory[bPair.name]+=iqPair.quantity*bPair.quantity;
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
			inventory[k]=0;
		});
		invRed.forEach(function(e,i){
			//console.log(JSON.stringify(e));
			inventory[e.name]=e.quantity;
			//console.log(e.name+" "+inventory[e.name]);
		},this);
		
		//console.log("input");
		//console.log(JSON.stringify(inputRed));
		
		//console.log("inv before");
		//console.log(JSON.stringify(removeInvZeros(inventory)));
		var craftList=this.simulate(inputRed,inventory,skills);
		//console.log("after");
		//console.log(JSON.stringify(removeInvZeros(inventory)));
		
		//console.log("raw craft list "+JSON.stringify(craftList));
		
		var compressedList=this.reduceItems(JSON.parse(JSON.stringify(craftList)));
		//console.log("compressed craft list "+JSON.stringify(compressedList));
		
		compressedList.forEach(function(k,i){
			var time=this.db[k.name].time;
			k.tier=this.db[k.name].tier;
			k.type=this.db[k.name].type;
			k.typeid=this.types.indexOf(k.type);
			
			//console.log(k.name);
			if (skills[k.type]!=null && k.name.search("Oxygen")==-1 && k.name.search("Hydrogen")==-1) {
				if (k.type=="Pure" )
				{
					//console.log(k.name);
					//console.log(skills[k.type].Time["Tier "+k.tier]);
					time=time*(1-skills[k.type].Time["Tier "+k.tier]*0.05)
					//console.log(time);
					k.time=k.quantity/this.db[k.name].outputQuantity*time;
					//console.log(k.time);
				}else if (k.type.search("Honeycomb")!=-1){
					time=time*(1-skills[k.type].Time*0.1)
					k.time=k.quantity/this.db[k.name].outputQuantity*time;
				}
				else
				{
					time=time*(1-skills[k.type].Time["Tier "+k.tier]*0.1)
					k.time=k.quantity/this.db[k.name].outputQuantity*time;
				}
			}
			else
			{
				k.time=k.quantity/this.db[k.name].outputQuantity*time;
			}
				
			
		},this);
		
		
		compressedList.sort(sortFunc);
		
		var invList=[];
		Object.keys(inventory).forEach(function(k,i){
			if (inventory[k]===0){return;}
			invList.push({
				name:k,quantity:inventory[k],
				type:this.db[k].type,
				typeid:this.types.indexOf(this.db[k].type),
				tier:this.db[k].tier});
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
