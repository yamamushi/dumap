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
	this.types={};
	
	
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
		var id = 1;
		Object.keys(db).forEach(function(name,i){
			this.types[db[name].type] = id++;

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
}
