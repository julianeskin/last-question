var version = 0.07;
var Univ = {};
Univ.FPS = 30;
Univ.Items = [];
Univ.Objects = [];

Univ.Item = function(singular,plural,type,number,production,consumption){
 	this.singular = singular;
	this.plural = plural;
	this.type = type;
 	this.number = number;
	this.production = production; 	// this might be a function in the future,
	// to allow for nonlinear effects, or to trigger events when certain items get produced
	
	this.consumption = consumption; // this might be a function in the future,
	// to allow for nonlinear effects, or to trigger events when certain items get consumed
	
	Univ.Items[this.type] = this;
	return this;
}

Univ.Object = function(id,type,singular,plural,number,VisibilityFcn,CostFcn,ProductionFcn,ConsumptionFcn){
	this.id = id;
	this.type = type;
    this.singular = singular;
	this.plural = plural;
	this.number = number;
 	this.activenumber = number;
	
	this.isAffordable = function(howmany){
		var notenough = 0;
		for (var item in this.Costs(howmany)) {
			if (this.Costs(howmany)[item] > Univ.Items[item].number) {
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
		}
	}
	
	Univ.Objects[this.singular] = this;
	return this;
}

Univ.ActiveItem = '';

function lookup(object) {return document.getElementById(object);}

function AddEvent(object,event,fcn){
	if(object.attachEvent) 
		object.attachEvent('on' + event, function() {
			fcn.call(object);
		});
	else if(object.addEventListener) 
	object.addEventListener(event,fcn,false);
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
 				if ( typeof generator.Consumption(i)[item] == 'undefined' || generator.Consumption(i)[item] <= Univ.Items[item].number ){
 					items_satisfied++;
				}
 			}
 			if ( items_satisfied == items_checked ) {
				generator.activenumber = i;
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
		Univ.Transact('spend',item.type, item.consumption / Univ.FPS);
		Univ.Transact('gain',item.type, item.production / Univ.FPS);
	}
}

Univ.Transact = function(transaction,item,amount){
	if (transaction == 'spend') {
		Univ.Items[item].number -= amount*1;
	}
	if (transaction == 'gain') {
		Univ.Items[item].number += amount*1;
	}
}

Univ.RefreshDisplay = function(){
	Univ.UpdateItems();
	Univ.UpdateGenerators();
}

Univ.UpdateItems = function(){
	for (var i in Univ.Items) {
		var item = Univ.Items[i];
		if (item.type != 'secs' && item.type != 'kelvin') {		
			// UPDATE NUMBER
			lookup(item.type + '_number').innerHTML = Math.floor(item.number);
			
			// UPDATE TITLE
			if (item.number == 1) {
				lookup(item.type + '_title').innerHTML = item.singular;
			} else {
				lookup(item.type + '_title').innerHTML = item.plural;
			}
			
			// UPDATE INCOME/SPENDING
			if (item.production > item.consumption) {
				lookup(item.type + '_production').innerHTML = 'Net production: ' + Math.round((item.production-item.consumption) * 10)/10 + ' per sec (+' + Math.round(item.production*10)/10 + '/-' + Math.round(item.consumption*10)/10 +').';
			} else if  (item.production < item.consumption) {
				lookup(item.type + '_production').innerHTML = 'Net consumption: ' + Math.round((item.production-item.consumption) * 10)/-10 + ' per sec (+' + Math.round(item.production*10)/10 + '/-' + Math.round(item.consumption*10)/10 +').';
			} else {
				lookup(item.type + '_production').innerHTML = '';
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
			
			// UPDATE PRODUCTION/CONSUMPTION
			var productionHTML = '';
			var consumptionHTML = '';
			var totalproduction = 0;
			var totalconsumption = 0;
			for (var item in Univ.Items) {
				if (item != 'secs' && item != 'kelvin') {
					if ( typeof generator.Production(generator.activenumber)[item] !== 'undefined' && generator.Production(generator.activenumber)[item] > 0 ) {
						totalproduction++;
					}
					if ( typeof generator.Consumption(generator.activenumber)[item] !== 'undefined' && generator.Consumption(generator.activenumber)[item] > 0 ) {
						totalconsumption++;
					}
				}
			}
			// this will display production of multiple different things – but it'll overflow the container quickly. Need a new solution if that ever comes up.
			if (totalproduction > 0) {
				var productionHTML = 'Generating ';
				for (var item in Univ.Items) {
					if (item != 'secs' && item != 'kelvin') {
						if ( typeof generator.Production(generator.activenumber)[item] !== 'undefined') {
							if (Math.round(generator.Production()[item] * 10)/10 == 1){
								productionHTML += Math.round(generator.Production(generator.activenumber)[item] * 10)/10 + ' ' + Univ.Items[item].singular + ' per sec (' + Math.round(generator.Production(generator.activenumber)[item]/generator.activenumber*10)/10 + ' each). ';
							} else {
								productionHTML += Math.round(generator.Production(generator.activenumber)[item] * 10)/10 + ' ' + Univ.Items[item].plural + ' per sec (' + Math.round(generator.Production(generator.activenumber)[item]/generator.activenumber*10)/10 + ' each). ';
							}
						}
					}
				}
			}
			lookup(generator.id + '_production').innerHTML = productionHTML;

			// this will display consumption of multiple different things – but it'll overflow the container quickly. Need a new solution if that ever comes up.
			if (totalconsumption > 0) {
				var consumptionHTML = 'Consuming ';
				for (var item in Univ.Items) {
					if (item != 'secs' && item != 'kelvin') {
						if ( typeof generator.Consumption(generator.activenumber)[item] !== 'undefined') {
							if (Math.round(generator.Consumption()[item] * 10)/10 == 1){
								consumptionHTML += Math.round(generator.Consumption(generator.activenumber)[item] * 10)/10 + ' ' + Univ.Items[item].singular + ' per sec (' + Math.round(generator.Consumption(generator.activenumber)[item]/generator.activenumber*10)/10 + ' each). ';
							} else {
								consumptionHTML += Math.round(generator.Consumption(generator.activenumber)[item] * 10)/10 + ' ' + Univ.Items[item].plural + ' per sec (' + Math.round(generator.Consumption(generator.activenumber)[item]/generator.activenumber*10)/10 + ' each). ';
							}
						}
					}
				}
			}
			lookup(generator.id + '_consumption').innerHTML = consumptionHTML;

		//// TO DO: check whether visibility requirements are met by calling generator.isVisible()
			lookup(generator.id + '_button').style = 'display:block;';
		//// TO DO: check whether it should be greyed out and unclickable by calling generator.isClickable()
		} else {
			lookup(generator.id + '_button').style = 'display:none;';
		}
	}
}

Univ.ItemMenuHTML = function(){
	var itemtable = [];

	for (var item in Univ.Items) {
		if (item != 'secs' && item != 'kelvin') {
			itemtable += '<div id="' + item + '_button" class="itembutton active visible">';
			itemtable += '<div id="' + item + '_number" class="itemnumber"></div>';
			itemtable += '<div id="' + item + '_title" class="itemtitle"></div>';
			itemtable += '<div id="' + item + '_production" class="itemproduction"></div>';
			itemtable += '</div>';
		}
	}

	lookup('items').innerHTML = itemtable;
	
	for (var item in Univ.Items) {
		if (item != 'secs' && item != 'kelvin') {
			try{throw item}
			catch(item){
				AddEvent(lookup(item + '_button'),'click',function(what){return function(e){Univ.ActiveItem = item;};}(item));
			}
		}
	}
}

Univ.GeneratorMenuHTML = function() {
	var generatortable = [];
 	for (var i in Univ.Objects) {
 		var generator = Univ.Objects[i];
 		generatortable += '<div id="' + generator.id + '_button" class="generatorbutton active" style="display:none;">';
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
		}
	}
}

window.onload = function(){
	Univ.LoadItems();
	Univ.LoadObjects();
	Univ.ItemMenuHTML();
	Univ.GeneratorMenuHTML();
 	Univ.Loop();
 }

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