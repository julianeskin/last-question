var version = 0.09;
var Univ = {};
Univ.FPS = 30;
Univ.Speedfactor = 10; // Factor to speed up everything -- for testing.
Univ.Items = [];
Univ.Objects = [];
Univ.T = 0;
Univ.SaveTo = 'LastQuestion';
Univ.ActiveItem = 'qfoam'; // possibly delete this line eventually, just makes testing faster

function lookup(object) {return document.getElementById(object);}

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
	return this;
}

Univ.Object = function(id,type,singular,plural,number,infoblurb,VisibilityFcn,CostFcn,ProductionFcn,ConsumptionFcn){
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
	this.Production = ProductionFcn;
	this.Consumption = ConsumptionFcn;
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
				Univ.Transact('spend', item, this.Costs(howmany)[item]);
			}
			this.number += howmany;
			Univ.Logic();
			this.showPopup();
		}
	}
	this.infoblurb = infoblurb;
	this.targetactivity = 100; // percent of this generator chosen to be active
	
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
					productionTxt += 'Generating ' + Math.round(this.Production(this.activenumber)[item] * 10)/10 + ' ' + Univ.Items[item].plural + ' per sec (' + Math.round(this.Production(this.activenumber)[item]/this.activenumber*10)/10 + '&nbsp;each). ';
				}
				if (totalconsumption > 0 && typeof this.Consumption(this.activenumber)[item] !== 'undefined') {
					consumptionTxt += 'Consuming ' + Math.round(this.Consumption(this.activenumber)[item] * 10)/10 + ' ' + Univ.Items[item].plural + ' per sec (' + Math.round(this.Consumption(this.activenumber)[item]/this.activenumber*10)/10 + '&nbsp;each). ';
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
	}
	
	
	if(mode == 3){
		return JSON.stringify(save, null, 2);
	}
	else{
		localStorage.setItem(Univ.SaveTo, JSON.stringify(save));
	}
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
	
	if(save.version >= 0.08){
		for(var g in save.Objects){
			if(Univ.Objects[g]){
				Univ.Objects[g].number = save.Objects[g].number;
				Univ.Objects[g].targetactivity = save.Objects[g].targetactivity;
			}
		}
		
		for(var i in save.Items){
			if(Univ.Items[i]){
				Univ.Items[i].available_number = save.Items[i].available_number;
			}
		}
	}
	
	Univ.T = 0; // Frame counter starts over
}

Univ.reset = function(hard){
	for(var g in Univ.Objects){
		var obj = Univ.Objects[g];
		Univ.Objects[g].number = 0;
		Univ.Objects[g].targetactivity = 100;
	}
	
	for(var i in Univ.Items){
		Univ.Items[i].available_number = 0;
	}
	
	Univ.Items['qfoam'].available_number = 90;
}

Univ.Loop = function(){
 	Univ.Logic();
	Univ.RefreshDisplay();
	setTimeout(Univ.Loop,1000/Univ.FPS);
}

Univ.Logic = function(){
// Find the number of each Generator that can run (by checking their consumption needs)
	for (var g in Univ.Objects) {
 		var generator = Univ.Objects[g];
 		generator.activenumber = 0;
 		for (var i = 1; i <= generator.number; i++) {
 			var items_checked = 0;
 			var items_satisfied = 0;
 			for (var item in Univ.Items) {
 				items_checked++;
 				if ( typeof generator.Consumption(i)[item] == 'undefined' || generator.Consumption(i)[item] <= Univ.Items[item].available_number ){
 					items_satisfied++;
				}
 			}
 			if ( items_satisfied == items_checked ) {
				generator.activenumber = Math.min(i,Math.round(generator.number * generator.targetactivity/100));
			}
 		}
 	}

// Update rates and spend/earn the Items accordingly
	for (var i in Univ.Items) {
		var item = Univ.Items[i];
		item.production = 0;
		item.consumption = 0;
		for (var h in Univ.Objects) {
			var generator = Univ.Objects[h];
			if ( typeof generator.Production(generator.activenumber)[i] !== 'undefined') {
				item.production += generator.Production(generator.activenumber)[i];
			}
			if ( typeof generator.Consumption(generator.activenumber)[i] !== 'undefined') {
				item.consumption += generator.Consumption(generator.activenumber)[i];
			}
		}
		Univ.Transact('spend',item.type, Univ.Speedfactor * item.consumption / Univ.FPS);
		Univ.Transact('gain',item.type, Univ.Speedfactor * item.production / Univ.FPS);
	}
	
	if (Univ.toSave || (Univ.T % (Univ.FPS * 60) == 0 )) {
		//check if we can save : no minigames are loading // Yes, I copied this from Cookie Clicker. I did warn you
		var canSave=true;
		/*for (var i in Game.Objects)
		{
			var me=Game.Objects[i];
			if (me.minigameLoading){canSave=false;break;}
		}*/
		if (canSave) Univ.WriteSave();
	}
	
	Univ.T++; // In case we don't want to run certain parts of code every frame
}

Univ.Transact = function(transaction,item,amount){
	if (transaction == 'spend') {
		Univ.Items[item].available_number -= amount*1;
	}
	if (transaction == 'gain') {
		Univ.Items[item].available_number += amount*1;
	}
}

Univ.RefreshDisplay = function(){
	Univ.UpdateItems();
	Univ.UpdateGenerators();
}

Univ.UpdateItems = function(){
	for (var i in Univ.Items) {
		var item = Univ.Items[i];
		if (Univ.Items[i].visibility == 1) {		
			// UPDATE NUMBER
			lookup(item.type + '_number').innerHTML = Math.floor(item.available_number);
			
			// UPDATE TITLE
			if (item.available_number == 1) {
				lookup(item.type + '_title').innerHTML = item.singular;
			} else {
				lookup(item.type + '_title').innerHTML = item.plural;
			}
			
			// UPDATE INCOME/SPENDING
			var netproduction = Math.round((item.production - item.consumption) * 10)/10;
			if (netproduction > 0) {
				lookup(item.type + '_production').innerHTML = '+' + netproduction + ' per sec (+' + Math.round(item.production*10)/10 + '/-' + Math.round(item.consumption*10)/10 +')';
			} else if  (netproduction < 0) {
				lookup(item.type + '_production').innerHTML = netproduction + ' per sec (+' + Math.round(item.production*10)/10 + '/-' + Math.round(item.consumption*10)/10 +')';
			} else {
				lookup(item.type + '_production').innerHTML = netproduction + ' per sec (+' + Math.round(item.production*10)/10 + '/-' + Math.round(item.consumption*10)/10 +')';
			}
		}
	}
}

Univ.UpdateGenerators = function(){
	for (var i in Univ.Objects) {
 		var generator = Univ.Objects[i];
		if (generator.type == Univ.ActiveItem){
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

		//// TO DO: check whether visibility requirements are met by calling generator.isVisible()
			lookup(generator.id + '_button').style = 'display:block;';
		//// TO DO: check whether it should be greyed out and unclickable by calling generator.isClickable()
		} else {
			lookup(generator.id + '_button').style = 'display:none;';
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

Univ.ItemMenuHTML = function(){
	var itemtable = [];

	for (var item in Univ.Items) {
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
	
	for (var item in Univ.Items) {
		if (Univ.Items[item].visibility == 1) {
			try{throw item}
			catch(item){
				AddEvent(lookup(item + '_button'),'mouseover',function(what){return function(e){Univ.ActiveItem = item;};}(item));
			}
		}
	}
}

Univ.GeneratorMenuHTML = function() {
	var generatortable = [];
 	for (var i in Univ.Objects) {
 		var generator = Univ.Objects[i];
 		generatortable += '<div id="' + generator.id + '_button" class="generatorbutton clickablegenerator" style="display:none;">';
  		generatortable += '<div id="' + generator.id + '_number" class="generatornumber"></div>'; 		
  		generatortable += '<div id="' + generator.id + '_title" class="generatortitle">' + generator.plural + '</div>';
		generatortable += '<div id="' + generator.id + '_cost" class="generatorcost"></div>';
		generatortable += '<div id="' + generator.id + '_production" class="generatorproduction"></div>';
		generatortable += '<div id="' + generator.id + '_consumption" class="generatorconsumption"></div>';
 		generatortable += '</div>';
 	}
 	lookup('generators').innerHTML = generatortable;
 	
	for (var k in Univ.Objects) {
		try{throw Univ.Objects[k]}
		catch(generator){
			AddEvent(lookup(generator.id + '_button'),'click',function(what){return function(e){generator.Buy(1);};}(generator.singular));
			AddEvent(lookup(generator.id + '_button'),'mouseover',function(){return function(){generator.showPopup();};}());
			AddEvent(lookup(generator.id + '_button'),'mouseout',function(){return function(){lookup('popupcontainer').style.visibility='hidden';};}());
		}
	}
	AddEvent(lookup('popupcontainer'),'mouseover',function(){return function(){lookup('popupcontainer').style.visibility='visible';};}());
	AddEvent(lookup('popupcontainer'),'mouseout',function(){return function(){lookup('popupcontainer').style.visibility='hidden';};}());
}

window.onload = function(){
	lookup('topbar').innerHTML += 'Version ' + version;
	Univ.LoadItems();
	Univ.LoadObjects();
	Univ.LoadSave();
	Univ.ItemMenuHTML();
	Univ.GeneratorMenuHTML();
 	Univ.Loop();
}

AddEvent(window,'keydown',function(e){
	if (e.ctrlKey && e.keyCode == 83) {Univ.toSave = true;e.preventDefault();} //ctrl-s saves the game
	if (e.ctrlKey && e.keyCode == 88) {Univ.reset();e.preventDefault();}//ctrl-x resets the game
	Univ.lastActivity = Date.now();
	//console.log(e);
});

// DELETE BEFORE RELEASE (this is so I can speed up production using the A/W/E/F keys)
document.addEventListener('keydown',function(event) {
    var control = 0;
    if (event.keyCode == 65 || event.keyCode == 87 || event.keyCode == 69 || event.keyCode == 70) { // A/W/E/F
		for (var i in Univ.Items) {
			var item = Univ.Items[i];
			Univ.Transact('gain',item.type, item.production / Univ.FPS * 30 );
		}
    }
});