var version = 0.019;
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

function lookup(object) {return document.getElementById(object);} // need to pick one function and then go thru everything

function round(num, places){ 
	if(Math.log10(num) < 10){
		return +(Math.round(num + 'e+' + places)  + 'e-' + places);
	}
	else{
		var p = Math.max(Math.ceil(Math.log10(Math.abs(num))) - places, 0);
		return Math.round(num / Math.pow(10, p)) * Math.pow(10, p);
	}
}

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

Univ.Object = function(id,type,singular,plural,number,infoblurb,VisibilityFcn,CostFcn,IntervalFcn,ProductionFcn,ConsumptionFcn){
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

	this.Costs = CostFcn;
	
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
			this.showPopup();
		}
	}
	
	this.infoblurb = infoblurb;
	this.targetactivity = 100; // percent of this generator chosen to be active
	this.interval = IntervalFcn;
	this.Production = ProductionFcn;
	this.Consumption = ConsumptionFcn;
	this.ticks_since_production = 0;	
	
	this.makePopup = function() {
	// this makes a generic popup for all Generators. In the future maybe some of them will need distinct info or options...
		var popup = '<div id="left_arrow_black" class="left_arrow_black"></div>';
		popup += '<div id="left_arrow_background" class="left_arrow_background"></div>';
		popup += '<div class="popup">';
		popup += '<div class="popupinfoblurb">' + this.infoblurb + '</div>';
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
					productionTxt += 'Generating ' + round(this.Production(this.activenumber)[item] * Univ.Speedfactor,1) + ' ' + Univ.Items[item].plural + ' every ' + round(this.interval(),2) + ' sec (' + round(this.Production(this.activenumber)[item] * Univ.Speedfactor / this.activenumber,1) + '&nbsp;each). ';
				}
				if (totalconsumption > 0 && typeof this.Consumption(this.activenumber)[item] !== 'undefined') {
					consumptionTxt += 'Consuming ' + round(this.Consumption(this.activenumber)[item] * Univ.Speedfactor,1) + ' ' + Univ.Items[item].plural + ' every ' + round(this.interval(),2) + ' sec (' + round(this.Consumption(this.activenumber)[item] * Univ.Speedfactor / this.activenumber,1) + '&nbsp;each). ';
				}
			}
		}
		popup += '<div class="popup_production">' + productionTxt + '</div><div class="popup_consumption">' + consumptionTxt + '</div>';
		
		popup += '<div class="slidercontainer" id="' + this.id + '_slidercontainer">Target activity: ';
		popup += '<div id="' + this.id + '_sliderlabel" class="sliderlabel"></div>';
		popup += '<input type="range" min="0" max="100" value="' + this.targetactivity + '" class="slider" id="' + this.id + '_slider">';
		popup += '<div id="' + this.id + '_currentlyactive" class="currentactive"></div></div>';
		
		popup += '</div>';
		return popup;
	}
	
	this.showPopup = function() {
		lookup('popupcontainer').innerHTML = this.makePopup();
		try{throw this.id}
		catch(generator){
			lookup(this.id + '_slider').oninput = function(){Univ.updateSlider(generator);};
		}
		Univ.updateSlider(this.id);
		if ( this.number > 0 ) {
			lookup(this.id + '_slidercontainer').style.display = 'block';
		}
		
		var buttonposition = lookup(this.id + '_button').getBoundingClientRect();
		var buttonTop = buttonposition.top + window.scrollY;
		var buttonBot = buttonposition.bottom + window.scrollY;
		var buttonY = (buttonTop + buttonBot) / 2;
		
		var buttonLeft = buttonposition.left + window.scrollX;
		var buttonLeft = buttonposition.left + window.scrollX;
		
		var PopupTop = Math.max(0, buttonY - lookup('popupcontainer').getBoundingClientRect().height / 2);
		var PopupLeft = buttonLeft + buttonposition.width - 6;
		var ArrowTop = lookup('popupcontainer').getBoundingClientRect().height / 2;

		lookup('popupcontainer').style.top = PopupTop + 'px';
		lookup('popupcontainer').style.left = PopupLeft + 'px';
		lookup('left_arrow_black').style.top = ArrowTop - 14 + 'px';
		lookup('left_arrow_background').style.top = lookup('left_arrow_black').style.top;
				
// eventually also modify width and height of the popup if they need to be bigger than the default for some things...
		lookup('popupcontainer').style.visibility = 'visible';
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
	return (Univ.Upgrades[id].bought);
}

function AddEvent(object,event,fcn){
	if(object.attachEvent) 
		object.attachEvent('on' + event, function() {
			fcn.call(object);
		});
	else if(object.addEventListener) 
	object.addEventListener(event,fcn,false);
}

Univ.WriteSave = function(mode){
	var save = {
		version: version,
		ActiveItem: Univ.ActiveItem,
		Objects: {},
		Items: {},
		Upgrades: {}
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
	}
	Univ.T = 0; // Frame counter starts over // from Cookie Clicker
}

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
	
	Univ.Items['qfoam'].available_number = 10;
	Univ.Items['qfoam'].total_number = 10;
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
	var consumption = generator.Consumption(chosenMax);
	var active = chosenMax;
	var capable;
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
	
	while(tooHigh){
		// Linear consumption functions will be satisfied here
		for(var item in consumption){
			if(item != 'undefined'){
				capable = Math.floor(Math.min(Univ.Items[item].available_number / (consumption[item] * multiplier), 1) * chosenMax);
				active = Math.min(capable, active);
			}
		}
		
		// Detect for less than linear growth
		chosenMax = active;
		consumption = generator.Consumption(chosenMax);
		tooHigh = false;
		for(var item in consumption){
			if(item != 'undefined'){
				if(round(Univ.Items[item].available_number, Univ.precision) < round(consumption[item] * multiplier, Univ.precision)) tooHigh = true;
			}
		}
		if(active <= 0) tooHigh = false;
	}
	
	// Above linear growth, not likely to have so many it causes lag
	chosenMax = Math.round(generator.number * generator.targetactivity / 100);
	while(active <= chosenMax){
		consumption = generator.Consumption(active);
		tooHigh = false;
		for(var item in consumption){
			if(item != 'undefined'){
				if(round(Univ.Items[item].available_number, Univ.precision) < round(consumption[item] * multiplier, Univ.precision)) tooHigh = true;
			}
		}
		if(tooHigh) break;
		step = Math.pow(10, Math.max(0, Math.ceil(Math.log10(active)) - 4));
		active += step;
	}
	
	generator.activenumber = Math.max(0, active - step);
}

Univ.GetMaxAffordable = function(generator){
	var cost = generator.Costs(1);
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

	// Linear cost functions first
	for(var item in cost){
		if(item != 'undefined'){
			ret = ret == -1 ? Math.floor(Univ.Items[item].available_number / (cost[item] * multiplier)) : Math.min(ret, Math.floor(Univ.Items[item].available_number / (cost[item] * multiplier)));
		}
	}
	
	cost = generator.Costs(ret);
	for(var item in cost){
		if(item != 'undefined'){
			if(round(Univ.Items[item].available_number, Univ.precision) < round(cost[item] * multiplier, Univ.precision)) tooHigh = true;
		}
	}
	
	if(tooHigh){
		// Above linear cost (exponential or polynomial)
		// Just have to iterate through and hope for the best
		ret = 0;
		tooHigh = false;
		while(!tooHigh){
			step = Math.pow(10, Math.max(0, Math.ceil(Math.log10(ret)) - 3));
			ret += step;
			cost = generator.Costs(ret);
			for(var item in cost){
				if(item != 'undefined'){
					if(round(Univ.Items[item].available_number, Univ.precision) < round(cost[item] * multiplier, Univ.precision)) tooHigh = true;
				}
			}
		}
		ret -= step;
	}
	else{
		// Linear or below. Leave ret as is for now
	}
	
	return Math.max(ret, 0);
}

Univ.GetMidAffordable = function(generator){
	var consumption = generator.Consumption(1);
	var wiggleRoom = {};
	var ret = -1;
	var alreadyNegative = false;
	var step = 1;
	
	var multiplier = Univ.Speedfactor;

	for(var item in consumption){
		consumption[item] *= multiplier / generator.interval();
		wiggleRoom[item] = Univ.Items[item].production + Univ.Items[item].consumption;
		if(wiggleRoom[item] <= 0){alreadyNegative = true; break;}
	}
	
	if(!alreadyNegative){
		// Linear cost functions first
		for(var item in consumption){
			if(item != 'undefined'){
				ret = ret == -1 ? Math.floor(wiggleRoom[item] / (consumption[item])) : Math.min(ret, Math.floor(wiggleRoom[item] / (consumption[item])));
			}
		}
		
		consumption = generator.Consumption(generator.number + ret);
		var cons2 = generator.Consumption(generator.number);
		var tooHigh = false;
		for(var item in consumption){
			if(item != 'undefined'){
				if(round(wiggleRoom[item], Univ.precision) < round((consumption[item] - cons2[item]) * multiplier / generator.interval(), Univ.precision)) tooHigh = true;
			}
		}
		
		if(tooHigh){
			// Above linear consumption (exponential or polynomial)
			// Just have to iterate through and hope for the best
			ret = 0;
			tooHigh = false;
			while(!tooHigh){
				step = Math.pow(10, Math.max(0, Math.ceil(Math.log10(ret)) - 3));
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
		else{
			// Linear or below. Leave ret as is for now
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
				lookup(item.type + '_number').innerHTML = Math.floor(item.available_number);
				
				// UPDATE TITLE
				if (item.available_number == 1) {
					lookup(item.type + '_title').innerHTML = item.singular;
				} else {
					lookup(item.type + '_title').innerHTML = item.plural;
				}
				
				// UPDATE INCOME/SPENDING
				productionHTML = [];
				if (item.available_number > 0) {
					var netproduction = round((item.production + item.consumption),2);
					if (netproduction > 0) {
						productionHTML = '+';
					}
					productionHTML += netproduction + ' per sec (+' + round(item.production,1) + '/' + round(item.consumption,1) +')'; 
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
		
			// UPDATE COST of 1 ( in the future maybe have a way to make more at once
			var costHTML = 'Cost: ';			
			for (var item in generator.Costs(1)) {
				costHTML += generator.Costs(1)[item] + ' ';
				if (generator.Costs(1)[item] == 1) {
					costHTML += Univ.Items[item].singular;
				} else {
					costHTML += Univ.Items[item].plural;
				}
			}
			lookup(generator.id + '_cost').innerHTML = costHTML;
			
			generator.maxAffordable = Univ.GetMaxAffordable(generator);  // should be the maximum affordable
			generator.midAffordable = Univ.GetMidAffordable(generator);  // should be the maximum that wouldn't result in any negative incomes
			
			lookup(generator.id + '_buymid').innerHTML = generator.midAffordable;
			lookup(generator.id + '_buymax').innerHTML = generator.maxAffordable;
			
			if (generator.isAffordable(1)) {
				lookup(generator.id + '_buyone').classList.add('affordable');
			} else {
				lookup(generator.id + '_buyone').classList.remove('affordable');
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
	
	lookup(sliderid + 'label').style.left = 90 + Math.round(slidervalue * 0.6) + 'px';
	lookup(sliderid + 'label').innerHTML = slidervalue + '%';
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
	var generatortable = '';
	
	// Options menu. Set the entire div to none or block to hide or show
	generatortable += '<div id="options_menu" style="display:none;">';
	generatortable += '<div id="versionbox" class="optionsButton menubutton" style="background-color:#f7f7f7;">Version ' + version.toFixed(3) + '</div>';
	generatortable += '<div id="savebutton" class="optionsButton menubutton" style="background-color:#c9ffd2;" onmousedown="Univ.WriteSave();">Save</div>';
	generatortable += '<div id="resetbutton" class="optionsButton menubutton" style="background-color:#ffd3dd;" onmousedown="Univ.Reset();Univ.WriteSave();">Reset (and wipe save)</div>';
	generatortable += '</div>';
	
	
 	for (var i in Univ.Objects) {
 		var generator = Univ.Objects[i];
 		generatortable += '<div id="' + generator.id + '_button" class="generatorbutton clickablegenerator" style="display:none;">';
  		generatortable += '<div id="' + generator.id + '_number" class="generatornumber"></div>'; 		
  		generatortable += '<div id="' + generator.id + '_title" class="generatortitle">' + generator.plural + '</div>';
		generatortable += '<div id="' + generator.id + '_cost" class="generatorcost"></div>';
		generatortable += '<div id="' + generator.id + '_production" class="generatorproduction"></div>';
		generatortable += '<div id="' + generator.id + '_consumption" class="generatorconsumption"></div>';
		generatortable += '<div id="' + generator.id + '_buyone" class="generatorbuyone">1</div>';
		generatortable += '<div id="' + generator.id + '_buymid" class="generatorbuymid">80</div>';
		generatortable += '<div id="' + generator.id + '_buymax" class="generatorbuymax">1000</div>';
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
			AddEvent(lookup(generator.id + '_buymid'),'click',function(what){return function(e){if(generator.isAffordable(generator.midAffordable)) generator.Buy(generator.midAffordable);};}());
			AddEvent(lookup(generator.id + '_buymax'),'click',function(what){return function(e){if(generator.isAffordable(generator.maxAffordable)) generator.Buy(generator.maxAffordable);};}());

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
			AddEvent(lookup(generator.id + '_button'),'mouseover',function(){return function(){generator.showPopup();};}());
			AddEvent(lookup(generator.id + '_button'),'mouseout',function(){return function(){lookup('popupcontainer').style.visibility='hidden';};}());
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
	
	AddEvent(lookup('popupcontainer'),'mouseover',function(){return function(){lookup('popupcontainer').style.visibility='visible';};}());
	AddEvent(lookup('popupcontainer'),'mouseout',function(){return function(){lookup('popupcontainer').style.visibility='hidden';};}());
	
	var menubuttons = document.getElementsByClassName('menubutton');
	for(var i in menubuttons){
		var button = menubuttons[i];
		AddEvent(button,'mouseover',function(what){return function(){what.classList.add('hovered');};}(button));
		AddEvent(button,'mouseout',function(what){return function(){what.classList.remove('hovered');};}(button));
	}
}

window.onload = function(){
	Univ.LoadMenus();	
	Univ.LoadItems();
	Univ.LoadObjects();
	Univ.LoadUpgrades();
	Univ.LoadSave();
	Univ.ItemMenuHTML();
	Univ.GeneratorMenuHTML();
	
	// Latency stuff
	Univ.accumulatedDelay = 0;
	Univ.lastActivity = Date.now();
	Univ.time = Date.now();
	
 	Univ.Loop();
}

AddEvent(window,'keydown',function(e){
	if (e.ctrlKey && e.keyCode == 83) {Univ.toSave = true;e.preventDefault();} // ctrl-s saves the game
});