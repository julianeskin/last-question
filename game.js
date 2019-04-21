var version = 0.06;
var Univ = {};
Univ.FPS = 30;
Univ.Items = [];
Univ.Objects = [];

Univ.Item = function(singular,plural,type,number,rate){
 	this.singular = singular;
	this.plural = plural;
	this.type = type;
 	this.number = number;
	this.rate = rate;
	Univ.Items[this.type] = this;
	return this;
}

Univ.Object = function(id,type,singular,plural,number,minreq,maxreq,VisibilityFcn,CostFcn,ProductionFcn){
	this.id = id;
	this.type = type;
    this.singular = singular;
	this.plural = plural;
	this.number = number;
	
	this.isAffordable = function(howmany){
		var notenough = 0;
		for (var item in this.costs(howmany)) {
			if (this.costs(howmany)[item] > Univ.Items[item].number) {
				notenough++;
			}
		}
		if (notenough == 0) {
			return 1;
		} else {
			return 0;
		}
	}

	this.costs = CostFcn;	
	
	this.Buy = function(howmany){	// howmany is not currently used, you can only buy 1 at at time – but this will be changed someday
		if (this.isAffordable(howmany)) {
			for (var item in this.costs(howmany)) {
				Univ.Transact('spend', item, this.costs(howmany)[item]);
			}
			this.number += howmany;
 			Univ.Nobjects += howmany; // why bother? 
 			Univ.RateUpdate();
		}
	}
	
	this.Production = ProductionFcn;
// 		
// 	this.minrequirements = minreq;
// 	this.maxrequirements = maxreq;
	
	this.isVisible = VisibilityFcn;
	
	this.isClickable = function(){ // check both if it's affordable, and if other conditions are met
		if (this.isAffordable) {
			return 1;
		} else {
			return 0;
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

Univ.RateUpdate = function(){
	for (var item in Univ.Items){
		Univ.Items[item].rate = 0;
		for (var generator in Univ.Objects) {
			if ( typeof Univ.Objects[generator].Production()[item] !== 'undefined') {
				Univ.Items[item].rate += Univ.Objects[generator].Production()[item];
			}
		}
	}
}

Univ.Logic = function(){
	for (var item in Univ.Items) {
		Univ.Transact('gain',item, Univ.Items[item].rate / Univ.FPS );	
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
	for (var item in Univ.Items) {
		if (item != 'secs' && item != 'kelvin') {		
			lookup(item + '_number').innerHTML = Math.floor(Univ.Items[item].number);
			if (Univ.Items[item].rate > 0) {
				lookup(item + '_production').innerHTML = 'Generating ' + Math.round(Univ.Items[item].rate * 10)/10 + ' per sec.';
			} else {
				lookup(item + '_production').innerHTML = '';
			}
			if (Univ.Items[item].number == 1) {
				lookup(item + '_title').innerHTML = Univ.Items[item].singular;
			} else {
				lookup(item + '_title').innerHTML = Univ.Items[item].plural;
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
			for (var item in generator.costs(1)) {
				costHTML += generator.costs(1)[item] + ' ';
				if (generator.costs(1)[item] == 1) {
					costHTML += Univ.Items[item].singular;
				} else {
					costHTML += Univ.Items[item].plural;
				}
			}
			lookup(generator.id + '_cost').innerHTML = costHTML;
			
			// UPDATE PRODUCTION
			// can display production of multiple different things – but it'll overflow the container quickly. Need a new solution if that ever comes up.
			var productionHTML = '';
			var totalproduction = 0;
			for (var item in Univ.Items) {
				if (item != 'secs' && item != 'kelvin') {
					if ( typeof generator.Production()[item] !== 'undefined' && generator.Production()[item] > 0 ) {
						totalproduction++;
					}
				}
			}
			if (totalproduction > 0) {
				var productionHTML = 'Generating ';
				for (var item in Univ.Items) {
					if (item != 'secs' && item != 'kelvin') {
						if ( typeof generator.Production()[item] !== 'undefined') {
							if (Math.round(generator.Production()[item] * 10)/10 == 1){
								productionHTML += Math.round(generator.Production()[item] * 10)/10 + ' ' + Univ.Items[item].singular + ' per sec (' + Math.round(generator.Production()[item]/generator.number*10)/10 + ' each). ';
							} else {
								productionHTML += Math.round(generator.Production()[item] * 10)/10 + ' ' + Univ.Items[item].plural + ' per sec (' + Math.round(generator.Production()[item]/generator.number*10)/10 + ' each). ';
							}
						}
					}
				}
			}
			lookup(generator.id + '_production').innerHTML = productionHTML;

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
		for (var item in Univ.Items) {
			Univ.Transact('gain',item, 30 * Univ.Items[item].rate / Univ.FPS);
		}
    }
});