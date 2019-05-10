/**=====================================
Definitions
=====================================**/
var version = 0.026;
var Univ = {};
Univ.FPS = 8;
Univ.precision = 10;
Univ.Speedfactor = 1; // Factor to speed up everything -- for testing.

Univ.Items = [];
Univ.ItemsById = [];
Univ.Objects = [];
Univ.ObjectsById = [];
Univ.Upgrades = [];
Univ.GeneratorUpgrades = [];
Univ.Crystals = [];

Univ.Age = 1e-43;
Univ.Temp = Math.pow(10,32);
Univ.T = 0;
Univ.SaveTo = 'LastQuestion';
Univ.ActiveItem = 'qfoam'; // possibly delete this line eventually, just makes testing faster


/**=====================================
Helper functions
=====================================**/
function lookup(object) {return document.getElementById(object);} // need to pick one function and then go thru everything

function round(num, places){ 
	if(Math.log10(Math.abs(num)) < 10){
		return +(Math.round(num + 'e+' + places)  + 'e-' + places);
	}
	else{
		var p = Math.max(Math.ceil(Math.log10(Math.abs(num))) - places, 0);
		return Math.round(num / Math.pow(10, p)) * Math.pow(10, p);
	}
}

function prettify(num, formOverride){
	if(!formOverride) formOverride = {};
	
	formOverride.flavor = Univ.prefs.shortsuffix ? 'short' : '';
	switch(Univ.prefs.numberformat){
		case 'Normal':
			formOverride.format = 'standard';
			break;
		case 'Scientific':
			formOverride.format = 'scientific';
			break;
		case 'Engineering':
			formOverride.format = 'engineering';
			break;
		default:
			formOverride.format = 'standard';
	}
	
	return Univ.format.format(num, formOverride);
}

function AddEvent(object,event,fcn){
	if(object.attachEvent) 
		object.attachEvent('on' + event, function() {
			fcn.call(object);
		});
	else if(object.addEventListener) 
	object.addEventListener(event,fcn,false);
}

function quickExp(base, exponent){return (1 - Math.pow(base, exponent)) / (1 - base)}


/**=====================================
Creation functions
=====================================**/
Univ.Item = function(singular,plural,type,visibility,available_number,total_number,production,consumption){
 	this.singular = singular;
	this.plural = plural;
	this.type = type;
	this.visibility = visibility;
 	this.available_number = available_number;
 	this.total_number = total_number;
	this.production = production;
	this.consumption = consumption;
	
	Univ.Items[this.type] = this;
	this.num = Univ.ItemsById.length;
	Univ.ItemsById.push(this);
	return this;
}

Univ.Object = function(id,type,singular,plural,number,infoblurb,VisibilityFcn,CostEquation,baseInterval,ProductionEquation,ConsumptionEquation,buyfunction){
	this.id = id;
	this.type = type;
    this.singular = singular;
	this.plural = plural;
	this.number = number;
 	this.activenumber = number;
	this.maxAffordable = 1000;
	this.midAffordable = 80;
	
	// Upgrade arrays
	this.AllUpgrades = [];
	this.costUpgrades = [];
	this.intervalUpgrades = [];
	this.productionUpgrades = [];
	this.consumptionUpgrades = [];
	
	this.isAffordable = function(howmany){
		var notenough = 0;
		for (var item in this.Costs(howmany)) {
			if (round(this.Costs(howmany)[item], Univ.precision) > round(Univ.Items[item].available_number, Univ.precision)) {
				notenough++;
			}
		}
		if (notenough == 0) {
			return 1;
		} else {
			return 0;
		}
	}
	
	if(typeof CostEquation == 'function'){
		this.CostEquation = CostEquation
	} else {
		this.CostEquation = function(){ return CostEquation; }
	}
	this.Costs = function(howmany){
		var cost = {};
		var ce = this.CostEquation();
		
		var adder = 0;
		var multiplier = 1;
		var adderFunctions = [];
		var multFunctions = [];
		
		for(var i in this.costUpgrades){
			var upgrade = this.costUpgrades[i];
			if (Univ.GeneratorUpgrades[upgrade.id].generatorsactive[this.id]){
				
				switch(upgrade.type){
					case 'multiply':
						if(typeof upgrade.magnitude == 'function') multFunctions.push(upgrade.magnitude);
						else multiplier *= upgrade.magnitude;
						break;
						
					case 'add':
						if(typeof upgrade.magnitude == 'function') adderFunctions.push(upgrade.magnitude);
						else adder += upgrade.magnitude;
						break;
				}
			}
		}
		
		for(var item in ce){
			if(ce[item].type == 'lin'){
				cost[item] = ce[item].slope * howmany;
			}
			else if(ce[item].type == 'exp'){
				cost[item] = ce[item].start * (quickExp(ce[item].base, howmany + this.number) - quickExp(ce[item].base, this.number));
			}
			else{ // Custom function
				cost[item] = ce[item].fcn(howmany);
			}
			
			cost[item] += adder;
			for(var i in adderFunctions) cost[item] += adderFunctions[i](item, this, cost, howmany);
			cost[item] *= multiplier;
			for(var i in multFunctions) cost[item] *= multFunctions[i](item, this, cost, howmany);
			
			cost[item] = Math.round(cost[item]); // Whole number to match display
		}
		
		return cost;
	}
	
	this.isVisible = VisibilityFcn;
	
	if (typeof buyfunction == 'function') {
		this.Buy = buyfunction;
	} else {
		this.Buy = function(howmany){
			if (this.isAffordable(howmany)) {
				for (var item in this.Costs(howmany)) {
					Univ.Items[item].available_number = round(Univ.Items[item].available_number, Univ.precision) - round(this.Costs(howmany)[item], Univ.precision);
				}
				this.number += howmany;
				if (howmany == 1 && this.number == 1) { this.ticks_since_production = this.interval() - 1; } // the first one will produce immediately instead of waiting a whole interval
				Univ.RefreshDisplay();
				this.showPopup();
			}
		}
	}
	
	this.infoblurb = infoblurb;
	this.targetactivity = 100; // percent of this generator chosen to be active
	this.baseInterval = baseInterval;
	this.interval = function(){
		var interval = this.baseInterval;
		
		var adder = 0;
		var multiplier = 1;
		var adderFunctions = [];
		var multFunctions = [];
		
		for(var i in this.intervalUpgrades){
			var upgrade = this.intervalUpgrades[i];
			if (Univ.GeneratorUpgrades[upgrade.id].generatorsactive[this.id]){
				
				switch(upgrade.type){
					case 'multiply':
						if(typeof upgrade.magnitude == 'function') multFunctions.push(upgrade.magnitude);
						else multiplier *= upgrade.magnitude;
						break;
						
					case 'add':
						if(typeof upgrade.magnitude == 'function') adderFunctions.push(upgrade.magnitude);
						else adder += upgrade.magnitude;
						break;
				}
			}
		}
		
		interval += adder;
		for(var i in adderFunctions) interval += adderFunctions[i](this);
		interval *= multiplier;
		for(var i in multFunctions) interval *= multFunctions[i](this);
		
		return Math.max(interval, 1 / Univ.FPS);
	}
	
	if(typeof ProductionEquation == 'function'){
		this.ProductionEquation = ProductionEquation
	} else {
		this.ProductionEquation = function(){ return ProductionEquation; }
	}
	this.Production = function(number){
		var production = {};
		var pe = this.ProductionEquation();

		var adder = 0;
		var multiplier = 1;
		var adderFunctions = [];
		var multFunctions = [];
		
		for(var i in this.productionUpgrades){
			var upgrade = this.productionUpgrades[i];
			if (Univ.GeneratorUpgrades[upgrade.id].generatorsactive[this.id]){
				
				switch(upgrade.type){
					case 'multiply':
						if(typeof upgrade.magnitude == 'function') multFunctions.push(upgrade.magnitude);
						else multiplier *= upgrade.magnitude;
						break;
						
					case 'add':
						if(typeof upgrade.magnitude == 'function') adderFunctions.push(upgrade.magnitude);
						else adder += upgrade.magnitude;
						break;
				}
			}
		}
		
		for(var item in pe){
			
			if(pe[item].type == 'lin'){
				production[item] = pe[item].slope * number;
			}
			else if(pe[item].type == 'exp'){
				production[item] = pe[item].start * quickExp(pe[item].base, number);
			}
			else{ // Custom function
				production[item] = pe[item].fcn(number);
			}

			production[item] += adder;
			for(var i in adderFunctions) production[item] += adderFunctions[i](item, this, production, number);
			production[item] *= multiplier;
			for(var i in multFunctions) production[item] *= multFunctions[i](item, this, production, number);
		}
		
		return production;
	}
	
	if(typeof ConsumptionEquation == 'function'){
		this.ConsumptionEquation = ConsumptionEquation
	} else {
		this.ConsumptionEquation = function(){ return ConsumptionEquation; }
	}
	this.Consumption = function(number){
		var consumption = {};
		var ce = this.ConsumptionEquation();
		
		var adder = 0;
		var multiplier = 1;
		var adderFunctions = [];
		var multFunctions = [];
		
		for(var i in this.consumptionUpgrades){
			var upgrade = this.consumptionUpgrades[i];
			if (Univ.GeneratorUpgrades[upgrade.id].generatorsactive[this.id]){
				
				switch(upgrade.type){
					case 'multiply':
						if(typeof upgrade.magnitude == 'function') multFunctions.push(upgrade.magnitude);
						else multiplier *= upgrade.magnitude;
						break;
						
					case 'add':
						if(typeof upgrade.magnitude == 'function') adderFunctions.push(upgrade.magnitude);
						else adder += upgrade.magnitude;
						break;
				}
			}
		}
		
		for(var item in ce){
			if(ce[item].type == 'lin'){
				consumption[item] = ce[item].slope * number;
			}
			else if(ce[item].type == 'exp'){
				consumption[item] = ce[item].start * quickExp(ce[item].base, number);
			}
			else{ // Custom function
				consumption[item] = ce[item].fcn(number);
			}
			
			consumption[item] += adder;
			for(var i in adderFunctions) consumption[item] += adderFunctions[i](item, this, consumption, number);
			consumption[item] *= multiplier;
			for(var i in multFunctions) consumption[item] *= multFunctions[i](item, this, consumption, number);
		}
		return consumption;
	}
	
	this.ticks_since_production = 0;	

	this.pupuptype = 1; //(1,'mid', or 'max')
	this.hidePopup = function() {
		lookup(this.id + '_popupcontainer').style.visibility = 'hidden';
	}
	this.showPopup = function() {
 		var productionTxt = [];
		var totalproduction = 0;
		var production = this.Production(this.activenumber);
		for (var item in production) {
			if (production[item] > 0 && this.ProductionEquation()[item].visible == 1) {
				if (totalproduction == 0) { productionTxt += '<span class="blacktext">Generating</span> ';}
				totalproduction++;
				productionTxt += prettify(this.Production(this.activenumber)[item] * Univ.Speedfactor) + ' ' + Univ.Items[item].plural + ' every ' + prettify(this.interval()) + ' sec (' + prettify(this.Production(this.activenumber)[item] * Univ.Speedfactor / this.activenumber) + '&nbsp;each). ';
			}
		}
		
  		var consumptionTxt = [];		
		var totalconsumption = 0;
		var consumption = this.Consumption(this.activenumber);
		for (var item in consumption) {
			if (consumption[item] > 0 && this.ConsumptionEquation()[item].visible == 1) {
				if (totalconsumption == 0) { consumptionTxt += '<span class="redtext">Consuming</span> ';}
				totalconsumption++;
				consumptionTxt += prettify(this.Consumption(this.activenumber)[item] * Univ.Speedfactor) + ' ' + Univ.Items[item].plural + ' every ' + prettify(this.interval()) + ' sec (' + prettify(this.Consumption(this.activenumber)[item] * Univ.Speedfactor / this.activenumber) + '&nbsp;each). ';
			}
		}

		lookup(this.id + '_popup_production').innerHTML = productionTxt; 
		lookup(this.id + '_popup_consumption').innerHTML = consumptionTxt;

		lookup(this.id + '_slider').value = this.targetactivity;
		Univ.updateSlider(this.id);
		if ( this.number > 0 ) {
			lookup(this.id + '_slidercontainer').style.display = 'block';
		}
		
		var costHTML = '<span class="blacktext">Cost:</span> ';		
		var buttonposition = lookup(this.id + '_button').getBoundingClientRect();
		var buttonTop = buttonposition.top + window.scrollY;
		var buttonBot = buttonposition.bottom + window.scrollY;
		var buttonY = (buttonTop + buttonBot) / 2;
		var buttonLeft = buttonposition.left + window.scrollX;
		var PopupTop = Math.max(0, buttonY - 101);
		var PopupLeft = buttonLeft + buttonposition.width - 6;
		var ArrowTop = lookup(this.id + '_popupcontainer').getBoundingClientRect().height - 123;

		var buying_info = [];
		if (this.pupuptype == 1) {
			buying_info = 'Make one.';
			for (var item in this.Costs(1)) {
				if (this.CostEquation()[item].visible == 1) {
					costHTML += prettify(this.Costs(1)[item], {maxSmall: 0, sigfigs: 6}) + ' ';
					if (this.Costs(1)[item] == 1) {
						costHTML += Univ.Items[item].singular;
					} else {
						costHTML += Univ.Items[item].plural;
					}
				}
			}
		} else if (this.pupuptype == 'mid') {
			ArrowTop += 16;
			var midaff = Univ.GetMidAffordable(this);
			if (midaff > 0) {
				for (var item in this.Costs(midaff)) {
					if (this.CostEquation()[item].visible == 1) {
						costHTML += prettify(this.Costs(midaff)[item], {maxSmall: 0, sigfigs: 6}) + ' ';
						if (this.Costs(midaff)[item] == 1) {
							costHTML += Univ.Items[item].singular;
						} else {
							costHTML += Univ.Items[item].plural;
						}
					}
				}
				buying_info = 'Make maximum without causing negative income (currently ' + midaff + ').';
			} else { 
				costHTML = [];
				buying_info = 'Make maximum without causing negative income (currently 0).';
			}
		} else if (this.pupuptype == 'max') {
			ArrowTop += 32;
			var maxaff = Univ.GetMaxAffordable(this);
			if (maxaff > 0) {
				for (var item in this.Costs(maxaff)) {
					if (this.CostEquation()[item].visible == 1) {
						costHTML += prettify(this.Costs(maxaff)[item], {maxSmall: 0, sigfigs: 6}) + ' ';
						if (this.Costs(maxaff)[item] == 1) {
							costHTML += Univ.Items[item].singular;
						} else {
							costHTML += Univ.Items[item].plural;
						}
					}
				}
				buying_info = 'Make maximum (currently ' + maxaff + ').';
			} else {
				costHTML = [];
				buying_info = 'Make maximum (currently 0).';
			}
		}

		lookup(this.id + '_costs').innerHTML = costHTML;
		lookup(this.id + '_buying_info').innerHTML = buying_info;
		lookup(this.id + '_popupcontainer').style.top = PopupTop + 'px';
		lookup(this.id + '_popupcontainer').style.left = PopupLeft + 'px';
		lookup(this.id + '_left_arrow_black').style.top = ArrowTop - 30 + 'px';
		lookup(this.id + '_left_arrow_background').style.top = lookup(this.id + '_left_arrow_black').style.top;
					
// eventually also modify width and height of the popup if they need to be bigger than the default for some things...
		lookup(this.id + '_popupcontainer').style.visibility = 'visible';
	}
	
	Univ.Objects[this.id] = this;
	this.num = Univ.ObjectsById.length;
	Univ.ObjectsById.push(this);
	return this;
}

Univ.GeneratorUpgrade = function(id,name,item,type,generators,magnitude,infoblurb,CostFcn,crystals,VisibilityFcn){
	this.id = id;
	this.name = name;
	this.item = item;
	var types = type.split('|');
	this.type = types[1];
	this.magnitude = magnitude; // magnitude of effect: factor to multiply by, or amount to add, etc
	this.generators = generators.split('|');
	this.generatorsactive = {};
	for (var g in this.generators) {
		this.generatorsactive[this.generators[g]] = 0;
	}
	this.bought = 0;
	this.infoblurb = infoblurb;
	this.isVisible = VisibilityFcn;
	this.Costs = CostFcn;
	this.Crystals = crystals;
	this.warning = 'Note: You will also need to activate this upgrade on a generator after purchase.';

	this.canBuy = function(){
		var notenough = 0;
		for (var item in this.Costs()) {
			if (round(this.Costs()[item], Univ.precision) > round(Univ.Items[item].available_number, Univ.precision)) {
				notenough++;
			}
		}
		if (notenough == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	this.Buy = function(){
		if (this.bought ==  0 && this.canBuy()) {
			for (var item in this.Costs()) {
				Univ.Items[item].available_number = round(Univ.Items[item].available_number, Univ.precision) - round(this.Costs()[item], Univ.precision);
			}
			this.bought = 1;
			lookup(this.id + '_button').style.display = 'none';
			
			//auto-activate the upgrade if it doesn't require crystals
			var num = 0;
			for (var c in this.Crystals){
				num++;
			}
			if (num == 0) {
				for (var g in this.generators) {
					generator = this.generators[g];
					this.generatorsactive[generator] = 1;
					lookup(generator + '_' + this.id + '_icon').style.animation = 'switchon 0s forwards';
				}
			}
		}
	}
	
	this.canActivate = function(){
		var notenough = 0;
		for (var crystal in this.Crystals) {
			if (this.Crystals[crystal] > Univ.Crystals[crystal].available_number) {
				notenough++;
			}
		}
		if (notenough == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	this.Toggle = function(generator){
		if (this.generatorsactive[generator] == 1){ 
			for (var c in this.Crystals) {
				var num = 0;
				Univ.Crystals[c].available_number += this.Crystals[c];
				for (i = 1; i <= this.Crystals[c]; i++){
					lookup(generator + '_' + this.id + '_crystal_' + c + num).innerHTML = '&#11046';
					num++;
				}
			}
			this.generatorsactive[generator] = 0;
			lookup(generator + '_' + this.id + '_icon').style.animation = 'switchoff 0.2s forwards';
		}
		else if(this.canActivate()){
			for (var c in this.Crystals){
				var num = 0;
				Univ.Crystals[c].available_number -= this.Crystals[c];
				for (i = 1; i <= this.Crystals[c]; i++){
					lookup(generator + '_' + this.id + '_crystal_' + c + num).innerHTML = '&#11045';
					num++;
				}
			}
			this.generatorsactive[generator] = 1;
			lookup(generator + '_' + this.id + '_icon').style.animation = 'switchon 0.2s forwards';
		}
	}
	
	this.hidePopup = function(generatorID){
		if (generatorID == 'button') {
			lookup(this.id + '_popup').style.visibility = 'hidden';
		} else {
			lookup(generatorID + '_' + this.id + '_upgradepopup').style.visibility = 'hidden';
		}
	}

	this.showPopup = function(generatorID){
		if (generatorID == 'button') {
			var buttonposition = lookup(this.id + '_button').getBoundingClientRect();
			var PopupTop = buttonposition.bottom + window.scrollY - 3;
			var PopupLeft = (buttonposition.left + buttonposition.right) / 2 + window.scrollX - 20;
			lookup(this.id + '_popup').style.top = PopupTop + 5 + 'px';
			lookup(this.id + '_popup').style.left = PopupLeft + 'px';
			lookup(this.id + '_popup').style.visibility = 'visible';
		} else {
			var slotposition = lookup(generatorID + '_' + this.id + '_box').getBoundingClientRect();
			var PopupTop = slotposition.bottom + window.scrollY;
			var PopupLeft = (slotposition.left + slotposition.right) / 2 + window.scrollX - 25;
			lookup(generatorID + '_' + this.id + '_upgradepopup').style.top = PopupTop + 'px';
			lookup(generatorID + '_' + this.id + '_upgradepopup').style.left = PopupLeft + 'px';
			lookup(generatorID + '_' + this.id + '_upgradepopup').style.visibility = 'visible';
		}
	}

	Univ.Upgrades[this.id] = this;
	Univ.GeneratorUpgrades[this.id] = this;
	for (var g in this.generators) {
		Univ.Objects[this.generators[g]][types[0] + 'Upgrades'].push(this);
		Univ.Objects[this.generators[g]]['AllUpgrades'].push(this);
	}
}

Univ.upgradeBought = function(id){
	//console.log(id);
	return (Univ.Upgrades[id].bought);
}

Univ.Crystal = function(type,names,color){
	this.id = type;
	var names = names.split('|');
	this.singular = names[0];
	this.plural = names[1];
	this.color = color;
	this.available_number = 10;	//edit to 0 for release
	this.total_number = 10;		//edit to 0 for release
	Univ.Crystals[this.id] = this;
	return this;
}


/**=====================================
Save functions
=====================================**/
Univ.WriteSave = function(mode){
	var save = {
		version: version,
		ActiveItem: Univ.ActiveItem,
		Objects: {},
		Items: {},
		Upgrades: {},
		prefs: {}
	};
	
	for(var g in Univ.Objects){
		save.Objects[g] = {};
		save.Objects[g].number = Univ.Objects[g].number;
		save.Objects[g].targetactivity = Univ.Objects[g].targetactivity;
	}
	
	for(var i in Univ.Items){
		save.Items[i] = {};
		save.Items[i].available_number = Univ.Items[i].available_number;
		save.Items[i].total_number = Univ.Items[i].total_number;
	}
		
	for(var i in Univ.Upgrades){
		save.Upgrades[i] = {};
		save.Upgrades[i].active = Univ.Upgrades[i].active;
	}
		
	for(var i in Univ.prefs){
		save.prefs[i] = Univ.prefs[i];
	}
	
	
	if(mode == 3){
		return JSON.stringify(save, null, 2);
	}
	else{
		store.set(Univ.SaveTo, JSON.stringify(save));
	}
	var today = new Date();
	var hour = today.getHours();
	var minute = today.getMinutes();
	var second = today.getSeconds();
	hour = (hour < 10 ?'0' : '') + hour;
	minute = (minute < 10 ? '0' : '') + minute;
	second = (second < 10 ? '0' : '') + second;
	var time = hour + ':' + minute + ':' + second;
	lookup('savebutton').innerHTML = 'Save (last saved at ' + time + ')';
	
	Univ.toSave = false;
}

Univ.LoadSave = function(data){
	try {
		var save = null;
		var str = '';
		
		if(data){
			str = data;
		}else{
			if(store.get(Univ.SaveTo)) str = store.get(Univ.SaveTo);
		}
			
		if(str != ''){
			save = JSON.parse(str);
		}
		
		if(!save) return;
		
		
		if(save.version >= 0.013){
			Univ.ActiveItem = save.ActiveItem;
			
			for(var g in save.Objects){
				if(Univ.Objects[g]){
					Univ.Objects[g].number = save.Objects[g].number;
					Univ.Objects[g].targetactivity = save.Objects[g].targetactivity;
				}
			}
			
			for(var i in save.Items){
				if(Univ.Items[i]){
					Univ.Items[i].available_number = save.Items[i].available_number;
					Univ.Items[i].total_number = save.Items[i].total_number;
				}
			}
			
			for(var i in save.Upgrades){
				if(Univ.Upgrades[i]){
					Univ.Upgrades[i].active = save.Upgrades[i].active;
				}
			}
			
			for(var i in save.prefs){
				Univ.prefs[i] = save.prefs[i];
			}
		}
	}
	catch(err) {
		// Should also display a message saying why the save got erased
		Univ.Reset();
	}
	
	Univ.T = 0; // Frame counter starts over // from Cookie Clicker
}

Univ.Reset = function(){
	for(var g in Univ.Objects){
		var obj = Univ.Objects[g];
		obj.number = 0;
		obj.targetactivity = 100;
		obj.ticks_since_production = 0;
	}
	
	for(var i in Univ.Items){
		Univ.Items[i].available_number = 0;
		Univ.Items[i].total_number = 0;
	}
	
	for(var i in Univ.Upgrades){
		Univ.Upgrades[i].active = 0;
	}
	
	Univ.RestoreDefaultPrefs();
	
	Univ.Items['qfoam'].available_number = 10;
	Univ.Items['qfoam'].total_number = 10;
}


/**=====================================
Preference functions
=====================================**/
Univ.RestoreDefaultPrefs = function(){
	Univ.prefs = {};
	
	Univ.prefs.numberformat = 'Normal';
	Univ.prefs.shortsuffix = 1;
	
}

Univ.TogglePref = function(pref, on, off){
	Univ.prefs[pref] = 1 - Univ.prefs[pref];
	var l = lookup('option' + pref);
	
	if(Univ.prefs[pref]){
		l.classList.add('optionOn');
		l.classList.remove('optionOff');
		l.innerHTML = on;
	}
	else{
		l.classList.remove('optionOn');
		l.classList.add('optionOff');
		l.innerHTML = off;
	}
}

Univ.CycleNumberFormat = function(){
	var l = lookup('optionnumberformat');
	
	switch(Univ.prefs.numberformat){
		case 'Normal':
			Univ.prefs.numberformat = 'Scientific';
			break;
		case 'Scientific':
			Univ.prefs.numberformat = 'Engineering';
			break;
		case 'Engineering':
			Univ.prefs.numberformat = 'Normal';
			break;
		default:
			Univ.prefs.numberformat = 'Normal';
	}
	
	l.innerHTML = 'Number format : ' + Univ.prefs.numberformat;
}


/**=====================================
Game functions
=====================================**/
Univ.Loop = function(){
	Univ.catchupLogic = 0;
 	Univ.Logic();
 	Univ.catchupLogic = 1;
 	
 	var time = Date.now();
	
	//latency compensator
	Univ.accumulatedDelay += ((time - Univ.time) - 1000 / Univ.FPS);
	
	Univ.accumulatedDelay = Math.min(Univ.accumulatedDelay, 1000 * 5); //don't compensate over 5 seconds; if you do, something's probably very wrong
	Univ.time = time;
	while(Univ.accumulatedDelay > 0){
		Univ.Logic();
		Univ.accumulatedDelay -= 1000 / Univ.FPS; //as long as we're detecting latency (slower than target fps), execute logic (this makes drawing slower but makes the logic behave closer to correct target fps)
	}
	Univ.catchupLogic = 0;

	if (Univ.T % (Univ.FPS / 4) == 0 ) {
		Univ.RefreshDisplay();
		Univ.UpdateTimeTemp();
	}
	setTimeout(Univ.Loop,1000/Univ.FPS);
	
	if (Univ.toSave || (Univ.T % (Univ.FPS * 60) == 0 )) {	// from Cookie Clicker
		var canSave = true;									// from Cookie Clicker
		if (canSave) Univ.WriteSave();						// from Cookie Clicker
	}
	Univ.T++; // In case we don't want to run certain parts of code every frame	// from Cookie Clicker
}

Univ.Logic = function(){
	for ( var g in Univ.Objects ) {
		var generator = Univ.Objects[g];
		if ( generator.number > 0 ) {
			generator.ticks_since_production++;
			Univ.ActiveNumber(generator);
			if ( generator.ticks_since_production >= (generator.interval() * Univ.FPS) && generator.activenumber > 0) {
				for ( var item in generator.Production(1) ) {
					itemproduction = generator.Production(generator.activenumber)[item] * Univ.Speedfactor;
					Univ.Items[item].available_number += itemproduction;
					Univ.Items[item].total_number += itemproduction;
					generator.ticks_since_production = 0;
				}
				for ( var item in generator.Consumption(1) ) {
					itemconsumption = generator.Consumption(generator.activenumber)[item] * Univ.Speedfactor;
					Univ.Items[item].available_number -= itemconsumption;
					generator.ticks_since_production = 0;
				}
			}
		} else { generator.activenumber = 0; }
	}
}

Univ.UpdateRates = function(){
	var productionrates = {};
	var consumptionrates = {};
	for (var item in Univ.Items) {
		productionrates[item] = 0;
		consumptionrates[item] = 0;
	}

	for ( var g in Univ.Objects ) {
		var generator = Univ.Objects[g];
		if ( generator.number > 0 ) {
			Univ.ActiveNumber(generator);
			if ( generator.activenumber > 0 ) {
				for ( var item in generator.Production(1) ) {
					itemproduction = generator.Production(generator.activenumber)[item];
					productionrates[item] += round(itemproduction / generator.interval() * Univ.Speedfactor, Univ.precision);
				}
				for ( var item in generator.Consumption(1) ) {
					itemconsumption = generator.Consumption(generator.activenumber)[item];
					consumptionrates[item] -= round(itemconsumption / generator.interval() * Univ.Speedfactor, Univ.precision);
				}
			}
		} else { generator.activenumber = 0; }
	}
	for (var item in Univ.Items) {
		Univ.Items[item].production = round(productionrates[item], Univ.precision);
		Univ.Items[item].consumption = round(consumptionrates[item], Univ.precision);
	}
}

Univ.UpdateTimeTemp = function(){
	// this is an early "draft" of the formula, I have a better version in progress elsewhere
	Univ.Age =	1e-113 * Univ.Items['qfoam'].total_number +
				1e-93 * Univ.Items['elementary'].total_number / (1 + Math.exp(2*(-Math.log10(Univ.Age)+30))) + // 30 = sigmoid midpoint (-log10), 2 = steepness
				2e-87 * Univ.Items['subatomic'].total_number +
				6e-81 * Univ.Items['atom'].total_number;
	
	Univ.Temp = 10000000000 * Math.pow(Univ.Age,-0.513);
}

Univ.ActiveNumber = function(generator){
// Find the number of a Generator that can run (by checking their consumption needs)
	var chosenMax = Math.round(generator.number * generator.targetactivity / 100);
	var active = chosenMax;
	var tooHigh = true;
	var step = 1;
	var gce = generator.ConsumptionEquation();
	
	// Take into account upgrades and Speedfactor
	var multiplier = Univ.Speedfactor;
	
	for(var item in gce){
		var ce = gce[item];
		var amt = 0;
		
		if(ce.type == 'lin'){
			amt = Math.floor(Univ.Items[item].available_number / (ce.slope * multiplier));
		}
		else if(ce.type == 'exp'){
			var currentcost = quickExp(ce.base, generator.number) * (ce.start * multiplier);
			var totalcost = (Univ.Items[item].available_number + currentcost) / (ce.start * multiplier);
			var divisor = 1 - ce.base;
			var exponent = Math.log(1 - totalcost * divisor) / Math.log(ce.base);
			amt = Math.floor(exponent - generator.number);
		}
		else if(item != 'upgrades'){ // Custom function
			// No guarantees
			// Try at 100% first
			tooHigh = false;
			var consumption = generator.Consumption(active);
			for(var item in consumption){
				if(item != 'undefined'){
					if(round(Univ.Items[item].available_number, Univ.precision) < round(consumption[item], Univ.precision)) tooHigh = true;
				}
			}
			
			if(toohigh){
				amt = 0;
				tooHigh = false;
				while(!tooHigh && amt < active){
					step = Math.pow(10, Math.max(0, Math.ceil(Math.log10(amt)) - 3)); // step gets bigger and bigger to cut down on time at the cost of precision
					amt += step;
					consumption = generator.Consumption(amt);
					for(var item in consumption){
						if(item != 'undefined'){
							if(round(Univ.Items[item].available_number, Univ.precision) < round(consumption[item], Univ.precision)) tooHigh = true;
						}
					}
				}
				active -= step;
			}
		}
		
		active = Math.min(active, amt);
	}
	
	generator.activenumber = Math.max(0, active);
}

Univ.GetMaxAffordable = function(generator){
	var ret = -1;
	var tooHigh = false;
	var step = 1;
	var gce = generator.CostEquation();
	
	var multiplier = 1;
	
	for(var item in gce){
		var ce = gce[item];
		var amt = 0;
		
		if(ce.type == 'lin'){
			amt = Math.floor(Univ.Items[item].available_number / (ce.slope * multiplier));
		}
		else if(ce.type == 'exp'){
			var currentcost = quickExp(ce.base, generator.number) * (ce.start * multiplier);
			var totalcost = (Univ.Items[item].available_number + currentcost) / (ce.start * multiplier);
			var divisor = 1 - ce.base;
			var exponent = Math.log(1 - totalcost * divisor) / Math.log(ce.base);
			amt = Math.floor(exponent - generator.number);
		}
		else if(item != 'upgrades'){ // Custom function
			// No guarantees
			amt = 0;
			tooHigh = false;
			while(!tooHigh){
				step = Math.pow(10, Math.max(0, Math.ceil(Math.log10(amt)) - 3)); // step gets bigger and bigger to cut down on time at the cost of precision
				amt += step;
				cost = generator.Costs(amt);
				for(var item in cost){
					if(item != 'undefined'){
						if(round(Univ.Items[item].available_number, Univ.precision) < round(cost[item], Univ.precision)) tooHigh = true;
					}
				}
			}
			amt -= step;
		}
		
		ret = ret == -1 ? amt : Math.min(ret, amt);
	}
	
	return Math.max(ret, 0);
}

Univ.GetMidAffordable = function(generator){
	var gce = generator.ConsumptionEquation();
	var wiggleRoom = {};
	var ret = -1;
	var alreadyNegative = false;
	var step = 1;
	
	var multiplier = Univ.Speedfactor;
	
	for(var item in gce){
		if(item != 'upgrades'){
			wiggleRoom[item] = (Univ.Items[item].production + Univ.Items[item].consumption) * generator.interval();
			if(wiggleRoom[item] <= 0){alreadyNegative = true; break;}
		}
	}
	
	if(!alreadyNegative){
		
		for(var item in gce){
			var ce = gce[item];
			var amt = 0;
			
			if(ce.type == 'lin'){
				amt = Math.floor(wiggleRoom[item] / (ce.slope * multiplier));
			}
			else if(ce.type == 'exp'){
				var currentcost = quickExp(ce.base, generator.number) * (ce.start * multiplier);
				var totalcost = (wiggleRoom[item] + currentcost) / (ce.start * multiplier);
				var divisor = 1 - ce.base;
				var exponent = Math.log(1 - totalcost * divisor) / Math.log(ce.base);
				amt = Math.floor(exponent - generator.number);
			}
			else if(item != 'upgrades'){ // Custom function
				// No guarantees
				ret = 0;
				tooHigh = false;
				while(!tooHigh){
					step = Math.pow(10, Math.max(0, Math.ceil(Math.log10(ret)) - 3)); // step gets bigger and bigger to cut down on time at the cost of precision
					ret += step;
					cost = generator.Consumption(generator.number + ret);
					for(var item in cost){
						if(item != 'undefined'){
							if(round(wiggleRoom[item], Univ.precision) < round((consumption[item] - cons2[item]) * multiplier / generator.interval(), Univ.precision)) tooHigh = true;
						}
					}
				}
				ret -= step;
			}
			
			ret = ret == -1 ? amt : Math.min(ret, amt);
		}
		
	}
	
	return Math.min(Math.max(ret, 0), generator.maxAffordable);
}


/**=====================================
Menu functions
=====================================**/
Univ.RefreshDisplay = function(){
	Univ.UpdateRates();
	Univ.UpdateItemDisplay();
	Univ.UpdateGeneratorDisplay();
	Univ.UpdateTopBar();
}

Univ.UpdateTopBar = function(){
//	Univ.Crystals['red'].available_number
	lookup('age').innerHTML = '<b>Age of the Universe:</b> ' + prettify(Univ.Age, 'scientific') + ' seconds';
	lookup('temp').innerHTML = '<b>Temperature:</b> ' + prettify(Univ.Temp, 'scientific') + ' Kelvin';
	var num = 0;
	var crystalHTML = [];
	for (var c in Univ.Crystals) {
		var crystal = Univ.Crystals[c];
		crystalHTML += '<span style="color:' + crystal.color + ';font-size:20px;">&#11045</span>' + crystal.available_number;
		num++;
	}
	if (num == 0) { crystalHTML = 'None available.';}
	lookup('crystals').innerHTML = '<b>Crystals: </b>' + crystalHTML;
}

Univ.UpdateItemDisplay = function(){
	for (var i in Univ.Items) {
		var item = Univ.Items[i];
		
		// Calculate whether to show this item
		var showItem = 0;
		for(var j in Univ.Objects){
			var generator = Univ.Objects[j];
			if(generator.type == i && generator.isVisible()){
				showItem = 1;
				break;
			}
		}
		
		if (Univ.Items[i].visibility == 1) {		
			if(showItem){
				// UPDATE NUMBER
				lookup(item.type + '_number').innerHTML = prettify(Math.floor(item.available_number), {maxSmall: 0, sigfigs: 6});
				
				// UPDATE TITLE
				if (item.available_number == 1) {
					lookup(item.type + '_title').innerHTML = item.singular;
				} else {
					lookup(item.type + '_title').innerHTML = item.plural;
				}
				
				// UPDATE INCOME/SPENDING
				productionHTML = [];
				if (item.available_number > 0) {
					var netproduction = prettify((item.production + item.consumption));
					if (netproduction > 0) {
						productionHTML = '+';
					}
					productionHTML += netproduction + ' per sec (+' + prettify(item.production) + '/' + prettify(item.consumption) +')'; 
				}
				lookup(i + '_production').innerHTML = productionHTML;
				lookup(i + '_button').classList.remove('invisible');
				lookup(i + '_button').classList.add('visible');
			}
			else{
				lookup(i + '_button').classList.add('invisible');
				lookup(i + '_button').classList.remove('visible');
			}
		}
	}
}

Univ.UpdateGeneratorDisplay = function(){
	for (var i in Univ.Objects) {
 		var generator = Univ.Objects[i];
		if (generator.type == Univ.ActiveItem && generator.isVisible()){
			// UPDATE NUMBER	
			lookup(generator.id + '_number').innerHTML = generator.number;
			
			// UPDATE TITLE
			if (generator.number == 1) {
				lookup(generator.id + '_title').innerHTML = generator.singular;
			} else {
				lookup(generator.id + '_title').innerHTML = generator.plural;
			}
			
			// UPDATE progress toward next burst of production
			var progress = Math.min(160, 160 * (generator.ticks_since_production) / (generator.interval() * Univ.FPS));
			lookup(generator.id + '_progress').style.width = progress + 'px';
			
			generator.maxAffordable = Univ.GetMaxAffordable(generator);  // should be the maximum affordable
			generator.midAffordable = Univ.GetMidAffordable(generator);  // should be the maximum that wouldn't result in any negative incomes
			
			if (generator.isAffordable(1)) {
				lookup(generator.id + '_buyone').classList.add('affordable');
				lookup(generator.id + '_buyprogress').style.width = '0px';
			} else {
				lookup(generator.id + '_buyone').classList.remove('affordable');
				var notenough = [];
				for (var item in generator.Costs(1)) {
					if (round(generator.Costs(1)[item], Univ.precision) > round(Univ.Items[item].available_number, Univ.precision)) {
						notenough.push(round(Univ.Items[item].available_number, Univ.precision) / round(generator.Costs(1)[item], Univ.precision));
					}
				}
				progress = 30 * Math.max(notenough);
				lookup(generator.id + '_buyprogress').style.width = progress + 'px';
			}
			if (generator.isAffordable(generator.midAffordable) && generator.midAffordable > 0) {
				lookup(generator.id + '_buymid').classList.add('affordable');
				if (generator.midAffordable == 1) {
					lookup(generator.id + '_buymid').innerHTML = '+';
				} else if (generator.midAffordable == 2) {
					lookup(generator.id + '_buymid').innerHTML = '++';
				} else if (generator.midAffordable != 2 && generator.midAffordable == generator.maxAffordable) {
					lookup(generator.id + '_buymid').innerHTML = '+++';
				} else {
					lookup(generator.id + '_buymid').innerHTML = '++';
				}
			} else {
				lookup(generator.id + '_buymid').classList.remove('affordable');
				lookup(generator.id + '_buymid').innerHTML = '++';
			}
			if (generator.isAffordable(generator.maxAffordable) && generator.maxAffordable > 0) {
				lookup(generator.id + '_buymax').classList.add('affordable');
				if (generator.maxAffordable == 1){
					lookup(generator.id + '_buymax').innerHTML = '+';
				} else if (generator.maxAffordable == 2){
					lookup(generator.id + '_buymax').innerHTML = '++';
				} else {
					lookup(generator.id + '_buymax').innerHTML = '+++';
				}
			} else {
				lookup(generator.id + '_buymax').classList.remove('affordable');
				lookup(generator.id + '_buymax').innerHTML = '+++';
			}
			
			for (var u in generator.AllUpgrades) {
				var upgrade = generator.AllUpgrades[u];
				if (upgrade.bought) {
					lookup(generator.id + '_' + upgrade.id + '_box').style.display = 'block';	
					if (upgrade.generatorsactive[generator.id] == 1) {
						lookup(generator.id + '_' + upgrade.id + '_icon').style.animation = 'switchon 0s forwards';
					} else {
						lookup(generator.id + '_' + upgrade.id + '_icon').style.animation = 'switchoff 0s forwards';						
					}
				} else {
					lookup(generator.id + '_' + upgrade.id + '_box').style.display = 'none';
				}
			}
      
			lookup(generator.id + '_button').style = 'display:block;';
			if (lookup(generator.id + '_popupcontainer').style.visibility == 'visible') {
				generator.showPopup();
			}
		} else {
			lookup(generator.id + '_button').style = 'display:none;';
		}
	}
	
	for (var i in Univ.GeneratorUpgrades) { // show unpurchased Upgrade buttons below Generators
		var upgrade = Univ.GeneratorUpgrades[i];
		if (upgrade.item == Univ.ActiveItem && upgrade.isVisible()){
			if (upgrade.canBuy()){
				lookup(upgrade.id + '_button').style = 'display:block;border:2px solid black;cursor:pointer;';
				lookup(upgrade.id + '_icon').style = 'opacity:1;';
			} else {
				lookup(upgrade.id + '_button').style = 'display:block;border:2px solid grey;cursor:auto;';
				lookup(upgrade.id + '_icon').style = 'opacity:.5;';
			}
		} else {
			lookup(upgrade.id + '_button').style = 'display:none;';
		}
	}
	
	if('options' == Univ.ActiveItem){
		lookup('optionsmenu_button').classList.add('itemSelected');
		lookup('options_menu').style = 'display:block;';
	}
	else{
		lookup('optionsmenu_button').classList.remove('itemSelected');
		lookup('options_menu').style = 'display:none;';
	}
	
	for(var item in Univ.Items){
		if(Univ.Items[item].visibility == 1){
			if(item == Univ.ActiveItem){
				lookup(item + '_button').classList.add('itemSelected');
			}else{
				lookup(item + '_button').classList.remove('itemSelected');
			}
		}
	}
}

Univ.updateSlider = function(generatorid){
	var sliderid = generatorid + '_slider';
	var slidervalue = lookup(sliderid).value;
	generator = Univ.Objects[generatorid];
	generator.targetactivity = slidervalue;
	lookup(generatorid + '_sliderlabel').style.left = 90 + Math.round(slidervalue * 0.6) + 'px';
	lookup(generatorid + '_sliderlabel').innerHTML = slidervalue + '%';
	lookup(generatorid + '_currentlyactive').innerHTML = 'Currently active: ' + generator.activenumber + ' (' + Math.round(100 * generator.activenumber / generator.number) + '%)';
}

Univ.LoadMenus = function(){
	// 	maybe eventually
}

Univ.ItemMenuHTML = function(){
	var itemtable = '<div id="optionsmenu_button" class="itembutton active visible">';
	itemtable += '<div class="menuTitle">Menu</div>';
	itemtable += '</div>';

	for (var i = Univ.ItemsById.length - 1; i >= 0; i--) {
		item = Univ.ItemsById[i].type;
		if (Univ.Items[item].visibility == 1) {
			itemtable += '<div id="' + item + '_button" class="itembutton active visible">';
				itemtable += '<img src="icons/' + item + '.png" class="itemicon">';
				itemtable += '<div id="' + item + '_number" class="itemnumber"></div>';
				itemtable += '<div id="' + item + '_title" class="itemtitle"></div>';
				itemtable += '<div id="' + item + '_production" class="itemproduction"></div>';
			itemtable += '</div>';
		}
	}

	lookup('items').innerHTML = itemtable;
	
	AddEvent(lookup('optionsmenu_button'),'mouseover',function(what){return function(e){Univ.ActiveItem = what;Univ.UpdateGeneratorDisplay();};}('options'));
	for (var item in Univ.Items) {
		if (Univ.Items[item].visibility == 1) {
			try{throw item}
			catch(item){
				AddEvent(lookup(item + '_button'),'mouseover',function(what){return function(e){Univ.ActiveItem = item;Univ.UpdateGeneratorDisplay();};}(item));
			}
		}
	}

}

Univ.GeneratorMenuHTML = function(){
	function WriteButton(pref, text, callback, Class){
		return '<div id="option' + pref + '" class="optionsButton menubutton' + (Class ? ' ' + Class: '') + '" style="background-color:#f7f7f7;" onmousedown="' + callback + '">' + text + '</div>';
	}
	
	var generatortable = '';
	
	// Options menu. Set the entire div to none or block to hide or show
	generatortable += '<div id="options_menu" style="display:none;">';
	generatortable += '<div id="versionbox" class="optionsButton" style="background-color:#f7f7f7;cursor:auto;">Version ' + version.toFixed(3) + '</div>';
	generatortable += '<div id="savebutton" class="optionsButton menubutton" style="background-color:#c9ffd2;" onmousedown="Univ.WriteSave();">Save</div>';
	generatortable += '<div id="resetbutton" class="optionsButton menubutton" style="background-color:#ffd3dd;" onmousedown="Univ.Reset();Univ.WriteSave();">Reset (and wipe save)</div><hr>';
	generatortable += WriteButton('numberformat', 'Number format : ' + Univ.prefs.numberformat, "Univ.CycleNumberFormat()");
	generatortable += WriteButton('shortsuffix', (Univ.prefs.shortsuffix ? 'Short number suffix ON' : 'Short number suffix OFF'), "Univ.TogglePref('shortsuffix','Short number suffix ON','Short number suffix OFF')", (Univ.prefs.shortsuffix ? 'optionOn' : 'optionOff'));
	generatortable += '</div>';
	
	
 	for (var i in Univ.Objects) {
 		var generator = Univ.Objects[i];
 		
 		generatortable += '<div id="' + generator.id + '_button" class="generatorbutton clickablegenerator" style="display:none;">';
			generatortable += '<div id="' + generator.id + '_hoverzone" class="generatorhoverzone"></div>';
			generatortable += '<img src="icons/ICON.png" class="generatoricon">';
			generatortable += '<div id="' + generator.id + '_title" class="generatortitle">' + generator.plural + '</div>';
			generatortable += '<div id="' + generator.id + '_number" class="generatornumber"></div>';
			generatortable += '<div id="' + generator.id + '_buyone" class="generatorbuyone">+</div>';
			generatortable += '<div id="' + generator.id + '_buymid" class="generatorbuymid">++</div>';
			generatortable += '<div id="' + generator.id + '_buymax" class="generatorbuymax">+++</div>';
			generatortable += '<div id="' + generator.id + '_buyprogress" class="generatorbuyprogress"></div>';
			generatortable += '<div id="' + generator.id + '_progress" class="generatorprogress"></div>';

			// Tooltip popup
			generatortable += '<div id="' + generator.id + '_popupcontainer" class="popupcontainer">';
				generatortable += '<div id="' + generator.id + '_left_arrow_black" class="left_arrow_black"></div>';
				generatortable += '<div id="' + generator.id + '_left_arrow_background" class="left_arrow_background"></div>';
				generatortable += '<div class="popup">';
					generatortable += '<div class="popupinfoblurb">' + generator.infoblurb + '</div>';
					generatortable += '<div id="' + generator.id + '_buying" class="generatorbuying">';
						generatortable += '<span id="' + generator.id + '_buying_info" class="generatorbuyinfo"></span>';
						generatortable += '<span id="' + generator.id + '_costs" class="generatorcosts"></span>';
					generatortable += '</div>';
					generatortable += '<div id="' + generator.id + '_rates" class="generatorrates">';					
						generatortable += '<div id="' + generator.id + '_popup_production" class="generatorproduction"></div>';
						generatortable += '<div id="' + generator.id + '_popup_consumption" class="generatorconsumption"></div>';
					generatortable += '</div>';
					// Tooltip target activity slider
					generatortable += '<div id="' + generator.id + '_slidercontainer" class="slidercontainer">Target activity: ';
						generatortable += '<div id="' + generator.id + '_sliderlabel" class="sliderlabel"></div>';
						generatortable += '<input id="' + generator.id + '_slider" type="range" min="0" max="100" value="100" class="slider">';
						generatortable += '<div id="' + generator.id + '_currentlyactive" class="currentactive"></div>';
					generatortable += '</div>';
					generatortable += '<div id="' + generator.id + '_upgradecontainer" class="upgradecontainer">';
						generatortable += '<span class="upgradestitle">Upgrades</span>';
						generatortable += '<div id="' + generator.id + '_upgrades_grid" class="upgrades_grid">No Upgrades, or they didn\'t load</div>';
					generatortable += '</div>';
				generatortable += '</div>';
			generatortable += '</div>';
 		generatortable += '</div>';
 	}

 	for (var i in Univ.GeneratorUpgrades) {
 		var upgrade = Univ.GeneratorUpgrades[i];
 		
		var costHTML = 'Cost: ';			
		for (var item in upgrade.Costs()) {
			costHTML += upgrade.Costs()[item] + ' ';
			if (upgrade.Costs()[item] == 1) {
				costHTML += Univ.Items[item].singular;
			} else {
				costHTML += Univ.Items[item].plural;
			}
		}
 		
 		var crystalHTML = 'Crystals to activate: ';
 		for (var crystal in upgrade.Crystals) {
 			for (i = 0; i < upgrade.Crystals[crystal]; i++){
				crystalHTML += '<span style="font-size:16px;color:' + Univ.Crystals[crystal].color + ';">&#11045</span>';
			}
		}
 		
 		generatortable += '<div id="' + upgrade.id + '_button" class="upgradebutton" style="display:none;">';
			generatortable += '<img id="' + upgrade.id + '_icon" src="icons/ICON.png" class="upgradebutton_icon">';
			generatortable += '<div id="' + upgrade.id + '_popup" class="upgrade_popup">';
				generatortable += '<div class="up_arrow_black"></div>';
				generatortable += '<div class="up_arrow_background"></div>';
				generatortable += '<div id="' + upgrade.id + '_title" class="upgrade_title">' + upgrade.name + '</div>';
				generatortable += '<div id="' + upgrade.id + '_text" class="upgrade_text">' + upgrade.infoblurb + '</div>';
				generatortable += '<div id="' + upgrade.id + '_cost" class="upgrade_cost">' + costHTML + '</div>';
				generatortable += '<div id="' + upgrade.id + '_crystalinfo" class="upgrade_crystalinfo">' + crystalHTML + '</div>';
				generatortable += '<div id="' + upgrade.id + '_warning" class="upgrade_warning">' + upgrade.warning + '</div>';
			generatortable += '</div>';	
 		generatortable += '</div>';
 	}

 	lookup('generators').innerHTML = generatortable;	
	
	for (var k in Univ.Objects) {
		try{throw Univ.Objects[k]}
		catch(generator){

			AddEvent(lookup(generator.id + '_buyone'),'click',function(what){return function(e){if(generator.isAffordable(1)) generator.Buy(1);};}());
			AddEvent(lookup(generator.id + '_buyone'),'mouseover',function(what){return function(e){generator.pupuptype=1;generator.showPopup();};}());
			AddEvent(lookup(generator.id + '_buyone'),'mouseout',function(what){return function(e){generator.hidePopup();};}());
			AddEvent(lookup(generator.id + '_buymid'),'click',function(what){return function(e){if(generator.isAffordable(generator.midAffordable)) generator.Buy(generator.midAffordable);};}());
			AddEvent(lookup(generator.id + '_buymid'),'mouseover',function(what){return function(e){generator.pupuptype='mid';generator.showPopup();};}());
			AddEvent(lookup(generator.id + '_buymid'),'mouseout',function(what){return function(e){generator.hidePopup();};}());
			AddEvent(lookup(generator.id + '_buymax'),'click',function(what){return function(e){if(generator.isAffordable(generator.maxAffordable)) generator.Buy(generator.maxAffordable);};}());
			AddEvent(lookup(generator.id + '_buymax'),'mouseover',function(what){return function(e){generator.pupuptype='max';generator.showPopup();};}());
			AddEvent(lookup(generator.id + '_buymax'),'mouseout',function(what){return function(e){generator.hidePopup();};}());

			if (generator.isAffordable(1)) {
				lookup(generator.id + '_buyone').classList.add('affordable');
			} else {
				lookup(generator.id + '_buyone').classList.remove('affordable');
			}
			if (generator.isAffordable(generator.midAffordable)) {
				lookup(generator.id + '_buymid').classList.add('affordable');
			} else {
				lookup(generator.id + '_buymid').classList.remove('affordable');
			}
			if (generator.isAffordable(generator.maxAffordable)) {
				lookup(generator.id + '_buymax').classList.add('affordable');
			} else {
				lookup(generator.id + '_buymax').classList.remove('affordable');
			}
			AddEvent(lookup(generator.id + '_hoverzone'),'mouseover',function(){return function(){generator.pupuptype=1;generator.showPopup();};}());
			AddEvent(lookup(generator.id + '_hoverzone'),'mouseout',function(){return function(){generator.hidePopup();};}());
			AddEvent(lookup(generator.id + '_popupcontainer'),'mouseover',function(){return function(){generator.showPopup();};}());
			AddEvent(lookup(generator.id + '_popupcontainer'),'mouseout',function(){return function(){generator.hidePopup();};}());
			
			lookup(generator.id + '_slider').oninput = function(){Univ.updateSlider(generator.id);};
		}
	}
	
	for (var k in Univ.GeneratorUpgrades){
		var num = 0;
 		for (var crystal in upgrade.Crystals) {
 			num++;
		}
		if (num == 0) {
			lookup(upgrade.id + '_crystalinfo').style.visibility = 'hidden';
			lookup(upgrade.id + '_warning').style.visibility = 'hidden';
			lookup(upgrade.id + '_cost').style.bottom = '5px';
		}
	
		try{throw Univ.GeneratorUpgrades[k]}
		catch(upgrade){
			AddEvent(lookup(upgrade.id + '_icon'),'click',function(){return function(){if(upgrade.canBuy()) upgrade.Buy();};}());
			AddEvent(lookup(upgrade.id + '_button'),'mouseover',function(){return function(){upgrade.showPopup('button');};}());
			AddEvent(lookup(upgrade.id + '_button'),'mouseout',function(){return function(){upgrade.hidePopup('button');};}());
		}
	}
	
	Univ.UpgradesHTML();
	
	var menubuttons = document.getElementsByClassName('menubutton');
	for(var i in menubuttons){
		var button = menubuttons[i];
		AddEvent(button,'mouseover',function(what){return function(){what.classList.add('hovered');};}(button));
		AddEvent(button,'mouseout',function(what){return function(){what.classList.remove('hovered');};}(button));
	}
}

Univ.UpgradesHTML = function(){ // for making the upgrade slots inside generator popups -- upgrade buying buttons are made in GeneratorMenuHTML()
		for (var i in Univ.Objects) {
 		var generator = Univ.Objects[i];
		var upgradeHTML = [];
		for (var u in generator.AllUpgrades) {
			var upgrade = generator.AllUpgrades[u];
			
			upgradeHTML += '<div id="' + generator.id + '_' + upgrade.id + '_box" class="upgradebox">';
			upgradeHTML += '<img id="' + generator.id + '_' + upgrade.id + '_icon" src="icons/ICON.png" class="upgradebox_icon">';

			upgradeHTML += '<div id="' + generator.id + '_' + upgrade.id + '_upgradepopup" class="upgradeslot_popup">';
				upgradeHTML += '<div class="up_arrow_black"></div>';
				upgradeHTML += '<div class="up_arrow_background"></div>';
				
				upgradeHTML += '<div id="' + generator.id + '_' + upgrade.id + '_slots" class="upgrade_slots">';
				for (var c in upgrade.Crystals) {
					var num = 0;
					for (i = 1; i <= upgrade.Crystals[c]; i++){
						upgradeHTML += '<div class="upgrade_slot">';
							upgradeHTML += '<span id="' + generator.id + '_' + upgrade.id + '_crystal_' + c + num + '" class="upgrade_crystalslot" style="color:' + Univ.Crystals[c].color + ';">&#11046</span>';
						upgradeHTML += '</div>';
						num++;
					}
				}
				upgradeHTML += '<span id="' + generator.id + '_' + upgrade.id + '_activity" class="upgrade_activity"></span>';
				upgradeHTML += '</div>';
				upgradeHTML += '<div id="' + generator.id + '_' + upgrade.id + '_title" class="upgradeslot_title">' + upgrade.name + '</div>';
				upgradeHTML += '<div id="' + generator.id + '_' + upgrade.id + '_text" class="upgradeslot_text">' + upgrade.infoblurb + '</div>';				
			upgradeHTML += '</div></div>';
		}
		lookup(generator.id + '_upgrades_grid').innerHTML = upgradeHTML; 
		
		for (var u in generator.AllUpgrades){
			try{throw [generator,generator.AllUpgrades[u]]}
			catch([generator,upgrade]){
 				AddEvent(lookup(generator.id + '_' + upgrade.id + '_box'),'click',function(){return function(){upgrade.Toggle(generator.id);};}());
 				AddEvent(lookup(generator.id + '_' + upgrade.id + '_box'),'mouseover',function(){return function(){upgrade.showPopup(generator.id);};}());
 				AddEvent(lookup(generator.id + '_' + upgrade.id + '_box'),'mouseout',function(){return function(){upgrade.hidePopup(generator.id);};}());
			}
 		}
	}
}

make_speedslider = function(){ // delete for release
	slider_HTML = [];
	slider_HTML += '<div id="speedslider_container" class="speedslidercontainer">';
	slider_HTML += '<div id="speedslider_label" class="speedsliderlabel">1x</div>';
	slider_HTML += 'Gamespeed Multiplier: <input type="range" min="1" max="100" value="1" class="speedslider" id="speedslider"></div>';
	lookup('topbar').innerHTML += slider_HTML;
	lookup('speedslider').oninput = function(){update_speedslider();};
}
update_speedslider = function(){ // delete for release
	var slidervalue = lookup('speedslider').value;
	Univ.Speedfactor = slidervalue;
	Univ.UpdateRates();
	lookup('speedslider_label').style.left = 132 + Math.round(slidervalue * 1.6) + 'px';
	lookup('speedslider_label').innerHTML = slidervalue + 'x';
}

Univ.TopBarHTML = function(){
 	lookup('topbar').innerHTML += '<span id="age" style="position:absolute;top:5px;left:5px"></span>';
 	lookup('topbar').innerHTML += '<span id="temp" style="position:absolute;top:25px;left:5px"></span>';
 	lookup('topbar').innerHTML += '<span id="crystals" style="position:absolute;top:45px;left:5px"></span>';
	make_speedslider(); // delete for release
}

/**=====================================
Game start!
=====================================**/
window.onload = function(){
	Univ.LoadItems();
	Univ.LoadObjects();
	Univ.LoadUpgrades();
	Univ.RestoreDefaultPrefs();
	Univ.LoadSave();
	Univ.ItemMenuHTML();
	Univ.GeneratorMenuHTML();
	
	Univ.TopBarHTML();	
	Univ.format = new numberformat.Formatter({format: 'standard', sigfigs: 4, maxSmall: 1000})
	
	// Latency stuff
	Univ.accumulatedDelay = 0;
	Univ.lastActivity = Date.now();
	Univ.time = Date.now();
	
 	Univ.Loop();
}

AddEvent(window,'keydown',function(e){
	if (e.ctrlKey && e.keyCode == 83) {Univ.toSave = true;e.preventDefault();} // ctrl-s saves the game
});