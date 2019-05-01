var version = 0.023;
var Univ = {};
Univ.FPS = 8;
Univ.Speedfactor = 1; // Factor to speed up everything -- for testing.
Univ.Items = [];
Univ.Objects = [];
Univ.Upgrades = [];
Univ.GeneratorUpgrades = [];
Univ.T = 0;
Univ.SaveTo = 'LastQuestion';
Univ.ActiveItem = 'qfoam'; // possibly delete this line eventually, just makes testing faster
Univ.ItemsById = [];
Univ.ObjectsById = [];
Univ.precision = 10;


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
	this.production = production; 	// this might be a function in the future,
	// to allow for nonlinear effects, or to trigger events when certain items get produced
	
	this.consumption = consumption; // this might be a function in the future,
	// to allow for nonlinear effects, or to trigger events when certain items get consumed
	
	Univ.Items[this.type] = this;
	this.num = Univ.ItemsById.length;
	Univ.ItemsById.push(this);
	return this;
}

Univ.Object = function(id,type,singular,plural,number,infoblurb,VisibilityFcn,CostEquation,IntervalFcn,ProductionEquation,ConsumptionEquation){
	this.id = id;
	this.type = type;
    this.singular = singular;
	this.plural = plural;
	this.number = number;
 	this.activenumber = number;
	this.maxAffordable = 1000;
	this.midAffordable = 80;
	
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

	this.CostEquation = CostEquation;
	this.Costs = function(howmany){
		var cost = {};
		var multiplier = 1;
		for(var i in this.CostEquation.upgrades){
			var upgrade = this.CostEquation.upgrades[i];
			if (Univ.upgradeBought(upgrade)){ multiplier *= Univ.Upgrades[upgrade].magnitude; }
		}
		
		for(var item in this.CostEquation){
			if(this.CostEquation[item].type == 'lin'){
				cost[item] = multiplier * this.CostEquation[item].slope * howmany;
			}
			else if(this.CostEquation[item].type == 'exp'){
				cost[item] = multiplier * this.CostEquation[item].start * (quickExp(this.CostEquation[item].base, howmany + this.number) - quickExp(this.CostEquation[item].base, this.number));
			}
			else if(item != 'upgrades'){ // Custom function
				cost[item] = multiplier * this.CostEquation[item].fcn(howmany);
			}
		}
		return cost;
	}
	this.NextCost = this.Costs(1);
	
	this.isVisible = VisibilityFcn;
	this.isClickable = function(){ // eventually this will check both if it's affordable, and if other conditions are met
		if (this.isAffordable) {
			// Check other conditions here
			return 1;
		} else {
			return 0;
		}
	}
	
	this.Buy = function(howmany){
		if (this.isAffordable(howmany)) {
			for (var item in this.Costs(howmany)) {
				Univ.Items[item].available_number = round(Univ.Items[item].available_number, Univ.precision) - round(this.Costs(howmany)[item], Univ.precision);
			}
			this.number += howmany;
			if (this.number == 1) { this.ticks_since_production = this.interval() - 1; } // for the first one, produce immediately instead of waiting the whole interval
			Univ.RefreshDisplay();
			this.showPopup('stay');
		}
		this.NextCost = this.Costs(1);
	}
	
	this.infoblurb = infoblurb;
	this.targetactivity = 100; // percent of this generator chosen to be active
	this.interval = IntervalFcn;
	
	this.ProductionEquation = ProductionEquation;
	this.Production = function(number){
		var production = {};
		var multiplier = 1;
		for(var i in this.ProductionEquation.upgrades){
			var upgrade = this.ProductionEquation.upgrades[i];
			if (Univ.upgradeBought(upgrade)){ multiplier *= Univ.Upgrades[upgrade].magnitude; }
		}
		
		for(var item in this.ProductionEquation){
			if(this.ProductionEquation[item].type == 'lin'){
				production[item] = multiplier * this.ProductionEquation[item].slope * number;
			}
			else if(this.ProductionEquation[item].type == 'exp'){
				production[item] = multiplier * this.ProductionEquation[item].start * quickExp(this.ProductionEquation[item].base, number);
			}
			else if(item != 'upgrades'){ // Custom function
				production[item] = multiplier * this.ProductionEquation[item].fcn(number);
			}
		}
		return production;
	}
	
	this.ConsumptionEquation = ConsumptionEquation;
	this.Consumption = function(number){
		var consumption = {};
		var multiplier = 1;
		for(var i in this.ConsumptionEquation.upgrades){
			var upgrade = this.ConsumptionEquation.upgrades[i];
			if (Univ.upgradeBought(upgrade)){ multiplier *= Univ.Upgrades[upgrade].magnitude; }
		}
		
		for(var item in this.ConsumptionEquation){
			if(this.ConsumptionEquation[item].type == 'lin'){
				consumption[item] = multiplier * this.ConsumptionEquation[item].slope * number;
			}
			else if(this.ConsumptionEquation[item].type == 'exp'){
				consumption[item] = multiplier * this.ConsumptionEquation[item].start * quickExp(this.ConsumptionEquation[item].base, number);
			}
			else if(item != 'upgrades'){ // Custom function
				consumption[item] = multiplier * this.ConsumptionEquation[item].fcn(number);
			}
		}
		return consumption;
	}
	
	this.ticks_since_production = 0;	

	this.showPopup = function(type) {
		if (type == 0) {
			lookup(this.id + '_popupcontainer').style.visibility = 'hidden';
		} else {
			var totalproduction = 0;
			var totalconsumption = 0;
			for (var item in Univ.Items) {
				if (Univ.Items[item].visibility == 1) {
					if ( typeof this.Production(this.activenumber)[item] !== 'undefined' && this.Production(this.activenumber)[item] > 0 ) {
						totalproduction++;
					}
					if ( typeof this.Consumption(this.activenumber)[item] !== 'undefined' && this.Consumption(this.activenumber)[item] > 0 ) {
						totalconsumption++;
					}
				}
			}
			var productionTxt = [];
			var consumptionTxt = [];
			for (var item in Univ.Items) {
				if (Univ.Items[item].visibility == 1) {
					if (totalproduction > 0 && typeof this.Production(this.activenumber)[item] !== 'undefined') {
						productionTxt += '<span class="blacktext">Generating</span> ' + prettify(this.Production(this.activenumber)[item] * Univ.Speedfactor) + ' ' + Univ.Items[item].plural + ' every ' + prettify(this.interval()) + ' sec (' + prettify(this.Production(this.activenumber)[item] * Univ.Speedfactor / this.activenumber) + '&nbsp;each). ';
					}
					if (totalconsumption > 0 && typeof this.Consumption(this.activenumber)[item] !== 'undefined') {
						consumptionTxt += '<span class="redtext">Consuming</span> ' + prettify(this.Consumption(this.activenumber)[item] * Univ.Speedfactor) + ' ' + Univ.Items[item].plural + ' every ' + prettify(this.interval()) + ' sec (' + prettify(this.Consumption(this.activenumber)[item] * Univ.Speedfactor / this.activenumber) + '&nbsp;each). ';
					}
				}
			}
			lookup(this.id + '_popup_production').innerHTML = productionTxt; 
			lookup(this.id + '_popup_consumption').innerHTML = consumptionTxt;
			


			lookup(this.id + '_slider').value = this.targetactivity;
			try{throw this.id}
			catch(generator){
				lookup(this.id + '_slider').oninput = function(){Univ.updateSlider(generator);};
			}
			Univ.updateSlider(this.id);
			if ( this.number > 0 ) {
				lookup(this.id + '_slidercontainer').style.display = 'block';
			}
			
			if (type != 'stay') {
				var costHTML = '<span class="blacktext">Cost:</span> ';		
				var buttonposition = lookup(this.id + '_button').getBoundingClientRect();
				var buttonTop = buttonposition.top + window.scrollY;
				var buttonBot = buttonposition.bottom + window.scrollY;
				var buttonY = (buttonTop + buttonBot) / 2;
		
				var buttonLeft = buttonposition.left + window.scrollX;
				var buttonLeft = buttonposition.left + window.scrollX;
		
				var PopupTop = Math.max(0, buttonY - 101);
				var PopupLeft = buttonLeft + buttonposition.width - 6;
				var ArrowTop = lookup(this.id + '_popupcontainer').getBoundingClientRect().height - 123;
				var buying_info = [];
				if (type == 1) {
					buying_info = 'Make one.';
					for (var item in this.Costs(1)) {
						costHTML += prettify(this.Costs(1)[item], {maxSmall: 0, sigfigs: 6}) + ' ';
						if (this.Costs(1)[item] == 1) {
							costHTML += Univ.Items[item].singular;
						} else {
							costHTML += Univ.Items[item].plural;
						}
					}
				} else if (type == 'mid') {
					ArrowTop += 16;
					var midaff = Univ.GetMidAffordable(this);
					if (midaff > 0) {
						for (var item in this.Costs(midaff)) {
							costHTML += prettify(this.Costs(midaff)[item], {maxSmall: 0, sigfigs: 6}) + ' ';
							if (this.Costs(midaff)[item] == 1) {
								costHTML += Univ.Items[item].singular;
							} else {
								costHTML += Univ.Items[item].plural;
							}
						}
						buying_info = 'Make maximum without causing negative income (currently ' + midaff + ').';
					} else { 
						costHTML = [];
						buying_info = 'Make maximum without causing negative income (currently 0).';
					}
				} else if (type == 'max') {
					ArrowTop += 32;
					var maxaff = Univ.GetMaxAffordable(this);
					if (maxaff > 0) {
						for (var item in this.Costs(maxaff)) {
							costHTML += prettify(this.Costs(maxaff)[item], {maxSmall: 0, sigfigs: 6}) + ' ';
							if (this.Costs(maxaff)[item] == 1) {
								costHTML += Univ.Items[item].singular;
							} else {
								costHTML += Univ.Items[item].plural;
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
			}				
	// eventually also modify width and height of the popup if they need to be bigger than the default for some things...
			lookup(this.id + '_popupcontainer').style.visibility = 'visible';
		}
	}
	
	Univ.Objects[this.id] = this;
	this.num = Univ.ObjectsById.length;
	Univ.ObjectsById.push(this);
	return this;
}

Univ.GeneratorUpgrade = function(id,name,item,type,generator,magnitude,infoblurb,CostFcn,VisibilityFcn) {
	this.id = id;
	this.name = name;
	this.item = item;
	this.type = type;
	this.magnitude = magnitude; // magnitude of effect: factor to multiply by, or amount to add, etc
	this.generator = generator;
	this.bought = 0;
	this.infoblurb = infoblurb;
	this.isVisible = VisibilityFcn;
	this.Costs = CostFcn;
	this.isAffordable = function(){
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
		if (this.isAffordable()) {
			for (var item in this.Costs()) {
				Univ.Items[item].available_number = round(Univ.Items[item].available_number, Univ.precision) - round(this.Costs()[item], Univ.precision);
			}
			this.bought = 1;
		}
	}
	
	this.isClickable = function(){
		if (this.isAffordable) {
			// Check other conditions here
			return 1;
		} else {
			return 0;
		}
	}
	
	Univ.Upgrades[this.id] = this;
	Univ.GeneratorUpgrades[this.id] = this;
}

Univ.upgradeBought = function(id){
	//console.log(id);
	return (Univ.Upgrades[id].bought);
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
		save.Upgrades[i].bought = Univ.Upgrades[i].bought;
	}
		
	for(var i in Univ.prefs){
		save.prefs[i] = Univ.prefs[i];
	}
	
	
	if(mode == 3){
		return JSON.stringify(save, null, 2);
	}
	else{
		localStorage.setItem(Univ.SaveTo, JSON.stringify(save));
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
	var save = null;
	var str = '';
	
	if(data){
		str = data;
	}else{
		if(localStorage.getItem(Univ.SaveTo)) str = localStorage.getItem(Univ.SaveTo);
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
				Univ.Upgrades[i].bought = save.Upgrades[i].bought;
			}
		}
		
		for(var i in save.prefs){
			Univ.prefs[i] = save.prefs[i];
		}
	}
	Univ.T = 0; // Frame counter starts over // from Cookie Clicker
}

Univ.Reset = function(){
	for(var g in Univ.Objects){
		var obj = Univ.Objects[g];
		Univ.Objects[g].number = 0;
		Univ.Objects[g].targetactivity = 100;
	}
	
	for(var i in Univ.Items){
		Univ.Items[i].available_number = 0;
		Univ.Items[i].total_number = 0;
	}
	
	for(var i in Univ.Upgrades){
		Univ.Upgrades[i].bought = 0;
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

Univ.ActiveNumber = function(generator){
// Find the number of a Generator that can run (by checking their consumption needs)
	var chosenMax = Math.round(generator.number * generator.targetactivity / 100);
	//var consumption = generator.Consumption(chosenMax);
	var active = chosenMax;
	//var capable;
	var tooHigh = true;
	var step = 1;
	
	// Take into account upgrades and Speedfactor
	var multiplier = Univ.Speedfactor;
// 	for (var i in Univ.GeneratorUpgrades) {
// 		var upgrade = Univ.GeneratorUpgrades[i];
// 		if (Univ.upgradeBought(upgrade.id) && upgrade.generator == generator.id ){
// 			if (upgrade.type == 'multiply') {
// 				multiplier *= upgrade.multiplier; 
// 			}
// 			else if (upgrade.type == 'efficiency') {
// 				multiplier *= upgrade.multiplier; 
// 			}
// 		}
// 	}
	
	for(var item in generator.ConsumptionEquation){
		var ce = generator.ConsumptionEquation[item];
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
	
	var multiplier = 1;
// 	for (var i in Univ.GeneratorUpgrades) {
// 		var upgrade = Univ.GeneratorUpgrades[i];
// 		if (Univ.upgradeBought(upgrade.id) && upgrade.generator == generator.id ){
// 			if (upgrade.type == 'costMult') {
// 				multiplier *= upgrade.multiplier; 
// 			}
// 		}
// 	}
	
	for(var item in generator.CostEquation){
		var ce = generator.CostEquation[item];
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
	var consumption = generator.ConsumptionEquation;
	var wiggleRoom = {};
	var ret = -1;
	var alreadyNegative = false;
	var step = 1;
	
	var multiplier = Univ.Speedfactor;
	
	for(var item in consumption){
		if(item != 'upgrades'){
			//consumption[item] *= multiplier / generator.interval();
			wiggleRoom[item] = Univ.Items[item].production + Univ.Items[item].consumption;
			if(wiggleRoom[item] <= 0){alreadyNegative = true; break;}
		}
	}
	
	if(!alreadyNegative){
		
		for(var item in generator.ConsumptionEquation){
			var ce = generator.ConsumptionEquation[item];
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
	Univ.UpdateUpgradeDisplay();
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
			var progress = Math.min(210, 210 * (generator.ticks_since_production) / (generator.interval() * Univ.FPS));
			lookup(generator.id + '_progress').style.width = progress + 'px';
			
// 			// UPDATE COST of 1 ( in the future maybe have a way to make more at once
// 			var costHTML = 'Cost: ';			
// 			for (var item in generator.Costs(1)) {
// 				costHTML += generator.Costs(1)[item] + ' ';
// 				if (generator.Costs(1)[item] == 1) {
// 					costHTML += Univ.Items[item].singular;
// 				} else {
// 					costHTML += Univ.Items[item].plural;
// 				}
// 			}
//			lookup(generator.id + '_cost').innerHTML = costHTML;
			
			generator.maxAffordable = Univ.GetMaxAffordable(generator);  // should be the maximum affordable
			generator.midAffordable = Univ.GetMidAffordable(generator);  // should be the maximum that wouldn't result in any negative incomes
			
// 			lookup(generator.id + '_buymid').innerHTML = generator.midAffordable;
// 			lookup(generator.id + '_buymax').innerHTML = generator.maxAffordable;
			
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
				progress = 30 - 30 * Math.max(notenough);
				lookup(generator.id + '_buyprogress').style.width = progress + 'px';
			}
			if (generator.isAffordable(generator.midAffordable) && generator.midAffordable > 0) {
				lookup(generator.id + '_buymid').classList.add('affordable');
			} else {
				lookup(generator.id + '_buymid').classList.remove('affordable');
			}
			if (generator.isAffordable(generator.maxAffordable) && generator.maxAffordable > 0) {
				lookup(generator.id + '_buymax').classList.add('affordable');
			} else {
				lookup(generator.id + '_buymax').classList.remove('affordable');
			}
      
			lookup(generator.id + '_button').style = 'display:block;';
		} else {
			lookup(generator.id + '_button').style = 'display:none;';
		}
	}
	
	for (var i in Univ.GeneratorUpgrades) {
		var upgrade = Univ.GeneratorUpgrades[i];
		if (upgrade.item == Univ.ActiveItem && upgrade.isVisible()){
			lookup(upgrade.id + '_button').style = 'display:block;';
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

Univ.UpdateUpgradeDisplay = function(){
	for (var upgrade in Univ.GeneratorUpgrades) {
		var upgrade = Univ.GeneratorUpgrades[upgrade];
		if( upgrade.isAffordable() == 1){
			lookup(upgrade.id + '_button').classList.add('clickableupgrade');
		} else {
			lookup(upgrade.id + '_button').classList.remove('clickableupgrade');
		}
	}
}

Univ.updateSlider = function(generatorid) {
	var sliderid = generatorid + '_slider';
	var slidervalue = lookup(sliderid).value;
	generator = Univ.Objects[generatorid];
	generator.targetactivity = slidervalue;
	
	lookup(generatorid + '_sliderlabel').style.left = 90 + Math.round(slidervalue * 0.6) + 'px';
	lookup(generatorid + '_sliderlabel').innerHTML = slidervalue + '%';
	lookup(generatorid + '_currentlyactive').innerHTML = 'Currently active: ' + generator.activenumber + ' (' + Math.round(100 * generator.activenumber / generator.number) + '%)';
}

make_speedslider = function() { // delete for release
	slider_HTML = [];
	slider_HTML += '<div id="speedslider_container" class="speedslidercontainer">';
	slider_HTML += '<div id="speedslider_label" class="speedsliderlabel">1x</div>';
	slider_HTML += 'Gamespeed Multiplier: <input type="range" min="1" max="100" value="1" class="speedslider" id="speedslider"></div>';
	lookup('topbar').innerHTML += slider_HTML;
	lookup('speedslider').oninput = function(){update_speedslider();};
}
update_speedslider = function() { // delete for release
	var slidervalue = lookup('speedslider').value;
	Univ.Speedfactor = slidervalue;
	Univ.UpdateRates();
	lookup('speedslider_label').style.left = 132 + Math.round(slidervalue * 1.6) + 'px';
	lookup('speedslider_label').innerHTML = slidervalue + 'x';
}

Univ.LoadMenus = function() {
	make_speedslider(); // delete for release
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

Univ.GeneratorMenuHTML = function() {
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
			generatortable += '<div id="' + generator.id + '_number" class="generatornumber"></div>';
			generatortable += '<div id="' + generator.id + '_title" class="generatortitle">' + generator.plural + '</div>';
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
				generatortable += '</div>';
			generatortable += '</div>';
 		generatortable += '</div>';
 	}
 	
 	for (var i in Univ.GeneratorUpgrades) {
 		var upgrade = Univ.GeneratorUpgrades[i];
 		generatortable += '<div id="' + upgrade.id + '_button" class="upgradebutton" style="display:none;">';
 		generatortable += '<div id="' + upgrade.id + '_title" class="upgradetitle">' + upgrade.name + '</div>';
		generatortable += '<div id="' + upgrade.id + '_text" class="upgradetext">' + upgrade.infoblurb + '</div>';
		generatortable += '<div id="' + upgrade.id + '_cost" class="upgradecost"></div>';
 		generatortable += '</div>';
 	}
 	
 	lookup('generators').innerHTML = generatortable;
 	
	for (var k in Univ.Objects) {
		try{throw Univ.Objects[k]}
		catch(generator){
			
			AddEvent(lookup(generator.id + '_buyone'),'click',function(what){return function(e){if(generator.isAffordable(1)) generator.Buy(1);};}());
			AddEvent(lookup(generator.id + '_buyone'),'mouseover',function(what){return function(e){generator.showPopup(1);};}());
			AddEvent(lookup(generator.id + '_buyone'),'mouseout',function(what){return function(e){generator.showPopup(0);};}());
			AddEvent(lookup(generator.id + '_buymid'),'click',function(what){return function(e){if(generator.isAffordable(generator.midAffordable)) generator.Buy(generator.midAffordable);};}());
			AddEvent(lookup(generator.id + '_buymid'),'mouseover',function(what){return function(e){generator.showPopup('mid');};}());
			AddEvent(lookup(generator.id + '_buymid'),'mouseout',function(what){return function(e){generator.showPopup(0);};}());
			AddEvent(lookup(generator.id + '_buymax'),'click',function(what){return function(e){if(generator.isAffordable(generator.maxAffordable)) generator.Buy(generator.maxAffordable);};}());
			AddEvent(lookup(generator.id + '_buymax'),'mouseover',function(what){return function(e){generator.showPopup('max');};}());
			AddEvent(lookup(generator.id + '_buymax'),'mouseout',function(what){return function(e){generator.showPopup(0);};}());

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
			AddEvent(lookup(generator.id + '_hoverzone'),'mouseover',function(){return function(){generator.showPopup(1);};}());
			AddEvent(lookup(generator.id + '_hoverzone'),'mouseout',function(){return function(){generator.showPopup(0);};}());
			AddEvent(lookup(generator.id + '_popupcontainer'),'mouseover',function(){return function(){generator.showPopup('stay');};}());
			AddEvent(lookup(generator.id + '_popupcontainer'),'mouseout',function(){return function(){generator.showPopup(0);};}());
		}
	}
	
	for (var k in Univ.GeneratorUpgrades) {
		try{throw Univ.GeneratorUpgrades[k]}
		catch(upgrade){
			AddEvent(lookup(upgrade.id + '_button'),'click',function(what){return function(e){if(upgrade.isAffordable()) upgrade.Buy();};}());
		
			var costHTML = 'Cost: ';			
			for (var item in upgrade.Costs()) {
				costHTML += upgrade.Costs()[item] + ' ';
				if (upgrade.Costs()[item] == 1) {
					costHTML += Univ.Items[item].singular;
				} else {
					costHTML += Univ.Items[item].plural;
				}
			}
			lookup(upgrade.id + '_cost').innerHTML = costHTML;
		}
	}
	
	var menubuttons = document.getElementsByClassName('menubutton');
	for(var i in menubuttons){
		var button = menubuttons[i];
		AddEvent(button,'mouseover',function(what){return function(){what.classList.add('hovered');};}(button));
		AddEvent(button,'mouseout',function(what){return function(){what.classList.remove('hovered');};}(button));
	}
}


/**=====================================
Game start!
=====================================**/
window.onload = function(){
	Univ.LoadMenus();	
	Univ.LoadItems();
	Univ.LoadObjects();
	Univ.LoadUpgrades();
	Univ.RestoreDefaultPrefs();
	Univ.LoadSave();
	Univ.ItemMenuHTML();
	Univ.GeneratorMenuHTML();
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