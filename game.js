var version = 0.013;
var Univ = {};
Univ.FPS = 8;
Univ.Speedfactor = 1; // Factor to speed up everything -- for testing.
Univ.Items = [];
Univ.Objects = [];
Univ.T = 0;
Univ.SaveTo = 'LastQuestion';
Univ.ActiveItem = 'qfoam'; // possibly delete this line eventually, just makes testing faster
Univ.ItemsById = [];
Univ.ObjectsById = [];

function lookup(object) {return document.getElementById(object);} // need to pick one function and then go thru everything

function round(num, places){ 
	return +(Math.round(num + 'e+' + places)  + 'e-' + places);
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

Univ.Object = function(id,type,singular,plural,number,infoblurb,VisibilityFcn,CostFcn,interval,ProductionFcn,ConsumptionFcn){
	this.id = id;
	this.type = type;
    this.singular = singular;
	this.plural = plural;
	this.number = number;
 	this.activenumber = number;
	
	this.isAffordable = function(howmany){
		var notenough = 0;
		for (var item in this.Costs(howmany)) {
			if (this.Costs(howmany)[item] > Univ.Items[item].available_number) {
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
				Univ.Items[item].available_number -= this.Costs(howmany)[item];
			}
			this.number += howmany;
			if (this.number == 1) { this.ticks_since_production = this.interval - 1; } // for the first one, produce immediately instead of waiting the whole interval
			Univ.RefreshDisplay();
			this.showPopup();
		}
	}
	
	this.infoblurb = infoblurb;
	this.targetactivity = 100; // percent of this generator chosen to be active
	this.interval = interval;
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
					productionTxt += 'Generating ' + round(this.Production(this.activenumber)[item] * Univ.Speedfactor,1) + ' ' + Univ.Items[item].plural + ' every ' + round(this.interval,2) + ' sec (' + round(this.Production(this.activenumber)[item] * Univ.Speedfactor / this.activenumber,1) + '&nbsp;each). ';
				}
				if (totalconsumption > 0 && typeof this.Consumption(this.activenumber)[item] !== 'undefined') {
					consumptionTxt += 'Consuming ' + round(this.Consumption(this.activenumber)[item] * Univ.Speedfactor,1) + ' ' + Univ.Items[item].plural + ' every ' + round(this.interval,2) + ' sec (' + round(this.Consumption(this.activenumber)[item] * Univ.Speedfactor / this.activenumber,1) + '&nbsp;each). ';
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
		Items: {}
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
	
	Univ.Items['qfoam'].available_number = 100;
	Univ.Items['qfoam'].total_number = 100;
}

Univ.Logic = function(){
	for ( var g in Univ.Objects ) {
		var generator = Univ.Objects[g];
		if ( generator.number > 0 ) {
			generator.ticks_since_production++;
			Univ.ActiveNumber(generator);
			if ( generator.ticks_since_production >= (generator.interval * Univ.FPS)) {
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

Univ.UpdateRates = function(generator){
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
			for ( var item in generator.Production(1) ) {
				itemproduction = generator.Production(generator.activenumber)[item];
				productionrates[item] += itemproduction / generator.interval * Univ.Speedfactor;
			}
			for ( var item in generator.Consumption(1) ) {
				itemconsumption = generator.Consumption(generator.activenumber)[item];
				consumptionrates[item] -= itemconsumption / generator.interval * Univ.Speedfactor;
			}
		} else { generator.activenumber = 0; }
	}
	for (var item in Univ.Items) {
		Univ.Items[item].production = productionrates[item];
		Univ.Items[item].consumption = consumptionrates[item];
	}
}

Univ.ActiveNumber = function(generator){
// Find the number of a Generator that can run (by checking their consumption needs)
// We can probably speed this up by only checking from 0 to targetactivity
	generator.activenumber = 0;
	for (var i = generator.number - 1; i >= 0; i--) {
		var items_checked = 0;
		var items_satisfied = 0;
		for (var item in generator.Consumption(i)) {
			if ( item != 'undefined') {
				items_checked++;
				if ( generator.Consumption(i)[item] <= Univ.Items[item].available_number ){
					items_satisfied++;
				}
			}
		}
		if ( items_satisfied != items_checked ) {
			break;
			alert(i);
		}
	}
	generator.activenumber = Math.min( generator.number - i - 1, Math.round(generator.number * generator.targetactivity/100));
}


/**=====================================
Menu functions
=====================================**/
Univ.RefreshDisplay = function(){
	Univ.UpdateRates();
	Univ.UpdateItemDisplay();
	Univ.UpdateGeneratorDisplay();
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

			try{throw generator}
			catch(generator){
				var max = 1000;  // should be the maximum affordable
				var mid = 80;	// should be the maximum that wouldn't result in any negative incomes
				
				if (generator.isAffordable(1)) {
					lookup(generator.id + '_buyone').classList.add('affordable');
				} else {
					lookup(generator.id + '_buyone').classList.remove('affordable');
				}
				if (generator.isAffordable(mid)) {
					lookup(generator.id + '_buymid').classList.add('affordable');
				} else {
					lookup(generator.id + '_buymid').classList.remove('affordable');
				}
				if (generator.isAffordable(max)) {
					lookup(generator.id + '_buymax').classList.add('affordable');
				} else {
					lookup(generator.id + '_buymax').classList.remove('affordable');
				}
			}
			lookup(generator.id + '_button').style = 'display:block;';
		} else {
			lookup(generator.id + '_button').style = 'display:none;';
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
 	lookup('generators').innerHTML = generatortable;
 	
	for (var k in Univ.Objects) {
		try{throw Univ.Objects[k]}
		catch(generator){
			var max = 1000;  // should be the maximum affordable
			var mid = 80;	// should be the maximum that wouldn't result in any negative incomes

			AddEvent(lookup(generator.id + '_buyone'),'click',function(what){return function(e){generator.Buy(1);};}());
			AddEvent(lookup(generator.id + '_buymid'),'click',function(what){return function(e){generator.Buy(mid);};}());
			AddEvent(lookup(generator.id + '_buymax'),'click',function(what){return function(e){generator.Buy(max);};}());
			AddEvent(lookup(generator.id + '_button'),'mouseover',function(){return function(){generator.showPopup();};}());
			AddEvent(lookup(generator.id + '_button'),'mouseout',function(){return function(){lookup('popupcontainer').style.visibility='hidden';};}());
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