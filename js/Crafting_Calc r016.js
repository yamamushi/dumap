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
function itemRecipe(name,data){
	this.name=name;
	this.tier=data.tier;
	this.type=data.type;
	this.mass=data.mass;
	this.volume=data.volume;
	this.outputQuantity=data.outputQuantity;
	this.time=data.time;
	this.byproducts=data.byproducts;
	this.industries=data.industries;
	this.input=data.input
	this.lang={"english":this.name}
	
	// skills affect these stats
	this.actualOQ=JSON.parse(JSON.stringify(this.outputQuantity));
	this.actualInput=JSON.parse(JSON.stringify(this.input));
	this.actualTime=JSON.parse(JSON.stringify(this.time));
	this.actualB=JSON.parse(JSON.stringify(this.byproducts));
	
	if (this.input==null){this.input={};}
	
	this.getIngredients=function(){
		var out=[];
		Object.keys(this.input).forEach(function(name,i,a){
			out.push({name:name,quantity:this.actualInput[name]});
		},this);
		return out;
	};
	
	this.getByproducts=function(){
		var out=[];
		Object.keys(this.byproducts).forEach(function(name,i,a){
			out.push({name:name,quantity:this.actualB[name]});
		},this);
		return out;
	};
}

// holds recipe database and performs crafting calculations
function recipeCalc(data){
	
	//parse db from JSON
	this.types=[];
	
	
	this.lang={"english":{}};
	this.langr={"english":{}}
	
	this.trans=function(lang,name){
		//console.log("lang: "+lang);
		//console.log("name: "+name);
		if ( this.lang[lang][name] ){return this.lang[lang][name];}
		else{ return name}
	}
	this.transr=function(lang,name){
		if ( this.langr[lang][name] ){return this.langr[lang][name];}
		else{ return name}
	}
	
	this.parseDb=function(db){
		var lines;
		var cols;
		var headers;
		this.db={};
		
		var db=JSON.parse(db);
		Object.keys(db).forEach(function(name,i){
			var fnd=false;
			for (var j=0;j<this.types.length;j++)
			{
				if(this.types[j]==db[name].type)
				{
					fnd=true;
					break;
				}
			}
			if(!fnd){
				this.types.push(db[name].type);
			}
			this.db[name]=new itemRecipe(name,db[name]);
			this.lang.english[name]=name;
			this.langr.english[name]=name;
		},this);
				
		
		//console.log(JSON.stringify(this.types,null,2));
		
		
		//console.log("parse db return");
		//console.log(JSON.stringify(this.db));
		
	};
	
	this.addTrans=function(trans){
		Object.keys(trans).forEach(function(lang,i){
			this.lang[lang]=trans[lang];
			//console.log(JSON.stringify(this.lang[lang],null,2));
			this.langr[lang]={}
			Object.keys(trans[lang]).forEach(function(english,j){
				this.langr[lang][trans[lang][english]]=english;
				//console.log(trans[lang][english]+" : "+english);
			},this);
		},this);
	};
		
	
	//console.log("constructor data");
	//console.log(data);
	this.data=data;
	this.parseDb(data);
	this.debug=[];
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
	
	this.modifyItemStat=function(name,type,amount,relative){
		if (type=="Time"){
			if(relative){
				this.db[name].actualTime=this.db[name].actualTime*(1-relative*amount);
			}else{
				this.db[name].actualTime=this.db[name].actualTime-amount;
			}
		}
		else if (type=="Speed"){
			if(relative){
				var speed=this.db[name].outputQuantity/this.db[name].actualTime*(1+relative*amount)
				this.db[name].actualTime=this.db[name].outputQuantity/speed;
			}else{
				var speed=this.db[name].outputQuantity/this.db[name].actualTime+amount
				this.db[name].actualTime=this.db[name].outputQuantity/speed;
			}
		}
		else if (type=="Output"){
			if(relative){
				this.db[name].actualOQ=this.db[name].actualOQ*(1+relative*amount);
				Object.keys(this.db[name].actualB).forEach(function(k,i){
					this.db[name].actualB[k]=this.db[name].byproducts[k]*(1+relative*amount);
				},this);
			}else{
				this.db[name].actualOQ=this.db[name].actualOQ+amount;
				Object.keys(this.db[name].actualB).forEach(function(k,i){
					this.db[name].actualB[k]=this.db[name].byproducts[k]+amount;
				},this);
			}
		}
		else if (type=="Input"){
			if(relative){
				Object.keys(this.db[name].actualInput).forEach(function(k,i){
					this.db[name].actualInput[k]=this.db[name].actualInput[k]*(1-relative*amount);
				},this);
			}else{
				Object.keys(this.db[name].actualInput).forEach(function(k,i){
					this.db[name].actualInput[k]=this.db[name].actualInput[k]-amount;
				},this);
			}
		}
	}		
	
	this.resetItemStats=function(){
		Object.keys(this.db).forEach(function(name,i){
			this.db[name].actualOQ=JSON.parse(JSON.stringify(this.db[name].outputQuantity));
			this.db[name].actualInput=JSON.parse(JSON.stringify(this.db[name].input));
			this.db[name].actualTime=JSON.parse(JSON.stringify(this.db[name].time));
			this.db[name].actualB=JSON.parse(JSON.stringify(this.db[name].byproducts));
		},this);
	}
		
	this.updateSkills=function(skills,indConfig){
		this.resetItemStats();
		this.skills=skills;
		
		for(var i=0;i<skills.length;i++){
			var skill=skills[i]
			
			if (skill.subject=="Industry") {
				Object.keys(this.db).forEach(function(name,i){
					if (indConfig[name]){
						if(skill.target==indConfig[name]){
							for (var d=0;d<skill.data.length;d++){
								this.modifyItemStat(name,skill.targets[d].type,skill.targets[d].amount*skill.values[d],skill.targets[d].relative);
							}
						}
					}
					else{
						var ind=this.db[name].industries[0];
						if(this.db[name].industries.length>1){
							ind=this.db[name].industries[1]
						}
						if(skill.target==ind){
							for (var d=0;d<skill.data.length;d++){
								this.modifyItemStat(name,skill.targets[d].type,skill.targets[d].amount*skill.values[d],skill.targets[d].relative);
							}
						}
					}
				},this);
				return;
			}
			
			var candidates=[];
			var modify=[];
			Object.keys(this.db).forEach(function(name,i){
				var item=this.db[name];
				if (item.skill==""||item.skill==null){
					if(item.type.search(skill.target)!=-1 || name.search(skill.target)!=-1){
						candidates.push(name);
					}
				}
				else if (item.skill==skill.target){
					
						candidates.push(name);
				}
			},this);
		
			for (var d=0;d<skill.data.length;d++){
				var found=false;
				for(var f=0;f<candidates.length;f++){
					if (candidates[f].search(skill.data[d])!=-1){
						found=true;
						this.modifyItemStat(candidates[f],skill.targets[d].type,skill.targets[d].amount*skill.values[d],skill.targets[d].relative);
						//break;
					}
				}
				if (!found) {
					for(var f=0;f<candidates.length;f++){
						this.modifyItemStat(candidates[f],skill.targets[d].type,skill.targets[d].amount*skill.values[d],skill.targets[d].relative);
					}
				}
			}
		}
	}
	
	
	
	//crafting simulation calculation
	// returns list of required crafting queue for a given input of crafted items
	this.simulate=function(input,inventory,skills){
		
		//console.log("SIMULATING "+JSON.stringify(input));
		var itemSequence=[];
		
		for (var jj=0;jj<input.length;jj++){
			var iqPair=input[jj];
			
			this.debug.push("number of "+iqPair.name+" required "+iqPair.quantity);
			this.debug.push("checking inventory "+JSON.stringify(inventory[iqPair.name]));
			if (iqPair.quantity<=(inventory[iqPair.name].quantity+inventory[iqPair.name].bpquantity)){
				
				this.debug.push("inventory has enough of input, moving on to next input");
				continue;
			}
			
			//console.log(JSON.stringify(this.db[iqPair.name],null,2));
			var ingredients=this.db[iqPair.name].getIngredients();
			var byproducts=this.db[iqPair.name].getByproducts();
			var oq=this.db[iqPair.name].actualOQ;
			
			
			this.debug.push("----checking ingredients of input");
			this.debug.push(JSON.stringify(ingredients));
			this.debug.push("----checking inventory for ingredients");
			if(ingredients.length!=0){
				this.debug.push(iqPair.name+": "+inventory[iqPair.name].quantity+" of "+iqPair.quantity);
				while(inventory[iqPair.name].quantity+inventory[iqPair.name].bpquantity<iqPair.quantity)
				{
					this.debug.push("crafting ingredients for "+iqPair.name);
					ingredients.forEach(function(ingPair,i){
						this.debug.push("");
						var subSeq=this.simulate([ingPair],inventory,skills)
						
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
					
					this.debug.push(iqPair.name+" now has: "+inventory[iqPair.name].quantity+" of "+iqPair.quantity);
					
					itemSequence=itemSequence.concat([{name:iqPair.name,quantity:oq,effectivenessQ:0,skillQ:0}]);
					
					
					
					
					byproducts.forEach(function(bPair,i){
						inventory[bPair.name].bpquantity+=bPair.quantity;
						itemSequence=itemSequence.concat([{name:bPair.name,bpquantity:bPair.quantity}]);
					},this);
					
				}
			}
			else{
				this.debug.push("this is a base recipe, inserting desired amount to inventory");
				itemSequence=itemSequence.concat([iqPair]);
				
				inventory[iqPair.name].quantity+=iqPair.quantity;
				this.debug.push("have "+inventory[iqPair.name].quantity+" of "+iqPair.quantity);
				
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
		this.debug=[];
		var craftList=this.simulate(inputRed,inventory,skills);
		//console.log("inv after");
		//console.log(JSON.stringify(removeInvZeros(inventory)));
		
		//console.log("raw craft list "+JSON.stringify(craftList));
		
		var compressedList=this.reduceItems(JSON.parse(JSON.stringify(craftList)));
		//console.log("compressed craft list "+JSON.stringify(compressedList,null,2));
		
		function populate(k,i){
			k.time=k.quantity/this.db[k.name].outputQuantity*this.db[k.name].actualTime;
			k.tier=this.db[k.name].tier;
			k.type=this.db[k.name].type;
			k.typeid=this.types.indexOf(k.type);
			k.industries=this.db[k.name].industries;
			k.skillT=0;
			k.effectivenessT=1;
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
